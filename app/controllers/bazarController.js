const pool = require("../../config/pool_conexoes");
const { body, validationResult } = require("express-validator");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");

const bazarController = {
    submitBazar: async (req, res) => {
        const userId = req.session.autenticado.id;
        const user = await models.findUserById(userId);
        const bazar = await produtosModels.findBazarByUserId(userId);
        const { Nome, Ano, Descricao, Titulo, Biografia } = req.body;

        await pool.query("INSERT INTO bazar (nome, ano, descricao, titulo, biografia, id_Cliente) VALUES (?, ?, ?, ?, ?, ?) ", [Nome, Ano, Descricao, Titulo, Biografia, userId]);

        res.redirect('/perfil');
    },


    // verificarBazar: async (req,res) => {
    //       const userId = req.session.autenticado.id;
    //       const bazar = await produtosModels.findBazarByUserId(userId);
    //   },


    dadosBazar: async (req, res) => {
    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    try {
        const idBazar = await produtosModels.findBazarById()
        const produtoBazar = await produtosModels.mostrarProdutosBazar(req.session.autenticado.id, idBazar)
        const jsonResult = {
          listaProdBazar: produtoBazar,
        }
      let campos = {
        Nome: bazar.nome,
        Ano: bazar.ano,
        Descricao: bazar.descricao,
        Titulo: bazar.titulo,
        Biografia: bazar.biografia,
      };

      res.render("pages/adc-bazar", { listaErros: null, dadosNotificacao: null, valores: campos, Bazar: bazar, listaProdBazar: produtoBazar });
    } catch (e) {
      const idBazar = await produtosModels.findBazarById()
      const produtoBazar = await produtosModels.mostrarProdutosBazar(req.session.autenticado.id, idBazar)
      const jsonResult = {
        listaProdBazar: produtoBazar,
      }
      console.log(e);
      res.render("pages/adc-bazar",
        {
          Bazar: bazar,
          listaErros: null,
          dadosNotificacao: null,
          listaProdBazar: produtoBazar,
          valores: {
            Nome: "",
            Ano: "",
            Descricao: "",
            Titulo: "",
            Biografia: ""
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
          console.log(lista)
          return res.render("pages/adc-bazar", { listaErros: lista, dadosNotificacao: null, valores: req.body })
        }
        try {
          let { Nome, Ano, Descricao, Titulo, Biografia } = req.body
          var dadosForm = {
            nome: Nome,
            ano: Ano,
            descricao: Descricao,
            titulo: Titulo,
            biografia: Biografia,
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
              };
              console.log("Atualizado")
              res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Bazar! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "sucess" }, usuario: user, Bazar: bazar, valores: campos });
            } else {
              const userId = req.session.autenticado.id;
              const user = await models.findUserById(userId);
              const bazar = await produtosModels.findBazarByUserId(userId);
              console.log("Atualizado 2")
              res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Bazar! atualizado com sucesso", mensagem: "Sem Alterações", tipo: "sucess" }, usuario: user, Bazar: bazar, valores: dadosForm });
            }
          }
        } catch (e) {
          console.log(e)
          const userId = req.session.autenticado.id;
          const user = await models.findUserById(userId);
          const bazar = await produtosModels.findBazarByUserId(userId);
          res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Erro ao atualizar", mensagem: "Verifique os valores digitados!", tipo: "error" },usuario: user, Bazar: bazar, valores: req.body });
        }
    },

    //puxar produto pelo ID

  //   mostrarProdutosPerfil: async (req, res) => {
  //     try {
  //       const UserIdProd = req.session.autenticado.id;
  //       const produtoBazar = await produtosModels.chamarProdutosBazar(UserIdProd)
  //       const jsonResult = {
  //         listaProdBazar: produtoBazar,
  //       }
  //         res.render("./pages/adc-bazar", jsonResult)
  //     } catch (error) {
  //     }
  // },

  mostrarProdutosBazar: async (req, res) => {
    try {
      const idBazar = await produtosModels.findBazarById
      const produtoBazar = await produtosModels.mostrarProdutosBazar(req.session.autenticado.id, idBazar)
      const jsonResult = {
        listaProdBazar: produtoBazar,
      }
        res.render("./pages/adc-bazar", jsonResult)
    } catch (error) {
    }
},
    

}

module.exports = bazarController;