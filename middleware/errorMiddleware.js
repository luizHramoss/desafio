module.exports = (err, req, res, next) => {
    console.error({
        timestamp: new Date().toISOString(),
        message: err.message,
        stack: err.stack,
        route: req.originalUrl,
        method: req.method,
        body: req.body
    });
    const statusCode = err.statusCode || 500;
    const message =
        statusCode === 500
            ? 'Ocorreu um erro interno no servidor.'
            : err.message;

    res.status(statusCode).json({
        message
    });
};