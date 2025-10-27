const express = require('express');
const cors = require('cors');
const pool = require('../db/mysqlConnect');
const { cadastroUsuario, loginUsuario, recuperarSenha, alterarSenha } = require('../modules/acesso/controller/usuarioController');
const { listarAlunos, cadastrarAluno, excluirAluno, atualizarAluno } = require('../modules/alunos/controller/alunoController');
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

app.get('/alunos',     checkAuth, checkRole(['ADM']), listarAlunos);
app.post('/alunos',    checkAuth, checkRole(['ADM']), cadastrarAluno);
app.delete('/alunos/:id', checkAuth, checkRole(['ADM']), excluirAluno);
app.put('/alunos/:id',    checkAuth, checkRole(['ADM']), atualizarAluno);


/*
const { listarPacientes, cadastrarPaciente } = require('../modules/pacientes/controller/pacienteController');
const { listarAgendamentos } = require('../modules/agendamentos/controller/agendamentoController');
const { gerarRelatorio } = require('../modules/relatorios/controller/relatorioController');

// Pacientes
app.get('/pacientes',     checkAuth, checkRole(['DEFAULT', 'ADM']), listarPacientes);
app.post('/pacientes',    checkAuth, checkRole(['DEFAULT', 'ADM']), cadastrarPaciente);

// Agendamentos
app.get('/agendamentos', checkAuth, checkRole(['DEFAULT', 'ADM']), listarAgendamentos);

// Relatórios
app.get('/relatorios',    checkAuth, checkRole(['DEFAULT', 'ADM']), gerarRelatorio);
*/


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));