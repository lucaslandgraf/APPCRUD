<?php
require_once __DIR__ . '/../../connection/Connection.php';

require_once(__DIR__ . '/../model/Agendamento.php');

class AgendamentoDao {
    
    private $apiUrl = 'http://localhost:3000/api/agendamentos';

    private function makeApiRequest($url, $method = 'GET', $data = null) {
        $ch = curl_init();
        
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json'
        ]);
        
        switch ($method) {
            case 'POST':
                curl_setopt($ch, CURLOPT_POST, true);
                if ($data) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                }
                break;
            case 'PUT':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
                if ($data) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                }
                break;
            case 'DELETE':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
                break;
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($response === false) {
            throw new Exception('Erro ao conectar com a API Node.js');
        }
        
        $decodedResponse = json_decode($response, true);
        
        if ($httpCode >= 400) {
            $errorMessage = isset($decodedResponse['message']) ? $decodedResponse['message'] : 'Erro na API';
            throw new Exception($errorMessage);
        }
        
        return $decodedResponse;
    }

    public function read() {
        try {
            $response = $this->makeApiRequest($this->apiUrl);
            $agendamentos = [];
            
            if (isset($response['data']) && is_array($response['data'])) {
                foreach ($response['data'] as $row) {
                    $agendamentos[] = $this->listaAgendamento($row);
                }
            }
            
            return $agendamentos;
        } catch (Exception $ex) {
            echo "<p>Erro ao listar agendamentos: " . $ex->getMessage() . "</p>";
            return [];
        }
    }

    public function buscarPorCpf($cpf) {
        try {
            $url = $this->apiUrl . '/cpf/' . urlencode($cpf);
            $response = $this->makeApiRequest($url);
            $agendamentos = [];
            
            if (isset($response['data']) && is_array($response['data'])) {
                foreach ($response['data'] as $row) {
                    $agendamentos[] = $this->listaAgendamento($row);
                }
            }
            
            return $agendamentos;
        } catch (Exception $ex) {
            echo "<p>Erro ao buscar agendamentos por CPF: " . $ex->getMessage() . "</p>";
            return [];
        }
    }

    public function buscarPorId($id) {
        try {
            $url = $this->apiUrl . '/' . $id;
            $response = $this->makeApiRequest($url);
            
            if (isset($response['data'])) {
                $row = $response['data'];
                $agendamento = new Agendamento();
                $agendamento->setId($row["id"]);
                $agendamento->setDataConsulta($row["data_consulta"]);
                $agendamento->setPacienteId($row["paciente_id"]);
                $agendamento->setPacienteNome($row["paciente_nome"]);
                $agendamento->setPacienteCpf($row["paciente_cpf"]);
                $agendamento->setTipoExame($row["tipo_exame"]);
                return $agendamento;
            }
            
            return null;
        } catch (Exception $ex) {
            return null;
        }
    }

    public function delete($id) {
        try {
            $url = $this->apiUrl . '/' . $id;
            $response = $this->makeApiRequest($url, 'DELETE');
            return $response['success'] ?? false;
        } catch (Exception $ex) {
            echo "<p>Erro ao excluir agendamento: " . $ex->getMessage() . "</p>";
            return false;
        }
    }

    public function inserir($agendamento) {
        try {
            $data = [
                'paciente_id' => $agendamento->getPacienteId(),
                'data_consulta' => $agendamento->getDataConsulta(),
                'tipo_exame' => $agendamento->getTipoExame()
            ];
            
            $response = $this->makeApiRequest($this->apiUrl, 'POST', $data);
            return $response['success'] ?? false;
        } catch (Exception $ex) {
            echo "<p>Erro ao inserir agendamento: " . $ex->getMessage() . "</p>";
            return false;
        }
    }

    public function atualizar(Agendamento $agd) {
        try {
            $data = [
                'paciente_id' => $agd->getPacienteId(),
                'data_consulta' => $agd->getDataConsulta(),
                'tipo_exame' => $agd->getTipoExame()
            ];
            
            $url = $this->apiUrl . '/' . $agd->getId();
            $response = $this->makeApiRequest($url, 'PUT', $data);
            return $response['success'] ?? false;
        } catch (Exception $ex) {
            echo "<p>Erro ao atualizar agendamento: " . $ex->getMessage() . "</p>";
            return false;
        }
    }

    private function listaAgendamento($row) {
        $agendamento = new Agendamento();
        $agendamento->setId($row["id"]);
        $agendamento->setDataConsulta($row["data_consulta"]);
        $agendamento->setPacienteNome($row["paciente_nome"]);
        $agendamento->setPacienteCpf($row["paciente_cpf"]);
        $agendamento->setTipoExame($row["tipo_exame"]);
        
        // Set paciente_id if available
        if (isset($row["paciente_id"])) {
            $agendamento->setPacienteId($row["paciente_id"]);
        }
        
        return $agendamento;
    }
}

?>
