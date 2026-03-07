const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
};

exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new AppError('Nome, e-mail e senha são obrigatórios.', 400);
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new AppError('E-mail já cadastrado.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    return res.status(201).json({
        message: 'Usuário criado com sucesso.',
        token: generateToken(user)
    });
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new AppError('E-mail e senha são obrigatórios.', 400);
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new AppError('Credenciais inválidas.', 401);
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
        throw new AppError('Credenciais inválidas.', 401);
    }

    return res.status(200).json({
        message: 'Login realizado com sucesso.',
        token: generateToken(user)
    });
});