const express = require('express')
const ikeaCode = express.Router()

const {
    ikea
} = require('./../../core/logic')

ikeaCode.get('/:ikeaCode/decode', (req,res)=>{
    ikea.decode(req,res,(data)=>{
        res.api.sendData(data)
    })
})

module.exports = ikeaCode