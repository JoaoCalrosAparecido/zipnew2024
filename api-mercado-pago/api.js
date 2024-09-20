const client = new MercadoPago({  accessToken: config.access_token });
const preference = new Preference(client);

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

};

const response = await preference.create({ body })
  .then(console.log).catch(console.log);
