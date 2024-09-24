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

        res.render('pages/perfil', { erros: null, logado: true, usuarioautenticado: userId, usuario: user, Bazar: bazar });
    },


    // verificarBazar: async (req,res) => {
    //      const userId = req.session.autenticado.id;
    //      const bazar = await prodModels.findBazarByUserId(userId);
    //  }


    dadosBazar: async (req, res) => {
    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    try {
      let campos = {
        Nome: bazar.nome,
        Ano: bazar.ano,
        Descricao: bazar.descricao,
        Titulo: bazar.titulo,
        Biografia: bazar.biografia,
      };

      res.render("pages/adc-bazar", { listaErros: null, dadosNotificacao: null, valores: campos, Bazar: bazar });
    } catch (e) {
      console.log(e);
      res.render("pages/adc-bazar",
        {
          Bazar: bazar,
          listaErros: null,
          dadosNotificacao: null,
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
          return res.render("pages/Config/meusdados", { listaErros: lista, dadosNotificacao: null, valores: req.body })
        }
        try {
          let { nome, email, cep, nasc, senha } = req.body
          var dadosForm = {
            nome: nome,
            email: email,
            cep: cep,
            nasc: nasc,
          };
    
          if (senha != "") {
            const salt = bcrypt.genSaltSync(10);
            dadosForm.senha = bcrypt.hashSync(req.body.senha, salt);
          }
    
          let resultUpdate = await models.update(dadosForm, req.session.autenticado.id);
    
          if (!resultUpdate.isEmpty) {
            if (resultUpdate.changedRows == 1) {
              var user = await models.findUserById(req.session.autenticado.id);
              const data = new Date(user.nasc)
              const dataFormatada = data.toISOString().split('T')[0];
              var autenticado = {
                autenticado: user.nome,
                id: user.id_Cliente,
              };
              req.session.autenticado = autenticado;
              let campos = {
                nome: user.nome,
                cpf: user.cpf,
                nasc: user.nasc,
                cep: user.cep,
                email: user.email,
                nasc: dataFormatada,
                senha: ""  
              };
              console.log("Atualizado")
              res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "sucess" }, usuario: user, valores: campos });
            } else {
              console.log("Atualizado 2")
              res.render("pages/perfil", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem Alterações", tipo: "sucess" }, usuario: user, valores: dadosForm });
            }
          }
        } catch (e) {
          console.log(e)
          res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error" }, valores: req.body });
        }
    },
}

module.exports = bazarController;