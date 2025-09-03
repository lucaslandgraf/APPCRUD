<?php

require_once __DIR__ . "/../../connection/Connection.php";
require_once __DIR__ . "/../model/Exames.php";

class ExameDengueDao {
    
    public function inserir(ExameDengue $exame) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "INSERT INTO EXAME_DENGUE (agendamento_id, paciente_id, nome, amostra_sangue, data_inicio_sintomas) VALUES (:agendamento_id, :paciente_id, :nome, :amostra_sangue, :data_inicio_sintomas)";
            $stmt = $conn->prepare($sql);
            
            $stmt->bindValue(":agendamento_id", $exame->getAgendamentoId());
            $stmt->bindValue(":paciente_id", $exame->getPacienteId());
            $stmt->bindValue(":nome", $exame->getNome());
            $stmt->bindValue(":amostra_sangue", $exame->getAmostraSangue());
            $stmt->bindValue(":data_inicio_sintomas", $exame->getDataInicioSintomas());
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao inserir exame de Dengue: " . $e->getMessage());
        }
    }

    public function buscarPorId($id) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "SELECT * FROM EXAME_DENGUE WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":id", $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                return $this->mapRowToExame($row);
            }
            return null;
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar exame de Dengue: " . $e->getMessage());
        }
    }

    public function buscarPorAgendamento($agendamentoId) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "SELECT * FROM EXAME_DENGUE WHERE agendamento_id = :agendamento_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":agendamento_id", $agendamentoId, PDO::PARAM_INT);
            $stmt->execute();

            $exames = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $exames[] = $this->mapRowToExame($row);
            }
            return $exames;
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar exames de Dengue por agendamento: " . $e->getMessage());
        }
    }

    public function buscarTodos() {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "SELECT ed.*, a.data_consulta, p.nome as paciente_nome, p.cpf as paciente_cpf 
                    FROM EXAME_DENGUE ed 
                    LEFT JOIN agendamento a ON ed.agendamento_id = a.id 
                    LEFT JOIN paciente p ON ed.paciente_id = p.id 
                    ORDER BY ed.id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            
            $exames = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $exame = $this->mapRowToExame($row);
                // Add additional info for listing
                $exame->dataConsulta = $row["data_consulta"];
                $exame->pacienteNome = $row["paciente_nome"];
                $exame->pacienteCpf = $row["paciente_cpf"];
                $exame->tipoExame = 'Dengue';
                $exames[] = $exame;
            }
            return $exames;
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar todos os exames de Dengue: " . $e->getMessage());
        }
    }

    public function atualizar(ExameDengue $exame) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "UPDATE EXAME_DENGUE SET nome = :nome, amostra_sangue = :amostra_sangue, data_inicio_sintomas = :data_inicio_sintomas WHERE id = :id";
            $stmt = $conn->prepare($sql);
            
            $stmt->bindValue(":id", $exame->getId());
            $stmt->bindValue(":nome", $exame->getNome());
            $stmt->bindValue(":amostra_sangue", $exame->getAmostraSangue());
            $stmt->bindValue(":data_inicio_sintomas", $exame->getDataInicioSintomas());
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao atualizar exame de Dengue: " . $e->getMessage());
        }
    }

    public function deletar($id) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "DELETE FROM EXAME_DENGUE WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":id", $id, PDO::PARAM_INT);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao deletar exame de Dengue: " . $e->getMessage());
        }
    }

    private function mapRowToExame($row) {
        $exame = new ExameDengue();
        $exame->setId($row["id"]);
        $exame->setAgendamentoId($row["agendamento_id"]);
        $exame->setPacienteId($row["paciente_id"]);
        $exame->setNome($row["nome"]);
        $exame->setAmostraSangue($row["amostra_sangue"]);
        $exame->setDataInicioSintomas($row["data_inicio_sintomas"]);
        return $exame;
    }
}

class ExameABODao {
    
    public function inserir(ExameABO $exame) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "INSERT INTO EXAME_ABO (agendamento_id, paciente_id, nome, amostra_dna, tipo_sanguineo, observacoes) VALUES (:agendamento_id, :paciente_id, :nome, :amostra_dna, :tipo_sanguineo, :observacoes)";
            $stmt = $conn->prepare($sql);
            
            $stmt->bindValue(":agendamento_id", $exame->getAgendamentoId());
            $stmt->bindValue(":paciente_id", $exame->getPacienteId());
            $stmt->bindValue(":nome", $exame->getNome());
            $stmt->bindValue(":amostra_dna", $exame->getAmostraDna());
            $stmt->bindValue(":tipo_sanguineo", $exame->getTipoSanguineo());
            $stmt->bindValue(":observacoes", $exame->getObservacoes());
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao inserir exame ABO: " . $e->getMessage());
        }
    }

    public function buscarPorId($id) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "SELECT * FROM EXAME_ABO WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":id", $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                return $this->mapRowToExame($row);
            }
            return null;
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar exame ABO: " . $e->getMessage());
        }
    }

    public function buscarPorAgendamento($agendamentoId) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "SELECT * FROM EXAME_ABO WHERE agendamento_id = :agendamento_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":agendamento_id", $agendamentoId, PDO::PARAM_INT);
            $stmt->execute();

            $exames = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $exames[] = $this->mapRowToExame($row);
            }
            return $exames;
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar exames ABO por agendamento: " . $e->getMessage());
        }
    }

    public function buscarTodos() {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "SELECT ea.*, a.data_consulta, p.nome as paciente_nome, p.cpf as paciente_cpf 
                    FROM EXAME_ABO ea 
                    LEFT JOIN agendamento a ON ea.agendamento_id = a.id 
                    LEFT JOIN paciente p ON ea.paciente_id = p.id 
                    ORDER BY ea.id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            $exames = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $exame = $this->mapRowToExame($row);
                // Add additional info for listing
                $exame->dataConsulta = $row["data_consulta"];
                $exame->pacienteNome = $row["paciente_nome"];
                $exame->pacienteCpf = $row["paciente_cpf"];
                $exame->tipoExame = 'ABO';
                $exames[] = $exame;
            }
            return $exames;
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar todos os exames ABO: " . $e->getMessage());
        }
    }

    public function atualizar(ExameABO $exame) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "UPDATE EXAME_ABO SET nome = :nome, amostra_dna = :amostra_dna, tipo_sanguineo = :tipo_sanguineo, observacoes = :observacoes WHERE id = :id";
            $stmt = $conn->prepare($sql);
            
            $stmt->bindValue(":id", $exame->getId());
            $stmt->bindValue(":nome", $exame->getNome());
            $stmt->bindValue(":amostra_dna", $exame->getAmostraDna());
            $stmt->bindValue(":tipo_sanguineo", $exame->getTipoSanguineo());
            $stmt->bindValue(":observacoes", $exame->getObservacoes());
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao atualizar exame ABO: " . $e->getMessage());
        }
    }

    public function deletar($id) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "DELETE FROM EXAME_ABO WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":id", $id, PDO::PARAM_INT);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao deletar exame ABO: " . $e->getMessage());
        }
    }

    private function mapRowToExame($row) {
        $exame = new ExameABO();
        $exame->setId($row["id"]);
        $exame->setAgendamentoId($row["agendamento_id"]);
        $exame->setPacienteId($row["paciente_id"]);
        $exame->setNome($row["nome"]);
        $exame->setAmostraDna($row["amostra_dna"]);
        $exame->setTipoSanguineo($row["tipo_sanguineo"]);
        $exame->setObservacoes($row["observacoes"]);
        return $exame;
    }
}

class ExameCovidDao {
    
    public function inserir(ExameCovid $exame) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "INSERT INTO EXAME_COVID_19 (agendamento_id, paciente_id, nome, tipo_teste, status_amostra, resultado, data_inicio_sintomas, sintomas, observacoes) VALUES (:agendamento_id, :paciente_id, :nome, :tipo_teste, :status_amostra, :resultado, :data_inicio_sintomas, :sintomas, :observacoes)";
            $stmt = $conn->prepare($sql);
            
            $stmt->bindValue(":agendamento_id", $exame->getAgendamentoId());
            $stmt->bindValue(":paciente_id", $exame->getPacienteId());
            $stmt->bindValue(":nome", $exame->getNome());
            $stmt->bindValue(":tipo_teste", $exame->getTipoTeste());
            $stmt->bindValue(":status_amostra", $exame->getStatusAmostra());
            $stmt->bindValue(":resultado", $exame->getResultado());
            $stmt->bindValue(":data_inicio_sintomas", $exame->getDataInicioSintomas());
            $stmt->bindValue(":sintomas", $exame->getSintomas());
            $stmt->bindValue(":observacoes", $exame->getObservacoes());
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao inserir exame COVID-19: " . $e->getMessage());
        }
    }

    public function buscarPorId($id) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "SELECT * FROM EXAME_COVID_19 WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":id", $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                return $this->mapRowToExame($row);
            }
            return null;
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar exame COVID-19: " . $e->getMessage());
        }
    }

    public function buscarPorAgendamento($agendamentoId) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "SELECT * FROM EXAME_COVID_19 WHERE agendamento_id = :agendamento_id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":agendamento_id", $agendamentoId, PDO::PARAM_INT);
            $stmt->execute();

            $exames = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $exames[] = $this->mapRowToExame($row);
            }
            return $exames;
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar exames COVID-19 por agendamento: " . $e->getMessage());
        }
    }

    public function buscarTodos() {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "SELECT ec.*, a.data_consulta, p.nome as paciente_nome, p.cpf as paciente_cpf 
                    FROM EXAME_COVID_19 ec 
                    LEFT JOIN agendamento a ON ec.agendamento_id = a.id 
                    LEFT JOIN paciente p ON ec.paciente_id = p.id 
                    ORDER BY ec.id DESC";
            $stmt = $conn->prepare($sql);
            $stmt->execute();

            $exames = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $exame = $this->mapRowToExame($row);
                // Add additional info for listing
                $exame->dataConsulta = $row["data_consulta"];
                $exame->pacienteNome = $row["paciente_nome"];
                $exame->pacienteCpf = $row["paciente_cpf"];
                $exame->tipoExame = 'COVID-19';
                $exames[] = $exame;
            }
            return $exames;
        } catch (PDOException $e) {
            throw new Exception("Erro ao buscar todos os exames COVID-19: " . $e->getMessage());
        }
    }

    public function atualizar(ExameCovid $exame) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "UPDATE EXAME_COVID_19 SET nome = :nome, tipo_teste = :tipo_teste, status_amostra = :status_amostra, resultado = :resultado, data_inicio_sintomas = :data_inicio_sintomas, sintomas = :sintomas, observacoes = :observacoes WHERE id = :id";
            $stmt = $conn->prepare($sql);
            
            $stmt->bindValue(":id", $exame->getId());
            $stmt->bindValue(":nome", $exame->getNome());
            $stmt->bindValue(":tipo_teste", $exame->getTipoTeste());
            $stmt->bindValue(":status_amostra", $exame->getStatusAmostra());
            $stmt->bindValue(":resultado", $exame->getResultado());
            $stmt->bindValue(":data_inicio_sintomas", $exame->getDataInicioSintomas());
            $stmt->bindValue(":sintomas", $exame->getSintomas());
            $stmt->bindValue(":observacoes", $exame->getObservacoes());
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao atualizar exame COVID-19: " . $e->getMessage());
        }
    }

    public function deletar($id) {
        try {
            $conn = ConnectionFactory::getConnection();
            $sql = "DELETE FROM EXAME_COVID_19 WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindValue(":id", $id, PDO::PARAM_INT);
            
            return $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Erro ao deletar exame COVID-19: " . $e->getMessage());
        }
    }

    private function mapRowToExame($row) {
        $exame = new ExameCovid();
        $exame->setId($row["id"]);
        $exame->setAgendamentoId($row["agendamento_id"]);
        $exame->setPacienteId($row["paciente_id"]);
        $exame->setNome($row["nome"]);
        $exame->setTipoTeste($row["tipo_teste"]);
        $exame->setStatusAmostra($row["status_amostra"]);
        $exame->setResultado($row["resultado"]);
        $exame->setDataInicioSintomas($row["data_inicio_sintomas"]);
        $exame->setSintomas($row["sintomas"]);
        $exame->setObservacoes($row["observacoes"]);
        return $exame;
    }
}

?>