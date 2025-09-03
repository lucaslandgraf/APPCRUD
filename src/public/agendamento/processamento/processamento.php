<?php 
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nome = $_POST['nome'];
        $dataConsulta = $_POST['data_consulta'];
        $tipoExame = $_POST['tipo_exame'];

        $agendamento = new Agendamento($nome, $dataConsulta, $tipoExame);
    }
?>