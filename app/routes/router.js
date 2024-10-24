const express = require("express");
const router = express.Router();
const controller = require("../controllers/controllers");
const { validationResult } = require("express-validator");
const connection = require("../../config/pool_conexoes")
const bcrypt = require("bcrypt");
const { verificarUsuAutorizado, limparSessao, verificarUsuAutenticado } = require("../auth/autentico");
const models = require("../models/models");
const produtosModels = require("../models/produtos.models");


//sacola
const cartModels = require('../models/cartModels')

// PEDIDO
const pedidoControler = require("../controllers/pedidoControler")
const pedidoModel = require("../models/pedidoModel")
//MINHAS VENDAS
const minhasvendasModels = require('../models/minhasvendasModels') 

//Upload
const upl = require("../multer/upload")
const del = require("../multer/imgdelete")

var uplImg = upl("./app/public/IMG/uploads/")

const bazarController = require("../controllers/bazarController");
const denunciaController = require("../controllers/denunciaController");
const multer = require('multer');
const upload = multer({ dest: './app/public/IMG/uploads/' });
const denunciasModels = require("../models/denunciasModels");

// SDK do Mercado Pago
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { pedidoController } = require("../controllers/pedidoControler");
const prodModels = require("../models/produtos.models");
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
    const quantidadeVendas = await pedidoModel.contarVendasPorCliente(userId);

    const bazar = await produtosModels.findBazarByUserId(userId);
    res.render('pages/perfil', { usuario: user, Bazar: bazar, quantidadeVendas, dadosNotificacao: null, listaErros: null });
  }
);

router.post("/socialmedia",
  controller.regrasValidaçãoURL,
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1]),
  async function (req, res) {
    const erros = validationResult(req);
    const userId = req.session.autenticado.id;
    const bazar = await produtosModels.findBazarByUserId(userId);
    const quantidadeVendas = await pedidoModel.contarVendasPorCliente(userId);
    const { socialLinks } = req.body;
    const user = await models.findUserById(userId);

    if (!erros.isEmpty()) {
      return res.render("pages/perfil", {
        usuario: user,
        Bazar: bazar,
        quantidadeVendas,
        listaErros: erros,
        dadosNotificacao: null,
        listaProdBazar: [],
        valores: {
          socialLinks: req.body.socialLinks,
        }
      });
    }

    await connection.query("UPDATE cliente SET Url_site = ? WHERE id_Cliente = ?;", [socialLinks, userId]);

    res.render('pages/perfil', {
      erros: null,
      logado: true,
      usuarioautenticado: userId,
      usuario: user,
      Bazar: bazar,
      quantidadeVendas,
      listaErros: null
    });
  }
);

router.get("/cart",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {

    const userId = req.session.autenticado.id;
    const cart = await cartModels.findAllProductByUserId(userId);
    
    

    
    res.render('pages/cart', { msg: 'Back-end funcionando', cart: cart });
  });

  router.get("/produtos-adicionados",
    verificarUsuAutenticado,
    verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
    async function (req, res) {
      const userId = req.session.autenticado.id;
      
      const prodAdd = await produtosModels.findAllProductByUserId(userId);

      res.render('pages/produtos-adicionados', { msg: 'Back-end funcionando', prodAdd: prodAdd });
    });

    router.post("/removeProdAdd",
      verificarUsuAutenticado,
      verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
      async function (req, res) {
  
        try {
        
          
          const productId = req.body.productAddremove; // Captura o valor do input
    
          
         
          console.log('ID do produto:', productId)
          const userId = req.session.autenticado.id;
          console.log( userId, productId);
          


           await connection.query(
            "DELETE FROM `produtos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
            [userId, productId]
          );
          console.log('produto do add removido');
    
          res.redirect('/produtos-adicionados'); 
        } catch (err) {
          console.log(err);
          res.status(500).send('Erro ao remover produto adicionado'); // Opcional: resposta de erro
        }
        
      }
      );
  
  

  router.post("/removeCart",
    verificarUsuAutenticado,
    verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
    async function (req, res) {


      try {
        
  
        const productId = req.body.idRemoveProdCart; // Captura o valor do input
  
        console.log('ID do produto:', productId);
       
        const userId = req.session.autenticado.id;
  
  
         await connection.query(
          "DELETE FROM `Sacola` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
          [userId, productId]
        );
        console.log('Sacola');
  
        res.redirect('/cart'); 
      } catch (err) {
        console.log(err);
        res.status(500).send('Erro ao remover cart'); // Opcional: resposta de erro
      }
    }
    );




      router.post("/create-preference", function (req, res) {
        const preference = new Preference(client);
      console.log(req.body.items);
      preference.create({
      body: {
      items: req.body.items,


      back_urls: {
      "success": process.env.URL_BASE + "/feedback" ,
      "failure": process.env.URL_BASE + "/feedback" ,
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
      pedidoControler.gravarPedido(req, res);
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

  router.get("/masculino",
    verificarUsuAutenticado,
    verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
    async function (req, res) {
      const produtos = await produtosModels.findAllProductByCategoryName('masculino');
  
      const userId = req.session.autenticado.id; // Certifique-se de que o userId está definido corretamente
      const prodFavJaExiste = await Promise.all(
        produtos.map(async (produto) => {
          const isFav = await prodModels.hasProductsFav(userId, produto.id_prod_cliente);
          return { ...produto, isFav };
        })
      );
  
      res.render('pages/masculino', { produtos: prodFavJaExiste, msg: 'Back-end funcionando' });
    }
  );
  

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

router.post("/enviado",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]), 
  async function (req, res) {
  

    try {
      const userId = req.session.autenticado.id;
      const envio = req.body.envio;
      await connection.query(
        'SELECT * FROM `Minhas_Vendas` WHERE id_Cliente = ? AND enviado = ? ',
        [userId, envio]
      );
      console.log(userId, envio)
  
    

     } catch (err) {
       console.log(err);
       res.status(500).send('Erro ao produto enviado'); // Opcional: resposta de erro
     }

     res.redirect('/minhas-vendas');
});


router.get("/meus-pedidos",
  pedidoControler.listarPedidos,
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  function (req, res) {

  res.render('pages/meus-pedidos', { msg: 'Back-end funcionando' });
});

router.get("/minhas-vendas", 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  pedidoControler.listarVendas
);

router.post('/atualizar-mensagem', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  pedidoControler.enviarMensagem
);


router.get('/produtos/:id_prod_cliente',
  verificarUsuAutenticado,
  async (req, res) => {
    const produtos = await produtosModels.findProducts();
  
    const userId = req.session.autenticado.id; // Certifique-se de que o userId está definido corretamente
    const prodFavJaExiste = await Promise.all(
      produtos.map(async (produto) => {
        const isFav = await prodModels.hasProductsFav(userId, produto.id_prod_cliente);
        return { ...produto, isFav };
      })
    );

    try {
      const produtoId = parseInt(req.params.id_prod_cliente);
      
      // Buscar o produto pelo ID
      const [produtos] = await connection.query(
        'SELECT * FROM `produtos` WHERE id_prod_cliente = ?', 
        [produtoId]
      );

      if (produtos.length > 0) {
        const produto = produtos[0];
        const idCliente = produto.id_Cliente;
        
        // Buscar o nome do cliente (vendedor)
        const [clientes] = await connection.query(
          'SELECT nome FROM `cliente` WHERE id_Cliente = ?', 
          [idCliente]
        );

        if (clientes.length > 0) {
          const nomeCliente = clientes[0].nome;
          
          // Contar a quantidade de vendas do vendedor
          const [vendas] = await connection.query(
            `SELECT COUNT(*) AS quantidadeVendas 
             FROM pedido_item pi
             INNER JOIN produtos p ON pi.Id_prod_cliente = p.id_prod_cliente
             WHERE p.id_Cliente = ? AND p.Stats = 'Disponível'`,
            [idCliente]
          );
          
          const quantidadeVendas = vendas[0].quantidadeVendas;

          res.render('pages/produtos', { 
            listaErros: null,
            usuarioautenticado: req.session.autenticado, 
            produto: { ...produto, isFav: prodFavJaExiste.find(p => p.id_prod_cliente === produto.id_prod_cliente).isFav },
            nomeCliente: nomeCliente,
            quantidadeVendas: quantidadeVendas, 
            dadosNotificacao: null
          });
        }
      } else {
        res.status(404).send('Produto não encontrado.');
      }
    } catch (error) {
      console.error("Erro ao carregar a página do produto:", error);
      res.status(500).send('Erro ao carregar a página do produto.');
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

router.get("/wishlist/",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    const userId = req.session.autenticado.id;
    const prodAddFav = await produtosModels.findAllProductfav(userId);
    console.log(prodAddFav)

    res.render('pages/wishlist', { msg: 'Back-end funcionando' , prodAddFav: prodAddFav });
  });


  router.post('/masculino/addFav', 
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

      const userId = req.session.autenticado.id
      
      const prodFavJaExiste = await prodModels.hasProductsFav(userId, id)

      if(prodFavJaExiste) {
        await connection.query(
          "DELETE FROM `Favoritos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
          [userId, id]
        );
        res.redirect('/masculino')
      } else {
        const results = await connection.query(
          'INSERT INTO `Favoritos` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)',
          [id, dataFav, req.session.autenticado.id, titulo, preco, img1]
        );
        console.log('Favoritado');
        res.redirect('/masculino');
      }



      

     
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar favorito'); // Opcional: resposta de erro
    }
  }
);
  router.post('/produtos/addFav', 
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

      const userId = req.session.autenticado.id
      
      const prodFavJaExiste = await prodModels.hasProductsFav(userId, id)

      if(prodFavJaExiste) {
        await connection.query(
          "DELETE FROM `Favoritos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
          [userId, id]
        );
        res.redirect('/wishlist')
      } else {
        const results = await connection.query(
          'INSERT INTO `Favoritos` (id_prod_cliente, data, id_Cliente, tituloProd, preçoProd, img1) VALUES (?, ?, ?, ?, ?, ?)',
          [id, dataFav, req.session.autenticado.id, titulo, preco, img1]
        );
        console.log('Favoritado');
        res.redirect('/wishlist');
      }



      

     
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao adicionar favorito'); // Opcional: resposta de erro
    }
  }
);

router.post("/wishlist/removeFav",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {

    try {
    
      
      const productId = req.body.produtosremovefav; // Captura o valor do input

      
     
      console.log('ID do produto:', productId)
      const userId = req.session.autenticado.id;
      console.log( userId, productId);
      


       await connection.query(
        "DELETE FROM `Favoritos` WHERE id_Cliente = ? AND Id_prod_cliente = ?",
        [userId, productId]
      );
      console.log('produto do favorito removido');

      res.redirect('/cart'); 
    } catch (err) {
      console.log(err);
      res.status(500).send('Erro ao remover produto favoritado'); // Opcional: resposta de erro
    }
    
  }
  );



  router.post('/checkFavStatus', 
    verificarUsuAutenticado,
    verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
    async function(req, res) {
    try {
        const userId = req.session.autenticado.id; // Pega o ID do usuário logado
        const idProd = req.body.idProd; // Pega o ID do produto enviado no corpo da requisição
        console.log("Produto id: ", idProd);
        
        

        // Verifica se o produto já está nos favoritos
        const prodFavJaExiste = await prodModels.hasProductsFav(userId, idProd);

        // Retorna a resposta como JSON para o frontend
        res.json({ prodFavJaExiste: prodFavJaExiste });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao verificar status do favorito' });
    }
});

  
  

router.post('/podutos/addCart', 
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  async function (req, res) {
    

    try {
      const date = new Date();

      const idProdCart = req.body.idProdCart; // Captura o valor do input
      const [id, titulo, preco, img1] = idProdCart.split(',');
      const userId = req.session.autenticado.id;
      console.log('ID do produto:', id);
      console.log('Título do produto:', titulo);
      console.log('Preço do produto:', preco);
      console.log('Imagem do produto:', img1);
  
      const dataFav = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      console.log('addtocart')


      const prodJaExiste = await cartModels.hasProducts(userId, id)

      if(prodJaExiste) {
        res.redirect('/cart')
      } else {
        await cartModels.addProducts(id, dataFav, req.session.autenticado.id, titulo, preco, img1)
        console.log('Sacola');
        res.redirect('/cart');
      }

       
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
    const userId = req.session.autenticado.id;
    const user = await models.findUserById(userId);

    const quantidadeVendas = await pedidoModel.contarVendasPorCliente(userId);

    console.log(user);
    res.render('pages/adc-produto', {
      usuario: user,
      erros: null,
      usuarioautenticado: req.session.autenticado,
      listaErros: null,
      quantidadeVendas: quantidadeVendas, 
      valores: {
        tituloProduto: "",
        precoProduto: "",
        descProduto: "",
    }
    });
  });

// [, ]
router.post("/adicionar-produto",
  verificarUsuAutenticado,
  verificarUsuAutorizado('pages/login_do_usuario', { erros: null, logado: false, dadosform: { email: '', senha: '' }, usuarioautenticado: null }, [1, 2, 3]),
  upload.fields([{ name: 'img1' }, { name: 'img2' }, { name: 'img3' }, { name: 'img4' }]),
  controller.regrasValidacaoAdcProduto,
  async function (req, res) {
    const userId = req.session.autenticado.id;
    const user = await models.findUserById(userId);
    const errors = validationResult(req);

    const quantidadeVendas = await pedidoModel.contarVendasPorCliente(userId);


    const { tamanProduto, cateProduto, tituloProduto, precoProduto, descProduto } = req.body;

    if (!errors.isEmpty()) {
      return res.render("pages/adc-produto", {
        usuario: user,
        listaErros: errors,
        dadosNotificacao: null,
        listaProdBazar: [],
        quantidadeVendas: quantidadeVendas,
        valores: {
            tituloProduto: req.body.tituloProduto,
            precoProduto: req.body.precoProduto,
            descProduto: req.body.descProduto
        }
    })
    }

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
      Stats: "Disponivel",
      tamanho: tamanProduto,
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
    const { nome, cpf, dia, mes, ano, email, senha } = req.body;

    const nasc = `${ano}-${mes}-${dia}`

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(senha, salt);

    const create = await connection.query("INSERT INTO cliente (nome, cpf, nasc, email, senha, Id_Tipo_Usuario, Stats) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [nome, cpf, nasc, email, hashedPassword, 1, "Ativo"]);
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
      res.render('pages/adc-bazar.ejs' , { 
        Bazar: bazar, 
        listaErros: null, 
        valores: {
          Nome: "",
          Ano: "",
          Descricao: "",
          Titulo: "",
          Biografia: "",
          imgBazar: "",
      }});
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
    uplImg('imgBazar'), 
    controller.regrasValidaçãoBazar, 
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
  uplImg('imgBazar'),
  controller.regrasValidaçãoBazar,
  function (req, res) {
    bazarController.alterarBazar(req, res);
  }
);

router.post("/denunciar-produto/:id_prod_cliente",
  controller.regrasValidaçãoDenunciaP,
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
  controller.regrasValidaçãoDenunciaV,
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
);

router.post('/banir/:id_Cliente_denunciado', 
  denunciaController.banirCliente,
  verificarUsuAutenticado,
  verificarUsuAutorizado(
    "./pages/login_do_usuario", {
      erros: null,
      dadosform: { email: "", senha: "" },
      logado: false,
      usuarioautenticado: null
    },
    [1, 2, 3]
  ));


router.get("/denuncias-usu", async function (req, res) {
  const userId = req.session.autenticado.id;
  const denuncias = await denunciasModels.listarDenunciasUsu(userId);
  const jsonResult = {
      denuncias: denuncias,
  };
  res.render('pages/denuncias-usu', jsonResult);
});


router.get("/pesquisa", function (req, res) {
  res.render('pages/pesquisa', { posts:null });
});


router.post("/search", async function (req, res) {
  try {
      const termoPesquisa = `%${req.body.pesquisaInput}%`;
      const produtos = await produtosModels.acharPorTermo(termoPesquisa) || [];
      if (produtos.length === 0) {
          const jsonResult = {
              posts: "none",
          };
          return res.render("./pages/pesquisa", jsonResult);
      }
      const posts = {
          produtos: produtos,
      };
      const jsonResult = {
          posts: posts,
      };
      return res.render("./pages/pesquisa", jsonResult);
  } catch (error) {
      console.error(error);
      return res.status(404)
  }
});




module.exports = router;