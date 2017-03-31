/**
 * Created by milosberka on 31.3.2017.
 */
const fs = require('fs');

function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if(err) {
            callback(err);
            return;
        }
        try {
            callback(null, JSON.parse(data));
        } catch(exception) {
            callback(exception);
        }
    });
}

const appRouter = function(app) {
    app.get("/", function(req, res) {
        res.send("Hello World");
    });
    app.get("/getData/", function(req, res) {
        const jsonData = readJSONFile('./public/js/riffs.json', function (err, json) {
            if(err) { throw err; }
            console.log(json);
        });
        const html = fs.readFile('./public/index.html', function (err, data) {
            return data;
        });
        const formattedData = jsonData.riffs.map((item) => `<div class="card">${item.title}</div>`).reduce((all, item) => (all += item), "");
        html.getElementById('container').innerHTML = formattedData;
        res.send(html);
    });
}

module.exports = appRouter;