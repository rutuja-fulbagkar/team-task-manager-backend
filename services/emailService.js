import nodemailer from "nodemailer";

console.log("EMAIL_USERNAME:", process.env.EMAIL_USERNAME);

console.log(
  "EMAIL_PASSWORD exists:",
  process.env.EMAIL_PASSWORD ? "YES" : "NO"
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

transporter.verify()
  .then(() => {
    console.log("SMTP connection successful. Server is ready.");
  })
  .catch((error) => {
    console.error("SMTP connection failed:");
    console.error(error);
  });

// Send verification email
export const sendVerificationEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USERNAME}>`, // Customize sender name
      to: email, // Recipient address
      subject: "Verify Your Email Address",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
              background-color: #4CAF50;
              color: #ffffff;
              padding: 10px 0;
              border-radius: 8px 8px 0 0;
            }
            .email-header h1 {
              margin: 0;
              font-size: 24px;
            }
            .email-body {
              padding: 20px;
              color: #333333;
            }
            .email-footer {
              text-align: center;
              font-size: 12px;
              color: #666666;
              margin-top: 20px;
            }
            .verify-btn {
              display: inline-block;
              background-color: #4CAF50;
              color: #ffffff;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 10px;
            }
            .verify-btn:hover {
              background-color: #45a049;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Your App Name</h1>
            </div>
            <div class="email-body">
              <p>Hi,</p>
              <p>Thank you for registering with <strong>Your App Name</strong>.</p>
              <p>Please verify your email address to activate your account:</p>
              <p><strong>Verification Code:</strong></p>
              <h2 style="text-align: center; color: #4CAF50;">${otp}</h2>
              <p>Alternatively, you can verify your email by clicking the button below:</p>
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/verify-email/${email}?otp=${otp}" class="verify-btn">Verify Email</a>
              </p>
              <p>If you didn’t create an account with us, please ignore this email.</p>
            </div>
            <div class="email-footer">
              <p>&copy; ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error.message);
    throw new Error("Failed to send verification email.");
  }
};
export const sendForgotPassEmail = async (email, subject, customContent) => {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USERNAME}>`, // Customize sender name
      to: email, // Recipient address
      subject, // Use the subject passed to the function
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
              background-color: #4CAF50;
              color: #ffffff;
              padding: 10px 0;
              border-radius: 8px 8px 0 0;
            }
            .email-header h1 {
              margin: 0;
              font-size: 24px;
            }
            .email-body {
              padding: 20px;
              color: #333333;
            }
            .email-footer {
              text-align: center;
              font-size: 12px;
              color: #666666;
              margin-top: 20px;
            }
            .reset-link {
              color: #4CAF50;
              text-decoration: none;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>Your App Name</h1>
            </div>
            <div class="email-body">
              <p>Hi,</p>
              <p>${customContent}</p>
            </div>
            <div class="email-footer">
              <p>&copy; ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email} with subject: ${subject}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email.");
  }
};


// Send OTP to phone (mock implementation)
export const sendOTP = async (phone, otp) => {
  try {
    console.log(`Sending OTP ${otp} to phone number ${phone}`);
    // Here, you can integrate with an SMS provider like Twilio
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    throw new Error("Failed to send OTP.");
  }
};


// If you want to send OTPs via SMS,
//     you can integrate with services like
// Twilio, Nexmo(Vonage), or MessageBird., using Twilio:

 
