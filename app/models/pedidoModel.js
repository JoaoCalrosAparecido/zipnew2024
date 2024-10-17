const pool = require("../../config/pool_conexoes");

const pedidoModel = {




    createPedido: async (pedido) => {
        try {

            const [linhas] = await pool.query('INSERT INTO `pedidos`(`Id_Pedidos_Loji`, `Data_Pedido`, `id_Cliente`, `status_pedido`, `status_pagamento`, `id_pagamento`) VALUES (? ,? , ?, ?, ?, ?) ', [pedido.id_pagamento, pedido.data, pedido.usuario_id_usuario, pedido.status_pedido, pedido.status_pagamento, pedido.id_pagamento ]);
            return linhas ;
        } catch (error) {
            return error;
        }
    },

    createItemPedido: async (pedido_items) => {
        try {
            console.log(pedido_items)
            //const [linhas] = await pool.query('INSERT INTO `pedido_item`(`Id_prod_cliente`, `Id_Pedidos_Loji`, `quantidade`) VALUES (?, ?, ?) ', [pedido_items ]);
            //return linhas ;

            var sql = "INSERT INTO `pedido_item`(`Id_prod_cliente`, `Id_Pedidos_Loji`, `quantidade`) VALUES ?";
            var values = pedido_items;

            const [linhas] =  await pool.query(sql, [values],function(err) {
                if (err) throw err;
                pool.end();
            });
            return linhas ;
        } catch (error) {
            return error;
        }
    },

<<<<<<< Updated upstream
    pedidoIdprod: async (prodId) => {
        try {

            const [linhas] = await pool.query('SELECT * FROM `produtos` WHERE id_prod_cliente = ?', [prodId]);
=======
    deleteItemPedido: async (delete_items) => {
        try {
            console.log(delete_items)
            //const [linhas] = await pool.query('INSERT INTO `pedido_item`(`Id_prod_cliente`, `Id_Pedidos_Loji`, `quantidade`) VALUES (?, ?, ?) ', [pedido_items ]);
            //return linhas ;

            var sql = "DELETE FROM produtos WHERE Id_prod_cliente IN (?)";
            var values = delete_items; // Certifique-se de que delete_items é um array


            const [linhas] =  await pool.query(sql, [values],function(err) {
                if (err) throw err;
                pool.end();
            });
>>>>>>> Stashed changes
            return linhas ;
        } catch (error) {
            return error;
        }
<<<<<<< Updated upstream
    },
=======
    }
>>>>>>> Stashed changes
};

module.exports = pedidoModel;