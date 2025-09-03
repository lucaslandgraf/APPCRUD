<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once(__DIR__."../../../connection/Connection.php");
require_once(__DIR__."../../model/Agendamento.php");
require_once(__DIR__."../../dao/AgendamentoDAO.php");

$agendamento = new Agendamento();

$agendamentoDao = new AgendamentoDao();

if (isset($_POST['cadastrar'])) {
    $cpf = $_POST['cpf'];
    $data_consulta = $_POST['data_consulta'];
    $tipo_exame = $_POST['tipo_exame'];

    try {
        $conn = ConnectionFactory::getConnection();

        // Find patient by CPF
        $stmt_paciente = $conn->prepare("SELECT id FROM paciente WHERE cpf = :cpf");
        $stmt_paciente->bindParam(':cpf', $cpf);
        $stmt_paciente->execute();
        $paciente = $stmt_paciente->fetch(PDO::FETCH_ASSOC);

        if ($paciente) {
            $paciente_id = $paciente['id'];
            
            $stmt_agendamento = $conn->prepare("INSERT INTO agendamento (paciente_id, data_consulta, tipo_exame) VALUES (:paciente_id, :data_consulta, :tipo_exame)");
            $stmt_agendamento->bindParam(':paciente_id', $paciente_id);
            $stmt_agendamento->bindParam(':data_consulta', $data_consulta);
            $stmt_agendamento->bindParam(':tipo_exame', $tipo_exame);

            if ($stmt_agendamento->execute()) {
                // Redirect on success
                $_SESSION['mensagem'] = 'Agendamento cadastrado com sucesso!';
                $_SESSION['tipo_mensagem'] = 'success';
                header('Location: ../agendamentos.php');
                exit();
            } else {
                $_SESSION['erro'] = 'Erro ao cadastrar agendamento.';
                header('Location: ../cadastro.php');
                exit();
            }
        } else {
            $_SESSION['erro'] = 'CPF não encontrado. Por favor, verifique o CPF e tente novamente.';
            header('Location: ../cadastro.php');
            exit();
        }

    } catch (PDOException $e) {
        echo "Erro: " . $e->getMessage();
    }
}

if(isset($_POST['atualizar'])) { 
    $id = $_POST['id'];
    $dataConsulta = $_POST['data_consulta'];
    $patientId = $_POST['paciente_id']; // Now receiving patient_id from hidden field
    $tipoExameString = $_POST['tipo_exame']; // Now receiving tipo_exame_string

    // Create Agendamento object and set properties
    $agendamento = new Agendamento();
    $agendamento->setId($id);
    $agendamento->setDataConsulta($dataConsulta);
    $agendamento->setPacienteId($patientId); // Set patient_id
    $agendamento->setTipoExame($tipoExameString); // Set tipo_exame_string
    
    // Create AgendamentoDao instance
    $agendamentoDao = new AgendamentoDao();
    
    // Call atualizar method
    if ($agendamentoDao->atualizar($agendamento)) {
        header("Location: ../agendamentos.php");
        exit();
    } else {
        echo "Erro ao atualizar agendamento.";
    }
}


if(isset($_POST['excluir?id'])) {
    $agendamento->setId($id);

    $resultado = $agendamentoDao->delete($agendamento);
}

function listar() {
    $agendamentoDao = new AgendamentoDao();
    
    $cpfFiltro = $_GET["cpf"] ?? "";

    if (!empty($cpfFiltro)) {
        $lista = $agendamentoDao->buscarPorCpf($cpfFiltro);
    } else {
        $lista = $agendamentoDao->read();
    }

    foreach ($lista as $agd) {
        echo "<tr>
                <td>{$agd->getId()}</td>
                <td>{$agd->getPacienteNome()}</td>
                <td>{$agd->getDataConsulta()}</td>
                <td>{$agd->getPacienteCpf()}</td>
                <td>{$agd->getTipoExame()}</td>
                <td>
                    <div class='d-flex gap-2'>
                        <a href='editar.php?editar={$agd->getId()}' class='btn btn-sm btn-warning'>
                            <i class='bi bi-pencil-square'></i> Editar
                        </a>
                        <form method='POST' action='agendamentos.php' onsubmit=\"return confirm('Tem certeza que deseja excluir este agendamento?');\">
                            <input type='hidden' name='excluir' value='{$agd->getId()}'>
                            <button type='submit' class='btn btn-sm btn-danger'>
                                <i class='bi bi-trash'></i> Excluir
                            </button>
                        </form>
                    </div>
                </td>
            </tr>";
    }
}
?>