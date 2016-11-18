var express = require('express')
var router = express.Router()
var oracle = require('oracledb');
oracle.outFormat = oracle.OBJECT;
oracle.maxRows = 9;

var database = require('../config/database')

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

router.get('/:id', function (req, res) {
    var id = req.params.id;

    conn.execute(
        "SELECT * " +
        "FROM JBPM_PROCESSINSTANCE " +
        "WHERE ID_ = :id",
        [id],  // bind value for :id
        function (err, result) {
            if (err) { console.error(err.message); return; }

            //var dados = {}
            result.metaData.forEach(function (value, index) {
                console.log(value.name);
                //dados[value.name] = result.rows[0][index];
            });
            res.send(result.rows);
            //doRelease(conn);

        });
});

module.exports = router