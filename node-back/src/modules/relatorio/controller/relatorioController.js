const pool = require('../../../db/mysqlConnect');

async function gerarRelatorioGeral(req, res) {
    
    const sqlQuery = `
        WITH RankedAgendamentos AS (
            SELECT 
                a.id,
                a.paciente_id,
                a.data_consulta,
                a.tipo_exame,
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

    try {
        const [rows] = await pool.execute(sqlQuery);
        res.status(200).json(rows);

    } catch (error) {
        console.error('Erro ao gerar relatório geral:', error);
        res.status(500).json({ error: 'Erro interno ao gerar relatório.' });
    }
}

module.exports = {
    gerarRelatorioGeral
};