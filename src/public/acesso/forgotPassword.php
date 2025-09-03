<?php session_start(); 

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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">
    <link rel="stylesheet" href="../CSS/styleCP.css">
    <title>Home</title>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand">SPS</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-12 text-center">
                <h1>Recuperação de acesso</h1>
                <p class="lead">Insira seu e-mail institucional para recuperar sua senha.</p>
            </div>
        </div>

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

        <div class="row">
            <div class="col-md-6 offset-md-3">
                <form action="controller/usuarioController.php" method="post">
                    <div class="mb-3 mt-4">
                        <label for="email" class="form-label">E-mail institucional:</label>
                        <input type="email" id="email" name="email" class="form-control" required>
                    </div>
                    <div class="d-flex justify-content-center mt-4">
                        <button type="submit" name="reset" class="btn btn-primary mt-4">Enviar</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12 text-center mt-5">
                <p>Retornar ao login. <a href="login.php">Clique aqui</a></p>
            </div>
        </div>
    </div>

    <?php
        include('../../modelo/footer.php');
    ?>
</body>

</html>