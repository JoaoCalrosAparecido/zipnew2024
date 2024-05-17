const mysql = require('mysql2')
require("dotenv").config()

const pool = mysql.createPool({
    host: process.env.HOST, 
    user: process.env.USER, 
    password: process.env.PASSWORD,
    database: process.env.NAME,
    port: process.env.PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, conn) => {
    if(err) 
        console.log(err)
    else
        console.log("Conectado ao SGBD!")
})

module.exports = pool.promise()

/*HOST= 'bvd7d0eykrivgn4plcfu-mysql.services.clever-cloud.com'
USER= 'upa7co6ryymgk4ck'
PASSWORD= 'DJnklhpdjlAsmHP2lLQT'
NAME=  'bvd7d0eykrivgn4plcfu'
PORT= '3306'*/
