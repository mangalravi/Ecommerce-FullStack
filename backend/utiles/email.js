import transporter from "./transporter.js";

const sendTestEmail = async () => {
  try {
    await transporter.sendMail({
      from: `"DailyFit Meals" <${process.env.EMAIL_USER}>`,
      to: "recipient@example.com",
      subject: "Test Email",
      text: "Hello from NodeMailer!",
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Email error:", err);
  }
};

sendTestEmail();
