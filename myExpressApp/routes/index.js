const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const dataFilePath = path.join(__dirname, '../data/info.txt');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.post('/submit', (req, res) => {
    const { firstName, lastName, favoriteFood } = req.body;
    const newData = `${firstName},${lastName},${favoriteFood}\n`;
    fs.appendFile(dataFilePath, newData, (err) => {
        if (err) throw err;
        res.send('Data submitted successfully!');
    });
});

router.get('/all-data', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const entries = data.trim().split('\n');
        let htmlString = `<table border="1"><tr><th>First Name</th><th>Last Name</th><th>Favorite Food</th></tr>`;
        entries.forEach(entry => {
            const [firstName, lastName, favoriteFood] = entry.split(',');
            htmlString += `<tr><td>${firstName}</td><td>${lastName}</td><td>${favoriteFood}</td></tr>`;
        });
        htmlString += `</table>`;
        res.send(htmlString);
    });
});

module.exports = router;
