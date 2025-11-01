const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // colocar a senha do seu banco MySQL aqui
  database: 'seu_banco_de_dados'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados!');
});

// CRUD para tabela agendamento

// Ler todos os agendamentos
app.get('/agendamentos', (req, res) => {
  const query = 'SELECT * FROM agendamento';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro interno no servidor' });
      return;
    }
    res.json(results);
  });
});

// Ler um agendamento pelo id
app.get('/agendamento/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM agendamento WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro interno no servidor' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Agendamento não encontrado' });
      return;
    }
    res.json(results[0]);
  });
});

// Criar um novo agendamento
app.post('/agendamento', (req, res) => {
  const { paciente_id, data_consulta, tipo_exame } = req.body;
  if (!paciente_id || !data_consulta || !tipo_exame) {
    res.status(400).json({ error: 'Dados incompletos para criar agendamento' });
    return;
  }
  const query = 'INSERT INTO agendamento (paciente_id, data_consulta, tipo_exame) VALUES (?, ?, ?)';
  db.query(query, [paciente_id, data_consulta, tipo_exame], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao criar agendamento' });
      return;
    }
    res.status(201).json({ message: 'Agendamento criado', id: result.insertId });
  });
});

// Atualizar um agendamento pelo id
app.put('/agendamento/:id', (req, res) => {
  const { id } = req.params;
  const { paciente_id, data_consulta, tipo_exame } = req.body;
  if (!paciente_id || !data_consulta || !tipo_exame) {
    res.status(400).json({ error: 'Dados incompletos para atualizar agendamento' });
    return;
  }
  const query = 'UPDATE agendamento SET paciente_id = ?, data_consulta = ?, tipo_exame = ? WHERE id = ?';
  db.query(query, [paciente_id, data_consulta, tipo_exame, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao atualizar agendamento' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Agendamento não encontrado' });
      return;
    }
    res.json({ message: 'Agendamento atualizado' });
  });
});

// Deletar um agendamento pelo id
app.delete('/agendamento/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM agendamento WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao deletar agendamento' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Agendamento não encontrado' });
      return;
    }
    res.json({ message: 'Agendamento deletado' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
