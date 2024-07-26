import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'shivamgupta08032001@gmail.com', 
    pass: 'keimqvfubhhiowou', 
  },
});

export const sendEmailService = async (to: any, subject: any, text: any) => {
  const mailOptions = {
    from: 'shivamgupta08032001@gmail.com',
    to,
    subject,
    text,
  };

  // try {
    await transporter.sendMail(mailOptions);
  //   console.log('Email sent successfully');
  // } catch (error) {
  //   console.error('Error sending email:', error);
  // }
};

