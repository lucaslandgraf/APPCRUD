const pool = require('../../../db/mysqlConnect'); // importar pool de conexão

// Listar todos agendamentos
async function listarAgendamentos(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM agendamento');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ error: 'Erro interno ao listar agendamentos' });
  }
}

// Obter agendamento por ID
async function obterAgendamento(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM agendamento WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao obter agendamento:', error);
    res.status(500).json({ error: 'Erro interno ao obter agendamento' });
  }
}

// Criar novo agendamento
async function criarAgendamento(req, res) {
  const { paciente_id, data_consulta, tipo_exame } = req.body;
  if (!paciente_id || !data_consulta || !tipo_exame) {
    return res.status(400).json({ error: 'Dados incompletos para criar agendamento' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO agendamento (paciente_id, data_consulta, tipo_exame) VALUES (?, ?, ?)',
      [paciente_id, data_consulta, tipo_exame]
    );
    res.status(201).json({ message: 'Agendamento criado', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro interno ao criar agendamento' });
  }
}

// Atualizar agendamento pelo ID
async function atualizarAgendamento(req, res) {
  const { id } = req.params;
  const { paciente_id, data_consulta, tipo_exame } = req.body;
  if (!paciente_id || !data_consulta || !tipo_exame) {
    return res.status(400).json({ error: 'Dados incompletos para atualizar agendamento' });
  }
  try {
    const [result] = await pool.execute(
      'UPDATE agendamento SET paciente_id = ?, data_consulta = ?, tipo_exame = ? WHERE id = ?',
      [paciente_id, data_consulta, tipo_exame, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json({ message: 'Agendamento atualizado' });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar agendamento' });
  }
}

// Deletar agendamento pelo ID
async function deletarAgendamento(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM agendamento WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }
    res.status(200).json({ message: 'Agendamento deletado' });
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    res.status(500).json({ error: 'Erro interno ao deletar agendamento' });
  }
}

module.exports = {
  listarAgendamentos,
  obterAgendamento,
  criarAgendamento,
  atualizarAgendamento,
  deletarAgendamento
};
