/* eslint-disable no-console */
const mysql = require('mysql');

async function init (username, password, host, dbName) {
    var connection = mysql.createConnection({
        host     : host,
        user     : username,
        password : password,
        port : 3306,
      });
    
      const query = new Promise((resolve) => {
        connection.query('CREATE DATABASE ' + dbName, function (err) {
            if (err){
                console.log('Database exist');
                resolve();
            } else {
                console.log('Database created');
                resolve();
            }
        });
    });

    await query;
}

module.exports = {
    init
};