const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendBookingConfirmation = async ({ customerEmail, customerName, ownerEmail, workerName, services, startTime }) => {
    const formattedTime = new Date(startTime).toLocaleString();
    // const serviceList = services.map(s => `• ${s.name} (${s.duration} mins)`).join('\n');

    const customerMsg = `
  <div style="max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333; line-height: 1.5; border: 1px solid #eeeeee; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
    <!-- Header with Logo -->
    <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #eeeeee;">
      <h1 style="color: #3e9776; margin: 0; font-weight: 300; font-size: 28px;">Tranquility Nails & Spa</h1>
    </div>
    
    <!-- Confirmation Message -->
    <div style="text-align: center; background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
      <h2 style="margin-top: 0; color: #3e9776; font-weight: 400;">Appointment Confirmation</h2>
      <p style="font-size: 16px; margin-bottom: 5px;">Hello <strong>${customerName}</strong>,</p>
      <p style="font-size: 16px;">Your appointment has been successfully booked!</p>
    </div>
    
    <!-- Appointment Details -->
    <div style="background-color: #f0f7f4; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
      <h3 style="color: #3e9776; margin-top: 0; font-weight: 400;">Appointment Details</h3>
      <p style="margin-bottom: 5px;"><strong>Date & Time:</strong> <span style="color: #3e9776;">${formattedTime}</span></p>
      <p style="margin-bottom: 5px;"><strong>Spa Specialist:</strong> ${workerName}</p>
      
      <div style="margin-top: 15px;">
        <p style="margin-bottom: 8px;"><strong>Services:</strong></p>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #dddddd;">Service</th>
              <th style="text-align: right; padding: 8px; border-bottom: 1px solid #dddddd;">Duration</th>
            </tr>
          </thead>
          <tbody>
            ${services.map(s => `
              <tr>
                <td style="text-align: left; padding: 8px; border-bottom: 1px solid #eeeeee;">${s.name}</td>
                <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eeeeee;">${s.duration} mins</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Message -->
    <div style="text-align: center; margin-bottom: 30px;">
      <p style="font-style: italic; color: #777777;">We look forward to pampering you at your upcoming appointment!</p>
      <p style="color: #888888; font-size: 14px;">Need to reschedule? Contact us at least 24 hours before your appointment.</p>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; color: #999999; font-size: 14px;">
      <p style="margin-bottom: 5px;">Warm regards,</p>
      <p style="margin-bottom: 15px;"><strong>Tranquility Nails & Spa</strong></p>
      <p style="font-size: 12px;">123 Serenity Ave • Relaxation City, RC 12345 • (555) 123-4567</p>
    </div>
  </div>
`;


    const ownerMsg = `
<div style="max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333; line-height: 1.5; border: 1px solid #eeeeee; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
  <!-- Header -->
  <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eeeeee;">
    <h1 style="color: #3e9776; margin: 0; font-weight: 300; font-size: 28px;">Tranquility Nails & Spa</h1>
  </div>
  
  <!-- Notification Header -->
  <div style="text-align: center; background-color: #f0f7f4; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
    <h2 style="margin: 0; color: #3e9776; font-weight: 500; font-size: 22px;">New Booking Notification</h2>
  </div>
  
  <!-- Booking Details -->
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
    <h3 style="color: #3e9776; margin-top: 0; font-weight: 400; margin-bottom: 15px;">Booking Details</h3>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #dddddd; width: 30%;"><strong>Customer:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #dddddd;">${customerName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #dddddd;"><strong>Email:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #dddddd;">${customerEmail}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #dddddd;"><strong>Staff Member:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #dddddd;">${workerName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #dddddd;"><strong>Date & Time:</strong></td>
        <td style="padding: 8px 0; border-bottom: 1px solid #dddddd; color: #3e9776;">${formattedTime}</td>
      </tr>
    </table>
    
    <div style="margin-top: 20px;">
      <p style="margin-bottom: 10px;"><strong>Booked Services:</strong></p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #dddddd;">Service</th>
            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #dddddd;">Duration</th>
          </tr>
        </thead>
        <tbody>
          ${services.map(s => `
            <tr>
              <td style="text-align: left; padding: 8px; border-bottom: 1px solid #eeeeee;">${s.name}</td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #eeeeee;">${s.duration} mins</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <!-- Action Button -->
  <div style="text-align: center; margin: 25px 0;">
    <a href="#" style="display: inline-block; padding: 12px 25px; background-color: #3e9776; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">View in Dashboard</a>
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee; color: #999999; font-size: 14px;">
    <p style="margin: 5px 0;">This is an automated notification. Please do not reply to this email.</p>
  </div>
</div>
`;

    // Send to customer
    await transporter.sendMail({
        from: `"Tranquility Nails & Spa" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: 'Your Appointment Confirmation',
        html: customerMsg
    });

    // Send to owner
    await transporter.sendMail({
        from: `"Tranquility Nails & Spa" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject: 'New Booking Notification',
        html: ownerMsg
    });
};
