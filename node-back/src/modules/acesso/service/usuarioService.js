require('dotenv').config();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs'); 
const pool = require('../../../db/mysqlConnect'); 
const { nanoid } = require('nanoid'); // 

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Função de enviar e-mail
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

/**
 * Autentica um usuário (LÓGICA SEGURA PADRÃO)
 * Compara a senha fornecida com o hash no banco.
 */
async function autenticarUsuario(email, senhaFornecida) {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuario WHERE email = ?', [email]);

    if (rows.length === 0) {
      throw new Error('Credenciais inválidas');
    }

    const usuario = rows[0];

    const senhaCorreta = await bcrypt.compare(senhaFornecida, usuario.senha);

    if (!senhaCorreta) {
      throw new Error('Credenciais inválidas');
    }

    delete usuario.senha; 
    return usuario;

  } catch (error) {
    console.error('Erro na autenticação:', error.message);
    throw new Error('Credenciais inválidas');
  }
}

async function recuperarSenhaService(email) {
  try {
    // 1. Verifica se o usuário existe
    const [rows] = await pool.execute('SELECT * FROM usuario WHERE email = ?', [email]);

    if (rows.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    // 2. Gera uma nova senha aleatória 
    const novaSenha = nanoid(8); 

    // 3. Cria o hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    // 4. Atualiza o banco de dados com a nova senha
    await pool.execute('UPDATE usuario SET senha = ? WHERE email = ?', [senhaHash, email]);

    // 5. Envia a nova senha (em texto puro) por e-mail
    await enviarEmail(
      email,
      'Recuperação de Senha - Sistema Positivo da Saúde',
      `Olá,\n\nVocê solicitou uma recuperação de senha.\n\nSua nova senha é: ${novaSenha}\n\nRecomendamos que você a altere após o primeiro login.\n`
    );

    return { message: 'Nova senha enviada para o seu e-mail.' };

  } catch (error) {
    console.error('Erro no serviço de recuperação:', error.message);
    throw new Error('Não foi possível processar a solicitação.');
  }
}

async function alterarSenhaService(email, senhaAtual, novaSenha) {
  try {
    const [rows] = await pool.execute('SELECT * FROM usuario WHERE email = ?', [email]);
    if (rows.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    const usuario = rows[0];

    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) {
      throw new Error('A senha atual está incorreta');
    }
    const salt = await bcrypt.genSalt(10);
    const novaSenhaHash = await bcrypt.hash(novaSenha, salt);

    await pool.execute('UPDATE usuario SET senha = ? WHERE email = ?', [novaSenhaHash, email]);

    return { message: 'Senha alterada com sucesso!' };

  } catch (error) {
    console.error('Erro no serviço de alteração de senha:', error.message);
    throw new Error(error.message || 'Não foi possível processar a solicitação.');
  }
}

module.exports = { 
  enviarEmail,
  autenticarUsuario,
  recuperarSenhaService,
  alterarSenhaService 
};