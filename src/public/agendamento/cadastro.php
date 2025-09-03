<?php session_start(); 

    $erro = $_SESSION['erro'] ?? null;

    if (!isset($_SESSION["id"])) {
        header("Location: ../acesso/login.php");
        exit;
    }

    
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="../CSS/styleCP.css">
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">
    <title>Cadastrar Agendamento</title>
</head>
<body>
    
    <?php
      include('../../modelo/nav.php');
    ?>

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <h1 class="text-center m-5">Agendamento</h1>
                <?php if ($erro): ?>
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <?= htmlspecialchars($erro, ENT_QUOTES, 'UTF-8') ?>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                <?php endif; ?>
                <div>
                    <form action="controller/AgendamentoController.php" method="post">
                        <div class="mt-3">
                            <label for="cpf" class="form-label">CPF do Paciente:</label>
                            <input type="text" name="cpf" id="cpf" class="form-control" placeholder="Digite o CPF do paciente" required>
                        </div>
                        
                        <div class="mt-3">
                            <label for="data_consulta" class="form-label">Data do Exame:</label>
                            <input type="date" name="data_consulta" id="data_consulta" class="form-control" required>
                        </div>
                        <div class="mt-3">
                            <label for="tipo_exame" class="form-label">Tipo do Exame:</label>
                            <select id="tipo_exame" name="tipo_exame" class="form-select" required>
                                <option value="">Selecione um exame</option>
                                <option value="Dengue">Dengue</option>
                                <option value="ABO">ABO - Tipo Sanguíneo</option>
                                <option value="COVID-19">COVID-19</option>
                            </select>
                        </div>
                        <div class="mt-3 text-center">
                            <input type="submit" name="cadastrar" value="Cadastrar" class="btn btn-primary">
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <?php
        include('../../modelo/footer.php');
    ?>

</body>
</html>
