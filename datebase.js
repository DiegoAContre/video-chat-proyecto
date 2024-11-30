const mysql = require('mysql');
const { promisify } = require('util');

const database = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'videochat'
};

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err){
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Conexion perdida con la base de datos');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos recibio multiples conexiones fallidas');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexion a la base de datos fue rechazada');
        }
    }else{
        if (connection) connection.release();
        console.log('La base de datos esta conectada');
    }
    return;
});

pool.query = promisify(pool.query);

module.exports = pool;