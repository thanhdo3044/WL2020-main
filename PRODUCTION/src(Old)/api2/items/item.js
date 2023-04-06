const express = require('express')
const route = express.Router()
const {
    Item,
    Op
} = require('../../../models')

route.get('/', async (req, res) => {
    let {
        factoryId
    } = req.query;
    try {
        let items = await Item.findAll({
            where: {
                [Op.and]: [{
                    factoryId
                }, {
                    typeId: {
                        [Op.in]: [100002, 100003]
                    }
                }]
            }
        })
        res.status(200).send(items)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})

route.put('/:id', async (req, res) => {
    try {
        let result = Item.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = route