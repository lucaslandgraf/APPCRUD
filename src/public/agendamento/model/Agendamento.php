<?php

class Agendamento {
    private $id;
    private $dataConsulta;
    private $pacienteId;
    private $pacienteNome;
    private $pacienteCpf;
    private $tipoExame;

    public function getId() { return $this->id; }
    public function setId($id) { $this->id = $id; }

    public function getDataConsulta() { return $this->dataConsulta; }
    public function setDataConsulta($dataConsulta) { $this->dataConsulta = $dataConsulta; }

    public function getPacienteId() { return $this->pacienteId; }
    public function setPacienteId($pacienteId) { $this->pacienteId = $pacienteId; }

    public function getPacienteNome() { return $this->pacienteNome; }
    public function setPacienteNome($pacienteNome) { $this->pacienteNome = $pacienteNome; }

    public function getPacienteCpf() { return $this->pacienteCpf; }
    public function setPacienteCpf($pacienteCpf) { $this->pacienteCpf = $pacienteCpf; }

    public function getTipoExame() { return $this->tipoExame; }
    public function setTipoExame($tipoExame) { $this->tipoExame = $tipoExame; }
}

?>

