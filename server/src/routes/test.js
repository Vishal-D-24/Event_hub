import { Router } from 'express';
import { sendEmail } from '../utils/mailer.js';

const router = Router();

router.post('/send-test-email', async (req, res, next) => {
  try {
    const { to } = req.body;
    if (!to) return res.status(400).json({ error: 'Email address required' });

    console.log('🧪 Testing email send to:', to);
    
    const result = await sendEmail({
      to,
      subject: 'Test Email from Smart Event Hub',
      html: `
        <h2>Test Email</h2>
        <p>If you're reading this, email functionality is working! ✅</p>
        <p>Sent at: ${new Date().toLocaleString()}</p>
      `
    });

    res.json({ 
      success: true, 
      message: 'Email sent successfully',
      result 
    });
  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.body || error.toString()
    });
  }
});

router.post('/send-welcome-email', async (req, res, next) => {
  try {
    const { to, name } = req.body;
    if (!to) return res.status(400).json({ error: 'Email address required' });

    console.log('📧 Testing welcome email to:', to);
    
    const welcomeHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1>Welcome to Smart Event Hub!</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p>Hi ${name || 'there'},</p>
          <p>Welcome to <strong>Smart Event Hub</strong>! Your admin account has been successfully created.</p>
          <h3 style="color: #667eea;">What you can do:</h3>
          <ul>
            <li>Create and manage events</li>
            <li>Share registration links</li>
            <li>Generate certificates</li>
            <li>Track participants</li>
            <li>Customize registration forms</li>
          </ul>
          <p><a href="http://localhost:5173/admin/events" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px;">Get Started</a></p>
        </div>
        <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>Smart Event Hub - Modern Event Management</p>
        </div>
      </div>
    `;
    
    const result = await sendEmail({
      to,
      subject: 'Welcome to Smart Event Hub!',
      html: welcomeHTML,
    });

    res.json({ 
      success: true, 
      message: 'Welcome email sent successfully',
      result 
    });
  } catch (error) {
    console.error('Welcome email failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.body || error.toString()
    });
  }
});

export default router;
