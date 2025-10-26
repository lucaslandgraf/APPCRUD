const pool = require('./src/db/mysqlConnect'); 
const bcrypt = require('bcryptjs');

async function migrarSenhas() {
  console.log('Iniciando migração de senhas...');
  
  try {
    const [usuarios] = await pool.execute('SELECT id, senha FROM usuario');
    
    let senhasMigradas = 0;

    for (const user of usuarios) {
      const senhaAtual = user.senha;

      // Verifica se NÃO é um hash bcrypt
      if (senhaAtual && !senhaAtual.startsWith('$2y$') && !senhaAtual.startsWith('$2a$') && !senhaAtual.startsWith('$2b$')) {
        
        console.log(`Migrando senha do usuário ID: ${user.id}...`);
        
        // Gera o hash da senha em texto puro
        const salt = await bcrypt.genSalt(10);
        const novoHash = await bcrypt.hash(senhaAtual, salt);

        // Atualiza o banco com o novo hash
        await pool.execute('UPDATE usuario SET senha = ? WHERE id = ?', [novoHash, user.id]);
        
        senhasMigradas++;
      }
    }

    console.log(`-----------------------------------`);
    console.log(`Migração concluída!`);
    console.log(`Total de senhas migradas: ${senhasMigradas}`);

  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    pool.end(); // Fecha a conexão
  }
}

// Executa a função
migrarSenhas();