require('dotenv').config(); // Carrega variáveis do .env
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function enviarEmail(to, subject, text) {
    try {
        const info = await transporter.sendMail({
            from: `"Sistema Positivo da Saúde" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });
        console.log('E-mail enviado com sucesso para', to);
        console.log('ID da mensagem:', info.messageId);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
}

module.exports = { enviarEmail };
