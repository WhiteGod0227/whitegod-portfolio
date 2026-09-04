const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const Message = require('../models/Message');
const { getDBStatus } = require('../config/db');

// Setup Nodemailer Transporter
const createTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return null;
};

// @desc    Submit a contact scroll (message)
// @route   POST /api/contact
// @access  Public
const submitScroll = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide your True Name, Magic Seal (Email), and Scroll Content.',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid magic email seal.',
      });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const dbStatus = getDBStatus();
    let savedRecord = null;

    if (dbStatus.connected) {
      // Save to MongoDB
      savedRecord = await Message.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        ipAddress: clientIp,
        userAgent,
      });
    } else {
      // Fallback: Save to Local JSON File
      const dataDir = path.join(__dirname, '..', 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const messagesFile = path.join(dataDir, 'messages.json');
      let messages = [];
      if (fs.existsSync(messagesFile)) {
        try {
          const raw = fs.readFileSync(messagesFile, 'utf-8');
          messages = JSON.parse(raw || '[]');
        } catch (e) {
          messages = [];
        }
      }

      savedRecord = {
        _id: 'scroll_' + Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        ipAddress: clientIp,
        userAgent,
        status: 'unread',
        createdAt: new Date().toISOString(),
      };

      messages.unshift(savedRecord);
      fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf-8');
    }

    // Dispatch Email Alert to ayush.singh.10293@gmail.com
    const recipient = process.env.NOTIFICATION_EMAIL || 'ayush.singh.10293@gmail.com';
    const transporter = createTransporter();

    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"WhiteGod Portfolio" <${process.env.EMAIL_USER || 'ayush.singh.10293@gmail.com'}>`,
          to: recipient,
          replyTo: `"${name}" <${email}>`,
          subject: `⚔️ [New Scroll Received] Message from ${name} • WhiteGod Portfolio`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #140202; color: #fff8e7; padding: 30px; border-radius: 8px; border: 2px solid #ff1e27; max-width: 600px; margin: 0 auto;">
              <div style="text-align: center; border-bottom: 2px solid #380808; padding-bottom: 20px; margin-bottom: 20px;">
                <h1 style="color: #ffd700; margin: 0; font-size: 24px; letter-spacing: 2px;">✦ WHITEGOD PORTFOLIO ✦</h1>
                <p style="color: #ff4500; font-size: 13px; margin: 5px 0 0; text-transform: uppercase; letter-spacing: 3px;">New Scroll Received in Grimoire Database</p>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #ffd700; font-weight: bold; width: 130px;">Sender Name:</td>
                  <td style="padding: 8px 0; color: #fff8e7; font-size: 16px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #ffd700; font-weight: bold;">Sender Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #ffd700; text-decoration: underline;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #ffd700; font-weight: bold;">Date & Time:</td>
                  <td style="padding: 8px 0; color: #e2c696; font-size: 13px;">${new Date().toLocaleString()}</td>
                </tr>
              </table>

              <div style="margin-top: 15px;">
                <p style="color: #ffd700; font-weight: bold; margin-bottom: 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">📜 Scroll Content:</p>
                <div style="background-color: #1e0505; border: 1px solid #380808; border-left: 4px solid #ffd700; padding: 18px; border-radius: 4px; color: #fff8e7; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
              </div>

              <div style="margin-top: 25px; text-align: center;">
                <a href="mailto:${email}?subject=Re:%20Alliance%20with%20WhiteGod" style="display: inline-block; background: linear-gradient(135deg, #ffd700, #ff1e27); color: #140202; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 4px; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">
                  ✉️ Reply Directly to ${name}
                </a>
              </div>

              <div style="border-top: 1px solid #380808; margin-top: 25px; padding-top: 15px; text-align: center; font-size: 11px; color: #a88960;">
                <p style="margin: 0;">WhiteGod Portfolio API • Transmission Protocol • IP: ${clientIp}</p>
              </div>
            </div>
          `,
        });
        console.log(`✉️ [Email Alert] Scroll notification successfully dispatched to ${recipient}`);
      } catch (mailErr) {
        console.warn(`⚠️ [Nodemailer] Could not send email alert: ${mailErr.message}`);
      }
    } else {
      console.log(`📜 [Scroll Received] From: ${name} (${email}) ➔ Destination: ${recipient}`);
      console.log(`💡 [Tip] To activate live email alerts to ${recipient}, add your Gmail App Password to server/.env (EMAIL_USER & EMAIL_PASS).`);
    }

    return res.status(201).json({
      success: true,
      message: 'Scroll successfully cast and received by WhiteGod.',
      data: {
        id: savedRecord._id,
        name: savedRecord.name,
        timestamp: savedRecord.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all received scrolls (for Admin / Developer Inspection)
// @route   GET /api/contact/messages
// @access  Public (or protected in production)
const getScrolls = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: messages.length, data: messages });
    }

    const messagesFile = path.join(__dirname, '..', 'data', 'messages.json');
    let messages = [];
    if (fs.existsSync(messagesFile)) {
      try {
        messages = JSON.parse(fs.readFileSync(messagesFile, 'utf-8') || '[]');
      } catch (e) {
        messages = [];
      }
    }
    return res.status(200).json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitScroll,
  getScrolls,
};
