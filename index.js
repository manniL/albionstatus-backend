const {send, json} = require('micro');
const {createConnection} = require("mysql");
const cfg = require("./config.json");
const connection = createConnection({
    host: 'localhost',
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
    timezone: 'Z',
});
connection.connect((err) => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log('Connected as ID ' + connection.threadId);
});


module.exports = async (request, response) => {
    const timestamp = decodeURI(request.url.split("/?timestamp=")[1]);
    console.log(timestamp, Date.parse(timestamp));
    if (typeof timestamp !== "undefined" && !isNaN(Date.parse(timestamp))) {
        const query = "SELECT created_at, current_status, message, comment" +
            " FROM status WHERE created_at >= ? ORDER BY created_at DESC";
        connection.query(query, [timestamp], (err, res) => {
            if (err) {
                console.log(err);
                send(response, 500, 'Internal Server Error');
            } else {
                send(response, 400, res);
            }
        });
    } else {
        send(response, 400, 'Bad Request');
    }
};