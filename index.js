'use strict';

const PORT = process.env.PORT || 8080;

const express = require('express');

let app = express();

app.use(express.static(`${__dirname}/app/dist`));

app.listen(PORT, () => console.log(`Server listening on port ${PORT} ...`));
