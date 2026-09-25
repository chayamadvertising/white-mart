import nodemailer from 'nodemailer'

export const sendOrderConfirmationEmail = async (userEmail: string, orderNumber: string, amount: number) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password',
      },
    })

    const mailOptions = {
      from: `"White Mart" <${process.env.EMAIL_USER || 'noreply@whitemart.com'}>`,
      to: userEmail,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #2874f0;">Order Confirmed!</h2>
          <p>Thank you for your order.</p>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
          <p>We will notify you once your order is shipped.</p>
          <br/>
          <p>Regards,<br/>White Mart Team</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
