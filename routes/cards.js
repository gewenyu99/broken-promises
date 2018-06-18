var express = require('express');
var sql = require('mysql');
var router = express.Router();

function connectToDb() {
    return new Promise(function (resolve, reject) {
        var connection = sql.createConnection({
            host: "35.203.14.127",
            user: "root",
            password: "marmoExtraSad3",
            database: 'cah'
        });
        connection.connect(function (err) {
            if (err) {
                reject(err);
            }
            resolve(connection);
        });
    });
}

function countCards(connection) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT COUNT(*) FROM whitecards', function (err, results, fields) {
            if (err) reject(err);
            resolve(results[0]["COUNT(*)"]);
        });
    });
}
function getCard(connection, id) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM whitecards WHERE id = ' + id, function (err, results, fields) {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
}
function getRandomInt(min, max) {
    var retval = Math.floor(Math.random() * (max - min + 1)) + min;
    if (retval < 1) {
        retval = 1
    }
    return retval;
}

/* GET home page. */
router.get('/', function (req, res, next) {
    var dbConnection;
    var cardCount = 0;
    var cardId = "123";
    var cardBody = 'nice memes';
    connectToDb().then(function (connection) {
        console.log('connected as id ' + connection.threadId);
        dbConnection = connection;
        return true;
    }).then(function (connectionResult) {
        if (connectionResult) {
            countCards(dbConnection).then(function (count) {
                cardCount = count;
                return count;
            }).then(function (count) {
                return getCard(dbConnection, getRandomInt(1,count)).then(function (card) {
                    return card;
                });
            }).then(function (card) {
                cardId = card.id;
                cardBody = card.body;
                res.render('cardView', {cardId: cardId, cardBody: cardBody});
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
});

module.exports = router;
