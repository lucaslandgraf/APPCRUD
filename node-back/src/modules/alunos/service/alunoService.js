const pool = require('../../../db/mysqlConnect');
const bcrypt = require('bcryptjs');
const { enviarEmail } = require('../../acesso/service/usuarioService'); // Importa do service de acesso

// Função que BUSCA os alunos no banco
async function listarAlunosService() {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nome, email, rol FROM usuario ORDER BY nome ASC'
    );
    return rows;
  } catch (error) {
    console.error('Erro no serviço de listagem de alunos:', error);
    throw new Error('Não foi possível buscar os alunos.');
  }
}

// Função que CADASTRA o aluno no banco e envia email
async function cadastrarAlunoService(nome, email, senha, rol = 'DEFAULT') {
    if (!nome || !email || !senha) {
        throw new Error("Dados incompletos para cadastro.");
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        const [result] = await pool.execute(
            'INSERT INTO usuario (nome, email, senha, rol) VALUES (?, ?, ?, ?)',
            [nome, email, senhaHash, rol]
        );
        console.log('Aluno (usuário) inserido:', result.insertId);
        await enviarEmail(
            email,
            'Bem-vindo ao Sistema Positivo da Saúde',
            `Olá ${nome}, seu cadastro como aluno foi realizado com sucesso!`
        );
        return { insertId: result.insertId, message: 'Aluno cadastrado com sucesso.' };
    } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("Este e-mail já está cadastrado.");
        }
        throw new Error("Erro interno ao processar cadastro do aluno.");
    }
}

async function excluirAlunoService(id) {
  try {
    // Verifica se o usuário existe antes de tentar deletar (opcional, mas bom)
    const [check] = await pool.execute('SELECT id FROM usuario WHERE id = ?', [id]);
    if (check.length === 0) {
      throw new Error('Aluno não encontrado com o ID fornecido.');
    }
    
    const [result] = await pool.execute('DELETE FROM usuario WHERE id = ?', [id]);

    // Verifica se alguma linha foi afetada
    if (result.affectedRows === 0) {
      throw new Error('Nenhum aluno foi excluído. ID pode não existir.');
    }

    console.log(`Aluno (usuário) ID ${id} excluído.`);
    return { message: 'Aluno excluído com sucesso.' };

  } catch (error) {
    console.error(`Erro ao excluir aluno ID ${id}:`, error);
    throw new Error(error.message || 'Erro interno ao excluir aluno.');
  }
}

async function atualizarAlunoService(id, nome, email, rol) {
  if (!nome || !email || !rol) {
      throw new Error("Dados incompletos para atualização (nome, email, rol são obrigatórios).");
  }
  try {
      const [result] = await pool.execute(
          'UPDATE usuario SET nome = ?, email = ?, rol = ? WHERE id = ?',
          [nome, email, rol, id]
      );

      if (result.affectedRows === 0) {
          throw new Error('Aluno não encontrado com o ID fornecido.');
      }

      console.log(`Aluno (usuário) ID ${id} atualizado.`);
      return { message: 'Dados do aluno atualizados com sucesso.' };

  } catch (error) {
      console.error(`Erro ao atualizar aluno ID ${id}:`, error);
      if (error.code === 'ER_DUP_ENTRY') {
          throw new Error("Este e-mail já está sendo usado por outro usuário.");
      }
      throw new Error(error.message || 'Erro interno ao atualizar aluno.');
  }
}

module.exports = {
  listarAlunosService,
  cadastrarAlunoService,
  excluirAlunoService, 
  atualizarAlunoService 
};