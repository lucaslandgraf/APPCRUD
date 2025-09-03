<?php
session_start();

if (!isset($_SESSION["id"])) {
    header("Location: ../acesso/login.php");
    exit;
}

require_once(__DIR__ . "/controller/RelatorioController.php");

$mensagem = $_SESSION["mensagem"] ?? "";
unset($_SESSION["mensagem"]);

$editar = false;
$editar_id = $editar_nome = $editar_cpf = $editar_tipo_exame = $editar_data_exame = $editar_resultado = $editar_observacao = "";

if (isset($_GET["editar_id"])) {
    $editar = true;
    $id = (int)$_GET["editar_id"];
    $registro = RelatorioController::getEdicao($id);
    if ($registro) {
        $editar_id = $registro["id"];
        $editar_nome = $registro["nome_paciente"];
        $editar_cpf = $registro["cpf"];
        $editar_tipo_exame = $registro["tipo_exame"];
        $editar_data_exame = $registro["data_exame"];
        $editar_resultado = $registro["resultado"];
        $editar_observacao = $registro["observacao"];
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["adicionar_relatorio"])) {
        RelatorioController::adicionar($_POST);
    } elseif (isset($_POST["atualizar_relatorio"])) {
        RelatorioController::atualizar($_POST);
    } elseif (isset($_POST["excluir_relatorio"])) {
        RelatorioController::excluir($_POST["id"]);
    }

    header("Location: relatorio.php");
    exit;
}

$registros = RelatorioController::listarTodos();

// Função para formatar CPF
function formatarCPF($cpf) {
    // Remove qualquer coisa que não seja número (caso tenha pontos, traço, espaços)
    $cpf = preg_replace("/\\D/", "", $cpf);
    if (strlen($cpf) === 11) {
        return substr($cpf, 0, 3) . "." .
               substr($cpf, 3, 3) . "." .
               substr($cpf, 6, 3) . "-" .
               substr($cpf, 9, 2);
    }
    return $cpf; // Retorna o CPF "cru" caso não tenha 11 dígitos
}

// Função para formatar data
function formatarData($data) {
    if (empty($data)) return "-";
    // Tenta criar um objeto DateTime para lidar com diferentes formatos de entrada
    try {
        $dateObj = new DateTime($data);
        return $dateObj->format("d/m/Y");
    } catch (Exception $e) {
        // Fallback para strtotime se DateTime falhar
        return date("d/m/Y", strtotime($data));
    }
}


// Variáveis para dados da API Node.js
$paciente_api = null;
$agendamentos_api = [];
$relatorios_api = [];
$cpf_para_busca = "";
$mensagem_api = "";

// Variáveis para todos os pacientes
$todos_pacientes_api = [];
$mensagem_todos_pacientes = "";

// Buscar todos os pacientes com agendamentos automaticamente
$url_todos_pacientes = "http://localhost:3000/api/relatorios/todos-pacientes";
$response_todos = @file_get_contents($url_todos_pacientes);

if ($response_todos === FALSE) {
    $mensagem_todos_pacientes = "Erro ao conectar com a API Node.js para buscar todos os pacientes. Verifique se o servidor Node.js está rodando.";
} else {
    $dados_todos_pacientes = json_decode($response_todos, true);
    if ($dados_todos_pacientes && isset($dados_todos_pacientes["success"]) && $dados_todos_pacientes["success"]) {
        $todos_pacientes_api = $dados_todos_pacientes["data"];
    } else {
        $mensagem_todos_pacientes = $dados_todos_pacientes["message"] ?? "Erro ao buscar todos os pacientes na API Node.js.";
    }
}

// Verifica se houve uma submissão para buscar dados via API
if (isset($_GET["buscar_dados_api"]) && !empty($_GET["cpf_busca_api"])) {
    $cpf_para_busca = htmlspecialchars($_GET["cpf_busca_api"]);
    $cpf_limpo = preg_replace("/\\D/", "", $cpf_para_busca); // Limpa o CPF para a API

    // Buscar dados consolidados (paciente, agendamentos e relatórios) por CPF
    $url_api = "http://localhost:3000/api/relatorios/consolidado/" . $cpf_limpo;
    $response = @file_get_contents($url_api);

    if ($response === FALSE) {
        $mensagem_api = "Paciente não encontrado com o CPF informado.";
    } else {
        $dados_api = json_decode($response, true);
        if ($dados_api && isset($dados_api["success"]) && $dados_api["success"]) {
            $paciente_api = $dados_api["data"]["paciente"];
            $agendamentos_api = $dados_api["data"]["agendamentos"];
            $relatorios_api = $dados_api["data"]["relatorios"];
        } else {
            $mensagem_api = $dados_api["message"] ?? "Erro ao buscar dados na API Node.js.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Relatórios</title>

    <link href="../CSS/styleCP.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">

    <style>
        /* Mantendo os estilos customizados como base */
        .table-responsive {
            overflow-x: auto;
        }

        table {
            table-layout: fixed;
            width: 100%;
        }

        th,
        td {
            word-wrap: break-word;
            word-break: break-word;
            white-space: normal;
            vertical-align: middle;
        }

        td:nth-child(7) {
            max-width: 250px;
        }
        
        /* Estilos para resultados de exames */
        /* O nome 'resultado-pendente' está aqui, mas o 'Em andamento' é tratado por uma classe separada */
        .resultado-pendente { 
            color: #6c757d; /* Cor cinza, pode ser usada para "pendente" se precisar */
            font-style: italic;
        }
        
        .resultado-positivo {
            color: #dc3545 !important; /* Vermelho - !important para garantir precedência */
            font-weight: bold;
        }
        
        .resultado-negativo {
            color: #198754 !important; /* Verde - !important para garantir precedência */
            font-weight: bold;
        }

        .resultado-em-andamento { /* NOVA CLASSE PARA 'EM ANDAMENTO' */
            color: #ffc107 !important; /* Amarelo Bootstrap 'warning' - !important para garantir precedência */
            font-weight: bold;
        }
        
        /* Estilos para a tabela recolhível (collapse) */
        .collapse-table-container {
            margin-top: 20px;
        }
        .collapse-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            /* Usar bg-primary e text-white no HTML, mas deixar fallback aqui */
            /* background-color: #f8f9fa; */
            border: 1px solid #dee2e6;
            padding: 10px 15px;
            cursor: pointer;
            border-radius: .25rem;
            transition: background-color 0.3s ease;
        }
        /* Cor de hover mais escura para o bg-primary */
        .collapse-header:hover {
            background-color: #0056b3; /* Um tom mais escuro de primary */
        }
        .collapse-header h5 {
            margin-bottom: 0;
        }
        .collapse-header .btn {
            font-size: 1.2rem;
            line-height: 1;
            padding: 0;
            border: none;
            background: none;
            /* Usar text-white no HTML, mas deixar fallback aqui */
            /* color: #333; */
        }

        /* NOVO ESTILO: Para controlar a altura e rolagem da tabela dentro do Collapse */
        .collapse-table-scrollable-content {
            max-height: 500px; /* Define uma altura máxima para a tabela */
            overflow-y: auto;   /* Adiciona uma barra de rolagem vertical se o conteúdo exceder a altura */
            /* Transição para suavizar a expansão e o recolhimento da altura */
            transition: max-height 0.3s ease-out; 
            overflow-x: auto; /* Mantém a rolagem horizontal caso as colunas sejam muito largas */
        }
    </style>
</head>

<body>
    <?php include("../../modelo/nav.php"); ?>

    <div class="container-fluid mt-5">
        <h1 class="text-center">Bem-vindo à tela dos relatórios</h1>

        <div class="container mt-3 mb-5">
            <?php if ($mensagem) : ?>
                <div class="alert alert-info"><?= htmlspecialchars($mensagem) ?></div>
            <?php endif; ?>

            <?php if (!$editar) : ?>
                <div class="d-flex justify-content-center mt-4">
                    <form method="POST" action="relatorio.php" style="max-width: 700px; width: 100%;">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <input type="text" name="nome" class="form-control" placeholder="Nome do Paciente" required />
                            </div>
                            <div class="col-md-6">
                                <input type="text" name="cpf" id="cpfInputAdicionar" class="form-control" placeholder="CPF do Paciente" required />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <select name="tipo_exame" class="form-select" required>
                                    <option value="" disabled selected>Selecione o tipo de exame</option>
                                    <option value="Dengue">Dengue</option>
                                    <option value="ABO Tipo Sanguíneo">ABO Tipo Sanguíneo</option>
                                    <option value="COVID-19">COVID-19</option>
                                    <option value="Outro">Outro</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <input type="date" name="data_exame" class="form-control" required />
                            </div>
                            <div class="col-md-4">
                                <select name="resultado" class="form-select" required>
                                    <option value="" disabled selected>Resultado</option>
                                    <option value="Positivado">Positivado</option>
                                    <option value="Negativado">Negativado</option>
                                    <option value="Em andamento">Em andamento</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <textarea name="observacao" class="form-control" placeholder="Observação (opcional)" rows="3"></textarea>
                        </div>
                        <div class="d-flex justify-content-center">
                            <button type="submit" name="adicionar_relatorio" class="btn btn-primary px-5">Adicionar</button>
                        </div>
                    </form>
                </div>
            <?php endif; ?>

            <?php if ($editar) : ?>
                <h2 class="text-center mb-4">Editar Relatório</h2>
                <div class="d-flex justify-content-center">
                    <form method="POST" action="relatorio.php" style="max-width: 700px; width: 100%;">
                        <input type="hidden" name="id" value="<?= htmlspecialchars($editar_id) ?>" />
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <input type="text" name="nome" class="form-control" placeholder="Nome do Paciente" required value="<?= htmlspecialchars($editar_nome) ?>" />
                            </div>
                            <div class="col-md-6">
                                <input type="text" name="cpf" id="cpfInputEditar" class="form-control" placeholder="CPF do Paciente" required value="<?= htmlspecialchars($editar_cpf) ?>" />
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <select name="tipo_exame" class="form-select" required>
                                    <option value="" disabled>Selecione o tipo de exame</option>
                                    <option value="Dengue" <?= $editar_tipo_exame == 'Dengue' ? 'selected' : '' ?>>Dengue</option>
                                    <option value="ABO Tipo Sanguíneo" <?= $editar_tipo_exame == 'ABO Tipo Sanguíneo' ? 'selected' : '' ?>>ABO Tipo Sanguíneo</option>
                                    <option value="COVID-19" <?= $editar_tipo_exame == 'COVID-19' ? 'selected' : '' ?>>COVID-19</option>
                                    <option value="Outro" <?= $editar_tipo_exame == 'Outro' ? 'selected' : '' ?>>Outro</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <input type="date" name="data_exame" class="form-control" required value="<?= htmlspecialchars($editar_data_exame) ?>" />
                            </div>
                            <div class="col-md-4">
                                <select name="resultado" class="form-select" required>
                                    <option value="" disabled>Resultado</option>
                                    <option value="Positivado" <?= $editar_resultado == 'Positivado' ? 'selected' : '' ?>>Positivado</option>
                                    <option value="Negativado" <?= $editar_resultado == 'Negativado' ? 'selected' : '' ?>>Negativado</option>
                                    <option value="Em andamento" <?= $editar_resultado == 'Em andamento' ? 'selected' : '' ?>>Em andamento</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <textarea name="observacao" class="form-control" placeholder="Observação (opcional)" rows="3"><?= htmlspecialchars($editar_observacao) ?></textarea>
                        </div>
                        <div class="d-flex justify-content-center gap-2">
                            <button type="submit" name="atualizar_relatorio" class="btn btn-success px-5">Salvar</button>
                            <a href="relatorio.php" class="btn btn-secondary px-5">Cancelar</a>
                        </div>
                    </form>
                </div>
            <?php endif; ?>

            <div class="card mt-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title mb-0">Buscar Relatórios por CPF</h5>
                </div>
                <div class="card-body">
                    <form method="GET" action="relatorio.php">
                        <div class="input-group mb-3">
                            <input type="text" name="cpf_busca_api" class="form-control" placeholder="Digite o CPF do paciente" value="<?= htmlspecialchars($cpf_para_busca) ?>" required>
                            <button class="btn btn-primary" type="submit" name="buscar_dados_api">Buscar Dados</button>
                        </div>
                    </form>
                    <?php if ($mensagem_api) : ?>
                        <div class="alert alert-warning mt-2"><?= htmlspecialchars($mensagem_api) ?></div>
                    <?php endif; ?>
                </div>
            </div>

            <?php if ($paciente_api) : ?>
                <div class="table-responsive mt-4">
                    <h3 class="text-center">Dados do Paciente e Agendamentos</h3>
                    <button id="gerarPdfCpfConsolidado" class="btn btn-info mb-3">
                        <i class="bi bi-file-earmark-pdf"></i> Gerar PDF do Paciente (Consolidado)
                    </button>
                    <div id="pdf-content-consolidado">
                        <table class="table table-bordered text-center align-middle mt-4">
                            <thead class="table-primary">
                                <tr>
                                    <th>ID Paciente</th>
                                    <th>Nome Paciente</th>
                                    <th>CPF Paciente</th>
                                    <th>Data Nasc.</th>
                                    <th>Telefone</th>
                                    <th>Endereço</th>
                                    <th>Observações Paciente</th>
                                    <th>ID Agendamento</th>
                                    <th>Data Consulta</th>
                                    <th>Tipo Exame Agendamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!empty($agendamentos_api)) : ?>
                                    <?php foreach ($agendamentos_api as $agendamento) : ?>
                                        <tr>
                                            <td><?= htmlspecialchars($paciente_api["id"]) ?></td>
                                            <td><?= htmlspecialchars($paciente_api["nome"]) ?></td>
                                            <td><?= htmlspecialchars(formatarCPF($paciente_api["CPF"])) ?></td>
                                            <td><?= htmlspecialchars(formatarData($paciente_api["data_nascimento"])) ?></td>
                                            <td><?= htmlspecialchars($paciente_api["telefone"] ?? "-") ?></td>
                                            <td><?= htmlspecialchars($paciente_api["endereco"] ?? "-") ?></td>
                                            <td><?= nl2br(htmlspecialchars($paciente_api["observacoes"] ?? "-")) ?></td>
                                            <td><?= htmlspecialchars($agendamento["id"]) ?></td>
                                            <td><?= htmlspecialchars(formatarData($agendamento["data_consulta"])) ?></td>
                                            <td><?= htmlspecialchars($agendamento["tipo_exame"]) ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else : ?>
                                    <tr>
                                        <td><?= htmlspecialchars($paciente_api["id"]) ?></td>
                                        <td><?= htmlspecialchars($paciente_api["nome"]) ?></td>
                                        <td><?= htmlspecialchars(formatarCPF($paciente_api["CPF"])) ?></td>
                                        <td><?= htmlspecialchars(formatarData($paciente_api["data_nascimento"])) ?></td>
                                        <td><?= htmlspecialchars($paciente_api["telefone"] ?? "-") ?></td>
                                        <td><?= htmlspecialchars($paciente_api["endereco"] ?? "-") ?></td>
                                        <td><?= nl2br(htmlspecialchars($paciente_api["observacoes"] ?? "-")) ?></td>
                                        <td colspan="3">Nenhum agendamento encontrado para este paciente.</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            <?php endif; ?>

            ---

            <?php if ($paciente_api && !empty($relatorios_api)) : ?>
                <div class="table-responsive mt-4">
                    <h3 class="text-center">Relatórios do Paciente</h3>
                    <button id="gerarPdfCpfRelatorios" class="btn btn-info mb-3">
                        <i class="bi bi-file-earmark-pdf"></i> Gerar PDF dos Relatórios (CPF)
                    </button>
                    <div id="pdf-content-relatorios">
                        <table class="table table-bordered text-center align-middle mt-4">
                            <thead class="table-primary">
                                <tr>
                                    <th>ID</th>
                                    <th>Nome do Paciente</th>
                                    <th>CPF</th>
                                    <th>Tipo de Exame</th>
                                    <th>Data do Exame</th>
                                    <th>Resultado</th>
                                    <th>Observação</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($relatorios_api as $relatorio) : ?>
                                    <tr>
                                        <td><?= htmlspecialchars($relatorio["id"]) ?></td>
                                        <td><?= htmlspecialchars($relatorio["nome_paciente"]) ?></td> 
                                        <td><?= htmlspecialchars(formatarCPF($relatorio["cpf"])) ?></td>
                                        <td><?= htmlspecialchars($relatorio["tipo_exame"]) ?></td>
                                        <td><?= htmlspecialchars(formatarData($relatorio["data_exame"])) ?></td>
                                        <td class="<?=
                                            $relatorio['resultado'] == 'Positivado' ? 'resultado-positivo' : (
                                            $relatorio['resultado'] == 'Negativado' ? 'resultado-negativo' : (
                                            $relatorio['resultado'] == 'Em andamento' ? 'resultado-em-andamento' : ''
                                            )
                                        ) ?>">
                                            <?= htmlspecialchars($relatorio["resultado"]) ?>
                                        </td>
                                        <td><?= nl2br(htmlspecialchars($relatorio["observacao"] ?? "-")) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            <?php elseif ($paciente_api && empty($relatorios_api)) : ?>
                <div class="alert alert-info mt-4">
                    Nenhum relatório encontrado para este paciente.
                </div>
            <?php endif; ?>

            ---

            <div class="collapse-table-container">
                <div class="card mt-4">
                    <div class="card-header bg-primary text-white collapse-header" id="headingAllPatients" data-bs-toggle="collapse" data-bs-target="#collapseAllPatients" aria-expanded="false" aria-controls="collapseAllPatients">
                        <h5 class="card-title mb-0">Todos os Pacientes Cadastrados (Clique para Expandir/Minimizar)</h5>
                        <button class="btn btn-link text-white" type="button" aria-expanded="false" aria-controls="collapseAllPatients">
                            <i class="bi bi-chevron-down" id="collapseAllPatientsIcon"></i>
                        </button>
                    </div>
                    <div id="collapseAllPatients" class="collapse"> <div class="card-body">
                            <?php if ($mensagem_todos_pacientes) : ?>
                                <div class="alert alert-warning"><?= htmlspecialchars($mensagem_todos_pacientes) ?></div>
                            <?php elseif (!empty($todos_pacientes_api)) : ?>
                                <div class="d-flex justify-content-start flex-wrap gap-2 mb-3">
                                    <button id="gerarPdfTodosPacientes" class="btn btn-info">
                                        <i class="bi bi-file-earmark-pdf"></i> Gerar PDF de Todos os Pacientes
                                    </button>
                                    <a href="http://localhost/PHPCRUD/public/pacientes/gestaoPaciente.php" class="btn btn-warning">
                                        <i class="bi bi-pencil-square"></i> Editar Pacientes
                                    </a>
                                    <a href="http://localhost/PHPCRUD/public/agendamento/agendamentos.php" class="btn btn-info">
                                        <i class="bi bi-calendar-event"></i> Editar Agendamentos
                                    </a>
                                </div>
                                <div class="table-responsive collapse-table-scrollable-content" id="pdf-content-todos-pacientes">
                                    <table class="table table-bordered text-center align-middle">
                                        <thead class="table-primary">
                                            <tr>
                                                <th>ID Paciente</th>
                                                <th>Nome Paciente</th>
                                                <th>CPF Paciente</th>
                                                <th>Data Nasc.</th>
                                                <th>Telefone</th>
                                                <th>Endereço</th>
                                                <th>Observações Paciente</th>
                                                <th>ID Agendamento</th>
                                                <th>Data Consulta</th>
                                                <th>Tipo Exame Agendamento</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($todos_pacientes_api as $paciente) : ?>
                                                <tr>
                                                    <td><?= htmlspecialchars($paciente["paciente_id"]) ?></td>
                                                    <td><?= htmlspecialchars($paciente["paciente_nome"]) ?></td>
                                                    <td><?= htmlspecialchars(formatarCPF($paciente["paciente_cpf"])) ?></td>
                                                    <td><?= htmlspecialchars(formatarData($paciente["paciente_data_nascimento"])) ?></td>
                                                    <td><?= htmlspecialchars($paciente["paciente_telefone"] ?? "-") ?></td>
                                                    <td><?= htmlspecialchars($paciente["paciente_endereco"] ?? "-") ?></td>
                                                    <td><?= nl2br(htmlspecialchars($paciente["paciente_observacoes"] ?? "-")) ?></td>
                                                    <td><?= htmlspecialchars($paciente["agendamento_id"] ?? "-") ?></td>
                                                    <td><?= htmlspecialchars(formatarData($paciente["agendamento_data_consulta"]) ? formatarData($paciente["agendamento_data_consulta"]) : "-") ?></td>
                                                    <td><?= htmlspecialchars($paciente["agendamento_tipo_exame"] ?? "-") ?></td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else : ?>
                                <div class="alert alert-info">Nenhum paciente encontrado no sistema.</div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>

            ---
            
            <div class="collapse-table-container">
                <div class="card mt-4">
                    <div class="card-header bg-primary text-white collapse-header" id="headingPhpReports" data-bs-toggle="collapse" data-bs-target="#collapsePhpReports" aria-expanded="false" aria-controls="collapsePhpReports">
                        <h5 class="card-title mb-0">Relatórios Cadastrados (Sistema PHP) (Clique para Expandir/Minimizar)</h5>
                        <button class="btn btn-link text-white" type="button" aria-expanded="false" aria-controls="collapsePhpReports">
                            <i class="bi bi-chevron-down" id="collapsePhpReportsIcon"></i>
                        </button>
                    </div>
                    <div id="collapsePhpReports" class="collapse"> <div class="card-body">
                            <button id="gerarPdfPhpReports" class="btn btn-info mb-3">
                                <i class="bi bi-file-earmark-pdf"></i> Gerar PDF dos Relatórios Cadastrados (PHP)
                            </button>
                            <div class="table-responsive collapse-table-scrollable-content" id="pdf-content-php-reports">
                                <table class="table table-bordered table-hover text-center align-middle">
                                    <thead class="table-primary">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nome do Paciente</th>
                                            <th>CPF</th>
                                            <th>Tipo de Exame</th>
                                            <th>Data do Exame</th>
                                            <th>Resultado</th>
                                            <th>Observação</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php if (count($registros) > 0) : ?>
                                            <?php foreach ($registros as $registro) : ?>
                                                <tr>
                                                    <td><?= htmlspecialchars($registro["id"]) ?></td>
                                                    <td><?= htmlspecialchars($registro["nome_paciente"]) ?></td>
                                                    <td><?= htmlspecialchars(formatarCPF($registro["cpf"])) ?></td>
                                                    <td><?= htmlspecialchars($registro["tipo_exame"]) ?></td>
                                                    <td><?= htmlspecialchars(formatarData($registro["data_exame"])) ?></td>
                                                    <td class="<?=
                                                        $registro['resultado'] == 'Positivado' ? 'resultado-positivo' : (
                                                        $registro['resultado'] == 'Negativado' ? 'resultado-negativo' : (
                                                        $registro['resultado'] == 'Em andamento' ? 'resultado-em-andamento' : ''
                                                        )
                                                    ) ?>">
                                                        <?= htmlspecialchars($registro["resultado"]) ?>
                                                    </td>
                                                    <td><?= nl2br(htmlspecialchars($registro["observacao"])) ?></td>
                                                    <td>
                                                        <a href="relatorio.php?editar_id=<?= $registro['id'] ?>" class="btn btn-warning btn-sm">Editar</a>
                                                        <form method="POST" action="relatorio.php" style="display: inline;">
                                                            <input type="hidden" name="id" value="<?= $registro['id'] ?>" />
                                                            <button type="submit" name="excluir_relatorio" class="btn btn-danger btn-sm" onclick="return confirm('Tem certeza que deseja excluir este relatório?')">Excluir</button>
                                                        </form>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        <?php else : ?>
                                            <tr>
                                                <td colspan="8">Nenhum relatório encontrado.</td>
                                            </tr>
                                        <?php endif; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    </div>
    <script>
        $(document).ready(function() {
            // Aplica a máscara para o campo CPF de adição
            $('#cpfInputAdicionar').mask('000.000.000-00', {reverse: true});
            // Aplica a máscara para o campo CPF de edição (se existir)
            $('#cpfInputEditar').mask('000.000.000-00', {reverse: true});

            // Intercepta o envio de TODOS os formulários na página
            // E garante que o CPF seja limpo antes do envio
            $('form').on('submit', function(event) {
                // Para o campo de adição (se for o formulário ativo)
                var cpfInputAdicionar = $('#cpfInputAdicionar');
                if (cpfInputAdicionar.length && cpfInputAdicionar.val()) {
                    var cpfValue = cpfInputAdicionar.val();
                    cpfInputAdicionar.val(cpfValue.replace(/\D/g, ''));
                }

                // Para o campo de edição (se for o formulário ativo)
                var cpfInputEditar = $('#cpfInputEditar');
                if (cpfInputEditar.length && cpfInputEditar.val()) {
                    var cpfValue = cpfInputEditar.val();
                    cpfInputEditar.val(cpfValue.replace(/\D/g, ''));
                }
                // Não precisa de event.preventDefault() aqui porque o form deve ser enviado.
                // O valor do input é alterado JIT (Just In Time) antes do submit real.
            });


            // Lógica do collapse para os ícones
            // Todos os Pacientes Cadastrados
            var collapseAllPatientsElement = $('#collapseAllPatients');
            var collapseAllPatientsIcon = $('#collapseAllPatientsIcon'); 

            collapseAllPatientsElement.on('show.bs.collapse', function () {
                collapseAllPatientsIcon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
            });

            collapseAllPatientsElement.on('hide.bs.collapse', function () {
                collapseAllPatientsIcon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
            });

            // Relatórios Cadastrados (Sistema PHP)
            var collapsePhpReportsElement = $('#collapsePhpReports');
            var collapsePhpReportsIcon = $('#collapsePhpReportsIcon'); 

            collapsePhpReportsElement.on('show.bs.collapse', function () {
                collapsePhpReportsIcon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
            });

            collapsePhpReportsElement.on('hide.bs.collapse', function () {
                collapsePhpReportsIcon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
            });


            // --- Lógica para Gerar PDF ---
            // Certifique-se de que window.jspdf.jsPDF esteja disponível (umd.min.js)

            // Função genérica para gerar PDF de um elemento HTML
            function generatePdf(elementId, filename, titleText) {
                const element = document.getElementById(elementId);
                if (!element) {
                    alert('Erro: Elemento para PDF não encontrado (ID: ' + elementId + ').');
                    console.error('Elemento não encontrado para gerar PDF:', elementId);
                    return;
                }

                // Cria um container temporário para a impressão para isolar estilos e layout
                const printContainer = document.createElement('div');
                printContainer.style.width = '210mm'; // Largura A4
                printContainer.style.padding = '10mm'; // Margens
                printContainer.style.backgroundColor = '#fff'; // Fundo branco
                printContainer.style.boxSizing = 'border-box'; // Incluir padding na largura total
                printContainer.style.position = 'absolute'; // Para não afetar o layout da página
                printContainer.style.left = '-9999px'; // Move para fora da tela
                printContainer.style.top = '-9999px'; // Move para fora da tela


                // Adiciona um título ao PDF
                if (titleText) {
                    const titleElement = document.createElement('h2');
                    titleElement.textContent = titleText;
                    titleElement.style.textAlign = 'center';
                    titleElement.style.marginBottom = '20px';
                    titleElement.style.fontFamily = 'Arial, sans-serif'; // Fonte para o título
                    printContainer.appendChild(titleElement);
                }

                // Clona o conteúdo do elemento para o container de impressão
                const clonedElement = element.cloneNode(true);

                // --- Ajustes no conteúdo clonado para melhorar o PDF ---
                // Remove botões e formulários dentro do conteúdo que não devem ir para o PDF
                clonedElement.querySelectorAll('.btn').forEach(btn => btn.remove());
                clonedElement.querySelectorAll('form').forEach(form => form.remove()); // Remove todos os forms
                // Se sua tabela tem rolagem (.collapse-table-scrollable-content),
                // remove a altura máxima e rolagem para capturar todo o conteúdo
                clonedElement.style.maxHeight = 'none';
                clonedElement.style.overflowY = 'visible';
                clonedElement.style.overflowX = 'visible';
                // Remove a largura fixa das colunas para evitar cortes ou formatação estranha no PDF
                clonedElement.querySelectorAll('th, td').forEach(cell => {
                    cell.style.width = 'auto';
                    cell.style.maxWidth = 'none';
                    cell.style.wordWrap = 'break-word';
                    cell.style.whiteSpace = 'normal';
                });
                // --------------------------------------------------------

                printContainer.appendChild(clonedElement);

                // Adiciona o container ao corpo temporariamente para html2canvas renderizar
                document.body.appendChild(printContainer);

                // Usa html2canvas para renderizar o elemento em um canvas
                html2canvas(printContainer, {
                    scale: 2, // Aumenta a resolução para melhor qualidade no PDF
                    useCORS: true, // Importante se houver imagens de outras origens (mesmo que não use agora, é boa prática)
                    logging: true // Ativa logs no console para depuração
                }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4'); // 'p' = portrait, 'mm' = milimeters, 'a4' = size

                    const imgWidth = 210; // Largura A4 em mm
                    const pageHeight = 297; // Altura A4 em mm
                    const imgHeight = canvas.height * imgWidth / canvas.width; // Calcula a altura da imagem proporcionalmente
                    let heightLeft = imgHeight; // Altura restante para adicionar ao PDF

                    let position = 0; // Posição Y na página do PDF

                    // Adiciona a primeira imagem/página
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    // Loop para adicionar páginas se o conteúdo for maior que uma página A4
                    while (heightLeft > 0) {
                        position = heightLeft - imgHeight; // Calcula a posição Y para a próxima página (negativo para rolar a imagem)
                        pdf.addPage(); // Adiciona uma nova página
                        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight); // Adiciona a imagem à nova página
                        heightLeft -= pageHeight; // Reduz a altura restante
                    }

                    pdf.save(filename); // Salva o arquivo PDF
                }).catch(error => {
                    console.error('Erro ao gerar PDF:', error);
                    alert('Erro ao gerar PDF. Verifique o console para mais detalhes.');
                }).finally(() => {
                    // Limpa o container de impressão após gerar o PDF
                    if (printContainer.parentNode) {
                        document.body.removeChild(printContainer);
                    }
                });
            }

            // Evento para o botão "Gerar PDF do Paciente (Consolidado)"
            // Captura os dados do paciente para o nome do arquivo/título
            document.getElementById('gerarPdfCpfConsolidado')?.addEventListener('click', function() {
                const patientName = document.querySelector('#pdf-content-consolidado table tbody tr td:nth-child(2)')?.textContent || 'Paciente';
                const patientCpf = document.querySelector('#pdf-content-consolidado table tbody tr td:nth-child(3)')?.textContent || '';
                const cleanCpf = patientCpf.replace(/\D/g, ''); // Remove formatação do CPF para o nome do arquivo

                generatePdf('pdf-content-consolidado', `relatorio_${patientName.replace(/\s/g, '_')}_${cleanCpf}_consolidado.pdf`, `Relatório Consolidado do Paciente: ${patientName} (${patientCpf})`);
            });

            // Evento para o botão "Gerar PDF dos Relatórios (CPF)"
            document.getElementById('gerarPdfCpfRelatorios')?.addEventListener('click', function() {
                const patientName = document.querySelector('#pdf-content-relatorios table tbody tr td:nth-child(2)')?.textContent || 'Paciente';
                const patientCpf = document.querySelector('#pdf-content-relatorios table tbody tr td:nth-child(3)')?.textContent || '';
                const cleanCpf = patientCpf.replace(/\D/g, '');

                generatePdf('pdf-content-relatorios', `relatorio_${patientName.replace(/\s/g, '_')}_${cleanCpf}_exames.pdf`, `Relatórios de Exames do Paciente: ${patientName} (${patientCpf})`);
            });

            // Evento para o botão "Gerar PDF de Todos os Pacientes"
            document.getElementById('gerarPdfTodosPacientes')?.addEventListener('click', function() {
                generatePdf('pdf-content-todos-pacientes', 'relatorio_todos_pacientes_agendamentos.pdf', 'Relatório de Todos os Pacientes e Agendamentos');
            });

            // NOVO EVENTO para o botão "Gerar PDF dos Relatórios Cadastrados (Sistema PHP)"
            document.getElementById('gerarPdfPhpReports')?.addEventListener('click', function() {
                generatePdf('pdf-content-php-reports', 'relatorio_todos_exames_php.pdf', 'Relatórios Cadastrados (Sistema PHP)');
            });
        });
    </script>
</body>

<?php include('../../modelo/footer.php'); ?>

</html>