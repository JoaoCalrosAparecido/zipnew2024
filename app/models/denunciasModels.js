const pool = require("../../config/pool_conexoes");

const denunciasModels = {
    denunciarProd: async (denunciaPForm) => {
        const [campos] = await pool.query('INSERT INTO denuncias_produto SET ?', [denunciaPForm]);
        return campos;
    },

    denunciarVend: async (denunciaVForm) => {
        const [campos] = await pool.query('INSERT INTO denuncias_vendedor SET ?', [denunciaVForm]);
        return campos;
    },
};

module.exports = denunciasModels