<?php session_start(); 

    if (!isset($_SESSION["id"])) {
        header("Location: /login.php");
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
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">
    <link rel="stylesheet" href="../CSS/styleCP.css">
    <title>Cadastro</title>
</head>

<body style="overflow-x: hidden">
    <?php
    include('../../modelo/nav.php');
    ?>

    <div class="row mt-4">
        <div class="col"></div>
        <div class="col mt-5">

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

            <h2>Troca de senha.</h2>
            <form action="controller/usuarioController.php" method="post">
                <div class="form-group mt-3">
                    <label for="sa">Senha atual:</label>
                    <input type="text" class="form-control" id="sa" name="passwordAtual" pattern=".{8,}" title="A senha deve ter pelo menos 8 caracteres" required>
                </div>
                <div class="form-group mt-3">
                    <label for="s">Nova senha:</label>
                    <input type="text" class="form-control" id="s" name="password" pattern=".{8,}" title="A senha deve ter pelo menos 8 caracteres" required>
                </div>
                <div class="form-group mt-3">
                    <label for="sc">Confirmação da senha:</label>
                    <input type="text" class="form-control" id="sc" name="pyes" pattern=".{8,}" title="A senha deve ter pelo menos 8 caracteres" required>
                </div>
                <div class="d-flex justify-content-center mt-4">
                    <button type="submit" name="alterar" class="btn btn-primary">Alterar</button>
                </div>
            </form>
        </div>
        <div class="col"></div>
    </div>

    <?php
    include('../../modelo/footer.php');
    ?>
</body>

</html>