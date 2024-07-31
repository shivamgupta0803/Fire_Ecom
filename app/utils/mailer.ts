import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "bloggieapp@gmail.com",
    pass: "fthqtorropvylczy",
  },
});

export const sendEmailService = async (to: any, subject: any, text: any) => {
  const mailOptions = {
    from: "shivamgupta08032001@gmail.com",
    to,
    subject,
    html: text,
  };
  await transporter.sendMail(mailOptions);
};
