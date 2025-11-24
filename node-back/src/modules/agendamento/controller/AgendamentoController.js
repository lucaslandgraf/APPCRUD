const pool = require('../../../db/mysqlConnect');

// Função auxiliar para buscar paciente por CPF
async function buscarPacientePorCpf(cpf) {
  try {
    const [rows] = await pool.execute('SELECT id FROM paciente WHERE cpf = ?', [cpf]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Erro ao buscar paciente por CPF:', error);
    throw new Error('Erro interno ao buscar paciente');
  }
}

// Listar todos agendamentos
async function listarAgendamentos(req, res) {
  try {
    const sql = `
      SELECT a.*, p.nome AS nome_paciente, p.cpf AS cpf_paciente
      FROM agendamento a
      LEFT JOIN paciente p ON a.paciente_id = p.id
      ORDER BY a.data_consulta DESC
    `;
    const [rows] = await pool.execute(sql);
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
    const sql = `
      SELECT a.*, p.nome AS nome_paciente 
      FROM agendamento a
      LEFT JOIN paciente p ON a.paciente_id = p.id
      WHERE a.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
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
  const { paciente_cpf, data_consulta, tipo_exame, observacoes } = req.body; 
  
  if (!paciente_cpf || !data_consulta || !tipo_exame) {
    return res.status(400).json({ error: 'Dados incompletos para criar agendamento' });
  }

  try {
    const paciente = await buscarPacientePorCpf(paciente_cpf);
    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado para o CPF informado' });
    }

    const [result] = await pool.execute(
      'INSERT INTO agendamento (paciente_id, data_consulta, tipo_exame, observacoes) VALUES (?, ?, ?, ?)', 
      [paciente.id, data_consulta, tipo_exame, observacoes || null]
    );
    res.status(201).json({ message: 'Agendamento criado', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    if (error.message.includes('buscar paciente')) {
        return res.status(500).json({ error: 'Erro interno ao buscar paciente' });
    }
    res.status(500).json({ error: 'Erro interno ao criar agendamento' });
  }
}

// Atualizar agendamento
async function atualizarAgendamento(req, res) {
  const { id } = req.params;
  const { paciente_id, data_consulta, tipo_exame, observacoes } = req.body; 
  
  if (!paciente_id || !data_consulta || !tipo_exame) {
    return res.status(400).json({ error: 'Dados incompletos para atualizar agendamento' });
  }
  try {
    const [result] = await pool.execute(
      'UPDATE agendamento SET paciente_id = ?, data_consulta = ?, tipo_exame = ?, observacoes = ? WHERE id = ?', 
      [paciente_id, data_consulta, tipo_exame, observacoes || null, id]
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

// Deletar agendamento
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