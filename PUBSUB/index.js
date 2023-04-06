require('dotenv').config()

const kernel = require('./src/core/Kernel')()

// kernel.addService(require('./src/service/tcp'),'TCP')
// kernel.addService(require('./src/service/long-polling'),'HTPP')
kernel.addService(require('./src/service/http/index'),'HTTP')
kernel.addService(require('./src/service/socket/index'),'SOCKET.IO')
kernel.addService(require('./src/service/net/index'), 'TCP')

