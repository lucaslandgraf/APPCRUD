const bcrypt = require('bcryptjs');

// --- Coloque a senha que quer hashear aqui 
const senhaEmTextoPuro = '123456';

async function criarHash() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senhaEmTextoPuro, salt);

    console.log(`Senha Original: ${senhaEmTextoPuro}`);
    console.log('---');
    console.log('Copie este hash para o seu banco de dados (phpMyAdmin):');
    console.log(hash);

  } catch (err) {
    console.error('Erro ao gerar hash:', err);
  }
}

criarHash();