const mysql = require("mysql2");
const express = require("express");
const path = require("path");
var app = express();

app.use(express.static('public'));

var con = mysql.createConnection({
    host: "mysql-1f2b719e-hatredemir-9a94.a.aivencloud.com",
    port: 18552,
    user: "avnadmin",
    password: "AVNS_lI51pdIjzWAbm_o9aOT", 
})
  
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Serveur en écoute sur le port 3000');
});

/**con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM defaultdb.utilisateur", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
});**/

