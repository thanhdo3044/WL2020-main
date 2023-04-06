require('dotenv').config()
require('dotenv').config({
    path: require('path').join(__dirname, './../.env')
})
const
  express = require('express'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback'),
  port = process.env.MOBILE_PORT || 1001

const fs = require('fs');
//const http = require('http');
const https = require('https');

const privateKey = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/private.key','utf8');
const certificate = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/Certificate.cer', 'utf8');
const ca = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/CA_Bundle.cer', 'utf8');

let credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
const app = express()
app.use(history())
app.use(serveStatic(__dirname + '/dist/pwa'))
//const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

//httpServer.listen(port, () => {
//	console.log('HTTP Server running on port '+port);
//});

httpsServer.listen(port, () => {
	console.log('HTTPS Server running on port '+port);
});