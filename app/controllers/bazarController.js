const pool = require("../../config/pool_conexoes");
const { body, validationResult } = require("express-validator");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");

const bazarController = {
  submitBazar: async (req, res) => {
    const userId = req.session.autenticado.id;
    const { Nome, Ano, Descricao, Titulo, Biografia } = req.body;

    let bazar = await produtosModels.findBazarByUserId(userId);

    if (!bazar) {
        const imgBazar = req.file ? req.file.filename : null;

        await pool.query(
            "INSERT INTO bazar (nome, ano, descricao, titulo, biografia, imgBazar, id_Cliente) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [Nome, Ano, Descricao, Titulo, Biografia, imgBazar, userId]
        );
        
        bazar = await produtosModels.findBazarByUserId(userId);
    }

    // atualiza os produtos com o id do bazar :)
    await pool.query(
        "UPDATE produtos SET id_Bazar = ? WHERE id_Cliente = ? AND id_Bazar IS NULL",
        [bazar.Id_Bazar, userId]
    );

    res.redirect('/perfil');
},


    // verificarBazar: async (req,res) => {
    //       const userId = req.session.autenticado.id;
    //       const bazar = await produtosModels.findBazarByUserId(userId);
    //   },


    dadosBazar: async (req, res) => {
      const UserId = req.session.autenticado.id;
      const bazar = await produtosModels.findBazarByUserId(UserId);
      
      try {
          const produtoBazar = await produtosModels.mostrarProdutosBazar(UserId, bazar.Id_Bazar);
          
          let campos = {
              Nome: bazar.nome,
              Ano: bazar.ano,
              Descricao: bazar.descricao,
              Titulo: bazar.titulo,
              Biografia: bazar.biografia,
              imgBazar: bazar.imgBazar
          };

          res.render("pages/adc-bazar", { 
              listaErros: null, 
              dadosNotificacao: null,
              valores: campos, 
              Bazar: bazar, 
              listaProdBazar: produtoBazar 
          });

      } catch (e) {
          console.log(e);
          res.render("pages/adc-bazar", {
              Bazar: bazar,
              listaErros: null,
              dadosNotificacao: null,
              listaProdBazar: [],
              valores: {
                  Nome: "",
                  Ano: "",
                  Descricao: "",
                  Titulo: "",
                  Biografia: "",
                  imgBazar: "",
              }
          });
      }
  },

  alterarBazar: async (req, res) => {
      const erros = validationResult(req);
      const erroMulter = req.session.erroMulter;
      
      if (!erros.isEmpty() || erroMulter != null) {
          lista = !erros.isEmpty() ? erros : { formatter: null, errors: [] };
          if (erroMulter != null) {
              lista.errors.push(erroMulter);
          }
          console.log(lista);
          return res.render("pages/adc-bazar", { listaErros: lista, dadosNotificacao: null, valores: req.body });
      }

      try {
          let { Nome, Ano, Descricao, Titulo, Biografia } = req.body;
          const imgBazarPath = req.file ? req.file.filename : null; // caminho da imagem
          
          var dadosForm = {
              nome: Nome,
              ano: Ano,
              descricao: Descricao,
              titulo: Titulo,
              biografia: Biografia,
              imgBazar: imgBazarPath
          };

          let resultUpdate = await models.att(dadosForm, req.session.autenticado.id);

          if (!resultUpdate.isEmpty) {
              if (resultUpdate.changedRows == 1) {
                var userr = await models.findUserById(req.session.autenticado.id);
                const user = await models.findUserById(userId);
                const userId = req.session.autenticado.id;
                const bazar = await produtosModels.findBazarByUserId(userId);
                var autenticado = {
                  autenticado: userr.nome,
                  id: userr.id_Cliente,
                };
                  req.session.autenticado = autenticado;
                  let campos = { 
                      Nome: bazar.nome,
                      Ano: bazar.ano,
                      Descricao: bazar.descricao,
                      Titulo: bazar.titulo,
                      Biografia: bazar.biografia,
                      imgBazar: bazar.imgBazar
                  };
                  console.log("Atualizado");
                  return res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Bazar! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "success" }, usuario: user, Bazar: bazar, valores: campos });
              } else {
                  const userId = req.session.autenticado.id;
                  const user = await models.findUserById(userId);
                  const bazar = await produtosModels.findBazarByUserId(userId);
                  console.log("Atualizado 2");
                  return res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Bazar! atualizado com sucesso", mensagem: "Sem Alterações", tipo: "success" }, usuario: user, Bazar: bazar, valores: dadosForm });
              }
          }
      } catch (e) {
          console.log(e);
          const userId = req.session.autenticado.id;
          const user = await models.findUserById(userId);
          const bazar = await produtosModels.findBazarByUserId(userId);
          return res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Erro ao atualizar", mensagem: "Verifique os valores digitados!", tipo: "error" }, usuario: user, Bazar: bazar, valores: req.body });
      }
  },


    //puxar produto pelo ID

    mostrarProdutosPerfil: async (req, res) => {
      try {
        const UserIdProd = req.session.autenticado.id;
        const produtoBazar = await produtosModels.chamarProdutosBazar(UserIdProd)
        const jsonResult = {
          listaProdBazar: produtoBazar,
        }
          res.render("./pages/adc-bazar", jsonResult)
      } catch (error) {
      }
  },

// mostrarProdutosBazar: async (req, res) => {
//       const userId = req.session.autenticado.id;
//       const idBazar = await produtosModels.findBazarByUserId(userId);
//       const produtoBazar = await produtosModels.mostrarProdutosBazar(userId, idBazar);
//       const jsonResult = {
//           listaProdBazar: produtoBazar,
//       };
          
//       res.render("./pages/adc-bazar", jsonResult);
// },


getBazaarsWithProducts: async (req, res) => {
  try {
      const bazaarList = await produtosModels.findAllBazaarsWithProducts();

      let groupedBazaars = bazaarList.reduce((accumulator, currentItem) => {
          const { Id_Bazar, nome, ano, descricao, titulo, biografia, imgBazar, tituloprod, preçoprod, img1, id_prod_cliente } = currentItem;

          if (!accumulator[Id_Bazar]) {
              accumulator[Id_Bazar] = {
                  nome,
                  ano,
                  descricao,
                  titulo,
                  biografia,
                  imgBazar,
                  produtos: []
              };
          }

          if (tituloprod) {
              accumulator[Id_Bazar].produtos.push({ tituloprod, preçoprod, img1, id_prod_cliente });
          }

          return accumulator;
      }, {});

      return res.render("pages/bazar", { bazaarList: groupedBazaars });
  } catch (error) {
      console.log(error);
      return res.render("pages/bazar", { bazaarList: [], errorList: error });
  }
}

    

}

module.exports = bazarController;