const pool = require('../../../db/mysqlConnect'); // importar pool de conexão

// Listar todos os pacientes
async function listarPacientes(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM paciente');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ error: 'Erro interno ao listar pacientes' });
  }
}

// Obter paciente pelo ID
async function obterPaciente(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM paciente WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao obter paciente:', error);
    res.status(500).json({ error: 'Erro interno ao obter paciente' });
  }
}

// Criar um novo paciente
async function criarPaciente(req, res) {
  const { nome, data_nascimento, endereco, telefone, cpf, observacoes } = req.body;
  if (!nome || !data_nascimento || !endereco || !telefone || !cpf) {
    return res.status(400).json({ error: 'Dados incompletos para criar paciente' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO paciente (nome, data_nascimento, endereco, telefone, CPF, observacoes) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, data_nascimento, endereco, telefone, cpf, observacoes || null]
    );
    res.status(201).json({ message: 'Paciente criado', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({ error: 'Erro interno ao criar paciente' });
  }
}

// Atualizar paciente pelo ID
async function atualizarPaciente(req, res) {
  const { id } = req.params;
  const { nome, data_nascimento, endereco, telefone, CPF, observacoes } = req.body;
  if (!nome || !data_nascimento || !endereco || !telefone || !cpf) {
    return res.status(400).json({ error: 'Dados incompletos para atualizar paciente' });
  }
  try {
    const [result] = await pool.execute(
      'UPDATE paciente SET nome = ?, data_nascimento = ?, endereco = ?, telefone = ?, CPF = ?, observacoes = ? WHERE id = ?',
      [nome, data_nascimento, endereco, telefone, cpf, observacoes || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    res.status(200).json({ message: 'Paciente atualizado' });
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar paciente' });
  }
}

// Deletar paciente pelo ID
async function deletarPaciente(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM paciente WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }
    res.status(200).json({ message: 'Paciente deletado' });
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    res.status(500).json({ error: 'Erro interno ao deletar paciente' });
  }
}

module.exports = {
  listarPacientes,
  obterPaciente,
  criarPaciente,
  atualizarPaciente,
  deletarPaciente
};
