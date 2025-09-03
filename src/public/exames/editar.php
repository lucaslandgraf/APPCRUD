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
    <title>Editar Exame Dinâmico</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="icon" href="../faviconSPS.png" type="image/x-icon">
    <link rel="stylesheet" href="../CSS/styleCP.css">
</head>
<body>

    <?php
        include('../../modelo/nav.php');
        require_once __DIR__.'/./dao/ExamesDao.php';

        $exame = null;
        $erro = '';
        $tipoExame = '';
        $exameId = '';

        // Get exam data
        if (isset($_GET['tipo']) && isset($_GET['id'])) {
            $tipoExame = $_GET['tipo'];
            $exameId = $_GET['id'];
            
            try {
                switch($tipoExame) {
                    case 'dengue':
                        $dao = new ExameDengueDao();
                        $exame = $dao->buscarPorId($exameId);
                        break;
                    case 'abo':
                        $dao = new ExameABODao();
                        $exame = $dao->buscarPorId($exameId);
                        break;
                    case 'covid':
                        $dao = new ExameCovidDao();
                        $exame = $dao->buscarPorId($exameId);
                        break;
                    default:
                        $erro = 'Tipo de exame inválido.';
                }
                
                if (!$exame && !$erro) {
                    $erro = 'Exame não encontrado.';
                }
            } catch (Exception $e) {
                $erro = 'Erro ao carregar exame: ' . $e->getMessage();
            }
        } else {
            $erro = 'Parâmetros de exame não fornecidos.';
        }
    ?>

    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-10">
                <?php if ($erro): ?>
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle"></i> <?= htmlspecialchars($erro) ?>
                        <br><br>
                        <a href="exames.php" class="btn btn-primary">
                            <i class="bi bi-arrow-left"></i> Voltar para Exames
                        </a>
                    </div>
                <?php else: ?>
                    <div class="card">
                        <div class="card-header">
                            <h3 class="mb-0">
                                <i class="bi bi-pencil-square"></i> Editar Exame - <?= ucfirst($tipoExame) ?> #<?= $exameId ?>
                            </h3>
                        </div>
                        <div class="card-body">
                            
                            <!-- Exam Information -->
                            <div class="mb-4">
                                <div class="alert alert-info">
                                    <h6><i class="bi bi-info-circle"></i> Informações do Exame:</h6>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <strong>Tipo:</strong> <?= ucfirst($tipoExame) ?>
                                        </div>
                                        <div class="col-md-6">
                                            <strong>ID:</strong> <?= $exameId ?>
                                        </div>
                                        <div class="col-md-6">
                                            <strong>Paciente ID:</strong> <?= $exame->getPacienteId() ?>
                                        </div>
                                        <div class="col-md-6">
                                            <strong>Agendamento ID:</strong> <?= $exame->getAgendamentoId() ?>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Dynamic Edit Form -->
                            <div class="mb-4">
                                <h5 class="text-primary">
                                    <i class="bi bi-clipboard-data"></i> Dados do Exame
                                </h5>
                                
                                <form id="examEditForm" method="POST" action="controller/ExamesController.php">
                                    <input type="hidden" name="acao" value="atualizar">
                                    <input type="hidden" name="tipo_exame" value="<?= htmlspecialchars($tipoExame) ?>">
                                    <input type="hidden" name="exame_id" value="<?= htmlspecialchars($exameId) ?>">
                                    <input type="hidden" name="agendamento_id" value="<?= $exame->getAgendamentoId() ?>">
                                    <input type="hidden" name="paciente_id" value="<?= $exame->getPacienteId() ?>">
                                    
                                    <!-- Basic Fields -->
                                    <div class="row mb-4">
                                        <div class="col-md-6">
                                            <label for="tipo_exame_display" class="form-label">Tipo de Exame:</label>
                                            <input type="text" 
                                                   class="form-control" 
                                                   id="tipo_exame_display" 
                                                   value="<?= ucfirst($tipoExame) ?>"
                                                   readonly>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="nome_exame" class="form-label">Nome do Exame: *</label>
                                            <input type="text" 
                                                   class="form-control" 
                                                   id="nome_exame" 
                                                   name="nome_exame" 
                                                   value="<?= htmlspecialchars($exame->getNome()) ?>"
                                                   required>
                                        </div>
                                    </div>

                                    <!-- Dynamic Fields Container -->
                                    <div id="dynamic-fields" class="mb-4">
                                        <!-- Fields will be populated by JavaScript -->
                                    </div>

                                    <!-- Form Actions -->
                                    <div class="d-flex justify-content-between">
                                        <a href="exames.php" class="btn btn-secondary">
                                            <i class="bi bi-arrow-left"></i> Voltar
                                        </a>
                                        <button type="submit" class="btn btn-success">
                                            <i class="bi bi-check-circle"></i> Salvar Alterações
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <?php
        include('../../modelo/footer.php');
    ?>

    <script>
        // Exam data from PHP
        const examData = <?= json_encode([
            'tipo' => $tipoExame,
            'id' => $exameId,
            'nome' => $exame ? $exame->getNome() : '',
            'agendamento_id' => $exame ? $exame->getAgendamentoId() : '',
            'paciente_id' => $exame ? $exame->getPacienteId() : '',
            // Dengue specific
            'amostra_sangue' => method_exists($exame, 'getAmostraSangue') ? $exame->getAmostraSangue() : '',
            'data_inicio_sintomas' => method_exists($exame, 'getDataInicioSintomas') ? $exame->getDataInicioSintomas() : '',
            // ABO specific
            'amostra_dna' => method_exists($exame, 'getAmostraDna') ? $exame->getAmostraDna() : '',
            'tipo_sanguineo' => method_exists($exame, 'getTipoSanguineo') ? $exame->getTipoSanguineo() : '',
            'observacoes' => method_exists($exame, 'getObservacoes') ? $exame->getObservacoes() : '',
            // COVID specific
            'tipo_teste' => method_exists($exame, 'getTipoTeste') ? $exame->getTipoTeste() : '',
            'status_amostra' => method_exists($exame, 'getStatusAmostra') ? $exame->getStatusAmostra() : '',
            'resultado' => method_exists($exame, 'getResultado') ? $exame->getResultado() : '',
            'sintomas' => method_exists($exame, 'getSintomas') ? $exame->getSintomas() : ''
        ]) ?>;

        // Dynamic form fields based on exam type
        const examFields = {
            dengue: function(data) {
                return `
                    <div class="row">
                        <div class="col-md-6">
                            <label for="amostra_sangue" class="form-label">Amostra de Sangue: *</label>
                            <select id="amostra_sangue" name="amostra_sangue" class="form-select" required>
                                <option value="">Selecione o tipo de amostra</option>
                                <option value="Sangue Total" ${data.amostra_sangue === 'Sangue Total' ? 'selected' : ''}>Sangue Total</option>
                                <option value="Soro" ${data.amostra_sangue === 'Soro' ? 'selected' : ''}>Soro</option>
                                <option value="Plasma" ${data.amostra_sangue === 'Plasma' ? 'selected' : ''}>Plasma</option>
                                <option value="Sangue Capilar" ${data.amostra_sangue === 'Sangue Capilar' ? 'selected' : ''}>Sangue Capilar</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="data_inicio_sintomas" class="form-label">Data de Início dos Sintomas:</label>
                            <input type="date" 
                                   id="data_inicio_sintomas" 
                                   name="data_inicio_sintomas" 
                                   class="form-control"
                                   value="${data.data_inicio_sintomas || ''}">
                            <div class="form-text">Deixe em branco se o paciente for assintomático</div>
                        </div>
                    </div>
                `;
            },
            abo: function(data) {
                return `
                    <div class="row">
                        <div class="col-md-6">
                            <label for="amostra_dna" class="form-label">Amostra de DNA: *</label>
                            <select id="amostra_dna" name="amostra_dna" class="form-select" required>
                                <option value="">Selecione o tipo de amostra</option>
                                <option value="Sangue Total" ${data.amostra_dna === 'Sangue Total' ? 'selected' : ''}>Sangue Total</option>
                                <option value="Saliva" ${data.amostra_dna === 'Saliva' ? 'selected' : ''}>Saliva</option>
                                <option value="Swab Bucal" ${data.amostra_dna === 'Swab Bucal' ? 'selected' : ''}>Swab Bucal</option>
                                <option value="Plasma" ${data.amostra_dna === 'Plasma' ? 'selected' : ''}>Plasma</option>
                                <option value="Soro" ${data.amostra_dna === 'Soro' ? 'selected' : ''}>Soro</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="tipo_sanguineo" class="form-label">Tipo Sanguíneo (Resultado):</label>
                            <select id="tipo_sanguineo" name="tipo_sanguineo" class="form-select">
                                <option value="">Selecione o tipo sanguíneo (se já conhecido)</option>
                                <option value="A+" ${data.tipo_sanguineo === 'A+' ? 'selected' : ''}>A+</option>
                                <option value="A-" ${data.tipo_sanguineo === 'A-' ? 'selected' : ''}>A-</option>
                                <option value="B+" ${data.tipo_sanguineo === 'B+' ? 'selected' : ''}>B+</option>
                                <option value="B-" ${data.tipo_sanguineo === 'B-' ? 'selected' : ''}>B-</option>
                                <option value="AB+" ${data.tipo_sanguineo === 'AB+' ? 'selected' : ''}>AB+</option>
                                <option value="AB-" ${data.tipo_sanguineo === 'AB-' ? 'selected' : ''}>AB-</option>
                                <option value="O+" ${data.tipo_sanguineo === 'O+' ? 'selected' : ''}>O+</option>
                                <option value="O-" ${data.tipo_sanguineo === 'O-' ? 'selected' : ''}>O-</option>
                            </select>
                            <div class="form-text">Deixe em branco se o resultado ainda não estiver disponível</div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <label for="observacoes" class="form-label">Observações:</label>
                            <textarea id="observacoes" 
                                      name="observacoes" 
                                      class="form-control" 
                                      rows="3" 
                                      placeholder="Observações adicionais sobre o exame (opcional)">${data.observacoes || ''}</textarea>
                        </div>
                    </div>
                `;
            },
            covid: function(data) {
                // Parse symptoms if it's a string
                let sintomas = [];
                if (data.sintomas) {
                    try {
                        sintomas = typeof data.sintomas === 'string' ? data.sintomas.split(',') : data.sintomas;
                    } catch (e) {
                        sintomas = [];
                    }
                }

                const sintomasOptions = [
                    'Febre', 'Tosse', 'Dor de garganta', 'Dificuldade respiratória',
                    'Perda de olfato', 'Perda de paladar', 'Dor de cabeça', 'Fadiga'
                ];

                return `
                    <div class="row">
                        <div class="col-md-6">
                            <label for="tipo_teste" class="form-label">Tipo de Teste: *</label>
                            <select id="tipo_teste" name="tipo_teste" class="form-select" required>
                                <option value="">Selecione o tipo de teste</option>
                                <option value="RT-PCR" ${data.tipo_teste === 'RT-PCR' ? 'selected' : ''}>RT-PCR</option>
                                <option value="Antígeno" ${data.tipo_teste === 'Antígeno' ? 'selected' : ''}>Teste de Antígeno</option>
                                <option value="Sorológico" ${data.tipo_teste === 'Sorológico' ? 'selected' : ''}>Teste Sorológico</option>
                                <option value="Autoteste" ${data.tipo_teste === 'Autoteste' ? 'selected' : ''}>Autoteste</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="status_amostra" class="form-label">Status da Amostra: *</label>
                            <select id="status_amostra" name="status_amostra" class="form-select" required>
                                <option value="">Selecione o status da amostra</option>
                                <option value="Coletada" ${data.status_amostra === 'Coletada' ? 'selected' : ''}>Coletada</option>
                                <option value="Não Coletada" ${data.status_amostra === 'Não Coletada' ? 'selected' : ''}>Não Coletada</option>
                                <option value="Em Processamento" ${data.status_amostra === 'Em Processamento' ? 'selected' : ''}>Em Processamento</option>
                                <option value="Processada" ${data.status_amostra === 'Processada' ? 'selected' : ''}>Processada</option>
                                <option value="Resultado Disponível" ${data.status_amostra === 'Resultado Disponível' ? 'selected' : ''}>Resultado Disponível</option>
                            </select>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <label for="resultado" class="form-label">Resultado:</label>
                            <select id="resultado" name="resultado" class="form-select">
                                <option value="">Selecione o resultado (se disponível)</option>
                                <option value="Positivo" ${data.resultado === 'Positivo' ? 'selected' : ''}>Positivo</option>
                                <option value="Negativo" ${data.resultado === 'Negativo' ? 'selected' : ''}>Negativo</option>
                                <option value="Inconclusivo" ${data.resultado === 'Inconclusivo' ? 'selected' : ''}>Inconclusivo</option>
                                <option value="Aguardando" ${data.resultado === 'Aguardando' ? 'selected' : ''}>Aguardando Resultado</option>
                            </select>
                            <div class="form-text">Deixe em branco se o resultado ainda não estiver disponível</div>
                        </div>
                        <div class="col-md-6">
                            <label for="data_inicio_sintomas_covid" class="form-label">Data de Início dos Sintomas:</label>
                            <input type="date" 
                                   id="data_inicio_sintomas_covid" 
                                   name="data_inicio_sintomas" 
                                   class="form-control"
                                   value="${data.data_inicio_sintomas || ''}">
                            <div class="form-text">Deixe em branco se o paciente for assintomático</div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <label class="form-label">Sintomas Relatados:</label>
                            <div class="row">
                                <div class="col-md-6">
                                    ${sintomasOptions.slice(0, 4).map(sintoma => `
                                        <div class="form-check">
                                            <input class="form-check-input" 
                                                   type="checkbox" 
                                                   name="sintomas[]" 
                                                   value="${sintoma}" 
                                                   id="${sintoma.toLowerCase().replace(/\s+/g, '_')}"
                                                   ${sintomas.includes(sintoma) ? 'checked' : ''}>
                                            <label class="form-check-label" for="${sintoma.toLowerCase().replace(/\s+/g, '_')}">${sintoma}</label>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="col-md-6">
                                    ${sintomasOptions.slice(4).map(sintoma => `
                                        <div class="form-check">
                                            <input class="form-check-input" 
                                                   type="checkbox" 
                                                   name="sintomas[]" 
                                                   value="${sintoma}" 
                                                   id="${sintoma.toLowerCase().replace(/\s+/g, '_')}"
                                                   ${sintomas.includes(sintoma) ? 'checked' : ''}>
                                            <label class="form-check-label" for="${sintoma.toLowerCase().replace(/\s+/g, '_')}">${sintoma}</label>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-12">
                            <label for="observacoes_covid" class="form-label">Observações:</label>
                            <textarea id="observacoes_covid" 
                                      name="observacoes" 
                                      class="form-control" 
                                      rows="3" 
                                      placeholder="Observações adicionais sobre o exame (opcional)">${data.observacoes || ''}</textarea>
                        </div>
                    </div>
                `;
            }
        };

        // Load fields on page load
        document.addEventListener('DOMContentLoaded', function() {
            const examType = examData.tipo;
            const dynamicFields = document.getElementById('dynamic-fields');
            
            if (examType && examFields[examType]) {
                dynamicFields.innerHTML = examFields[examType](examData);
            }
        });

        // Form validation
        document.getElementById('examEditForm').addEventListener('submit', function(e) {
            const tipoExame = examData.tipo;
            const nomeExame = document.getElementById('nome_exame').value;
            
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