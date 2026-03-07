const AppError = require('../utils/appError');

function isBlank(value) {
    return typeof value !== 'string' || !value.trim();
}

function isInvalidDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime());
}

function validateItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError('O pedido deve possuir ao menos um item.', 400);
    }

    if (items.length > 100) {
        throw new AppError('Pedido excede o limite de itens.', 400);
    }

    const ids = [];

    items.forEach((item, index) => {

        if (!item.idItem || !String(item.idItem).trim()) {
            throw new AppError(`idItem do item ${index + 1} é obrigatório.`, 400);
        }

        const productId = Number(item.idItem);

        if (!Number.isInteger(productId) || productId <= 0) {
            throw new AppError(`idItem do item ${index + 1} é inválido.`, 400);
        }

        if (!Number.isInteger(item.quantidadeItem) || item.quantidadeItem <= 0) {
            throw new AppError(`quantidadeItem do item ${index + 1} deve ser maior que zero.`, 400);
        }

        if (typeof item.valorItem !== 'number' || item.valorItem <= 0) {
            throw new AppError(`valorItem do item ${index + 1} deve ser maior que zero.`, 400);
        }

        ids.push(String(item.idItem).trim());

    });

    const unique = new Set(ids);

    if (unique.size !== ids.length) {
        throw new AppError('Itens duplicados no pedido.', 400);
    }
}

function validateCreateOrder(body) {
    const { numeroPedido, valorTotal, dataCriacao, items } = body;

    if (numeroPedido === undefined || isBlank(numeroPedido)) {
        throw new AppError('numeroPedido é obrigatório.', 400);
    }

    if (numeroPedido.trim().length < 5) {
        throw new AppError('numeroPedido inválido.', 400);
    }

    if (typeof valorTotal !== 'number' || valorTotal <= 0) {
        throw new AppError('valorTotal deve ser maior que zero.', 400);
    }

    if (dataCriacao === undefined || isBlank(dataCriacao)) {
        throw new AppError('dataCriacao é obrigatória.', 400);
    }

    if (isInvalidDate(dataCriacao)) {
        throw new AppError('dataCriacao inválida.', 400);
    }

    validateItems(items);
}

function validateUpdateOrder(body) {

    const { valorTotal, dataCriacao, items } = body;

    if (
        valorTotal === undefined &&
        dataCriacao === undefined &&
        items === undefined
    ) {
        throw new AppError('Nenhum campo para atualização foi informado.', 400);
    }

    if (valorTotal !== undefined) {
        if (typeof valorTotal !== 'number' || valorTotal <= 0) {
            throw new AppError('valorTotal inválido.', 400);
        }
    }

    if (dataCriacao !== undefined) {

        if (isBlank(dataCriacao)) {
            throw new AppError('dataCriacao inválida.', 400);
        }

        if (isInvalidDate(dataCriacao)) {
            throw new AppError('dataCriacao inválida.', 400);
        }
    }

    if (items !== undefined) {
        validateItems(items);
    }

}

module.exports = {
    validateCreateOrder,
    validateUpdateOrder
};