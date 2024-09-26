const pool = require("../../config/pool_conexoes");

const prodModels = {
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

    createProd: async (dadosForm) => {
        try {
            const [linhas] = await pool.query('INSERT INTO produtos SET ?', [dadosForm]);
            return linhas;
        } catch (error) {
            console.log(error);
            return error;
        }
    },
    findBazarByUserId: async (UserId) => {
        try {
            const [linhas] = await pool.query("SELECT * FROM bazar WHERE id_Cliente = ?", [UserId])
            return linhas[0]
        } catch (error) {
            return error
        }
    },

    mostrarProdutosPerfil: async (UserIdProd) => {
        const [resultados] = await pool.query("SELECT * FROM produtos WHERE id_Cliente = ?", [UserIdProd])
        return resultados
    },

    mostrarProdutosBazar: async (userId, idBazar) => {
         const [resultados] = await pool.query("SELECT * FROM produtos WHERE id_Cliente = ? AND Id_Bazar = ?", [userId, idBazar])
    return resultados;
    },


    // pegar todos os bazares com seus produtos
    findAllBazaarsWithProducts: async () => {
        try {
            const [result] = await pool.query(`
                SELECT bazar.*, produtos.tituloprod, produtos.preçoprod
                FROM bazar
                LEFT JOIN produtos ON bazar.Id_Bazar = produtos.Id_Bazar
            `);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    

};

module.exports = prodModels;