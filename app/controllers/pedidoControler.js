const pool = require("../../config/pool_conexoes");
const { body, validationResult } = require("express-validator");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");
const moment = require("moment"); // Certifique-se de ter isso importado
const pedidoModel = require("../models/pedidoModel"); // Certifique-se de ter esse import
const cartModels = require("../models/cartModels");


const pedidoControler = {
  gravarPedido: async (req, res) => {
    try {
      const userId = req.session.autenticado.id;
      const pedidos = await cartModels.findAllProductByUserId(userId);
      const camposJsonPedido = {
        data: moment().format("YYYY-MM-DD HH:mm:ss"),
        usuario_id_usuario: userId,
        status_pedido: 1,
        status_pagamento: req.query.status,
        id_pagamento: req.query.payment_id
      };

      await pedidoModel.createPedido(camposJsonPedido);
      
        const listtaDePedidos =  pedidos.map((element) => {
          return [ element.Id_prod_cliente, req.query.payment_id, 1, element.tituloprod]
        });
        
        await pedidoModel.createItemPedido(listtaDePedidos);

        
      req.session.pedidos = [];
      res.redirect("/");
      const listaIdProd = pedidos.map((element) => {
        return [ element.Id_prod_cliente]
        });

        await pedidoModel.deleteItemPedido(listaIdProd);
    } catch (e) {
      console.log(e);
      res.status(500).send("Erro ao gravar o pedido.");
    }
  },

  listarPedidos: async (req, res) => {
    const id_Cliente = req.session.autenticado.id;

    pedidoModel.getPedidosByCliente(id_Cliente, (err, pedidos) => {
        if (err) {
            return res.status(500).send('Erro ao buscar os pedidos');
        }
        res.render("/meus-pedidos", { pedidos });
    });
}
};

module.exports = pedidoControler;