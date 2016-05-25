const express = require("express");
const app = express();
const router = express.Router();
const path = require('path');
const RGBControl = require("./lib/RGBControl");

global.appRoot = path.resolve(__dirname);

router.use(express.static(__dirname + '/public'));

require("./app/controllers/Install")(app);

app.use('/', router);

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
