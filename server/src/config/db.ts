import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password:"",
    database: "signup",
    port: 3306,
    connectionLimit:10,
    waitForConnections:true,
    queueLimit:0
})

export default db ;