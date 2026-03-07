const AppError = require('../utils/appError');
module.exports = (req, res, next) => {
    next(new AppError('Rota não encontrada.', 404));
};