const nodemailer = require('nodemailer');

// Set up transporter using Gmail's SMTP service
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,  // Use port 587 for secure TLS
    secure: false,  // Set to false because we are using STARTTLS
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASS   // App-specific password from Google
    }
});

// Function to send order confirmation email
async function sendOrderEmail(orderDetails) {
    const { customerName, email, products, total, orderNumber } = orderDetails;

    if (!email) {
        throw new Error("Recipient email is not defined");
    }

    if (!products || products.length === 0) {
        throw new Error("No products found in the order.");
    }

    // Email options: sending to both the customer and the admin
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,  // Send to the user who placed the order
        cc: process.env.ADMIN_EMAIL,  // Send a copy to the admin
        subject: `Order Confirmation - #${orderNumber}`,
        html: `
            <h1>Hi ${customerName},</h1>
            <p>Your order has been successfully placed!</p>
            <h2>Order Summary:</h2>
            <p>Order Number: ${orderNumber}</p>
            <h3>Total: ₹${total}</h3>
            <p>Thank you for shopping with us!</p>
        `,
    };

    // Send email to both the user and the admin
    return transporter.sendMail(mailOptions);
}

module.exports = { sendOrderEmail };
