const express = require('express')
const routing = express.Router()
const mssql = require('mssql')
const {
  getErrorMessage
} = require('./../../../core/config')

const {
  getRouting,
  getRoutingWithItemId,
  deleteRouting
} = require('./../../../core/query/index')

const {
  Routing
} = require('../../../../models')

routing.get('/', (req, res, next) => {
  new mssql.Request()
    .query(getRouting, (err, record) => {
      if (err) { return res.api.sendFail(getErrorMessage(4907)) }
      req.result = []
      record.recordset.forEach(e => {
        req.result.push({
          id: e.ID,
          item: e.ITEM_ID,
          step: e.STEP_ID,
          order: e.ORDER
        })
      })
      next()
    })
}, (req, res, next) => {
  res.setHeader('x-response-description', JSON.stringify({
    field: {
      item: 'itemId',
      step: 'departmentId'
    }
  }))
  req.api.sendData(req.result)
})

routing.get('/:itemId', (req, res, next) => {
  new mssql.Request()
    .input('ITEM_ID', req.params.itemId)
    .query(getRoutingWithItemId, (err, record) => {
      if (err) { return res.api.sendFail(getErrorMessage(4907)) }
      req.result = []
      record.recordset.forEach(e => {
        req.result.push({
          id: e.ID,
          item: e.ITEM_ID,
          step: e.STEP_ID,
          order: e.ORDER,
          thoiGianThucHien: e.thoiGianThucHien,
          soNguoiThucHien: e.soNguoiThucHien,
          donGia: e.donGia
        })
      })
      next()
    })
}, (req, res, next) => {
  res.setHeader('x-response-description', JSON.stringify({
    field: {
      item: 'itemId',
      step: 'departmentId'
    }
  }))
  req.api.sendData(req.result)
})

routing.post('/', async (req, res) => {
  const routings = req.body.routing
  console.log(routings)
  if (routings === undefined) { return res.api.sendFail(getErrorMessage(4900)) }
  if (routings[0] === undefined) {
    return res.api.sendData(getErrorMessage(4907))
  }
  const itemId = routings[0].itemId
  await Routing.destroy({
    where: {
      itemId
    }
  })
  await Routing.bulkCreate(routings)
  res.api.sendData([])
})

routing.delete('/:itemId', (req, res) => {
  new mssql.Request()
    .input('ITEM_ID', req.params.itemId)
    .query(deleteRouting, (err, record) => {
      if (err) {
        return res.api.sendFail({
          number: 4907,
          message: err
        })
      }
      res.api.sendData([])
    })
})

routing.get('/:itemId/boms', async (req, res) => {
  const { factoryId } = req.query
  if (!factoryId || factoryId === 'undefined') return res.status(404).send([{ err: 'Lỗi chưa có nhà máy' }])
  const routings = await Routing.findAll({
    where: {
      itemId: req.params.itemId,
      factoryId
    },
    order: [['ORDER', 'ASC']]
  })
  res.status(200).send(routings)
})

routing.post('/:itemId/boms', async (req, res) => {
  console.log(req.body)
  const routings = await Routing.findOrCreate({
    where: req.body
  })
  res.status(200).send(routings)
})

routing.put('/:id/boms', async (req, res) => {
  await Routing.update({ factoryId: 100000 }, { where: { factoryId: null } })
  const routing = await Routing.findByPk(req.body.ID)
  if (routing) {
    routing.itemId = req.body.itemId
    routing.stepId = req.body.stepId
    routing.order = req.body.order
    routing.soNguoiThucHien = req.body.soNguoiThucHien
    routing.thoiGianThucHien = req.body.thoiGianThucHien
    routing.donGia = req.body.donGia
    routing.factoryId = req.body.factoryId
    await routing.save()
  }
  res.status(200).send(routing)
})

routing.delete('/:id/boms', async (req, res) => {
  const routing = await Routing.findByPk(req.params.id)
  const result = await routing.destroy()
  res.status(200).send(result)
})

module.exports = routing
