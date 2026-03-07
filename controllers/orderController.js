const prisma = require('../lib/prisma');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');

function mapOrderPayload(body) {
    return {
        orderId: body.numeroPedido.replace(/-01$/, ''),
        value: body.valorTotal,
        creationDate: new Date(body.dataCriacao),
        items: body.items.map((item) => ({
            productId: Number(item.idItem),
            quantity: Number(item.quantidadeItem),
            price: item.valorItem
        }))
    };
}

exports.createOrder = asyncHandler(async (req, res) => {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    if (!numeroPedido || !valorTotal || !dataCriacao || !Array.isArray(items) || !items.length) {
        throw new AppError('Dados do pedido inválidos.', 400);
    }

    const mapped = mapOrderPayload(req.body);

    const existingOrder = await prisma.order.findUnique({
        where: { orderId: mapped.orderId }
    });

    if (existingOrder) {
        throw new AppError('Pedido já existe.', 409);
    }

    const order = await prisma.order.create({
        data: {
            orderId: mapped.orderId,
            value: mapped.value,
            creationDate: mapped.creationDate,
            items: {
                create: mapped.items
            }
        },
        include: {
            items: true
        }
    });

    return res.status(201).json(order);
});

exports.getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
        where: { orderId: id },
        include: { items: true }
    });

    if (!order) {
        throw new AppError('Pedido não encontrado.', 404);
    }

    return res.status(200).json(order);
});

exports.listOrders = asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
        include: { items: true }
    });

    return res.status(200).json(orders);
});

exports.updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingOrder = await prisma.order.findUnique({
        where: { orderId: id }
    });

    if (!existingOrder) {
        throw new AppError('Pedido não encontrado.', 404);
    }

    const { valorTotal, dataCriacao, items } = req.body;

    await prisma.item.deleteMany({
        where: { orderId: id }
    });

    const updatedOrder = await prisma.order.update({
        where: { orderId: id },
        data: {
            value: valorTotal,
            creationDate: new Date(dataCriacao),
            items: {
                create: (items || []).map((item) => ({
                    productId: Number(item.idItem),
                    quantity: Number(item.quantidadeItem),
                    price: item.valorItem
                }))
            }
        },
        include: { items: true }
    });

    return res.status(200).json(updatedOrder);
});

exports.deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingOrder = await prisma.order.findUnique({
        where: { orderId: id }
    });

    if (!existingOrder) {
        throw new AppError('Pedido não encontrado.', 404);
    }

    await prisma.order.delete({
        where: { orderId: id }
    });

    return res.status(200).json({
        message: 'Pedido deletado com sucesso.'
    });
});