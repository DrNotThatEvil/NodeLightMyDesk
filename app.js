const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const expressWs = require('express-ws')(app);
const router = express.Router();
const path = require('path');

global.appRoot = path.resolve(__dirname);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.use(express.static(__dirname + '/public'));

require('./app/controllers/Install')(app);
require('./app/controllers/Dashboard')(app);

app.use('/', router);

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
