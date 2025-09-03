<?php session_start(); 

    if (!isset($_SESSION["id"])) {
        header("Location: ../acesso/login.php");
        exit;
    }
?>

<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">
    <link rel="stylesheet" href="../CSS/styleCP.css">
    <title>Gestão de Exames</title>
</head>

<body>

    <?php
        include('../../modelo/nav.php');
        require_once 'controller/ExamesController.php';

        // Handle exam deletion
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['acao']) && $_POST['acao'] === 'excluir') {
            $controller = new ExamesController();
            $controller->processarRequisicao();
        }

        // Get filter parameter
        $filtroTipo = $_GET['tipo'] ?? '';
        
        // Initialize controller
        $controller = new ExamesController();
        
        try {
            $exames = $controller->listarTodosExames($filtroTipo);
            $contadores = $controller->contarExamesPorTipo();
        } catch (Exception $e) {
            $erro = $e->getMessage();
            $exames = [];
            $contadores = ['dengue' => 0, 'abo' => 0, 'covid' => 0, 'total' => 0];
        }
    ?>

    <div class="container mt-4">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h3 class="mb-0">
                                <i class="bi bi-clipboard-data"></i> Gestão de Exames
                            </h3>
                            <div class="d-flex gap-2">
                                <a href="cadastro.php" class="btn btn-success">
                                    <i class="bi bi-plus-circle"></i> Novo Exame
                                </a>
                                <a href="../agendamento/agendamentos.php" class="btn btn-secondary">
                                    <i class="bi bi-calendar-check"></i> Agendamentos
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        
                        <!-- Statistics Cards -->
                        <div class="row mb-4">
                            <div class="col-md-3">
                                <div class="card bg-primary text-white">
                                    <div class="card-body text-center">
                                        <i class="bi bi-clipboard-pulse fs-1"></i>
                                        <h4><?= $contadores['total'] ?></h4>
                                        <p class="mb-0">Total de Exames</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-danger text-white">
                                    <div class="card-body text-center">
                                        <i class="bi bi-bug fs-1"></i>
                                        <h4><?= $contadores['dengue'] ?></h4>
                                        <p class="mb-0">Exames Dengue</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-info text-white">
                                    <div class="card-body text-center">
                                        <i class="bi bi-droplet fs-1"></i>
                                        <h4><?= $contadores['abo'] ?></h4>
                                        <p class="mb-0">Exames ABO</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-warning text-white">
                                    <div class="card-body text-center">
                                        <i class="bi bi-virus fs-1"></i>
                                        <h4><?= $contadores['covid'] ?></h4>
                                        <p class="mb-0">Exames COVID-19</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Filter Section -->
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="btn-group" role="group">
                                    <a href="exames.php" class="btn <?= empty($filtroTipo) ? 'btn-primary' : 'btn-outline-primary' ?>">
                                        <i class="bi bi-list"></i> Todos
                                    </a>
                                    <a href="exames.php?tipo=dengue" class="btn <?= $filtroTipo === 'dengue' ? 'btn-danger' : 'btn-outline-danger' ?>">
                                        <i class="bi bi-bug"></i> Dengue
                                    </a>
                                    <a href="exames.php?tipo=abo" class="btn <?= $filtroTipo === 'abo' ? 'btn-info' : 'btn-outline-info' ?>">
                                        <i class="bi bi-droplet"></i> ABO
                                    </a>
                                    <a href="exames.php?tipo=covid" class="btn <?= $filtroTipo === 'covid' ? 'btn-warning' : 'btn-outline-warning' ?>">
                                        <i class="bi bi-virus"></i> COVID-19
                                    </a>
                                </div>
                            </div>
                            <div class="col-md-6 text-end">
                                <span class="text-muted">
                                    Exibindo <?= count($exames) ?> exame(s)
                                    <?= !empty($filtroTipo) ? 'do tipo ' . strtoupper($filtroTipo) : '' ?>
                                </span>
                            </div>
                        </div>

                        <!-- Error Display -->
                        <?php if (isset($erro)): ?>
                            <div class="alert alert-danger">
                                <i class="bi bi-exclamation-triangle"></i> <?= htmlspecialchars($erro) ?>
                            </div>
                        <?php endif; ?>

                        <!-- Exams Table -->
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead class="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Tipo</th>
                                        <th>Nome do Exame</th>
                                        <th>Paciente</th>
                                        <th>CPF</th>
                                        <th>Data Consulta</th>
                                        <th>Detalhes Específicos</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (empty($exames)): ?>
                                        <tr>
                                            <td colspan="8" class="text-center text-muted py-4">
                                                <i class="bi bi-inbox fs-1"></i>
                                                <br>
                                                <?php if (!empty($filtroTipo)): ?>
                                                    Nenhum exame do tipo <?= strtoupper($filtroTipo) ?> encontrado.
                                                <?php else: ?>
                                                    Nenhum exame cadastrado ainda.
                                                <?php endif; ?>
                                                <br>
                                                <a href="cadastro_exame_dinamico.php" class="btn btn-primary mt-2">
                                                    <i class="bi bi-plus-circle"></i> Cadastrar Primeiro Exame
                                                </a>
                                            </td>
                                        </tr>
                                    <?php else: ?>
                                        <?php foreach ($exames as $exame): ?>
                                            <tr>
                                                <td>
                                                    <span class="badge bg-secondary"><?= $exame->getId() ?></span>
                                                </td>
                                                <td>
                                                    <?php
                                                    $tipoClass = '';
                                                    $tipoIcon = '';
                                                    switch ($exame->tipoExame) {
                                                        case 'Dengue':
                                                            $tipoClass = 'bg-danger';
                                                            $tipoIcon = 'bi-bug';
                                                            break;
                                                        case 'ABO':
                                                            $tipoClass = 'bg-info';
                                                            $tipoIcon = 'bi-droplet';
                                                            break;
                                                        case 'COVID-19':
                                                            $tipoClass = 'bg-warning text-dark';
                                                            $tipoIcon = 'bi-virus';
                                                            break;
                                                    }
                                                    ?>
                                                    <span class="badge <?= $tipoClass ?>">
                                                        <i class="bi <?= $tipoIcon ?>"></i> <?= $exame->tipoExame ?>
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong><?= htmlspecialchars($exame->getNome()) ?></strong>
                                                </td>
                                                <td>
                                                    <?= htmlspecialchars($exame->pacienteNome ?? 'N/A') ?>
                                                </td>
                                                <td>
                                                    <code><?= htmlspecialchars($exame->pacienteCpf ?? 'N/A') ?></code>
                                                </td>
                                                <td>
                                                    <?= $exame->dataConsulta ? date('d/m/Y', strtotime($exame->dataConsulta)) : 'N/A' ?>
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        <?php
                                                        switch ($exame->tipoExame) {
                                                            case 'Dengue':
                                                                echo "Amostra: " . htmlspecialchars($exame->getAmostraSangue());
                                                                if ($exame->getDataInicioSintomas()) {
                                                                    echo "<br>Sintomas: " . date('d/m/Y', strtotime($exame->getDataInicioSintomas()));
                                                                }
                                                                break;
                                                            case 'ABO':
                                                                echo "Amostra: " . htmlspecialchars($exame->getAmostraDna());
                                                                if ($exame->getTipoSanguineo()) {
                                                                    echo "<br>Tipo: " . htmlspecialchars($exame->getTipoSanguineo());
                                                                }
                                                                break;
                                                            case 'COVID-19':
                                                                echo "Teste: " . htmlspecialchars($exame->getTipoTeste());
                                                                if ($exame->getResultado()) {
                                                                    echo "<br>Resultado: " . htmlspecialchars($exame->getResultado());
                                                                }
                                                                break;
                                                        }
                                                        ?>
                                                    </small>
                                                </td>
                                                <td>
                                                    <div class="btn-group btn-group-sm" role="group">
                                                        <a href="editar.php?tipo=<?= 
                                                            $exame->tipoExame === 'Dengue' ? 'dengue' : 
                                                            ($exame->tipoExame === 'ABO' ? 'abo' : 'covid') 
                                                        ?>&id=<?= $exame->getId() ?>" 
                                                           class="btn btn-outline-primary" 
                                                           title="Editar exame">
                                                            <i class="bi bi-pencil"></i>
                                                        </a>
                                                        <button type="button" 
                                                                class="btn btn-outline-danger" 
                                                                onclick="confirmarExclusao('<?= strtolower(str_replace('-', '', $exame->tipoExame)) ?>', <?= $exame->getId() ?>, '<?= htmlspecialchars($exame->getNome()) ?>')"
                                                                title="Excluir exame">
                                                            <i class="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Hidden form for deletion -->
    <form id="deleteForm" method="POST" action="controller/ExamesController.php" style="display: none;">
        <input type="hidden" name="acao" value="excluir">
        <input type="hidden" name="tipo" id="deleteTipo">
        <input type="hidden" name="id" id="deleteId">
    </form>

    <?php
        include('../../modelo/footer.php');
    ?>

    <script>
        function confirmarExclusao(tipo, id, nomeExame) {
            if (confirm(`Tem certeza que deseja excluir o exame "${nomeExame}"?\n\nEsta ação não pode ser desfeita.`)) {
                document.getElementById('deleteTipo').value = tipo;
                document.getElementById('deleteId').value = id;
                document.getElementById('deleteForm').submit();
            }
        }

        // Auto-refresh page every 30 seconds if no filter is applied
        <?php if (empty($filtroTipo)): ?>
        setTimeout(function() {
            if (!document.hidden) {
                window.location.reload();
            }
        }, 30000);
        <?php endif; ?>
    </script>

</body>
</html>