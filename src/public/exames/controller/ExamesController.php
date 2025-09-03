<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once(__DIR__ . "/../dao/ExamesDao.php");
require_once(__DIR__ . "/../model/Exames.php");

class ExamesController {

    public function processarRequisicao() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $acao = $_POST['acao'] ?? '';
            
            switch ($acao) {
                case 'cadastrar':
                    return $this->cadastrarExame();
                    
                case 'atualizar':
                    return $this->atualizarExame();
                    
                case 'excluir':
                    return $this->excluirExame();
                    
                default:
                    echo "<script>
                        alert('Ação não reconhecida: " . addslashes($acao) . "');
                        window.history.back();
                    </script>";
                    return false;
            }
        } else {
            echo "<script>
                alert('Método de requisição inválido. Use POST.');
                window.history.back();
            </script>";
            return false;
        }
    }

    public function cadastrarExame() {
        try {
            $tipoExame = $_POST['tipo_exame'] ?? '';
            $agendamentoId = $_POST['agendamento_id'] ?? '';
            $pacienteId = $_POST['paciente_id'] ?? '';
            $nomeExame = $_POST['nome_exame'] ?? '';
            
            // Validação básica
            if (empty($tipoExame) || empty($agendamentoId) || empty($pacienteId) || empty($nomeExame)) {
                throw new Exception('Todos os campos obrigatórios devem ser preenchidos.');
            }
            
            $resultado = false;
            
            switch ($tipoExame) {
                case 'dengue':
                    $resultado = $this->cadastrarExameDengue($agendamentoId, $pacienteId, $nomeExame);
                    break;
                case 'abo':
                    $resultado = $this->cadastrarExameABO($agendamentoId, $pacienteId, $nomeExame);
                    break;
                case 'covid':
                    $resultado = $this->cadastrarExameCovid($agendamentoId, $pacienteId, $nomeExame);
                    break;
                default:
                    throw new Exception('Tipo de exame inválido.');
            }
            
            if ($resultado) {
                echo "<script>
                    alert('Exame cadastrado com sucesso!');
                    window.location.href = '../exames.php';
                </script>";
                return true;
            } else {
                throw new Exception('Erro ao cadastrar exame. Tente novamente.');
            }
            
        } catch (Exception $e) {
            echo "<script>
                alert('Erro: " . addslashes($e->getMessage()) . "');
                window.history.back();
            </script>";
            return false;
        }
    }

    public function atualizarExame() {
        try {
            $tipoExame = $_POST['tipo_exame'] ?? '';
            $exameId = $_POST['exame_id'] ?? '';
            $agendamentoId = $_POST['agendamento_id'] ?? '';
            $pacienteId = $_POST['paciente_id'] ?? '';
            $nomeExame = $_POST['nome_exame'] ?? '';
            
            // Validação básica
            if (empty($tipoExame) || empty($exameId) || empty($agendamentoId) || empty($pacienteId) || empty($nomeExame)) {
                throw new Exception('Todos os campos obrigatórios devem ser preenchidos.');
            }
            
            $resultado = false;
            
            switch ($tipoExame) {
                case 'dengue':
                    $resultado = $this->atualizarExameDengue($exameId, $agendamentoId, $pacienteId, $nomeExame);
                    break;
                case 'abo':
                    $resultado = $this->atualizarExameABO($exameId, $agendamentoId, $pacienteId, $nomeExame);
                    break;
                case 'covid':
                    $resultado = $this->atualizarExameCovid($exameId, $agendamentoId, $pacienteId, $nomeExame);
                    break;
                default:
                    throw new Exception('Tipo de exame inválido.');
            }
            
            if ($resultado) {
                echo "<script>
                    alert('Exame atualizado com sucesso!');
                    window.location.href = '../exames.php';
                </script>";
                return true;
            } else {
                throw new Exception('Erro ao atualizar exame. Verifique se o exame existe.');
            }
            
        } catch (Exception $e) {
            echo "<script>
                alert('Erro: " . addslashes($e->getMessage()) . "');
                window.history.back();
            </script>";
            return false;
        }
    }

    public function listarTodosExames($filtroTipo = '') {
        $todosExames = [];
        
        try {
            // Get Dengue exams
            if (empty($filtroTipo) || $filtroTipo === 'dengue') {
                $dengueDao = new ExameDengueDao();
                $examesDengue = $dengueDao->buscarTodos();
                $todosExames = array_merge($todosExames, $examesDengue);
            }
            
            // Get ABO exams
            if (empty($filtroTipo) || $filtroTipo === 'abo') {
                $aboDao = new ExameABODao();
                $examesABO = $aboDao->buscarTodos();
                $todosExames = array_merge($todosExames, $examesABO);
            }
            
            // Get COVID exams
            if (empty($filtroTipo) || $filtroTipo === 'covid') {
                $covidDao = new ExameCovidDao();
                $examesCovid = $covidDao->buscarTodos();
                $todosExames = array_merge($todosExames, $examesCovid);
            }
            
            // Sort by ID descending (most recent first)
            usort($todosExames, function($a, $b) {
                return $b->getId() - $a->getId();
            });
            
            return $todosExames;
            
        } catch (Exception $e) {
            throw new Exception("Erro ao listar exames: " . $e->getMessage());
        }
    }
    
    public function excluirExame() {
        try {
            $tipo = $_POST['tipo'] ?? '';
            $id = $_POST['id'] ?? '';
            
            if (empty($tipo) || empty($id)) {
                throw new Exception('Tipo e ID são obrigatórios para exclusão.');
            }
            
            $resultado = false;
            
            switch ($tipo) {
                case 'dengue':
                    $dao = new ExameDengueDao();
                    $resultado = $dao->deletar($id);
                    break;
                case 'abo':
                    $dao = new ExameABODao();
                    $resultado = $dao->deletar($id);
                    break;
                case 'covid':
                case 'covid19':
                    $dao = new ExameCovidDao();
                    $resultado = $dao->deletar($id);
                    break;
                default:
                    throw new Exception('Tipo de exame inválido para exclusão.');
            }
            
            if ($resultado) {
                echo "<script>
                    alert('Exame excluído com sucesso!');
                    window.location.href = '../exames.php';
                </script>";
                return true;
            } else {
                throw new Exception('Erro ao excluir exame.');
            }
            
        } catch (Exception $e) {
            echo "<script>
                alert('Erro: " . addslashes($e->getMessage()) . "');
                window.history.back();
            </script>";
            return false;
        }
    }
    
    public function contarExamesPorTipo() {
        try {
            $contadores = [
                'dengue' => 0,
                'abo' => 0,
                'covid' => 0,
                'total' => 0
            ];
            
            // Count Dengue exams
            $dengueDao = new ExameDengueDao();
            $examesDengue = $dengueDao->buscarTodos();
            $contadores['dengue'] = count($examesDengue);
            
            // Count ABO exams
            $aboDao = new ExameABODao();
            $examesABO = $aboDao->buscarTodos();
            $contadores['abo'] = count($examesABO);
            
            // Count COVID exams
            $covidDao = new ExameCovidDao();
            $examesCovid = $covidDao->buscarTodos();
            $contadores['covid'] = count($examesCovid);
            
            // Total count
            $contadores['total'] = $contadores['dengue'] + $contadores['abo'] + $contadores['covid'];
            
            return $contadores;
            
        } catch (Exception $e) {
            throw new Exception("Erro ao contar exames: " . $e->getMessage());
        }
    }

    public function cadastrarExameDengue($agendamentoId, $pacienteId, $nomeExame) {
        $amostraSangue = $_POST['amostra_sangue'] ?? '';
        $dataInicioSintomas = $_POST['data_inicio_sintomas'] ?? null;
        
        if (empty($amostraSangue)) {
            throw new Exception('Amostra de sangue é obrigatória para exame de Dengue.');
        }
        
        $exame = new ExameDengue();
        $exame->setAgendamentoId($agendamentoId);
        $exame->setPacienteId($pacienteId);
        $exame->setNome($nomeExame);
        $exame->setAmostraSangue($amostraSangue);
        $exame->setDataInicioSintomas($dataInicioSintomas ?: null);
        
        $dao = new ExameDengueDao();
        return $dao->inserir($exame);
    }

    public function cadastrarExameABO($agendamentoId, $pacienteId, $nomeExame) {
        $amostraDna = $_POST['amostra_dna'] ?? '';
        $tipoSanguineo = $_POST['tipo_sanguineo'] ?? null;
        $observacoes = $_POST['observacoes'] ?? null;
        
        if (empty($amostraDna)) {
            throw new Exception('Amostra de DNA é obrigatória para exame ABO.');
        }
        
        $exame = new ExameABO();
        $exame->setAgendamentoId($agendamentoId);
        $exame->setPacienteId($pacienteId);
        $exame->setNome($nomeExame);
        $exame->setAmostraDna($amostraDna);
        $exame->setTipoSanguineo($tipoSanguineo ?: null);
        $exame->setObservacoes($observacoes ?: null);
        
        $dao = new ExameABODao();
        return $dao->inserir($exame);
    }

    public function cadastrarExameCovid($agendamentoId, $pacienteId, $nomeExame) {
        $tipoTeste = $_POST['tipo_teste'] ?? '';
        $statusAmostra = $_POST['status_amostra'] ?? '';
        $resultado = $_POST['resultado'] ?? null;
        $dataInicioSintomas = $_POST['data_inicio_sintomas'] ?? null;
        $sintomas = $_POST['sintomas'] ?? [];
        $observacoes = $_POST['observacoes'] ?? null;
        
        if (empty($tipoTeste) || empty($statusAmostra)) {
            throw new Exception('Tipo de teste e status da amostra são obrigatórios para exame COVID-19.');
        }
        
        // Convert symptoms array to string
        $sintomasString = is_array($sintomas) ? implode(',', $sintomas) : '';
        
        $exame = new ExameCovid();
        $exame->setAgendamentoId($agendamentoId);
        $exame->setPacienteId($pacienteId);
        $exame->setNome($nomeExame);
        $exame->setTipoTeste($tipoTeste);
        $exame->setStatusAmostra($statusAmostra);
        $exame->setResultado($resultado ?: null);
        $exame->setDataInicioSintomas($dataInicioSintomas ?: null);
        $exame->setSintomas($sintomasString);
        $exame->setObservacoes($observacoes ?: null);
        
        $dao = new ExameCovidDao();
        return $dao->inserir($exame);
    }

    public function atualizarExameDengue($exameId, $agendamentoId, $pacienteId, $nomeExame) {
        $amostraSangue = $_POST['amostra_sangue'] ?? '';
        $dataInicioSintomas = $_POST['data_inicio_sintomas'] ?? null;
        
        if (empty($amostraSangue)) {
            throw new Exception('Amostra de sangue é obrigatória para exame de Dengue.');
        }
        
        $exame = new ExameDengue();
        $exame->setId($exameId);
        $exame->setAgendamentoId($agendamentoId);
        $exame->setPacienteId($pacienteId);
        $exame->setNome($nomeExame);
        $exame->setAmostraSangue($amostraSangue);
        $exame->setDataInicioSintomas($dataInicioSintomas ?: null);
        
        $dao = new ExameDengueDao();
        return $dao->atualizar($exame);
    }

    public function atualizarExameABO($exameId, $agendamentoId, $pacienteId, $nomeExame) {
        $amostraDna = $_POST['amostra_dna'] ?? '';
        $tipoSanguineo = $_POST['tipo_sanguineo'] ?? null;
        $observacoes = $_POST['observacoes'] ?? null;
        
        if (empty($amostraDna)) {
            throw new Exception('Amostra de DNA é obrigatória para exame ABO.');
        }
        
        $exame = new ExameABO();
        $exame->setId($exameId);
        $exame->setAgendamentoId($agendamentoId);
        $exame->setPacienteId($pacienteId);
        $exame->setNome($nomeExame);
        $exame->setAmostraDna($amostraDna);
        $exame->setTipoSanguineo($tipoSanguineo ?: null);
        $exame->setObservacoes($observacoes ?: null);
        
        $dao = new ExameABODao();
        return $dao->atualizar($exame);
    }

    public function atualizarExameCovid($exameId, $agendamentoId, $pacienteId, $nomeExame) {
        $tipoTeste = $_POST['tipo_teste'] ?? '';
        $statusAmostra = $_POST['status_amostra'] ?? '';
        $resultado = $_POST['resultado'] ?? null;
        $dataInicioSintomas = $_POST['data_inicio_sintomas'] ?? null;
        $sintomas = $_POST['sintomas'] ?? [];
        $observacoes = $_POST['observacoes'] ?? null;
        
        if (empty($tipoTeste) || empty($statusAmostra)) {
            throw new Exception('Tipo de teste e status da amostra são obrigatórios para exame COVID-19.');
        }
        
        // Convert symptoms array to string
        $sintomasString = is_array($sintomas) ? implode(',', $sintomas) : '';
        
        $exame = new ExameCovid();
        $exame->setId($exameId);
        $exame->setAgendamentoId($agendamentoId);
        $exame->setPacienteId($pacienteId);
        $exame->setNome($nomeExame);
        $exame->setTipoTeste($tipoTeste);
        $exame->setStatusAmostra($statusAmostra);
        $exame->setResultado($resultado ?: null);
        $exame->setDataInicioSintomas($dataInicioSintomas ?: null);
        $exame->setSintomas($sintomasString);
        $exame->setObservacoes($observacoes ?: null);
        
        $dao = new ExameCovidDao();
        return $dao->atualizar($exame);
    }
}

// Processamento automático de requisições POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller = new ExamesController();
    $controller->processarRequisicao();
}

?>