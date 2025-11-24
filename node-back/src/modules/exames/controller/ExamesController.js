const pool = require('../../../db/mysqlConnect'); 

async function listarTodosExames(req, res) {
  try {
    // Template de Query para buscar o exame + nome do paciente + data do agendamento
    const queryBase = (tabela) => `
      SELECT e.*, p.nome AS nomePaciente, a.data_consulta AS dataConsulta
      FROM ${tabela} e
      LEFT JOIN paciente p ON e.paciente_id = p.id
      LEFT JOIN agendamento a ON e.agendamento_id = a.id
    `;

    // Executa as consultas para os 3 tipos de exames
    const [dengue] = await pool.execute(queryBase('exame_dengue'));
    const [abo] = await pool.execute(queryBase('exame_abo'));
    const [covid] = await pool.execute(queryBase('exame_covid_19'));

    // Junta tudo num único array e adiciona o campo 'tipo'
    const exames = [
      ...dengue.map(e => ({ ...e, tipo: 'Dengue' })),
      ...abo.map(e => ({ ...e, tipo: 'ABO' })),
      ...covid.map(e => ({ ...e, tipo: 'Covid' })),
    ];

    res.status(200).json(exames);
  } catch (error) {
    console.error('Erro ao listar todos exames:', error);
    res.status(500).json({ error: 'Erro interno ao listar exames' });
  }
}

// CRUD INDIVIDUAL (ABO, COVID, DENGUE)

// exame_abo

async function listarExameAbo(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM exame_abo');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar exame_abo:', error);
    res.status(500).json({ error: 'Erro interno ao listar exame_abo' });
  }
}

async function obterExameAbo(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM exame_abo WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Exame ABO não encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao obter exame_abo:', error);
    res.status(500).json({ error: 'Erro interno ao obter exame_abo' });
  }
}

async function criarExameAbo(req, res) {
  const { agendamento_id, paciente_id, nome, amostra_dna, tipo_sanguineo, observacoes } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO exame_abo (agendamento_id, paciente_id, nome, amostra_dna, tipo_sanguineo, observacoes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [agendamento_id || null, paciente_id || null, nome || null, amostra_dna || null, tipo_sanguineo || null, observacoes || null]
    );
    res.status(201).json({ message: 'Exame ABO criado', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar exame_abo:', error);
    res.status(500).json({ error: 'Erro interno ao criar exame_abo' });
  }
}

async function atualizarExameAbo(req, res) {
  const { id } = req.params;
  const { agendamento_id, paciente_id, nome, amostra_dna, tipo_sanguineo, observacoes } = req.body;
  try {
    const [result] = await pool.execute(
      `UPDATE exame_abo SET agendamento_id = ?, paciente_id = ?, nome = ?, amostra_dna = ?, tipo_sanguineo = ?, observacoes = ? WHERE id = ?`,
      [agendamento_id || null, paciente_id || null, nome || null, amostra_dna || null, tipo_sanguineo || null, observacoes || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exame ABO não encontrado' });
    }
    res.status(200).json({ message: 'Exame ABO atualizado' });
  } catch (error) {
    console.error('Erro ao atualizar exame_abo:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar exame_abo' });
  }
}

async function deletarExameAbo(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM exame_abo WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exame ABO não encontrado' });
    }
    res.status(200).json({ message: 'Exame ABO deletado' });
  } catch (error) {
    console.error('Erro ao deletar exame_abo:', error);
    res.status(500).json({ error: 'Erro interno ao deletar exame_abo' });
  }
}

// exame_covid_19 

async function listarExameCovid19(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM exame_covid_19');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar exame_covid_19:', error);
    res.status(500).json({ error: 'Erro interno ao listar exame_covid_19' });
  }
}

async function obterExameCovid19(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM exame_covid_19 WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Exame COVID-19 não encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao obter exame_covid_19:', error);
    res.status(500).json({ error: 'Erro interno ao obter exame_covid_19' });
  }
}

async function criarExameCovid19(req, res) {
  const { agendamento_id, paciente_id, nome, tipo_teste, status_amostra, resultado, data_inicio_sintomas, sintomas, nivel_anticorpos, observacoes } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO exame_covid_19
       (agendamento_id, paciente_id, nome, tipo_teste, status_amostra, resultado, data_inicio_sintomas, sintomas, nivel_anticorpos, observacoes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        agendamento_id || null, paciente_id || null, nome || null, tipo_teste || null,
        status_amostra || null, resultado || null, data_inicio_sintomas || null,
        sintomas || null, nivel_anticorpos || null, observacoes || null
      ]
    );
    res.status(201).json({ message: 'Exame COVID-19 criado', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar exame_covid_19:', error);
    res.status(500).json({ error: 'Erro interno ao criar exame_covid_19' });
  }
}

async function atualizarExameCovid19(req, res) {
  const { id } = req.params;
  const { agendamento_id, paciente_id, nome, tipo_teste, status_amostra, resultado, data_inicio_sintomas, sintomas, nivel_anticorpos, observacoes } = req.body;
  try {
    const [result] = await pool.execute(
      `UPDATE exame_covid_19 SET
       agendamento_id = ?, paciente_id = ?, nome = ?, tipo_teste = ?, status_amostra = ?, resultado = ?,
       data_inicio_sintomas = ?, sintomas = ?, nivel_anticorpos = ?, observacoes = ?
       WHERE id = ?`,
      [
        agendamento_id || null, paciente_id || null, nome || null, tipo_teste || null,
        status_amostra || null, resultado || null, data_inicio_sintomas || null,
        sintomas || null, nivel_anticorpos || null, observacoes || null, id
      ]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exame COVID-19 não encontrado' });
    }
    res.status(200).json({ message: 'Exame COVID-19 atualizado' });
  } catch (error) {
    console.error('Erro ao atualizar exame_covid_19:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar exame_covid_19' });
  }
}

async function deletarExameCovid19(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM exame_covid_19 WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exame COVID-19 não encontrado' });
    }
    res.status(200).json({ message: 'Exame COVID-19 deletado' });
  } catch (error) {
    console.error('Erro ao deletar exame_covid_19:', error);
    res.status(500).json({ error: 'Erro interno ao deletar exame_covid_19' });
  }
}

// exame_dengue

async function listarExameDengue(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM exame_dengue');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar exame_dengue:', error);
    res.status(500).json({ error: 'Erro interno ao listar exame_dengue' });
  }
}

async function obterExameDengue(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM exame_dengue WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Exame dengue não encontrado' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erro ao obter exame_dengue:', error);
    res.status(500).json({ error: 'Erro interno ao obter exame_dengue' });
  }
}

async function criarExameDengue(req, res) {
  const { agendamento_id, paciente_id, nome, amostra_sangue, data_inicio_sintomas } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO exame_dengue (agendamento_id, paciente_id, nome, amostra_sangue, data_inicio_sintomas) VALUES (?, ?, ?, ?, ?)',
      [agendamento_id || null, paciente_id || null, nome || null, amostra_sangue || null, data_inicio_sintomas || null]
    );
    res.status(201).json({ message: 'Exame dengue criado', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar exame_dengue:', error);
    res.status(500).json({ error: 'Erro interno ao criar exame_dengue' });
  }
}

async function atualizarExameDengue(req, res) {
  const { id } = req.params;
  const { agendamento_id, paciente_id, nome, amostra_sangue, data_inicio_sintomas } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE exame_dengue SET agendamento_id = ?, paciente_id = ?, nome = ?, amostra_sangue = ?, data_inicio_sintomas = ? WHERE id = ?',
      [agendamento_id || null, paciente_id || null, nome || null, amostra_sangue || null, data_inicio_sintomas || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exame dengue não encontrado' });
    }
    res.status(200).json({ message: 'Exame dengue atualizado' });
  } catch (error) {
    console.error('Erro ao atualizar exame_dengue:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar exame_dengue' });
  }
}

async function deletarExameDengue(req, res) {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM exame_dengue WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Exame dengue não encontrado' });
    }
    res.status(200).json({ message: 'Exame dengue deletado' });
  } catch (error) {
    console.error('Erro ao deletar exame_dengue:', error);
    res.status(500).json({ error: 'Erro interno ao deletar exame_dengue' });
  }
}

module.exports = {
  listarExameAbo,
  obterExameAbo,
  criarExameAbo,
  atualizarExameAbo,
  deletarExameAbo,
  listarExameCovid19,
  obterExameCovid19,
  criarExameCovid19,
  atualizarExameCovid19,
  deletarExameCovid19,
  listarExameDengue,
  obterExameDengue,
  criarExameDengue,
  atualizarExameDengue,
  deletarExameDengue,
  listarTodosExames
};