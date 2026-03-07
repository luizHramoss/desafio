module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    if (statusCode === 500) {
        console.error(err);
    }

    return res.status(statusCode).json({
        message: statusCode === 500 ? 'Ocorreu um erro interno no servidor.' : err.message
    });
}