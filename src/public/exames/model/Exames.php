<?php

class ExameDengue {
    private $id;
    private $agendamentoId;
    private $pacienteId;
    private $nome;
    private $amostraSangue;
    private $dataInicioSintomas;

    public $dataConsulta;
    public $pacienteNome;
    public $pacienteCpf;
    public $tipoExame;

    // Constructor
    public function __construct() {}

    // Getters
    public function getId() {
        return $this->id;
    }

    public function getAgendamentoId() {
        return $this->agendamentoId;
    }

    public function getPacienteId() {
        return $this->pacienteId;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getAmostraSangue() {
        return $this->amostraSangue;
    }

    public function getDataInicioSintomas() {
        return $this->dataInicioSintomas;
    }

    // Setters
    public function setId($id) {
        $this->id = $id;
    }

    public function setAgendamentoId($agendamentoId) {
        $this->agendamentoId = $agendamentoId;
    }

    public function setPacienteId($pacienteId) {
        $this->pacienteId = $pacienteId;
    }

    public function setNome($nome) {
        $this->nome = $nome;
    }

    public function setAmostraSangue($amostraSangue) {
        $this->amostraSangue = $amostraSangue;
    }

    public function setDataInicioSintomas($dataInicioSintomas) {
        $this->dataInicioSintomas = $dataInicioSintomas;
    }
}

class ExameABO {
    private $id;
    private $agendamentoId;
    private $pacienteId;
    private $nome;
    private $amostraDna;
    private $tipoSanguineo;
    private $observacoes;

    public $dataConsulta;
    public $pacienteNome;
    public $pacienteCpf;
    public $tipoExame;

    // Constructor
    public function __construct() {}

    // Getters
    public function getId() {
        return $this->id;
    }

    public function getAgendamentoId() {
        return $this->agendamentoId;
    }

    public function getPacienteId() {
        return $this->pacienteId;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getAmostraDna() {
        return $this->amostraDna;
    }

    public function getTipoSanguineo() {
        return $this->tipoSanguineo;
    }

    public function getObservacoes() {
        return $this->observacoes;
    }

    // Setters
    public function setId($id) {
        $this->id = $id;
    }

    public function setAgendamentoId($agendamentoId) {
        $this->agendamentoId = $agendamentoId;
    }

    public function setPacienteId($pacienteId) {
        $this->pacienteId = $pacienteId;
    }

    public function setNome($nome) {
        $this->nome = $nome;
    }

    public function setAmostraDna($amostraDna) {
        $this->amostraDna = $amostraDna;
    }

    public function setTipoSanguineo($tipoSanguineo) {
        $this->tipoSanguineo = $tipoSanguineo;
    }

    public function setObservacoes($observacoes) {
        $this->observacoes = $observacoes;
    }
}

class ExameCovid {
    private $id;
    private $agendamentoId;
    private $pacienteId;
    private $nome;
    private $tipoTeste;
    private $statusAmostra;
    private $resultado;
    private $dataInicioSintomas;
    private $sintomas;
    private $observacoes;

    public $dataConsulta;
    public $pacienteNome;
    public $pacienteCpf;
    public $tipoExame;

    // Constructor
    public function __construct() {}

    // Getters
    public function getId() {
        return $this->id;
    }

    public function getAgendamentoId() {
        return $this->agendamentoId;
    }

    public function getPacienteId() {
        return $this->pacienteId;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getTipoTeste() {
        return $this->tipoTeste;
    }

    public function getStatusAmostra() {
        return $this->statusAmostra;
    }

    public function getResultado() {
        return $this->resultado;
    }

    public function getDataInicioSintomas() {
        return $this->dataInicioSintomas;
    }

    public function getSintomas() {
        return $this->sintomas;
    }

    public function getObservacoes() {
        return $this->observacoes;
    }

    // Setters
    public function setId($id) {
        $this->id = $id;
    }

    public function setAgendamentoId($agendamentoId) {
        $this->agendamentoId = $agendamentoId;
    }

    public function setPacienteId($pacienteId) {
        $this->pacienteId = $pacienteId;
    }

    public function setNome($nome) {
        $this->nome = $nome;
    }

    public function setTipoTeste($tipoTeste) {
        $this->tipoTeste = $tipoTeste;
    }

    public function setStatusAmostra($statusAmostra) {
        $this->statusAmostra = $statusAmostra;
    }

    public function setResultado($resultado) {
        $this->resultado = $resultado;
    }

    public function setDataInicioSintomas($dataInicioSintomas) {
        $this->dataInicioSintomas = $dataInicioSintomas;
    }

    public function setSintomas($sintomas) {
        $this->sintomas = $sintomas;
    }

    public function setObservacoes($observacoes) {
        $this->observacoes = $observacoes;
    }
}

?>