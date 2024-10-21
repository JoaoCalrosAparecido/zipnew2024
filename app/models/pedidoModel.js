const pool = require("../../config/pool_conexoes");

const pedidoModel = {




    createPedido: async (pedido) => {
        try {

            const [linhas] = await pool.query('INSERT INTO pedidos(Id_Pedidos_Loji, Data_Pedido, id_Cliente, status_pedido, status_pagamento, id_pagamento) VALUES (? ,? , ?, ?, ?, ?) ', [pedido.id_pagamento, pedido.data, pedido.usuario_id_usuario, pedido.status_pedido, pedido.status_pagamento, pedido.id_pagamento ]);
            return linhas ;
        } catch (error) {
            return error;
        }
    },

    createItemPedido: async (pedido_items) => {
        try {
            console.log(pedido_items)
            //const [linhas] = await pool.query('INSERT INTO pedido_item(Id_prod_cliente, Id_Pedidos_Loji, quantidade) VALUES (?, ?, ?) ', [pedido_items ]);
            //return linhas ;


           var sql = "INSERT INTO `pedido_item`(`Id_prod_cliente`, `Id_Pedidos_Loji`, `quantidade`, `tituloprod`) VALUES ?";

        //var sql = "INSERT INTO pedido_item(Id_prod_cliente, Id_Pedidos_Loji, quantidade, tituloprod) VALUES ?";

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


   

    deleteItemPedido: async (delete_items) => {
        try {
            console.log(delete_items);
    
            var updateSql = "UPDATE produtos SET Stats = 'Vendido' WHERE Id_prod_cliente IN (?)";
            var values = delete_items;
    

            var deleteSql = "DELETE FROM Sacola WHERE Id_prod_cliente IN (?)";
            
            const [updateResult] = await pool.query(updateSql, [values]);
            const [deleteResult] = await pool.query(deleteSql, [values]);
    
            return { updateResult, deleteResult };
        } catch (error) {
            return error;
        } 
    },


    pedidoIdprod: async (userId, produtoId) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM `pedido_item` WHERE `id_Cliente` = ? AND id_prod_cliente = ?', [userId, produtoId]);

            return linhas;
        } catch (error) {
            return error;
        }
    },

    getPedidosByCliente: async (id_Cliente, callback) => {
        const query = `
            SELECT 
                pedido_item.tituloprod AS produto_comprado,
                cliente.nome AS vendedor_nome,
            FROM 
                pedidos
            JOIN 
                pedido_item ON pedidos.Id_Pedidos_Loji = pedido_item.Id_Pedidos_Loji
            JOIN 
                produtos ON pedido_item.Id_prod_cliente = produtos.Id_prod_cliente
            JOIN 
                cliente ON produtos.id_Cliente = cliente.id_Cliente
            WHERE 
                pedidos.id_Cliente = ?
        `;
        pool.query(query, [id_Cliente], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    },

}


module.exports = pedidoModel;