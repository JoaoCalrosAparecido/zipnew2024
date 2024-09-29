const MercadoPago = require('mercadopago'); 

const config = {
  access_token: 'APP_USR-5593607796954557-092821-c64b7b86bb2f21f48268017986839bb2-2009674095'
};

MercadoPago.configure({ access_token: config.access_token });

const body = {
  items: [
    {
      id: '1234',
      title: 'Dummy Title',
      quantity: 1,
      currency_id: 'BRL',
      unit_price: 10,
    },
  ],
  back_urls: {
    success: 'http://test.com/success',
    failure: 'http://test.com/failure',
    pending: 'http://test.com/pending',
  },
  auto_return: 'all',
};

(async () => {
  try {
    const response = await MercadoPago.preferences.create(body);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
