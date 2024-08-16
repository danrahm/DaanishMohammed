const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const dataFilePath = path.join(__dirname, '../data/info.txt');

router.get('/searchfood', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/search.html'));
});

router.get('/search', (req, res) => {
    const { favoriteFood } = req.query;

    if (!favoriteFood) {
        return res.send('Please provide a favorite food to search for.');
    }

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) throw err;

        const entries = data.trim().split('\n');
        let htmlString = `<table border="1"><tr><th>First Name</th><th>Last Name</th><th>Favorite Food</th></tr>`;

        entries.forEach(entry => {
            const parts = entry.split(',');
            if (parts.length === 3) {
                const [firstName, lastName, food] = parts;

                if (food && food.toLowerCase() === favoriteFood.toLowerCase()) {
                    htmlString += `<tr><td>${firstName}</td><td>${lastName}</td><td>${food}</td></tr>`;
                }
            } else {
                console.log(`Skipping invalid entry: ${entry}`);
            }
        });

        htmlString += `</table>`;
        res.send(htmlString);
    });
});

module.exports = router;
