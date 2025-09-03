<?php 
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once(__DIR__."../../../connection/Connection.php");
require_once(__DIR__."../../../../modelo/paciente.php");
require_once(__DIR__."../../dao/pacienteDao.php");

$pacienteDao = new PacienteDao();

if(isset($_POST['cadastrar'])) {
    $nome = $_POST['nome'];
    $dataNascimento = $_POST['nascimento'];
    $endereco = $_POST['endereco'];
    $telefone = $_POST['telefone'];
    $cpf = $_POST['cpf'];
    $observacoes = $_POST['observacoes'];

    $result = $pacienteDao->inserir($nome, $cpf, $telefone, $endereco, $observacoes, $dataNascimento);

    if ($result) {
        $_SESSION['sucesso'] = "Paciente cadastrado com sucesso!";
    } else {
        $_SESSION['erro'] = "Erro ao cadastrar paciente. Verifique os dados e tente novamente.";
    }
    header("Location: ../cadastroPaciente.php");
    exit();
}

if(isset($_POST['atualizar'])) { 
    $id = $_POST['id'];
    $nome = $_POST['nome'];
    $dataNascimento = $_POST['nascimento'];
    $endereco = $_POST['endereco'];
    $telefone = $_POST['telefone'];
    $cpf = $_POST['cpf'];
    $observacoes = $_POST['observacoes'];

    $pacienteDao->atualizar($id, $nome, $cpf, $telefone, $endereco, $observacoes, $dataNascimento);

    $_SESSION['sucesso'] = "Paciente atualizado com sucesso!";
    header("Location: ../gestaoPaciente.php");
    exit();
}

if(isset($_POST['excluir'])) {
    $id = $_POST['excluir'];
    $pacienteDao->delete($id);

    $_SESSION['sucesso'] = "Paciente excluído com sucesso!";
    header("Location: ../pacientes/gestaoPaciente.php");
    exit();
}

function listar() {
    $pacienteDao = new PacienteDao();
    $cpfFiltro = $_GET['cpf'] ?? '';

    if (!empty($cpfFiltro)) {
        $lista = $pacienteDao->buscarPorCpf($cpfFiltro);
        if(empty($lista)) {
            echo "<tr class='text-center'><td colspan='7'>Nenhum paciente encontrado com o CPF informado.</td></tr>";
        }
    } else {
        $lista = $pacienteDao->listarTodos();
    }

    foreach ($lista as $pac) {
        echo "<tr>
                <td>{$pac['CPF']}</td>
                ";

        if (isset($_SESSION["rol"]) && $_SESSION["rol"] == 'ADM') {
            echo "<td>{$pac['nome']}</td>";
        }

        echo "<td>{$pac['data_nascimento']}</td>
                <td>{$pac['endereco']}</td>
                <td>{$pac['telefone']}</td>
                <td>{$pac['observacoes']}</td>
                <td>
                    <div class='d-flex gap-2'>
                        <a href='cadastroPaciente.php?editar={$pac['id']}' class='btn btn-sm btn-warning'>
                            <i class='bi bi-pencil-square'></i> Editar
                        </a>
                        <form method='POST' action='gestaoPaciente.php' onsubmit=\"return confirm('Tem certeza que deseja excluir este paciente?');\">
                            <input type='hidden' name='excluir' value='{$pac['id']}'>
                            <button type='submit' class='btn btn-sm btn-danger'>
                                <i class='bi bi-trash'></i> Excluir
                            </button>
                        </form>
                    </div>
                </td>
            </tr>";
    }
}
