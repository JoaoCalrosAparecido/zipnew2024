const pool = require("../../config/pool_conexoes");
const bcrypt = require('bcrypt');
const { body, validationResult } = require("express-validator");

const controller = {
  regrasValidacaocadastro: [
    body('nome').trim().isAlpha('pt-BR', {ignore: ' '}).withMessage('*Nome Inválido'),
    body('cpf').custom(async value => {
      const [cpf] = await pool.query('SELECT * FROM cliente WHERE cpf = ?', [value]);
      if (cpf.length > 0) {
        throw new Error('*CPF em uso!');
      }
      // Validação do CPF
      let soma = 0;
      for (let i = 1; i <= 9; i++) {
        soma += parseInt(value.substring(i - 1, i)) * (11 - i);
      }
      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(value.substring(9, 10))) {
        throw new Error("*CPF inválido!");
      }
      soma = 0;
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(value.substring(i - 1, i)) * (12 - i);
      }
      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(value.substring(10, 11))) {
        throw new Error("*CPF inválido!");
      }
    }),
    body('dia').isNumeric({min: 1, max: 31}).withMessage('*Dia Inválido'),
    body('mes').isNumeric({min: 1, max: 12}).withMessage('*Mês Inválido'),
    body('ano').isNumeric({min: 1900, max: new Date().getFullYear()}).withMessage('*Ano Inválido'),
    body('email').isEmail().withMessage('*Email Inválido')
      .custom(async value => {
        const [email] = await pool.query('SELECT * FROM cliente WHERE email = ?', [value]);
        if (email.length > 0) {
          throw new Error('*Email em uso!');
        }
      }),
    body('senha').isStrongPassword().withMessage('*A senha é fraca'),
    body('confirmsenha').isStrongPassword().withMessage('*A senha é fraca e/ou é diferente'),
    body('cep').isNumeric({min: 8}).withMessage('*CEP Inválido')
  ],

  regrasValidacaolog: [
    body('email').isEmail().withMessage('*Email Inválido'),
    body('senha').isStrongPassword().withMessage('*Senha Inválida')
      .custom(async (senha, { req }) => {
        try {
          const [users] = await pool.query("SELECT * FROM cliente WHERE email = ?", [req.body.email]);
          if (users.length === 0) {
            throw new Error('Usuário não encontrado.');
          }
          const userSenha = users[0].senha;
          const senhaCorreta = await bcrypt.compare(senha, userSenha);
          if (!senhaCorreta) {
            throw new Error('Senha incorreta.');
          }

          return true;
        } catch (err) {
          console.error(err); // Log de erro para depuração
          throw new Error(err);
        }
      }),
  ],

  regrasValidacaoAdcProduto: [
    body('tituloProduto').isString().isLength({min: 3, max: 45}),
    body('precoProduto').isNumeric({min: 0.1}),
    body('descProduto').isString().isLength({ min: 25, max: 220 }),
  ],


regrasValidacaoperfil: [
  body('nome').trim().isAlpha('pt-BR', {ignore: ' '}).withMessage('*Nome Inválido'),
  body('cpf').custom(async value => {
    const [cpf] = await pool.query('SELECT * FROM cliente WHERE cpf = ?', [value]);
    if (cpf.length > 0) {
      throw new Error('*CPF em uso!');
    }
    // Validação do CPF
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(value.substring(i - 1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(value.substring(9, 10))) {
      throw new Error("*CPF inválido!");
    }
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(value.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(value.substring(10, 11))) {
      throw new Error("*CPF inválido!");
    }
  }),
  body('dia').isNumeric({min: 1, max: 31}).withMessage('*Dia Inválido'),
  body('mes').isNumeric({min: 1, max: 12}).withMessage('*Mês Inválido'),
  body('ano').isNumeric({min: 1900, max: new Date().getFullYear()}).withMessage('*Ano Inválido'),
  body('email').isEmail().withMessage('*Email Inválido')
    .custom(async value => {
      const [email] = await pool.query('SELECT * FROM cliente WHERE email = ?', [value]);
      if (email.length > 0) {
        throw new Error('*Email em uso!');
      }
    }),
  body('senha').isStrongPassword().withMessage('*A senha é fraca'),
  body('cep').isNumeric({min: 8}).withMessage('*CEP Inválido')
],


 mostrarPerfil: async (req, res) => {
    try {
        let results = await usuario.findId(req.session.autenticado.id);
        if (results[0].cep_usuario != null) {
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false,
            });
            const response = await fetch(`https://viacep.com.br/ws/${results[0].cep_usuario}/json/`, 
              { method: 'GET', headers: null, body: null, agent: httpsAgent, });
            var viaCep = await response.json();
            var cep = results[0].cep_usuario.slice(0,5) + "-" + results[0].cep_usuario.slice(5);
        } else {
            var viaCep = {logradouro:"", bairro:"", localidade:"", uf:""}
            var cep = null;
        }
        let campos = {
          nome: results[0].nome_usuario, 
          email: results[0].email_usuario,
          cep: cep,
          complemento: results[0].complemento_usuario, 
          logradouro: viaCep.logradouro, 
          localidade: viaCep.localidade, 
          uf: viaCep.uf,
          senha_usu: ""
        };

        res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: null, valores: campos });
    } catch (e) {
        console.log(e);
        res.render("pages/Config/meusdados", {
            listaErros: null, dadosNotificacao: null, valores: {
                nome_usu: "", email_usu: "", 
                senha_usu: "", cep: "", numero: "",
                logradouro: "", bairro: "", localidade: "", uf: ""
            }
        });
    }
},

gravarPerfil: async (req, res) => {

    const erros = validationResult(req);
    const erroMulter = req.session.erroMulter;
    if (!erros.isEmpty() || erroMulter != null) {
      lista = !erros.isEmpty() ? erros: {formatter: null, errors: []};
      if (erroMulter != null){
        lista.errors.push(erroMulter);
    }
    return res.render("pages/Config/meusdados", { listaErros: lista, dadosNotificacao: null, valores: req.body })
  }
  try {
    var dadosForm = {
      nome_usuario: req.body.nome,
      email_usuario: req.body.email,
      cep_usuario: req.body.cep.replace("-",""),
      numero_usuario: req.body.numero,
  };
  if (req.body.senha != "") {
    dadosForm.senha_usuario =  bcrypt.hashSync(req.body.senha, salt);
  }

  if (!req.file) {
    console.log("Falha no carregamento");
  } else {
    //Armazenando o caminho do arquivo salvo na pasta do projeto
    caminhoArquivo = "imagem/perfil/" + req.file.filename;
    //Se houve alteração de imagem de perfil apaga a imagem anterion
    if (dadosForm.img_perfil_pasta != caminhoArquivo ){ 
      removeImg(dadosForm.img_perfil_pasta);
    }
    dadosForm.img_perfil_pasta = caminhoArquivo;
    dadosForm.img_perfil_banco = null;
    ////Armazenando o buffer de dados binários do arquivo
    // dadosForm.img_perfil_banco req.file.buffer;
    ////Apagando a imagem armazenada na pasta
    // removeImg(dadosForm.img_perfil_pasta)
    // dadosForm.img_perfil_pasta = null;
    }
    let resultUpdate = await usuario.update(dadosForm, req.session.autenticado.id);
    if (!resultUpdate.isEmpty) {
      if (resultUpdate.changedRows == 1) {
        var result = await usuario.findId(req.session.autenticado.id);
        var autenticado = {
          autenticado: result[0].nome_usuario,
          id: result[0].id_usuario,
          tipo: result[0].id_tipo_usuario,
        };
        req.session.autenticado = autenticado;
        var campos = {
          nome_usu: result[0].nome_usuario, email_usu: result[0].email.usuario,
          nomeusu_usu: result[0].user_usuario, senha_usu: ""
        }
        res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Alterações Gravadas", tipo: "sucess"}, valores: campos });
      }else{
        res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: { titulo: "Perfil! atualizado com sucesso", mensagem: "Sem Alterações", tipo: "sucess"}, valores: dadosForm });
      }
    }
  } catch (e) {
    console.log(e)
    res.render("pages/Config/meusdados", { listaErros: null, dadosNotificacao: { titulo: "Erro ao atualizar o perfil!", mensagem: "Verifique os valores digitados!", tipo: "error"}, valores: req.body });
    }
  }
};

module.exports = controller;
