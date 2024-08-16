
const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");


recordRoutes.route("/word").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        const result = await db_connect.collection("WordBank").findOne({});
        res.json(result);
    } catch (err) {
        throw err;
    }
});

module.exports = recordRoutes;
