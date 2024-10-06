const pool = require("../../config/pool_conexoes");
const { body, validationResult } = require("express-validator");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");
/* 
const moment = require("moment"); // Certifique-se de ter isso importado
const pedidoModel = require("../models/pedidoModel"); // Certifique-se de ter esse import
*/

const pedidoControler = {
  gravarPedido: async (req, res) => {
    try {
      const pedidos = req.session.pedidos;
      const camposJsonPedido = {
        data: moment().format("YYYY-MM-DD HH:mm:ss"),
        usuario_id_usuario: req.session.autenticado.id,
        status_pedido: 1,
        status_pagamento: req.query.status,
        id_pagamento: req.query.payment_id
      };
      var create = await pedidoModel.createPedido(camposJsonPedido);
      await Promise.all(pedidos.map(async element => {
        const camposJsonItemPedido = {
          pedido_id_pedido: create.insertId,
          hq_id_hq: element.codproduto,
          quantidade: element.qtde
        };
        await pedidoModel.createItemPedido(camposJsonItemPedido);
      }));
      req.session.pedidos = [];
      res.redirect("/");
    } catch (e) {
      console.log(e);
      res.status(500).send("Erro ao gravar o pedido.");
    }
  }
};

module.exports = pedidoControler;
