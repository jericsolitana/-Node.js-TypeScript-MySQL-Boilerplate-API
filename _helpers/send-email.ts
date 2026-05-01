import nodemailer from 'nodemailer';
import config from '../config.json';

export default async function sendEmail({ to, subject, html, from = config.emailFrom }: any) {
    const transporter = nodemailer.createTransport(config.smtpOptions);

    // SEND EMAIL
    const info = await transporter.sendMail({ from, to, subject, html });

    // ✅ ADD THESE LINES
    console.log("Message sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}
