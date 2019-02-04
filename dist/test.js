"use strict";
const fs = require('fs');
fs.access('/views', (err, stats) => {
    console.log(err.message);
});
