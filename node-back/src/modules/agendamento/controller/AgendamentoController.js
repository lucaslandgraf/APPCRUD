const pool = require('../../../db/mysqlConnect'); // importar pool de conexão

// Função auxiliar para buscar paciente por CPF
async function buscarPacientePorCpf(cpf) {
  try {
    // Assumindo que existe uma tabela 'paciente' com uma coluna 'cpf'
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
  const { paciente_cpf, data_consulta, tipo_exame } = req.body;
  if (!paciente_cpf || !data_consulta || !tipo_exame) {
    return res.status(400).json({ error: 'Dados incompletos para criar agendamento' });
  }
  try {
    // 1. Buscar o paciente pelo CPF
    const paciente = await buscarPacientePorCpf(paciente_cpf);

    if (!paciente) {
      console.error("Paciente não encontrado");
      return res.status(404).json({ error: 'Paciente não encontrado para o CPF informado' });
    }

    // 2. Usar o ID do paciente para criar o agendamento
    const [result] = await pool.execute(
      'INSERT INTO agendamento (paciente_id, data_consulta, tipo_exame) VALUES (?, ?, ?)',
      [paciente.id, data_consulta, tipo_exame]
    );
    res.status(201).json({ message: 'Agendamento criado', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    // Verifica se o erro veio da função auxiliar
    if (error.message.includes('buscar paciente')) {
        return res.status(500).json({ error: 'Erro interno ao buscar paciente' });
    }
    res.status(500).json({ error: 'Erro interno ao criar agendamento' });
  }
}


// Atualizar agendamento pelo ID
async function atualizarAgendamento(req, res) {
  const { id } = req.params;
  // O front-end original enviava paciente_id, mas o novo front-end enviará paciente_cpf.
  // Para manter a compatibilidade com a função de atualização, vou manter a lógica de usar paciente_id
  // mas é importante notar que o front-end de *criação* mudou para usar CPF.
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