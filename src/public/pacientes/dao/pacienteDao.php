<?php
require_once __DIR__ . '/../../connection/Connection.php';

class PacienteDao {

    private $apiUrl = 'http://localhost:3000/api/pacientes';

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


    public function inserir($nome, $cpf, $telefone, $endereco, $observacoes, $dataNascimento) {
        try {
            $data = [
                'nome' => $nome,
                'cpf' => $cpf,
                'telefone' => $telefone,
                'endereco' => $endereco,
                'observacoes' => $observacoes,
                'dataNascimento' => $dataNascimento
            ];
            
            $response = $this->makeApiRequest($this->apiUrl, 'POST', $data);
            return $response['success'] ?? false;
        } catch (Exception $ex) {
            echo "<p>Erro ao inserir paciente: " . $ex->getMessage() . "</p>";
            return false;
        }
    }

    public function listarTodos() {
        try {
            $response = $this->makeApiRequest($this->apiUrl);
            return $response['data'] ?? [];
        } catch (Exception $ex) {
            echo "<p>Erro ao listar pacientes: " . $ex->getMessage() . "</p>";
            return [];
        }
    }

    public function atualizar($id, $nome, $cpf, $telefone, $endereco, $observacoes, $dataNascimento) {
        try {
            $data = [
                'nome' => $nome,
                'cpf' => $cpf,
                'telefone' => $telefone,
                'endereco' => $endereco,
                'observacoes' => $observacoes,
                'dataNascimento' => $dataNascimento
            ];
            
            $url = $this->apiUrl . '/' . $id;
            $response = $this->makeApiRequest($url, 'PUT', $data);
            return $response['success'] ?? false;
        } catch (Exception $ex) {
            echo "<p>Erro ao atualizar paciente: " . $ex->getMessage() . "</p>";
            return false;
        }
    }

    public function delete($id) {
        try {
            $url = $this->apiUrl . '/' . $id;
            $response = $this->makeApiRequest($url, 'DELETE');
            return $response['success'] ?? false;
        } catch (Exception $ex) {
            echo "<p>Erro ao excluir paciente: " . $ex->getMessage() . "</p>";
            return false;
        }
    }

    public function buscarPorCpf($cpf) {
        try {
            $url = $this->apiUrl . '/cpf/' . urlencode($cpf);
            $response = $this->makeApiRequest($url);
            return $response['data'] ?? [];
        } catch (Exception $ex) {
            echo "<p>Erro ao buscar paciente por CPF: " . $ex->getMessage() . "</p>";
            return [];
        }
    }

    public function buscarPorId($id) {
        try {
            $url = $this->apiUrl . '/' . $id;
            $response = $this->makeApiRequest($url);
            return $response['data'] ?? null;
        } catch (Exception $ex) {
            echo "<p>Erro ao buscar paciente por ID: " . $ex->getMessage() . "</p>";
            return null;
        }
    }
}
