const express = require('express');
const bodyParser = require('body-parser');
const indexRoutes = require('./routes/index');
const searchRoutes = require('./routes/search');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', indexRoutes);
app.use('/', searchRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
