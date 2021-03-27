const express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    uniqid = require('uniqid');
cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors())
app.use(express.json())
const MSGPATH = "messages.json";
let msgArr = []
const port = process.env.PORT || 3001
app.listen(port);

if (fs.existsSync(MSGPATH)) {
    msgArr = JSON.parse(fs.readFileSync(MSGPATH));
}

function saveMsgs() {
    fs.writeFileSync(MSGPATH, JSON.stringify(msgArr, null, 2));
}

function validateEntry(entry) {
    if ("firstName" in entry && "lastName" in entry && "year" in entry && "class" in entry) {
        return true
    }
    return false
}


// CREATE
app.post('/add', (req, res) => {
    if (validateEntry(req.body) && Object.keys(req.body).length == 4) {
        let id = uniqid()
        let obj = {
            id: id,
            ...req.body // is year a number? names without spaces? class A or B? 
        };
        msgArr.push(obj);
        saveMsgs();
        res.status(201).send(id);
    } else {
        res.status(400).send('(firstName, lastName, year, class)')
    }
});

//READ
app.post('/read', (req, res) => {
    if ("id" in req.body) {
        let id = req.body.id;
        for (let item of msgArr) {
            if (item.id == id) {
                res.send(item)
                return
            }
        }
        res.status(400).send('Id not found')
    } else {
        res.status(400).send('(id)')
    }
});

//UPDATE
app.post('/update', (req, res) => {
    if (validateEntry(req.body) && "id" in req.body && Object.keys(req.body).length == 5) {
        for (let i = msgArr.length - 1; i >= 0; i--) {
            if (msgArr[i].id == req.body.id) {
                msgArr.splice(i, 1);
                let obj = {
                    id: req.body.id,
                    ...req.body
                };
                msgArr.push(obj);
                saveMsgs();
                res.status(202).end()
                return
            }
        }
        res.status(400).send('Id not found')
        return
    } else {
        res.status(400).send('(firstName, lastName, year, class, id)')
        return
    }
});

//DELETE
app.post('/delete', (req, res) => {
    if ("id" in req.body) {
        for (let i = msgArr.length - 1; i >= 0; i--) { // (Doesnt need to be backwards bcs we re deliting one item)
            if (msgArr[i].id == req.body.id) {
                msgArr.splice(i, 1);
                saveMsgs();
                res.status(202).end()
                return
            }
        }
        res.status(400).send('Id not found')
        return
    } else {
        res.status(400).send('(id)')
        return
    }
});

//LIST
app.get('/list', (req, res) => {
    res.status(200).send(JSON.stringify(msgArr))
});