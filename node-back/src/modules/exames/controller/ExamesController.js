const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // coloque a senha do seu banco MySQL aqui
  database: 'seu_banco_de_dados'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados!');
});

// CRUD exame_abo

app.get('/exame_abo', (req, res) => {
  const query = 'SELECT * FROM exame_abo';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });
    res.json(results);
  });
});

app.get('/exame_abo/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM exame_abo WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });
    if (results.length === 0) return res.status(404).json({ error: 'Exame não encontrado' });
    res.json(results[0]);
  });
});

app.post('/exame_abo', (req, res) => {
  const { agendamento_id, paciente_id, nome, amostra_dna, tipo_sanguineo, observacoes } = req.body;
  const query = 'INSERT INTO exame_abo (agendamento_id, paciente_id, nome, amostra_dna, tipo_sanguineo, observacoes) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [agendamento_id || null, paciente_id || null, nome || null, amostra_dna || null, tipo_sanguineo || null, observacoes || null], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao criar exame' });
    res.status(201).json({ message: 'Exame criado', id: result.insertId });
  });
});

app.put('/exame_abo/:id', (req, res) => {
  const { id } = req.params;
  const { agendamento_id, paciente_id, nome, amostra_dna, tipo_sanguineo, observacoes } = req.body;
  const query = 'UPDATE exame_abo SET agendamento_id = ?, paciente_id = ?, nome = ?, amostra_dna = ?, tipo_sanguineo = ?, observacoes = ? WHERE id = ?';
  db.query(query, [agendamento_id || null, paciente_id || null, nome || null, amostra_dna || null, tipo_sanguineo || null, observacoes || null, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar exame' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Exame não encontrado' });
    res.json({ message: 'Exame atualizado' });
  });
});

app.delete('/exame_abo/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM exame_abo WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao deletar exame' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Exame não encontrado' });
    res.json({ message: 'Exame deletado' });
  });
});

// CRUD exame_covid_19

app.get('/exame_covid_19', (req, res) => {
  db.query('SELECT * FROM exame_covid_19', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });
    res.json(results);
  });
});

app.get('/exame_covid_19/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM exame_covid_19 WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });
    if (results.length === 0) return res.status(404).json({ error: 'Exame não encontrado' });
    res.json(results[0]);
  });
});

app.post('/exame_covid_19', (req, res) => {
  const { agendamento_id, paciente_id, nome, tipo_teste, status_amostra, resultado, data_inicio_sintomas, sintomas, observacoes } = req.body;
  const query = `
    INSERT INTO exame_covid_19 
    (agendamento_id, paciente_id, nome, tipo_teste, status_amostra, resultado, data_inicio_sintomas, sintomas, observacoes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [agendamento_id || null, paciente_id || null, nome || null, tipo_teste || null, status_amostra || null, resultado || null, data_inicio_sintomas || null, sintomas || null, observacoes || null], 
  (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao criar exame' });
    res.status(201).json({ message: 'Exame criado', id: result.insertId });
  });
});

app.put('/exame_covid_19/:id', (req, res) => {
  const { id } = req.params;
  const { agendamento_id, paciente_id, nome, tipo_teste, status_amostra, resultado, data_inicio_sintomas, sintomas, observacoes } = req.body;
  const query = `
    UPDATE exame_covid_19 SET 
      agendamento_id = ?, paciente_id = ?, nome = ?, tipo_teste = ?, status_amostra = ?, resultado = ?, data_inicio_sintomas = ?, sintomas = ?, observacoes = ? 
    WHERE id = ?`;
  db.query(query, [agendamento_id || null, paciente_id || null, nome || null, tipo_teste || null, status_amostra || null, resultado || null, data_inicio_sintomas || null, sintomas || null, observacoes || null, id], 
  (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar exame' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Exame não encontrado' });
    res.json({ message: 'Exame atualizado' });
  });
});

app.delete('/exame_covid_19/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM exame_covid_19 WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao deletar exame' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Exame não encontrado' });
    res.json({ message: 'Exame deletado' });
  });
});

// CRUD exame_dengue

app.get('/exame_dengue', (req, res) => {
  db.query('SELECT * FROM exame_dengue', (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });
    res.json(results);
  });
});

app.get('/exame_dengue/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM exame_dengue WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro no servidor' });
    if (results.length === 0) return res.status(404).json({ error: 'Exame não encontrado' });
    res.json(results[0]);
  });
});

app.post('/exame_dengue', (req, res) => {
  const { agendamento_id, paciente_id, nome, amostra_sangue, data_inicio_sintomas } = req.body;
  const query = 'INSERT INTO exame_dengue (agendamento_id, paciente_id, nome, amostra_sangue, data_inicio_sintomas) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [agendamento_id || null, paciente_id || null, nome || null, amostra_sangue || null, data_inicio_sintomas || null], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao criar exame' });
    res.status(201).json({ message: 'Exame criado', id: result.insertId });
  });
});

app.put('/exame_dengue/:id', (req, res) => {
  const { id } = req.params;
  const { agendamento_id, paciente_id, nome, amostra_sangue, data_inicio_sintomas } = req.body;
  const query = 'UPDATE exame_dengue SET agendamento_id = ?, paciente_id = ?, nome = ?, amostra_sangue = ?, data_inicio_sintomas = ? WHERE id = ?';
  db.query(query, [agendamento_id || null, paciente_id || null, nome || null, amostra_sangue || null, data_inicio_sintomas || null, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar exame' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Exame não encontrado' });
    res.json({ message: 'Exame atualizado' });
  });
});

app.delete('/exame_dengue/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM exame_dengue WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erro ao deletar exame' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Exame não encontrado' });
    res.json({ message: 'Exame deletado' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
