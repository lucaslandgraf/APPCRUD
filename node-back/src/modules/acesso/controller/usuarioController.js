// src/modules/acesso/controller/usuarioController.js
const { enviarEmail } = require('../service/usuarioService');

async function cadastroUsuario(req, res) {
  const { email, nome } = req.body;

  if (!email || !nome) {
    return res.status(400).json({ error: "Email ou nome não enviados" });
  }

  // Aqui você cadastra no banco

  await enviarEmail(
    email,
    'Bem-vindo ao Sistema Positivo da Saúde',
    `Olá ${nome}, seu cadastro foi realizado com sucesso!`
  );

  res.json({ status: 'Usuário cadastrado e e-mail enviado' });
}

module.exports = { cadastroUsuario };
