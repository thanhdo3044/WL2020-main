const MongoClient = require('mongodb').MongoClient
const uri = require('./config').mongodb.connectString
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

client.connect(err => {
    if (err)
        return console.log(err)
        console.log('MongoDB : connected')
    //const collection = client.db('Woodsland').collection("devices").insert()
})

module.exports = client