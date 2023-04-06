const redis = require("redis")

const client =  redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    //db: 'woodsland',
    password: process.env.REDIS_PASSWORD
})



client.on('connect',()=>{
    console.log('Redis : connected')
})

client.on("error", function (err) {
    console.log(err)
});

 //client.set("string key", "hoang")
//client.expire('string key',10)
//client.del('string key')

client.keys('*',(err,keys)=>{
    //client.expire('3c09dfce327641730a6efda46d9fa817',10)
    let data = []
    let length = keys.length
    let no = 0
    keys.forEach(e=>{
        // console.log(e)
        // client.del(e)
        client.get(e, (err,value)=>{
            data.push({key : e,value})
            no++
            if(no == length){
                console.table(data)
            }
        })
    })
})
// client.get('string key',(err,reply)=>{
//     if(err) console.log(err)
//     console.log(reply)
// })

module.exports = client