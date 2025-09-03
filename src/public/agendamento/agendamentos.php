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
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="../CSS/styleCP.css">
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">
    <title>Agendamentos</title>
</head>
<body>

    <?php
        include('../../modelo/nav.php');
        require_once './controller/AgendamentoController.php';

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['excluir'])) {
            $id = $_POST['excluir'];
            $agendamentoDao = new AgendamentoDao();
            $agendamentoDao->delete($id);

            header("Location: agendamentos.php");
            exit;
        }
    ?>

    <div class="container">
        <div class="row">
            <div class="col mx-4 mt-4">
                <form method="get" class="row g-3 mb-4">
                    <div class="col-auto">
                        <input
                            type="text"
                            class="form-control"
                            name="cpf"
                            placeholder="Buscar por CPF"
                            value="<?= htmlspecialchars($_GET['cpf'] ?? '', ENT_QUOTES) ?>"
                        >
                    </div>
                    <div class="col-auto">
                        <button type="submit" class="btn btn-primary">Buscar</button>
                        <a href="agendamentos.php" class="btn btn-secondary">Limpar</a>
                    </div>
                </form>
            
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Id</th> <th>Nome do Paciente</th> <th>Data Consulta</th> <th>CPF</th> <th>Exame</th> <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                         <?php
                         if($_SERVER["REQUEST_METHOD"] == "GET" || $_SERVER["REQUEST_METHOD"] == "POST"){

                            listar();
                         }
                         ?>
                    </tbody>
                </table>

            </div>
        </div>
    </div>

        <?php
            include('../../modelo/footer.php');
        ?>
</body>
</html>

