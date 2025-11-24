require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('../db/mysqlConnect');
const { cadastroUsuario, loginUsuario, recuperarSenha, alterarSenha } = require('../modules/acesso/controller/usuarioController');
const { listarAlunos, cadastrarAluno, excluirAluno, atualizarAluno } = require('../modules/alunos/controller/alunoController');
const { listarPacientes, criarPaciente, atualizarPaciente, obterPaciente, deletarPaciente } = require('../modules/paciente/controller/PacienteController')
const { listarAgendamentos, deletarAgendamento, criarAgendamento, atualizarAgendamento, obterAgendamento } = require('../modules/agendamento/controller/AgendamentoController');
const { listarTodosExames, criarExameCovid19, criarExameDengue, criarExameAbo, listarExameCovid19, listarExameAbo, listarExameDengue, atualizarExameAbo, atualizarExameCovid19, atualizarExameDengue, obterExameAbo, obterExameCovid19, obterExameDengue, deletarExameAbo, deletarExameDengue, deletarExameCovid19 } = require('../modules/exames/controller/ExamesController');
const { gerarRelatorioGeral, gerarGraficoRegressao } = require('../modules/relatorio/controller/relatorioController');
const { getDashboardStats } = require('../modules/dashboard/controller/dashboardController'); 
const { checkAuth, checkRole } = require('../middlewares/authMiddleware');


const app = express();

// Midlewares básicos
app.use(cors());
app.use(express.json()); 

app.get("/", async (req, res) => {
    res.json({status: "Ok"});
});

app.get('/dashboard-stats', checkAuth, checkRole(['DEFAULT', 'ADM']), getDashboardStats); 

// --- ROTAS DE ACESSO ---

app.post('/cadastro', cadastroUsuario);
app.post('/login', loginUsuario);
app.post('/recuperar-senha', recuperarSenha);
app.post('/alterar-senha', alterarSenha);

app.get('/alunos', checkAuth, checkRole(['ADM']), listarAlunos);
app.post('/alunos', checkAuth, checkRole(['ADM']), cadastrarAluno);
app.delete('/alunos/:id', checkAuth, checkRole(['ADM']), excluirAluno);
app.put('/alunos/:id', checkAuth, checkRole(['ADM']), atualizarAluno);

// ROTAS DOS PACIENTES

app.get('/pacientes', checkAuth, checkRole(['DEFAULT', 'ADM']), listarPacientes);
app.get('/pacientes/:id', checkAuth, checkRole(['DEFAULT', 'ADM']), obterPaciente);
app.post('/pacientes', checkAuth, checkRole(['DEFAULT', 'ADM']), criarPaciente);
app.delete('/pacientes/:id', checkAuth, checkRole(['DEFAULT', 'ADM']), deletarPaciente);
app.put('/pacientes/:id', checkAuth, checkRole(['DEFAULT', 'ADM']), atualizarPaciente)

// ROTAS DOS AGENDAMENTOS

app.post('/agendamentos', checkAuth, checkRole(['DEFAULT', 'ADM']), criarAgendamento);
app.get('/agendamentos', checkAuth, checkRole(['DEFAULT', 'ADM']), listarAgendamentos);
app.delete('/agendamentos/:id', checkAuth, checkRole(['DEFAULT', 'ADM']), deletarAgendamento);
app.get('/agendamentos/:id', checkAuth, checkRole(['DEFAULT', 'ADM']), obterAgendamento);
app.put('/agendamentos/:id', checkAuth, checkRole(['DEFAULT', 'ADM']), atualizarAgendamento);

// ROTAS DOS EXAMES

app.get('/exames', checkAuth, checkRole(['DEFAULT', 'ADM']), listarTodosExames);
app.post('/exames/covid', criarExameCovid19);
app.post('/exames/dengue', criarExameDengue);
app.post('/exames/abo', criarExameAbo);
app.get('/exames/covid', listarExameCovid19);
app.get('/exames/dengue', listarExameDengue);
app.get('/exames/abo', listarExameAbo);
app.get('/exames/covid/:id', obterExameCovid19);
app.get('/exames/dengue/:id', obterExameDengue);
app.get('/exames/abo/:id', obterExameAbo);
app.put('/exames/dengue/:id', atualizarExameDengue);
app.put('/exames/covid/:id', atualizarExameCovid19);
app.put('/exames/abo/:id', atualizarExameAbo);
app.delete('/exames/abo/:id', deletarExameAbo);
app.delete('/exames/dengue/:id', deletarExameDengue);
app.delete('/exames/covid/:id', deletarExameCovid19);

// ROTA DE RELATÓRIOS
app.get('/relatorios', checkAuth, checkRole(['DEFAULT', 'ADM']), gerarRelatorioGeral);

// ROTA DE RELATÓRIO DATASCIENCE
app.get('/grafico-regressao', checkAuth, checkRole(['DEFAULT', 'ADM']), gerarGraficoRegressao);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));