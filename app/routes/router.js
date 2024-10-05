const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers");
const { validationResult } = require("express-validator");
const connection = require("../../config/pool_conexoes")
const bcrypt = require("bcrypt");
const { verificarUsuAutorizado, limparSessao, verificarUsuAutenticado } = require("../auth/autentico");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");

const bazarController = require("../controllers/bazarController");
const denunciaController = require("../controllers/denunciaController");
const multer = require('multer');
const upload = multer({ dest: './app/public/IMG/uploads/' });
const denunciasModels = require("../models/denunciasModels");

// SDK do Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { pedidoController } = require("../controllers/pedidoControler");
// Adicione as credenciais
const client = new MercadoPagoConfig({
accessToken: process.env.accessToken
});



router.get("/", verificarUsuAutenticado, function (req, res) {
  if (req.session.autenticado && req.session.autenticado.id) {
    res.render('pages/index', { logado: true, usuarioautenticado: req.session.autenticado.id });
  } else {
    res.render('pages/index', { logado: false, usuarioautenticado: null });
  }
});

router.get("/bazar", bazarController.getBazaarsWithProducts, function (req, res) {

});


router.get("/cadastro", function (req, res) {
  res.render('pages/cadastro',
    { erros: null, dadosform: { nome: '', cpf: '', dia: '', mes: '', ano: '', email: '', senha: '', confirmsenha: '', cep: '' }, logado: false, usuarioautenticado: req.session.userid });
});

router.get("/login_do_usuario", verificarUsuAutenticado, async function (req, res) {
  if (req.session.autenticado && req.session.autenticado.id != null) {
    return res.redirect("/perfil")
  }
  res.render('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: req.session.userid });
});

router.get("/perfil",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    const user = await models.findUserById(req.session.autenticado.id);

    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    res.render('pages/perfil', { usuario: user, Bazar: bazar });
  }
);

router.post("/socialmedia",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1]),
  async function (req, res) {
    const { socialLinks } = req.body;
    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    await connection.query("UPDATE cliente SET Url_site = ? WHERE id_Cliente = ?;", [socialLinks, userId]);
    const user = await models.findUserById(userId);
    res.render('pages/perfil', { erros: null, logado: true, usuarioautenticado: userId, usuario: user, Bazar:bazar });
  }
);

router.get("/bolsa_preta_classica", function (req, res) {
  res.render('pages/bolsa_preta_classica', { msg: 'Back-end funcionando' });
});

router.get("/cart",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  function (req, res) {
    res.render('pages/cart', { msg: 'Back-end funcionando' });
  });



router.post("/create-preference", function (req, res) {
const preference = new Preference(client);
console.log(req.body.items);
preference.create({
body: {
items: req.body.items,




back_urls: {
"success": process.env.URL_BASE + "/feedback",
"failure": process.env.URL_BASE + "/feedback",
"pending": process.env.URL_BASE + "/feedback"
},
auto_return: "approved",
}
})
.then((value) => {
res.json(value)
})
.catch(console.log)
});
router.get("/feedback", function (req, res) {
pedidoController.gravarPedido(req, res);
});


router.get('/pedidos', (req, res) => {
    const pedidos = req.session.pedidos || []; // ou outra forma de obter os pedidos
    res.render('pages/cart', { pedidos: pedidos });
});


// Exporta o router
module.exports = router;



router.get("/pagamento",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  function (req, res) {
    res.render('pages/pagamento', { msg: 'Back-end funcionando' });
  });

router.get("/masculino", async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('masculino')

  res.render('pages/masculino', { produtos, msg: 'Back-end funcionando' });
});

router.get("/feminino", async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('feminino')

  res.render('pages/feminino', { produtos, msg: 'Back-end funcionando' });
});

router.get("/infantil", async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('infantil')

  res.render('pages/infantil', { produtos, msg: 'Back-end funcionando' });
});

router.get("/acessorios", async function (req, res) {
  const produtos = await produtosModels.findAllProductByCategoryName('acessorios')

  res.render('pages/acessorios', { produtos, msg: 'Back-end funcionando' });
});

router.get("/vender", function (req, res) {
  res.render('pages/vender', { msg: 'Back-end funcionando' });
});

router.get('/produtos/:id_prod_cliente',
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async (req, res) => {
    try {
      const produtoId = parseInt(req.params.id_prod_cliente);
      const [produtos] = await connection.query('SELECT * FROM `produtos` WHERE id_prod_cliente = ?', [produtoId]);
      if (produtos.length > 0) {
        res.render('pages/produtos', { usuarioautenticado: req.session.autenticado, produto: produtos[0] });
      } 
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao buscar o produto');
    }
  }
);
router.get("/meusdados",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    controller.mostrarPerfil(req, res)
  });

router.post("/atualizardados",
  controller.regrasValidacaoperfil,
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    controller.gravarPerfil(req, res)
  });

router.get("/wishlist",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  function (req, res) {
    res.render('pages/wishlist', { msg: 'Back-end funcionando' });
  });

  router.post('/addFav', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    try {
     /* const idProd = parseInt(req.body.idProd);*/
      const date = new Date();

      const idProd = req.body.idProd; // Captura o valor do input
      const [id, titulo, preco, img1] = idProd.split(',');

      console.log('ID do produto:', id);
      console.log('Título do produto:', titulo);
      console.log('Preço do produto:', preco);
      console.log('Imagem do produto:', img1);
  
      const dataFav = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      


      const results = await connection.query(
        'INSERT INTO `Favoritos` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)',
        [id, dataFav, req.session.autenticado.id, titulo, preco, img1]
      );
      console.log('Favoritado');

      res.redirect('/wishlist');
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar favorito'); // Opcional: resposta de erro
    }
  }
);

router.delete('/removeFav', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    try {
      const idProd = req.body.idProd; // Captura o valor do input (ID do produto a ser removido)
      console.log('ID do produto a ser removido:', idProd);

      const results = await connection.query(
        'DELETE FROM `Favoritos` WHERE id_prod_cliente = ? AND id_Cliente = ?',
        [idProd, req.session.autenticado.id]
      );
      
      if (results.affectedRows > 0) {
        console.log('Produto removido dos favoritos');
        res.status(200).send('Produto removido dos favoritos'); // Sucesso
      } else {
        res.status(404).send('Produto não encontrado nos favoritos'); // Produto não encontrado
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao remover favorito'); // Opcional: resposta de erro
    }
  }
);

router.post('/addCart', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    try {
     /* const idProd = parseInt(req.body.idProd);*/
      const date = new Date();

      const idProd = req.body.idProd; // Captura o valor do input
      const [id, titulo, preco, img1] = idProd.split(',');

      console.log('ID do produto:', id);
      console.log('Título do produto:', titulo);
      console.log('Preço do produto:', preco);
      console.log('Imagem do produto:', img1);
  
      const dataFav = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      


      const results = await connection.query(
        'INSERT INTO `Sacola` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)',
        [id, dataFav, req.session.autenticado.id, titulo, preco, img1]
      );
      console.log('Favoritado');

      res.redirect('/cart');
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar cart'); // Opcional: resposta de erro
    }
  }
);


router.get("/adc-produto",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2]),
  async function (req, res) {
    const user = await models.findUserById(req.session.autenticado.id)
    console.log(user)
    res.render('pages/adc-produto', { usuario: user, erros: null, usuarioautenticado: req.session.autenticado })
  });

// [, ]
router.post("/adicionar-produto",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  upload.fields([{ name: 'img1' }, { name: 'img2' }, { name: 'img3' }, { name: 'img4' }]),
  controller.regrasValidacaoAdcProduto,
  async function (req, res) {
    const user = await models.findUserById(req.session.autenticado.id)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors)
      return res.render('pages/adc-produto', { msg: 'Back-end funcionando', usuario: user, erros: errors });
    }


    const { cateProduto, tituloProduto, precoProduto, descProduto } = req.body;

    const userBazar = await produtosModels.findBazarByUserId(req.session.autenticado.id)

    const dadosProduto = {
      tituloprod: tituloProduto,
      preçoprod: precoProduto,
      descProduto: descProduto,
      cateProduto: cateProduto,
      Id_Bazar: userBazar ? userBazar.Id_Bazar : null,
      id_Cliente: req.session.autenticado.id,
      img1: req.files.img1[0].filename,
      img2: req.files.img2[0].filename,
      img3: req.files.img3[0].filename,
      img4: req.files.img4[0].filename,
    }

    const createProd = await produtosModels.createProd(dadosProduto)
    console.log(createProd)
    if (cateProduto == "feminino") {
      res.redirect("/feminino")
    } else if (cateProduto == "masculino") {
      res.redirect("/masculino")
    } else if (cateProduto == "infantil") {
      res.redirect("/infantil")
    } else if (cateProduto == "acessorios") {
      res.redirect("/acessorios")
    }
  });

router.post("/sign/register", controller.regrasValidacaocadastro, async function (req, res) {
  const erros = validationResult(req);

  console.log(erros);

  if (!erros.isEmpty()) {
    return res.render('pages/cadastro', {
      erros: erros, dadosform: {
        nome: req.body.nome,
        cpf: req.body.cpf,
        dia: req.body.dia,
        mes: req.body.mes,
        ano: req.body.ano,
        email: req.body.email,
        senha: req.body.senha,
        confirmsenha: req.body.confirmsenha,
        cep: req.body.cep
      },
      logado: false
    });
  }

  try {
    const { nome, cpf, dia, mes, ano, email, senha, confirmsenha, cep } = req.body;

    const nasc = `${ano}-${mes}-${dia}`

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(senha, salt);
    const hashPassword = bcrypt.hashSync(confirmsenha, salt);

    const create = await connection.query("INSERT INTO cliente (nome, cpf, nasc, email, senha, confirmsenha, cep, Id_Tipo_Usuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nome, cpf, nasc, email, hashedPassword, hashPassword, cep, 1]);
    console.log(create)
    const usuario = await connection.query("SELECT * FROM cliente WHERE id_Cliente = ?", [create.insertId]);
    req.session.autenticado = {
      autenticado: usuario[0].nome,
      id: usuario[0].id_Cliente,
      tipo: usuario[0].Id_Tipo_Usuario
    }

    res.render('pages/login_do_usuario', { erros: null, dadosform: { email: req.body.email, senha: req.body.senha }, logado: true, usuarioautenticado: req.session.userid })
  } catch (error) {
    console.log(error)
  }
});

router.post("/sign/login", controller.regrasValidacaolog, async function (req, res) {
  const erros = validationResult(req);

  if (!erros.isEmpty()) {
    console.log(erros);
    return res.render('pages/login_do_usuario', { erros: erros, dadosform: { email: req.body.email, senha: req.body.senha }, logado: false, usuarioautenticado: req.session.userid });
  }

  try {
    const { email } = req.body;
    const [user] = await connection.query("SELECT * FROM cliente WHERE email = ?", [email]);
    req.session.autenticado = { autenticado: user[0].nome, id: user[0].id_Cliente, tipo: user[0].Id_Tipo_Usuario }
    if (req.session.autenticado.tipo == 3) {
      res.redirect("/adm");
    }
    res.redirect("/perfil");

  } catch (error) {
    console.log("erro:" + error)
  }
});

router.get('/sair', limparSessao, function (req, res) {
  res.redirect('/');
});

router.post("/update", controller.regrasValidacaocadastro, function (req, res) {

});

router.post("/delete", function (req, res) {

});

router.get("/adc-bazar",

  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
    erros: null,
    dadosform: { email: "", senha: "" },
    logado: false,
    usuarioautenticado: null
  },
    [2, 3]
  ), async function (req, res) {
    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    if (bazar){
      bazarController.dadosBazar(req,res)
    }else{
      res.render('pages/adc-bazar.ejs' , { Bazar: bazar });
    }
  })


  router.post("/bazarAdc", 
    verificarUsuAutenticado,
    verificarUsuAutorizado(
        "./pages/login_do_usuario", {
            erros: null,
            dadosform: { email: "", senha: "" },
            logado: false,
            usuarioautenticado: null
        }, [2, 3]
    ), 
    upload.single('imgBazar'),
    function (req, res) {
        bazarController.submitBazar(req, res);
    }
);

router.post("/attBazar", 
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
      erros: null,
      dadosform: { email: "", senha: "" },
      logado: false,
      usuarioautenticado: null
    },
    [2, 3]
  ), 
  upload.single('imgBazar'),
  function (req, res) {
    bazarController.alterarBazar(req, res);
  }
);

router.post("/denunciar-produto/:id_prod_cliente",
  verificarUsuAutenticado, 
  verificarUsuAutorizado(   
    "./pages/login_do_usuario", {
      erros: null,
      dadosform: { email: "", senha: "" },
      logado: false,
      usuarioautenticado: null
    },
    [1, 2, 3] 
  ), 
  function (req, res) {
    denunciaController.denunciarP(req, res);
  }
);

router.post("/denunciar-vendedor/:id_prod_cliente",
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
      erros: null,
      dadosform: { email: "", senha: "" },
      logado: false,
      usuarioautenticado: null
    },
    [1, 2, 3]
  ), 
  function (req, res) {
    denunciaController.denunciarV(req, res);
  }
)

module.exports = router;