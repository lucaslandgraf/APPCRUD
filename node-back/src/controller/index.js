require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('../db/mysqlConnect');
const { cadastroUsuario, loginUsuario, recuperarSenha, alterarSenha } = require('../modules/acesso/controller/usuarioController');
const { listarAlunos, cadastrarAluno, excluirAluno, atualizarAluno } = require('../modules/alunos/controller/alunoController');
const { listarPacientes, criarPaciente, atualizarPaciente, obterPaciente, deletarPaciente } = require('../modules/paciente/controller/PacienteController')
const { listarAgendamentos, deletarAgendamento, criarAgendamento, atualizarAgendamento, obterAgendamento } = require('../modules/agendamento/controller/AgendamentoController');
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');

const app = express();

// Midlewares básicos
app.use(cors());
app.use(express.json()); 

app.get("/", async (req, res) => {
    res.json({status: "Ok"});
});

// --- ROTA /getpaciente
app.get("/getpaciente", checkAuth, checkRole(['DEFAULT', 'ADM']), async (req, res) => {
    try{
        const [rows] = await pool.execute('SELECT * FROM paciente;');
        res.status(200).json(rows);

    } catch (error){
        console.error("Erro ao realizar a consulta", error);
        res.status(500).json({ error: "Erro interno ao buscar pacientes." });
    }    
})

// --- ROTAS DE ACESSO ---

app.post('/cadastro', cadastroUsuario);
app.post('/login', loginUsuario);
app.post('/recuperar-senha', recuperarSenha);
app.post('/alterar-senha', alterarSenha);

app.get('/alunos', checkAuth, checkRole(['ADM']), listarAlunos);
app.post('/alunos', checkAuth, checkRole(['ADM']), cadastrarAluno);
app.delete('/alunos/:id', checkAuth, checkRole(['ADM']), excluirAluno);
app.put('/alunos/:id', checkAuth, checkRole(['ADM']), atualizarAluno);

app.get('/pacientes', checkAuth, checkRole(['DEFAULT', 'ADM']), listarPacientes);
app.get('/pacientes/:id', checkAuth, checkRole(['DEFAULT', 'ADM']), obterPaciente);
app.post('/pacientes', checkAuth, checkRole(['DEFAULT', 'ADM']), criarPaciente);
app.delete('/pacientes/:id', checkAuth, checkRole(['DEFAULT', 'ADM']), deletarPaciente);
app.put('/pacientes/:id', checkAuth, checkRole(['ADM']), atualizarPaciente)


// Agendamentos
app.post('/agendamentos', checkAuth, checkRole(['ADM']), criarAgendamento);
app.get('/agendamentos', checkAuth, checkRole(['DEFAULT', 'ADM']), listarAgendamentos);
app.delete('/agendamentos/:id', checkAuth, checkRole(['DEFAULT', 'ADM']), deletarAgendamento);
app.get('/agendamentos/:id', checkAuth, checkRole(['ADM']), obterAgendamento);
app.put('/agendamentos/:id', checkAuth, checkRole(['ADM']), atualizarAgendamento);


/*
// Relatórios
app.get('/relatorios',    checkAuth, checkRole(['DEFAULT', 'ADM']), gerarRelatorio);
*/


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));