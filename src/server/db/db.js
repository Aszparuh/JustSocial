/* eslint-disable no-console */
const mysql = require('mysql2');

const init = (username, password, host, dbName) => {
    var connection = mysql.createConnection({
        host     : host,
        user     : username,
        password : password,
        port : 3306,
      });
    
    connection.connect((err) => {
        if (err) {
            throw err;
        } else {
            console.log('Connected to db');
            connection.query('CREATE DATABASE ' + dbName, function (err) {
                if (err){
                    console.log('Database exist');
                } else {
                    console.log('Database created');
                }
            });
        }
    }); 
};

module.exports = {
    init
};