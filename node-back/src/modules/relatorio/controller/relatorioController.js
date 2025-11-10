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
                ra.tipo_exame AS agendamento_tipo_exame
            FROM paciente p
            LEFT JOIN RankedAgendamentos ra ON p.id = ra.paciente_id AND ra.rn = 1
            ORDER BY p.nome ASC;
        `;
        const [rows] = await pool.execute(sqlQuery);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Erro ao gerar relatório geral:', error);
        res.status(500).json({ error: 'Erro interno ao gerar relatório.' });
    }
}

// chama o script Python
async function gerarGraficoRegressao(req, res) {
    
    //  Define o caminho para o script Python
    // Ele "sobe" dois níveis (de controller/ e relatorio/) até o 'src/'
    // e depois "desce" para 'datascience/calcular_regressao.py'
    const scriptPath = path.join(__dirname, '../../../datascience/calcular_regressao.py');

    //  Define o comando para executar o Python
    const pythonExecutable = path.join(__dirname, '../../../../venv/Scripts/python.exe'); // ou 'python3' se python não funcionar

    //  Executa o script Python
    const pythonProcess = spawn(pythonExecutable, [scriptPath]);

    let dataBuffer = ''; // Para guardar os dados que o Python envia
    let errorBuffer = ''; // Para guardar os erros

    //  "Escuta" o que o Python imprime no console (stdout)
    pythonProcess.stdout.on('data', (data) => {
        dataBuffer += data.toString();
    });

    // "Escuta" qualquer erro que o Python imprimir (stderr)
    pythonProcess.stderr.on('data', (data) => {
        errorBuffer += data.toString();
    });

    //  Quando o script Python terminar...
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            // Se o código for diferente de 0, deu erro no Python
            console.error('Erro no script Python (stderr):', errorBuffer);
            try {
                const errorJson = JSON.parse(errorBuffer);
                return res.status(500).json({ error: errorJson.error || "Erro no script Python" });
            } catch (e) {
                return res.status(500).json({ error: errorBuffer || "Erro desconhecido ao rodar script Python" });
            }
        }

        try {
            const jsonData = JSON.parse(dataBuffer);
            // Envia o JSON do Python direto para o React Native
            res.status(200).json(jsonData);
        } catch (e) {
            console.error('Erro ao parsear JSON do Python:', e.message);
            res.status(500).json({ error: 'Erro ao processar resposta do Python.' });
        }
    });

    // Pega erros na própria chamada (ex: 'python' não encontrado)
    pythonProcess.on('error', (err) => {
         console.error('Falha ao iniciar o processo Python:', err);
         res.status(500).json({ error: 'Falha ao iniciar serviço de Data Science.' });
    });
}

module.exports = {
    gerarRelatorioGeral,
    gerarGraficoRegressao 
};