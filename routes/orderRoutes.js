const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numeroPedido
 *               - valorTotal
 *               - dataCriacao
 *               - items
 *             properties:
 *               numeroPedido:
 *                 type: string
 *                 example: v10089015vdb-01
 *               valorTotal:
 *                 type: number
 *                 example: 10000
 *               dataCriacao:
 *                 type: string
 *                 example: 2023-07-19T12:24:11.5299601+00:00
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - idItem
 *                     - quantidadeItem
 *                     - valorItem
 *                   properties:
 *                     idItem:
 *                       type: string
 *                       example: "2434"
 *                     quantidadeItem:
 *                       type: integer
 *                       example: 1
 *                     valorItem:
 *                       type: number
 *                       example: 1000
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados do pedido inválidos
 *       401:
 *         description: Token não informado ou inválido
 *       409:
 *         description: Pedido já existe
 *       500:
 *         description: Erro interno no servidor
 */
router.post('/', orderController.createOrder);

/**
 * @swagger
 * /order/list:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/list', orderController.listOrders);

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Busca um pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get('/:id', orderController.getOrderById);

/**
 * @swagger
 * /order/{id}:
 *   put:
 *     summary: Atualiza um pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valorTotal:
 *                 type: number
 *                 example: 15000
 *               dataCriacao:
 *                 type: string
 *                 example: 2023-07-19T12:24:11.5299601+00:00
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     idItem:
 *                       type: string
 *                       example: "2434"
 *                     quantidadeItem:
 *                       type: integer
 *                       example: 2
 *                     valorItem:
 *                       type: number
 *                       example: 2000
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.put('/:id', orderController.updateOrder);

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: v10089015vdb
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       401:
 *         description: Token não informado ou inválido
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.delete('/:id', orderController.deleteOrder);

module.exports = router;