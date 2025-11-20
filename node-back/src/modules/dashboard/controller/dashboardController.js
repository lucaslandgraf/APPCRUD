const pool = require('../../../db/mysqlConnect'); 

async function getDashboardStats(req, res) {
    try {
        // Conta todos os pacientes
        const [pacientesRows] = await pool.execute(
            'SELECT COUNT(*) AS total FROM paciente;'
        );
        const pacientesAtivos = pacientesRows[0].total;

        // Conta agendamentos ONDE a data é IGUAL a data de HOJE
        const [agendRows] = await pool.execute(
            'SELECT COUNT(*) AS total FROM agendamento WHERE DATE(data_consulta) = CURDATE()'
        );
        const agendamentosHoje = agendRows[0].total;

        // Retorna o JSON
        res.status(200).json({
            pacientesAtivos: pacientesAtivos,
            agendamentosHoje: agendamentosHoje
        });

    } catch (error) {
        console.error("Erro ao buscar estatísticas do dashboard:", error);
        res.status(500).json({ error: "Erro interno ao buscar estatísticas." });
    }
}

module.exports = { 
    getDashboardStats 
};