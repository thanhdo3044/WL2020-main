const mongoose = require('mongoose')
const Redis = require('./redis/index')

const Node = mongoose.model('Node', require('./schema/Node'))
const Message = mongoose.model('Message', require('./schema/Message'))
const Session = mongoose.model('Session', require('./schema/Session'))
const Token = mongoose.model('Token', require('./schema/Token'))
const Listen = mongoose.model('Listen', require('./schema/Listen'))

mongoose.connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify : false
})
.then(async () => {
    console.log('MongoDB : connected')
    // Node.deleteMany({},(err)=>{
    //     console.log(err)
    // })


    // Node.find({}, (err, res) => {
    //     let data = JSON.parse(JSON.stringify(res))
    //     for(let i = 0, length = data.length; i < length; i++){
    //         delete data[i].password
    //         delete data[i].__v
    //     }
    //     console.table(data)
    // })
})
.catch(err => console.log('MongoDB : connect failse'))

module.exports = {
    Node,
    Message,
    Session,
    Token,
    Redis,
    Listen,
}