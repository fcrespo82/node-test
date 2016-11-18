var express = require('express');
var app = express();

var oracle = require('oracledb');
oracle.outFormat = oracle.OBJECT;
oracle.maxRows = 9;

var database = require('./config/database')

var conn;

oracle.getConnection(
    {
        user: database.user,
        password: database.password,
        connectString: database.connectString
    }, function (err, connection) {
        if (err) { console.error(err.message); return; }
        conn = connection;
    }
);

function doRelease(connection) {
    connection.release(
        function (err) {
            if (err) {
                console.error      //doRelease(conn);
                    (err.message);
            }
        });
}

app.get('/',
    function (req, res) {
        var id = req.params.id;

        // conn.execute(
        //     "SELECT * " +
        //     "FROM JBPM_PROCESSINSTANCE " +
        //     [],
        //     { maxRows: 999 },
        //     function (err, result) {
        //         if (err) { console.error(err.message); return; }
        //         res.send(result.rows);
        //         //doRelease(conn);

        //     });

        var stream = conn.queryStream('SELECT * FROM JBPM_PROCESSINSTANCE where ROWNUM <= 10');

        stream.on('error', function (error) {
            // handle data row...
            console.log(error);
        });

        stream.on('data', function (data) {
            // handle data row...
            res.write(JSON.stringify(data));

        });
        stream.on('end', function () {
            res.end();
        });
    });

var id_route = require('./routes/id.route');

// ...

app.use(id_route);


app.listen(3000, function () {
    console.log("Server listening on port 3000");
})