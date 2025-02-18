const mysql = require('mysql2');

// Create a connection to MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your-pass-word',
    database: 'node_mysql'
});

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

module.exports = connection;
