import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendContactEmail = async (contactData) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER, 
    subject: `Contact Form: ${contactData.subject}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${contactData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contactData.message}</p>
    `
  };  

  return await transporter.sendMail(mailOptions);
};

export const sendBookingConfirmation = async (bookingData) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: bookingData.userEmail,
    subject: 'Booking Confirmation - Torado Car Wash',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: #000; margin: 0; }
          .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
          .booking-details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; color: #6b7280; }
          .detail-value { color: #111827; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚗 Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${bookingData.userName},</p>
            <p>Thank you for booking with Torado Car Wash! Your appointment has been confirmed.</p>
            
            <div class="booking-details">
              <h2 style="margin-top: 0;">Booking Details</h2>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#${bookingData.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${bookingData.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Vehicle Type:</span>
                <span class="detail-value">${bookingData.vehicleCategory}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${bookingData.bookingDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${bookingData.bookingTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Price:</span>
                <span class="detail-value">$${bookingData.price}</span>
              </div>
              <div class="detail-row" style="border-bottom: none;">
                <span class="detail-label">Status:</span>
                <span class="detail-value" style="color: #F59E0B; font-weight: bold;">${bookingData.status}</span>
              </div>
            </div>
            
            <p><strong>Important Notes:</strong></p>
            <ul>
              <li>Please arrive 5 minutes before your scheduled time</li>
              <li>Bring this confirmation email with you</li>
              <li>Contact us if you need to reschedule</li>
            </ul>
          </div>
          <div class="footer">
            <p>Questions? Contact us at ${process.env.MAIL_USER}</p>
            <p style="color: #6b7280; font-size: 12px;">© 2024 Torado Car Wash. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  return await transporter.sendMail(mailOptions);
};