const mysql = require("mysql2");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
var app = express();

const fs = require("fs");

app.use(express.static("img"));
app.use(bodyParser.urlencoded({ extended: false }));


var con = mysql.createConnection({
    host: "mysql-1f2b719e-hatredemir-9a94.a.aivencloud.com",
    port: 18552,
    user: "avnadmin",
    password: "AVNS_lI51pdIjzWAbm_o9aOT", 
})
  
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.post('/register', (req, res) => {
    let { username, password } = req.body;
    const user = new User(username, password);
    con.query("INSERT INTO defaultdb.utilisateur (id ,login, mot_de_passe) VALUES (?, ?, ?)", [0 ,user.username, user.password], (err, result) => {
        if (err) {
            var error = ''+err;
            const jsonfilePath = path.join(__dirname, 'index.html');

            fs.readFile(jsonfilePath,'utf8', (err2, html) => {
                if (err2) {
                    console.error('Error reading file:', err2);
                    res.send('Internal Server Error');
                }
                let htmlmodifie = html.replace("<!-- INSERT_MESSAGE_HERE -->",error);
                res.send(htmlmodifie);
            });
            return;
        }else{
            res.send("REGISTERED");
        }
    });
});

app.post('/login', (req, res) => {
    let { username, password } = req.body;
    const user = new User(username, password);
   
    const users = [];

    con.query("SELECT * FROM defaultdb.utilisateur", (err, result, fields) => {
        if (err) {
            res.status(500).json({ error: 'An error occurred' });
            return;
        }
        result.forEach(row => {
            const u = new User(row.login, row.mot_de_passe);
            users.push(u);
        });


        let found = false;
        let otherUser = null;
        users.forEach(u =>{
            if(u.username == user.username && u.password == user.password){
                found = true;
                return;
            }
            if(u.password == user.password){
                otherUser = u.username;
            }
        });

        console.log(__dirname  + '/public');
        if(found){
            res.send("CONNECTED");
        }else{
            var error = 'ERROR : You use the password of '+ otherUser;
            const jsonfilePath = path.join(__dirname, 'index.html');

            fs.readFile(jsonfilePath,'utf8', (err, html) => {
                if (err) {
                    console.error('Error reading file:', err);
                    res.status(500).send('Internal Server Error');
                }
                let htmlmodifie = html.replace("<!-- INSERT_MESSAGE_HERE -->",error);
                res.send(htmlmodifie);
            });
          
        }
    });
});


app.listen(3000, () => {
    console.log('Serveur en écoute sur le port 3000');
});


class User{
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
}