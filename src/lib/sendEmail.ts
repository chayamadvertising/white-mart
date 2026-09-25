import nodemailer from 'nodemailer'

export async function sendOrderNotification(orderId: string, orderDetails: any) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send notification to the admin's email
      subject: `New Order Received! #${orderDetails.orderNumber}`,
      html: `
        <h2>You have received a new order!</h2>
        <p><strong>Order Number:</strong> ${orderDetails.orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
        <p><strong>Shipping Address:</strong> ${orderDetails.shippingAddress}, ${orderDetails.shippingCity}</p>
        <br/>
        <a href="${process.env.NEXTAUTH_URL}/admin/orders/${orderId}">View Full Order Details in Admin Panel</a>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Notification email sent for order', orderDetails.orderNumber)
  } catch (error) {
    console.error('Error sending email notification:', error)
  }
}
