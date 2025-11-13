const pool = require('../../../db/mysqlConnect');
const { spawn } = require('child_process'); 
const path = require('path'); 

async function gerarRelatorioGeral(req, res) {
    try {
        const sqlQuery = `
            WITH RankedAgendamentos AS (
                SELECT 
                    a.id, a.paciente_id, a.data_consulta, a.tipo_exame,
                    ROW_NUMBER() OVER(
                        PARTITION BY a.paciente_id 
                        ORDER BY a.data_consulta DESC
                    ) as rn
                FROM agendamento a
            )
            SELECT 
                p.id AS paciente_id,
                p.nome AS paciente_nome,
                p.cpf AS paciente_cpf,
                p.data_nascimento AS paciente_data_nascimento,
                p.telefone AS paciente_telefone,
                p.endereco AS paciente_endereco,
                p.observacoes AS paciente_observacoes,
                ra.id AS agendamento_id,
                ra.data_consulta AS agendamento_data_consulta,
                ra.tipo_exame AS agendamento_tipo_exame,
                ec.nivel_anticorpos 
            FROM paciente p
            LEFT JOIN RankedAgendamentos ra ON p.id = ra.paciente_id AND ra.rn = 1
            LEFT JOIN exame_covid_19 ec ON ra.id = ec.agendamento_id
            ORDER BY p.nome ASC;
        `;
        const [rows] = await pool.execute(sqlQuery);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Erro ao gerar relatório geral:', error);
        res.status(500).json({ error: 'Erro interno ao gerar relatório.' });
    }
}

async function gerarGraficoRegressao(req, res) {
    let dataBuffer = '';
    let errorBuffer = '';

    try {
        const scriptPath = path.join(__dirname, '../../../datascience/calcular_regressao.py');
        const pythonExecutable = path.join(__dirname, '../../../../venv/Scripts/python.exe');     
        const pythonProcess = spawn(pythonExecutable, [scriptPath]);
        pythonProcess.stdout.on('data', (data) => {
            dataBuffer += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorBuffer += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Erro no script Python (stderr):', errorBuffer);
                try {
                    const errorJson = JSON.parse(errorBuffer);
                    return res.status(500).json({ error: errorJson.error || "Erro no script Python" });
                } catch (e) {
                    // Se não for JSON, envia o texto bruto do erro
                    return res.status(500).json({ error: errorBuffer || "Erro desconhecido ao rodar script Python" });
                }
            }
            try {
                // Se o código for 0 (sucesso), parseia o JSON dos dados
                const jsonData = JSON.parse(dataBuffer);
                res.status(200).json(jsonData);
            } catch (e) {
                console.error('Erro ao parsear JSON do Python:', e.message);
                res.status(500).json({ error: 'Erro ao processar resposta do Python.' });
            }
        });

        pythonProcess.on('error', (err) => {
             console.error('Falha ao iniciar o processo Python:', err);
             res.status(500).json({ error: 'Falha ao iniciar serviço de Data Science.' });
        });

    } catch (processError) { // Este catch agora pega erros do 'spawn'
        console.error('Erro ao tentar iniciar o script Python:', processError);
        return res.status(500).json({ error: 'Erro interno ao iniciar análise.' });
    }
}

module.exports = {
    gerarRelatorioGeral,
    gerarGraficoRegressao 
};