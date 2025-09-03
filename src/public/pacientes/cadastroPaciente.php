<?php session_start();

    if (!isset($_SESSION["id"])) {
        header("Location: ../acesso/login.php");
        exit;
    }

    $sucesso = $_SESSION['sucesso'] ?? null;
    $erro    = $_SESSION['erro'] ?? null;
    unset($_SESSION['sucesso'], $_SESSION['erro']);
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Cadastro de Pacientes</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">
    <link rel="stylesheet" href="../CSS/styleCP.css">
</head>
<body style="overflow-x: hidden">

    <?php include('../../modelo/nav.php'); ?>

    <div class="container mt-4">
        <div class="row">
            <div class="col"></div>
            <div class="col">
                <h2>Cadastro de Pacientes</h2>

                <form action="controller/pacienteController.php" method="post" class="mt-3">
                    
                    <?php if ($sucesso): ?>
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                            <?= htmlspecialchars($sucesso, ENT_QUOTES, 'UTF-8') ?>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>                    
                        </div>
                    <?php endif; ?>

                    <?php if ($erro): ?>
                        <div class="alert alert-danger alert-dismissible fade show" role="alert">
                            <?= htmlspecialchars($erro, ENT_QUOTES, 'UTF-8') ?>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    <?php endif; ?>

                    <!-- Se vier editar, $_GET['editar'] contém o ID -->
                    <?php

                        require_once(__DIR__."../../pacientes/dao/pacienteDao.php");
                        require_once(__DIR__."../../connection/Connection.php");

                        $pacienteDao = new PacienteDao();

                        $pacienteEdicao = null;
                        if (isset($_GET['editar'])) {
                            $idEditar = (int) $_GET['editar'];
                            $pacienteEdicao = $pacienteDao->buscarPorId($idEditar);
                        }
                    ?>

                    <input type="hidden" name="id" value="<?= $pacienteEdicao['id'] ?? '' ?>">

                    <?php if (isset($_SESSION["rol"]) && $_SESSION["rol"] == 'ADM') { ?>
                        <div class="form-group mt-3">
                            <label for="nome">Nome:</label>
                            <input
                                type="text"
                                class="form-control"
                                id="nome"
                                name="nome"
                                value="<?= $pacienteEdicao['nome'] ?? '' ?>"
                                required
                            >
                        </div>
                    <?php } else { ?>
                        <div class="form-group mt-3">
                            <label for="nome">Nome:</label>
                            <input
                                type="text"
                                class="form-control"
                                id="nome"
                                name="nome"
                                value=""
                                <?php if (isset($pacienteEdicao['nome'])){ ?>
                                    disabled
                                <?php }else{ ?>
                                    require
                                <?php } ?>
                            >
                        </div>
                    <?php } ?>

                    <div class="form-group mt-3">
                        <label for="nascimento">Data de nascimento:</label>
                        <input
                            type="date"
                            class="form-control"
                            id="nascimento"
                            name="nascimento"
                            value="<?= isset($pacienteEdicao["data_nascimento"]) ? date("Y-m-d", strtotime($pacienteEdicao["data_nascimento"])) : "" ?>"
                            required
                        >
                    </div>

                    <div class="form-group mt-3">
                        <label for="endereco">Endereço:</label>
                        <input
                            type="text"
                            class="form-control"
                            id="endereco"
                            name="endereco"
                            value="<?= $pacienteEdicao['endereco'] ?? '' ?>"
                            required
                        >
                    </div>

                    <div class="form-group mt-3">
                        <label for="telefone">Telefone:</label>
                        <input
                            type="tel"
                            class="form-control"
                            id="telefone"
                            name="telefone"
                            value="<?= $pacienteEdicao['telefone'] ?? '' ?>"
                            required
                        >
                    </div>

                    <div class="form-group mt-3">
                        <label for="cpf">CPF:</label>
                        <input
                            type="text"
                            class="form-control"
                            id="cpf"
                            name="cpf"
                            value="<?= $pacienteEdicao['CPF'] ?? '' ?>"
                            required
                        >
                    </div>

                    <div class="form-group mt-3">
                        <label for="observacoes">Observações do paciente:</label>
                        <textarea
                            rows="5"
                            class="form-control"
                            id="observacoes"
                            name="observacoes"
                        ><?= $pacienteEdicao['observacoes'] ?? '' ?></textarea>
                    </div>

                    <div class="d-flex justify-content-center mt-4">
                        <?php if ($pacienteEdicao): ?>
                            <button name="atualizar" type="submit" class="btn btn-success">Atualizar</button>
                            <a href="gestaoPaciente.php" class="btn btn-secondary ms-2">Cancelar</a>
                        <?php else: ?>
                            <button name="cadastrar" type="submit" class="btn btn-primary">Salvar</button>
                        <?php endif; ?>
                    </div>
                </form>
            </div>
            <div class="col"></div>
        </div>
    </div>

    <?php include('../../modelo/footer.php'); ?>
</body>
</html>