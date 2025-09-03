<?php
if (!isset($_SESSION["id"])) {
    header("Location: /acesso/login.php");
    exit;
}
?>

<div class="col mt-3">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Alunos</h5>
            <p class="card-text">Cadastro de novos usuários no sistema.</p>
            <a href="../cadastro/cadastro.php" class="btn btn-primary">Acessar</a>
        </div>
    </div>
</div>
<div class="col mt-3">
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Exames</h5>
            <p class="card-text">Cadastro de exames no sistema.</p>
            <a href="../exames/exames.php" class="btn btn-primary">Acessar</a>
        </div>
    </div>
</div>