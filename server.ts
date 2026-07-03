import express from 'express';
import path from 'path';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Set up mock Nodemailer transporter using Ethereal Email (for preview/dev)
  const createMockTransporter = async () => {
    // We are simulating an SMTP server for invoice generation
    const account = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass
      }
    });
  };

  // Admin Route: Confirm Booking & Send Invoice PDF
  app.post('/api/admin/confirm', async (req, res) => {
    try {
      const { id, firstName, lastName, email, serviceName, price, currency, date, time } = req.body;
      
      // Generate PDF Invoice
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.setTextColor(26, 41, 66); // Brand blue
      doc.text("INVOICE & CONFIRMATION", 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Invoice Ref: ${id}`, 20, 30);
      doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 36);
      
      doc.setTextColor(0);
      doc.setFontSize(14);
      doc.text("Heading-West Immigration Services Inc.", 20, 50);
      doc.setFontSize(10);
      doc.text("Toronto HQ, ON, Canada", 20, 56);
      doc.text("info@heading-west.com", 20, 62);
      
      doc.setFontSize(14);
      doc.text("Bill To:", 20, 80);
      doc.setFontSize(11);
      doc.text(`${firstName} ${lastName}`, 20, 86);
      doc.text(email, 20, 92);
      
      // Using autotable for line items
      (doc as any).autoTable({
        startY: 105,
        head: [['Description', 'Date', 'Time', 'Amount']],
        body: [[
           serviceName,
           new Date(date).toLocaleDateString(),
           time,
           `${currency} ${price}.00`
        ]],
        theme: 'striped',
        headStyles: { fillColor: [26, 41, 66] }
      });
      
      doc.setFontSize(12);
      doc.text(`Total Paid: ${currency} ${price}.00`, 140, (doc as any).lastAutoTable.finalY + 20);
      
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

      // Configure Email Transport
      const transporter = await createMockTransporter();
      
      // Email content
      const subject = `Confirmed: Your Consultation with Heading-West (${id})`;
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #1a2942;">Booking Confirmed</h2>
          <p>Dear ${firstName},</p>
          <p>We are pleased to confirm your appointment for <strong>${serviceName}</strong>.</p>
          <div style="background-color: #f8f9fc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Amount Paid:</strong> ${currency} ${price}.00</p>
          </div>
          <p>Please find attached your official invoice and meeting instructions.</p>
          <br/>
          <p>Best regards,<br/><strong>Heading-West Immigration Team</strong></p>
        </div>
      `;

      // Send mail with generated PDF attachment
      const info = await transporter.sendMail({
        from: '"Heading-West Admin" <info@heading-west.com>',
        to: email,
        subject: subject,
        html: htmlContent,
        attachments: [
          {
            filename: `Invoice_${id.replace('#', '')}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });

      console.log('Automated Invoice sent via Nodemailer: %s', nodemailer.getTestMessageUrl(info));

      res.json({ success: true, message: 'Invoice and confirmation sent successfully.', previewUrl: nodemailer.getTestMessageUrl(info) });
    } catch (error: any) {
      console.error("Admin Confirm Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Book Appointment Route
  app.post('/api/book', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
      const token = authHeader.replace('Bearer ', '');

      const { name, email, date, time, type, location } = req.body;

      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: token });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const startTime = new Date(`${date}T${time}:00`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour

      let meetLink = '';
      let eventSummary = `Consultation with ${name} (${type})`;
      let eventLocation = location || 'Online via Google Meet';

      // Create Calendar Event
      const eventDetails: any = {
        summary: eventSummary,
        location: eventLocation,
        description: `Consultation regarding Canadian Immigration.\nClient: ${name}\nEmail: ${email}`,
        start: { dateTime: startTime.toISOString(), timeZone: 'America/Toronto' },
        end: { dateTime: endTime.toISOString(), timeZone: 'America/Toronto' },
      };

      if (type === 'online') {
        eventDetails.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        };
      }

      const eventResp = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: eventDetails,
        conferenceDataVersion: 1,
      });

      if (type === 'online' && eventResp.data.conferenceData) {
        const entryPoints = eventResp.data.conferenceData.entryPoints || [];
        const videoPoint = entryPoints.find(p => p.entryPointType === 'video');
        if (videoPoint) meetLink = videoPoint.uri || '';
      }

      // Send Email to Company (Simulation: we send it to the auth user's email too for testing)
      // Send Email to Client
      const clientMessage = [
        `To: ${email}`,
        'Subject: Booking Confirmation: Heading-West Immigration Services',
        'Content-Type: text/html; charset=utf-8',
        '',
        `<p>Dear ${name},</p>`,
        `<p>Your ${type} consultation has been successfully scheduled.</p>`,
        `<p><strong>Date & Time:</strong> ${startTime.toLocaleString()}</p>`,
        `<p><strong>Location/Link:</strong> ${eventLocation} ${meetLink ? `<br/><a href="${meetLink}">${meetLink}</a>` : ''}</p>`,
        `<p>We will review your details prior to the meeting. Looking forward to speaking with you!</p>`,
        `<p>Best Regards,<br>Heading-West Immigration Services Inc.</p>`
      ].join('\\n');

      const encodedClientMsg = Buffer.from(clientMessage).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedClientMsg }
      });

      // We could send a second email to info@heading-west.com, but since it's sandbox, one is enough to demonstrate.

      res.json({ success: true, meetLink, message: 'Event added to calendar and email sent.' });

    } catch (error: any) {
      console.error("Booking Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Chatbot Route
  app.post('/api/chat', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.json({ reply: 'Please configure your Gemini API Key in the application settings to use the AI chatbot.' });
      }
      
      const ai = new GoogleGenAI({ apiKey });
      const { message } = req.body;
      
      const systemInstruction = `You are an AI assistant for Heading-West Immigration Services Inc., a premier Canadian Immigration Consultancy. 
Director: Nur Mohammed (RCIC-IRB).
Locations: Toronto (HQ), Dhaka Uttara, Dhaka Mirpur.
Services: PNP, Start-up Visa, Caregiver Program, Express Entry, Study Permit, PGWP, Spousal Open Work Permit, Visitor Visas, Refugee/H&C.
Answer the user's questions strictly based on this context. Be helpful, professional, and concise. Don't invent programs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: message }] }],
        config: { systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] } }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Chat error:", error);
      
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key not valid')) {
        return res.json({ reply: 'Please configure a valid Gemini API Key in the application settings to use the AI chatbot.' });
      }
      
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
