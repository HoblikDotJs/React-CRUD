const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path'),
    mysql = require('mysql')

require('dotenv').config();
let connection;
checkDatabaseConnection();
setInterval(checkDatabaseConnection, 10000);



function checkDatabaseConnection() {
    if (connection && connection.state == 'authenticated') return;
    connection = mysql.createConnection({
        host: process.env.HOST,
        port: process.env.DPORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    })
    connection.connect(err => {
        if (err) {
            console.log('error when connecting to MySQL db:', err);
            console.log('reconnecting...');
            setTimeout(checkDatabaseConnection, 2000);
        } else {
            console.log("Connected!");
        }
    });
    connection.on('error', err => {
        console.log('MySQL db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('reconnecting...');
            checkDatabaseConnection();
        } else {
            throw err;
        }
    });

}

const app = express();
app.use(bodyParser.json());
app.use(cors()) // not needed now
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.json())
const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log("listening on " + port)
});

function validateEntry(entry) {
    if ("firstName" in entry && "lastName" in entry && "year" in entry && "class" in entry) {
        return true
    }
    return false
}

app.get('/', (res, req) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// CREATE
app.post('/add', (req, res) => {
    if (validateEntry(req.body) && Object.keys(req.body).length == 4) {
        connection.query(`INSERT INTO students (firstName,lastName,year,class) VALUES
         ('${req.body.firstName}','${req.body.lastName}','${req.body.year}','${req.body.class}')`,
            (err, result) => {
                if (err) throw err;
                res.status(201).send(result.insertId.toString());
            });
    } else {
        res.status(400).send('(firstName, lastName, year, class)')
    }
});

//READ
app.post('/read', (req, res) => { // not used
    if ("id" in req.body) {
        connection.query(`SELECT * FROM students WHERE id = '${req.body.id}'`, (err, result) => {
            if (err) throw err;
            res.status(200).send(JSON.stringify(result))
        })
    } else {
        res.status(400).send('(id)')
    }
});

//UPDATE
app.post('/update', (req, res) => {
    if (validateEntry(req.body) && "id" in req.body && Object.keys(req.body).length == 5) {
        connection.query(`UPDATE students SET firstName = '${req.body.firstName}', lastName = '${req.body.lastName}',
        year = '${req.body.year}', class = '${req.body.class}' 
        WHERE id = '${req.body.id}'`, (err, result) => {
            if (err) throw err;
            res.status(202).end()
            return
        });
    } else {
        res.status(400).send('(firstName, lastName, year, class, id)')
        return
    }
});

//DELETE
app.post('/delete', (req, res) => {
    if ("id" in req.body) {
        connection.query(`DELETE FROM students WHERE id = '${req.body.id}'`, (err, result) => {
            if (err) throw err;
            res.status(202).end()
        });
    } else {
        res.status(400).send('(id)')
        return
    }
});

//LIST
app.get('/list', (req, res) => {
    connection.query("SELECT * FROM students ORDER BY id", (err, result) => {
        if (err) throw err;
        res.status(200).send(JSON.stringify(result))
    });
});