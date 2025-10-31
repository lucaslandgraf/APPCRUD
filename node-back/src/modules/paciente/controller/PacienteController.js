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

// CRUD para tabela paciente

// Ler todos os pacientes
app.get('/pacientes', (req, res) => {
  const query = 'SELECT * FROM paciente';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro interno no servidor' });
      return;
    }
    res.json(results);
  });
});

// Ler um paciente pelo id
app.get('/paciente/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM paciente WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Erro interno no servidor' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Paciente não encontrado' });
      return;
    }
    res.json(results[0]);
  });
});

// Criar um novo paciente
app.post('/paciente', (req, res) => {
  const { nome, data_nascimento, endereco, telefone, CPF, observacoes } = req.body;
  if (!nome || !data_nascimento || !endereco || !telefone || !CPF) {
    res.status(400).json({ error: 'Dados incompletos para criar paciente' });
    return;
  }
  const query = 'INSERT INTO paciente (nome, data_nascimento, endereco, telefone, CPF, observacoes) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [nome, data_nascimento, endereco, telefone, CPF, observacoes || null], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao criar paciente' });
      return;
    }
    res.status(201).json({ message: 'Paciente criado', id: result.insertId });
  });
});

// Atualizar um paciente pelo id
app.put('/paciente/:id', (req, res) => {
  const { id } = req.params;
  const { nome, data_nascimento, endereco, telefone, CPF, observacoes } = req.body;
  if (!nome || !data_nascimento || !endereco || !telefone || !CPF) {
    res.status(400).json({ error: 'Dados incompletos para atualizar paciente' });
    return;
  }
  const query = 'UPDATE paciente SET nome = ?, data_nascimento = ?, endereco = ?, telefone = ?, CPF = ?, observacoes = ? WHERE id = ?';
  db.query(query, [nome, data_nascimento, endereco, telefone, CPF, observacoes || null, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao atualizar paciente' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Paciente não encontrado' });
      return;
    }
    res.json({ message: 'Paciente atualizado' });
  });
});

// Deletar um paciente pelo id
app.delete('/paciente/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM paciente WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao deletar paciente' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Paciente não encontrado' });
      return;
    }
    res.json({ message: 'Paciente deletado' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
