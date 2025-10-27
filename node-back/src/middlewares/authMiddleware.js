const jwt = require('jsonwebtoken');

/**
 * Middleware de AUTENTICAÇÃO
 * Verifica se o usuário enviou um token JWT válido.
 */
function checkAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ error: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        // Verifica se o token é válido (usando a mesma chave secreta do .env)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
}

/**
 * Middleware de AUTORIZAÇÃO
 * Verifica se o 'rol' do usuário (que veio do token) tem permissão
 **/

function checkRole(rolesPermitidas) { 
    
    return (req, res, next) => {
        const { rol } = req.user; 
        if (!rolesPermitidas.includes(rol)) {
            return res.status(403).json({ error: 'Acesso proibido. Você não tem permissão para este recurso.' });
        }
        next(); 
    }
}

module.exports = { 
    checkAuth, 
    checkRole 
};