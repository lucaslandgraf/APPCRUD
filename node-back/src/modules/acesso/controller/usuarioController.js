const bcrypt = require('bcryptjs');
const pool = require('../../../db/mysqlConnect'); // Importe o pool para o cadastro
const { enviarEmail, autenticarUsuario, recuperarSenhaService, alterarSenhaService } = require('../service/usuarioService');

/**
 * CADASTRO DE USUÁRIO
 * Sempre salva a senha com hash bcrypt
 */
async function cadastroUsuario(req, res) {
  const { email, nome, senha, rol = 'DEFAULT' } = req.body; 

  if (!email || !nome || !senha) {
    return res.status(400).json({ error: "Email, nome ou senha não enviados" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Inserir no banco usando os nomes corretos da sua tabela
    const [result] = await pool.execute(
      'INSERT INTO usuario (nome, email, senha, rol) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, rol]
    );
    
    console.log('Usuário inserido:', result.insertId);

    // Envia o e-mail de boas-vindas
    await enviarEmail(
      email,
      'Bem-vindo ao Sistema Positivo da Saúde',
      `Olá ${nome}, seu cadastro foi realizado com sucesso!`
    );

    res.status(201).json({ status: 'Usuário cadastrado e e-mail enviado' });

  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    // Verifica se é um erro de e-mail duplicado (exemplo)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Este e-mail já está cadastrado." });
    }
    res.status(500).json({ error: "Erro interno ao processar cadastro" });
  }
}

/**
 * LOGIN DE USUÁRIO
 * Retorna os dados do usuário (incluindo o 'rol') em caso de sucesso
 */
async function loginUsuario(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email ou senha não fornecidos" });
  }

  try {
    const usuario = await autenticarUsuario(email, senha);

    res.status(200).json({ 
      message: 'Login bem-sucedido', 
      usuario: { 
        id: usuario.id, 
        nome: usuario.nome, 
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    // Falha (usuário não encontrado ou senha errada)
    res.status(401).json({ error: error.message || 'Credenciais inválidas' });
  }
}

async function recuperarSenha(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "E-mail não fornecido" });
  }

  try {
    await recuperarSenhaService(email);
    res.status(200).json({ message: 'Se o e-mail estiver cadastrado, uma nova senha será enviada.' });

  } catch (error) {
    console.error(error);
    res.status(200).json({ message: 'Se o e-mail estiver cadastrado, uma nova senha será enviada.' });
  }
}

async function alterarSenha(req, res) {
  const { email, senhaAtual, novaSenha } = req.body;

  if (!email || !senhaAtual || !novaSenha) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const resultado = await alterarSenhaService(email, senhaAtual, novaSenha);
    res.status(200).json(resultado);

  } catch (error) {
    // Envia o erro específico (ex: "Senha atual incorreta")
    res.status(401).json({ error: error.message });
  }
}

module.exports = { 
  cadastroUsuario,
  loginUsuario,
  recuperarSenha,
  alterarSenha 
};