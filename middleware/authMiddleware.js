const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Token não informado.' });
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Token inválido ou expirado.' });
        }

        const token = parts[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ message: 'Usuário não autorizado.' });
        }

        req.user = {
            id: user.id,
            email: user.email
        };

        next();
    } catch (error) {
        console.error('Erro JWT:', error.message);
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};