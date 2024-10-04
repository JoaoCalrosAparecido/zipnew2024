const pool = require("../../config/pool_conexoes");

const denunciasModels = {
    denunciarProd: async (dadosDenuncia) => {
        const query = 
            `INSERT INTO denuncias_produto 
            (id_prod_cliente, id_Cliente, repetido, fora_tema, ma_qualidade, data_denuncia)
            VALUES (?, ?, ?, ?, ?, NOW())`
        ;
    
        const values = [
            dadosDenuncia.id_prod_cliente,
            dadosDenuncia.id_Cliente,
            dadosDenuncia.repetido,
            dadosDenuncia.fora_tema,
            dadosDenuncia.ma_qualidade,
        ];
    
        return await pool.query(query, values);
    },
    

    denunciarVend: async (denunciaVForm) => {
        const [campos] = await pool.query('INSERT INTO denuncias_vendedor SET ?', [denunciaVForm]);
        return campos;
    },
}

module.exports = denunciasModels