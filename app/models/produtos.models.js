const pool = require("../../config/pool_conexoes");

const models = {
    findAllProductByCategoryName: async (name) => {
        try {
            console.log(name)
            const [linhas] = await pool.query('SELECT * FROM `produtos` WHERE `cateProduto` = ?', [name]);
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findProducts: async () => {
        try {
            const [linhas] = await pool.query('SELECT * FROM `produtos`');
            return linhas;
        } catch (error) {
            return error;
        }
    },

    findProdById: async (produtoId) => {
        try {
            const [linhas] = await pool.query('SELECT * FROM `produtos` WHERE id_prod_cliente = ?', [produtoId]);
            return linhas
        } catch (err) {
            console.log(err);
        }
    },

    create: async (dadosForm) => {
        try {
            console.log(dadosForm)
            const [linhas] = await pool.query('INSERT INTO produtos SET ?', [dadosForm]);
            return linhas;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
};

module.exports = models;