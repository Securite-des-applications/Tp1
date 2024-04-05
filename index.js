const mysql = require("mysql2");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
var app = express();

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

app.get('/error.jpg',  (req, res) => {
    res.sendFile(path.join(__dirname, '/error.jpg'))
})

app.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'error.html'));
})


class User{
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
}

app.post('/login', (req, res) => {
    let { username, password } = req.body;
    const user = new User(username, password);
   
    const users = [];

    con.query("SELECT * FROM defaultdb.utilisateur", function (err, result, fields) {
        if (err) {
            res.status(500).json({ error: 'An error occurred' });
            return;
        }
        result.forEach(row => {
            const u = new User(row.login, row.mot_de_passe);
            users.push(u);
        });


        let found = false;
        users.forEach(u =>{
            if(u.username == user.username && u.password == user.password){
                found = true;
                return;
            }
        });

        console.log(__dirname  + '/public');
        if(found){
            res.send("CONNECTED");
        }else{
            res.redirect('/error');
        }
        
       
    });

})

app.listen(3000, () => {
    console.log('Serveur en écoute sur le port 3000');
});
