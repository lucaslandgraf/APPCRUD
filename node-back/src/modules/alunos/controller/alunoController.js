const { listarAlunosService, cadastrarAlunoService, excluirAlunoService, atualizarAlunoService } = require('../service/alunoService'); 

async function listarAlunos(req, res) {
  try {
    const alunos = await listarAlunosService(); // Chama o service
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function cadastrarAluno(req, res) {
  const { nome, email, senha, rol = 'DEFAULT' } = req.body;
  try {
    await cadastrarAlunoService(nome, email, senha, rol); 
    res.status(201).json({ status: 'Aluno cadastrado e e-mail enviado' });
  } catch (error) {
    if (error.message === "Este e-mail já está cadastrado.") {
        return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || "Erro interno ao cadastrar aluno." });
  }
}

async function excluirAluno(req, res) {
  const { id } = req.params; 
  if (!id) {
      return res.status(400).json({ error: "ID do aluno não fornecido na URL." });
  }
  try {
      const resultado = await excluirAlunoService(parseInt(id, 10)); // Converte ID para número
      res.status(200).json(resultado);
  } catch (error) {
      if (error.message.includes('não encontrado')) {
          return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || "Erro interno ao excluir aluno." });
  }
}

async function atualizarAluno(req, res) {
    const { id } = req.params;
    const { nome, email, rol } = req.body; 

    if (!id) {
        return res.status(400).json({ error: "ID do aluno não fornecido na URL." });
    }
    if (!nome || !email || !rol) {
        return res.status(400).json({ error: "Dados incompletos (nome, email, rol)." });
    }

    try {
        const resultado = await atualizarAlunoService(parseInt(id, 10), nome, email, rol);
        res.status(200).json(resultado);
    } catch (error) {
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({ error: error.message });
        }
        if (error.message.includes('e-mail já está sendo usado')) {
            return res.status(409).json({ error: error.message }); 
        }
        res.status(500).json({ error: error.message || "Erro interno ao atualizar aluno." });
    }
}

module.exports = {
  listarAlunos,
  cadastrarAluno,
  excluirAluno,  
  atualizarAluno 
};