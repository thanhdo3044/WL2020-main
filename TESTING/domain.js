const express = require('express')
const app = express()


app.use('/', (req,res,next)=>{
    res.send('ok asd')
})
var os = require("os")
console.log(os.hostname())
app.listen(80,()=>{
    console.log('ok')
})