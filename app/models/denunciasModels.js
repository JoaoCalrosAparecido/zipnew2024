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

    denunciarVend: async (dadosDenunciaV) => {
        const query = 
            `INSERT INTO denuncias_vendedor
            (id_Cliente, id_Cliente_denunciado, fraude, produto_ilicito, propaganda_enganosa, data_denuncia)
            VALUES (?, ?, ?, ?, ?, NOW())`
        ;
    
        const values = [
            dadosDenunciaV.id_Cliente,
            dadosDenunciaV.id_Cliente_denunciado,
            dadosDenunciaV.fraude,
            dadosDenunciaV.produto_ilicito,
            dadosDenunciaV.propaganda_enganosa,
        ];
    
        return await pool.query(query, values);
    },
}

module.exports = denunciasModels