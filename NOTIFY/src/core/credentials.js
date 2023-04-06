const fs = require('fs');

let credentials = null
try {
    const privateKey = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/private.key', 'utf8');
    const certificate = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/Certificate.cer', 'utf8');
    const ca = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/CA_Bundle.cer', 'utf8');
    credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
    }
} catch (error) {
    console.log('HTTPS not run')
}

module.exports = credentials