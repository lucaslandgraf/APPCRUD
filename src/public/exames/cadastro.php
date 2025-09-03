<?php session_start(); 

    if (!isset($_SESSION["id"])) {
        header("Location: ../acesso/login.php");
        exit;
    }
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro de Exame Dinâmico</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">
    <link rel="stylesheet" href="../CSS/styleCP.css">
</head>
<body>

    <?php
        include('../../modelo/nav.php');
        require_once(__DIR__ . '/../agendamento/dao/AgendamentoDao.php');

        // Handle appointment search
        $agendamentoSelecionado = null;
        $erroBusca = '';
        $idBusca = '';

        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['buscar_agendamento'])) {
            $idBusca = trim($_POST['agendamento_search']);
            
            if (!empty($idBusca) && is_numeric($idBusca)) {
                $agendamentoDao = new AgendamentoDao();
                $agendamentoSelecionado = $agendamentoDao->buscarPorId($idBusca);
                
                if (!$agendamentoSelecionado) {
                    $erroBusca = 'Agendamento não encontrado com este ID.';
                }
            } else {
                $erroBusca = 'Por favor, digite um ID válido para buscar.';
            }
        }
    ?>

    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <div class="card">
                    <div class="card-header">
                        <h3 class="mb-0">
                            <i class="bi bi-clipboard-plus"></i> Cadastro de Exame Dinâmico
                        </h3>
                    </div>
                    <div class="card-body">
                        
                        <!-- Appointment Search Section -->
                        <div class="mb-4">
                            <h5 class="text-primary">
                                <i class="bi bi-search"></i> Buscar Agendamento
                            </h5>
                            <form method="POST" class="mb-3">
                                <div class="row">
                                    <div class="col-md-8">
                                        <label for="agendamento_search" class="form-label">ID do Agendamento:</label>
                                        <input type="text" 
                                               id="agendamento_search" 
                                               name="agendamento_search"
                                               class="form-control" 
                                               placeholder="Digite o ID do agendamento"
                                               value="<?= htmlspecialchars($idBusca) ?>">
                                    </div>
                                    <div class="col-md-4 d-flex align-items-end">
                                        <button type="submit" name="buscar_agendamento" class="btn btn-primary w-100">
                                            <i class="bi bi-search"></i> Buscar
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <!-- Search Results -->
                            <?php if ($agendamentoSelecionado): ?>
                                <div class="alert alert-success">
                                    <h6><i class="bi bi-check-circle"></i> Agendamento Encontrado:</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <strong>Paciente:</strong> <?= htmlspecialchars($agendamentoSelecionado->getPacienteNome()) ?>
                                        </div>
                                        <div class="col-md-6">
                                            <strong>CPF:</strong> <?= htmlspecialchars($agendamentoSelecionado->getPacienteCpf()) ?>
                                        </div>
                                        <div class="col-md-6">
                                            <strong>Data da Consulta:</strong> <?= date('d/m/Y', strtotime($agendamentoSelecionado->getDataConsulta())) ?>
                                        </div>
                                        <div class="col-md-6">
                                            <strong>Tipo de Exame:</strong> <?= htmlspecialchars($agendamentoSelecionado->getTipoExame()) ?>
                                        </div>
                                    </div>
                                </div>
                            <?php elseif ($erroBusca): ?>
                                <div class="alert alert-danger">
                                    <i class="bi bi-exclamation-triangle"></i> <?= htmlspecialchars($erroBusca) ?>
                                </div>
                            <?php endif; ?>
                        </div>

                        <hr>

                        <!-- Dynamic Exam Form -->
                        <?php if ($agendamentoSelecionado): ?>
                            <div class="mb-4">
                                <h5 class="text-primary">
                                    <i class="bi bi-clipboard-data"></i> Dados do Exame
                                </h5>
                                
                                <form id="examForm" method="POST" action="controller/ExamesController.php">
                                    <input type="hidden" name="acao" value="cadastrar">
                                    <input type="hidden" name="agendamento_id" value="<?= $agendamentoSelecionado->getId() ?>">
                                    <input type="hidden" name="paciente_id" value="<?= $agendamentoSelecionado->getPacienteId() ?>">
                                    
                                    <!-- Exam Type Selection -->
                                    <div class="row mb-4">
                                        <div class="col-md-6">
                                            <label for="tipo_exame" class="form-label">Tipo de Exame: *</label>
                                            <select class="form-select" id="tipo_exame" name="tipo_exame" required>
                                                <option value="">Selecione o tipo de exame</option>
                                                <option value="dengue">Dengue</option>
                                                <option value="abo">ABO - Tipo Sanguíneo</option>
                                                <option value="covid">COVID-19</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="nome_exame" class="form-label">Nome do Exame: *</label>
                                            <input type="text" 
                                                   class="form-control" 
                                                   id="nome_exame" 
                                                   name="nome_exame" 
                                                   placeholder="Nome descritivo do exame"
                                                   required>
                                        </div>
                                    </div>

                                    <!-- Dynamic Fields Container -->
                                    <div id="dynamic-fields" class="mb-4">
                                        <div class="alert alert-info text-center">
                                            <i class="bi bi-info-circle"></i>
                                            Selecione o tipo de exame para ver os campos específicos.
                                        </div>
                                    </div>

                                    <!-- Form Actions -->
                                    <div class="d-flex justify-content-between">
                                        <a href="exames.php" class="btn btn-secondary">
                                            <i class="bi bi-arrow-left"></i> Voltar
                                        </a>
                                        <button type="submit" id="submitBtn" class="btn btn-success" disabled>
                                            <i class="bi bi-check-circle"></i> Cadastrar Exame
                                        </button>
                                    </div>
                                </form>
                            </div>
                        <?php else: ?>
                            <div class="alert alert-info text-center">
                                <i class="bi bi-info-circle"></i>
                                Para cadastrar um exame, primeiro busque e selecione um agendamento usando o ID.
                            </div>
                            
                            <div class="text-center">
                                <a href="agendamentos.php" class="btn btn-secondary">
                                    <i class="bi bi-arrow-left"></i> Voltar para Agendamentos
                                </a>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php
        include('../../modelo/footer.php');
    ?>

    <script>
        // Dynamic form fields based on exam type
        const examFields = {
            dengue: `
                <div class="row">
                    <div class="col-md-6">
                        <label for="amostra_sangue" class="form-label">Amostra de Sangue: *</label>
                        <select id="amostra_sangue" name="amostra_sangue" class="form-select" required>
                            <option value="">Selecione o tipo de amostra</option>
                            <option value="Sangue Total">Sangue Total</option>
                            <option value="Soro">Soro</option>
                            <option value="Plasma">Plasma</option>
                            <option value="Sangue Capilar">Sangue Capilar</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="data_inicio_sintomas" class="form-label">Data de Início dos Sintomas:</label>
                        <input type="date" id="data_inicio_sintomas" name="data_inicio_sintomas" class="form-control">
                        <div class="form-text">Deixe em branco se o paciente for assintomático</div>
                    </div>
                </div>
            `,
            abo: `
                <div class="row">
                    <div class="col-md-6">
                        <label for="amostra_dna" class="form-label">Amostra de DNA: *</label>
                        <select id="amostra_dna" name="amostra_dna" class="form-select" required>
                            <option value="">Selecione o tipo de amostra</option>
                            <option value="Sangue Total">Sangue Total</option>
                            <option value="Saliva">Saliva</option>
                            <option value="Swab Bucal">Swab Bucal</option>
                            <option value="Plasma">Plasma</option>
                            <option value="Soro">Soro</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="tipo_sanguineo" class="form-label">Tipo Sanguíneo (Resultado):</label>
                        <select id="tipo_sanguineo" name="tipo_sanguineo" class="form-select">
                            <option value="">Selecione o tipo sanguíneo (se já conhecido)</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        <div class="form-text">Deixe em branco se o resultado ainda não estiver disponível</div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <label for="observacoes" class="form-label">Observações:</label>
                        <textarea id="observacoes" name="observacoes" class="form-control" rows="3" 
                                  placeholder="Observações adicionais sobre o exame (opcional)"></textarea>
                    </div>
                </div>
            `,
            covid: `
                <div class="row">
                    <div class="col-md-6">
                        <label for="tipo_teste" class="form-label">Tipo de Teste: *</label>
                        <select id="tipo_teste" name="tipo_teste" class="form-select" required>
                            <option value="">Selecione o tipo de teste</option>
                            <option value="RT-PCR">RT-PCR</option>
                            <option value="Antígeno">Teste de Antígeno</option>
                            <option value="Sorológico">Teste Sorológico</option>
                            <option value="Autoteste">Autoteste</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="status_amostra" class="form-label">Status da Amostra: *</label>
                        <select id="status_amostra" name="status_amostra" class="form-select" required>
                            <option value="">Selecione o status da amostra</option>
                            <option value="Coletada">Coletada</option>
                            <option value="Não Coletada">Não Coletada</option>
                            <option value="Em Processamento">Em Processamento</option>
                            <option value="Processada">Processada</option>
                            <option value="Resultado Disponível">Resultado Disponível</option>
                        </select>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <label for="resultado" class="form-label">Resultado:</label>
                        <select id="resultado" name="resultado" class="form-select">
                            <option value="">Selecione o resultado (se disponível)</option>
                            <option value="Positivo">Positivo</option>
                            <option value="Negativo">Negativo</option>
                            <option value="Inconclusivo">Inconclusivo</option>
                            <option value="Aguardando">Aguardando Resultado</option>
                        </select>
                        <div class="form-text">Deixe em branco se o resultado ainda não estiver disponível</div>
                    </div>
                    <div class="col-md-6">
                        <label for="data_inicio_sintomas_covid" class="form-label">Data de Início dos Sintomas:</label>
                        <input type="date" id="data_inicio_sintomas_covid" name="data_inicio_sintomas" class="form-control">
                        <div class="form-text">Deixe em branco se o paciente for assintomático</div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <label class="form-label">Sintomas Relatados:</label>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="sintomas[]" value="Febre" id="febre">
                                    <label class="form-check-label" for="febre">Febre</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="sintomas[]" value="Tosse" id="tosse">
                                    <label class="form-check-label" for="tosse">Tosse</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="sintomas[]" value="Dor de garganta" id="dor_garganta">
                                    <label class="form-check-label" for="dor_garganta">Dor de garganta</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="sintomas[]" value="Dificuldade respiratória" id="dificuldade_respiratoria">
                                    <label class="form-check-label" for="dificuldade_respiratoria">Dificuldade respiratória</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="sintomas[]" value="Perda de olfato" id="perda_olfato">
                                    <label class="form-check-label" for="perda_olfato">Perda de olfato</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="sintomas[]" value="Perda de paladar" id="perda_paladar">
                                    <label class="form-check-label" for="perda_paladar">Perda de paladar</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="sintomas[]" value="Dor de cabeça" id="dor_cabeca">
                                    <label class="form-check-label" for="dor_cabeca">Dor de cabeça</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="sintomas[]" value="Fadiga" id="fadiga">
                                    <label class="form-check-label" for="fadiga">Fadiga</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-12">
                        <label for="observacoes_covid" class="form-label">Observações:</label>
                        <textarea id="observacoes_covid" name="observacoes" class="form-control" rows="3" 
                                  placeholder="Observações adicionais sobre o exame (opcional)"></textarea>
                    </div>
                </div>
            `
        };

        // Handle exam type change
        document.getElementById('tipo_exame').addEventListener('change', function() {
            const examType = this.value;
            const dynamicFields = document.getElementById('dynamic-fields');
            const submitBtn = document.getElementById('submitBtn');
            
            if (examType && examFields[examType]) {
                dynamicFields.innerHTML = examFields[examType];
                submitBtn.disabled = false;
                
                // Update exam name placeholder
                const nomeExame = document.getElementById('nome_exame');
                const pacienteNome = '<?= htmlspecialchars($agendamentoSelecionado ? $agendamentoSelecionado->getPacienteNome() : "") ?>';
                
                switch(examType) {
                    case 'dengue':
                        nomeExame.placeholder = `Teste Dengue - Paciente ${pacienteNome}`;
                        break;
                    case 'abo':
                        nomeExame.placeholder = `Tipagem ABO - Paciente ${pacienteNome}`;
                        break;
                    case 'covid':
                        nomeExame.placeholder = `Teste COVID-19 - Paciente ${pacienteNome}`;
                        break;
                }
            } else {
                dynamicFields.innerHTML = `
                    <div class="alert alert-info text-center">
                        <i class="bi bi-info-circle"></i>
                        Selecione o tipo de exame para ver os campos específicos.
                    </div>
                `;
                submitBtn.disabled = true;
            }
        });

        // Form validation
        document.getElementById('examForm').addEventListener('submit', function(e) {
            const tipoExame = document.getElementById('tipo_exame').value;
            const nomeExame = document.getElementById('nome_exame').value;
            
            if (!tipoExame) {
                e.preventDefault();
                alert('Por favor, selecione o tipo de exame.');
                return;
            }
            
            if (!nomeExame.trim()) {
                e.preventDefault();
                alert('Por favor, digite o nome do exame.');
                return;
            }
            
            // Validate required fields based on exam type
            if (tipoExame === 'dengue') {
                const amostraSangue = document.getElementById('amostra_sangue').value;
                if (!amostraSangue) {
                    e.preventDefault();
                    alert('Por favor, selecione o tipo de amostra de sangue.');
                    return;
                }
            } else if (tipoExame === 'abo') {
                const amostraDna = document.getElementById('amostra_dna').value;
                if (!amostraDna) {
                    e.preventDefault();
                    alert('Por favor, selecione o tipo de amostra de DNA.');
                    return;
                }
            } else if (tipoExame === 'covid') {
                const tipoTeste = document.getElementById('tipo_teste').value;
                const statusAmostra = document.getElementById('status_amostra').value;
                if (!tipoTeste) {
                    e.preventDefault();
                    alert('Por favor, selecione o tipo de teste.');
                    return;
                }
                if (!statusAmostra) {
                    e.preventDefault();
                    alert('Por favor, selecione o status da amostra.');
                    return;
                }
            }
        });
    </script>

</body>
</html>