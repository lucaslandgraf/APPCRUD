<?php 
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $id = $_POST['id'];
        $nomeExame = $_POST['nome_exame'];

        $exames = new Exames($id, $nomeExame);
    }
?>