const sequelize = require('../config/database');
const Order = require('../models/Order');
const Item = require('../models/Item');

function mapOrderPayload(body){
    return {
        orderId: body.numeroPedido.replace(/-01$/, ''),
        value: body.valorTotal,
        creationDate: body.dataCriacao,
        items: body.items.map(item => ({
            productId: Number(item.idItem),
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };
}

exports.createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();
    console.log(transaction);
    try{
        const mapped = mapOrderPayload(req.body);
        const existingOrder = await Order.findByPk(mapped.orderId);

        if(existingOrder){
            await transaction.rollback();
            return res.status(409).json({message: 'Pedido já existe.'});
        }

        await Order.create({
            orderId: mapped.orderId,
            value: mapped.value,
            creationDate: mapped.creationDate
        }, {transaction});

        const itemsToCreate = mapped.items.map(item => ({
            orderId: mapped.orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        await Item.bulkCreate(itemsToCreate, { transaction });
        await transaction.commit();

        const createdOrder = await Order.findByPk(mapped.orderId, {
            include: [{ model: Item, as: 'items' }]
        });

        return res.status(201).json(createdOrder);
    } catch(error){
        await transaction.rollback();
        return res.status(500).json({message: 'Erro ao criar pedido. ', error: error.message});
    }
};

exports.getOrderById = async (req, res) => {
    try{
        const order = await Order.findByPk(req.params.id, {
            include: [{ model: Item, as: 'items' }]
        });

        if(!order){
            return res.status(404).json({message: 'Pedido não encontrado.'});
        }
        return res.status(200).json(order);
    }catch(error){
        return res.status(500).json({message: 'Erro ao listar pedidos. ', error: error.message});
    }
};

exports.listOrders = async (req, res) => {
    try{
        const orders = await Order.findAll({
            include: [{ model: Item, as: 'items' }]
        });

        return res.status(200).json(orders);
    }catch(error){
        return res.status(500).json({message: 'Erro ao listar pedidos. ', error: error.message});
    }
}

exports.updateOrder = async (req, res) => {
    const transaction = await sequelize.transaction();

    try{
        const orderId = req.params.id;
        const order = await Order.findByPk(orderId);

        if(!order){
            await transaction.rollback();
            return res.status(404).json({message: 'Pedido não encontrado.'});
        }

        const mapped = mapOrderPayload(req.body);

        await Order.update(
            {
                value: mapped.value,
                creationDate: mapped.creationDate
            },
            {
                where: { orderId },
                transaction
            }
        );

        await Item.destroy({
            where: { orderId },
            transaction
        });

        const itemsToCreate = mapped.items.map(item => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        await Item.bulkCreate(itemsToCreate, { transaction });
        await transaction.commit();

        const updatedOrder = await Order.findByPk(orderId, {
            include: [{ model: Item, as: 'items' }]
        });

        return res.status(201).json(updatedOrder);
    }catch(error){
        await transaction.rollbacl();
        return res.status(500).json({message: 'Erro ao atualizar pedido. ', error: error.message});
    }
};

exports.deleteOrder = async (req, res) => {
    const transaction = await sequelize.transaction();

    try{
        const orderId = req.params.id;
        const order = await Order.findByPk(orderId);

        if(!order){
            await transaction.rollback();
            return res.status(404).json({message: 'Pedido não encontrado.'});
        }

        await Item.destroy({
            where: { orderId },
            transaction
        });

        await Order.destroy({
            where: { orderId },
            transaction
        });

        await transaction.commit();

        return res.status(200).json({message: 'Pedido deletado com sucesso.'});
    }catch(error){
        await transaction.rollback();
        return res.status(500).json({message: 'Error ao deletar pedido. ', error: error.message});
    }
};