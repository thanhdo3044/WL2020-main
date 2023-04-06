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
  {
    const {recordset} = await new mssql.Request()
    .query(`
    SELECT r.ID , ITEM_ID itemId, STEP_ID stepId, r.[ORDER] [order], r.factoryId, CREATE_BY createBy, d.CODE code  
    FROM prod.ROUTING r inner join base.DEPARTMENT d on r.STEP_ID = d.ID
    where ITEM_ID = ${req.params.itemId} and r.factoryId = ${req.query.factoryId}
    `)
    res.status(200).send(recordset)
  }
  

})

routing.get('/temp/:itemId/boms', async (req, res) => {
  const { factoryId } = req.query
  if (!factoryId || factoryId === 'undefined') return res.status(404).send([{ err: 'Lỗi chưa có nhà máy' }])
  const {recordset} = await new mssql.Request()
  .query(`
  SELECT rt.ID , ITEM_ID itemId, STEP_ID stepId, [ORDER] [order] , IS_SEND, a.LAST_NAME, STATUS
  FROM prod.ROUTING_TEMP rt inner join 
  base.ACCOUNT a on rt.CREATE_BY = a.ID 
  where rt.ITEM_ID = ${req.params.itemId} and rt.FACTORY_ID = ${factoryId}
  order by rt.[ORDER]
  `)
  res.status(200).send(recordset)
})

routing.get('/temp/:itemId/item', async (req, res) => {
  const {recordset} = await new mssql.Request()
  .query(`
  SELECT ITEM_ID itemId, STEP_ID stepId, [ORDER] [order] FROM prod.ROUTING_TEMP WHERE ITEM_ID = ${req.params.itemId} AND FACTORY_ID = ${req.query.factoryId}
  `)
  res.status(200).send(recordset)
})

routing.get('/temp/item-in-routing', async (req, res) => {
  const {recordset} = await new mssql.Request()
  .query(`
  select distinct i.ID id, i.NAME name, i.CODE code, i.LENGTH length, i.WIDTH width, i.HEIGHT height , A.LAST_NAME
from prod.ROUTING_TEMP rt 
inner join base.ITEM i on rt.ITEM_ID = i.ID 
INNER JOIN base.ACCOUNT A ON RT.CREATE_BY = A.ID
where rt.FACTORY_ID = ${req.query.factoryId} 
  `)
  res.status(200).send(recordset)
})
routing.get('/temp/pending', async (req, res) => {
  const {recordset} = await new mssql.Request()
  .query(`
  select distinct i.ID, i.CODE, i.NAME from prod.ROUTING_TEMP rt 
inner join base.ITEM i on rt.ITEM_ID = i.ID
where rt.CREATE_BY = ${req.query.accountId} and rt.IS_SEND = 1
  `)
  res.status(200).send(recordset)
})

routing.delete('/temp/:id', async (req, res) => {
  const {recordset} = await new mssql.Request()
  .query(`
  UPDATE prod.ROUTING_TEMP SET STATUS = 'delete' WHERE ID = ${req.params.id}
  `)
  res.status(200).send(recordset)
})

routing.delete('/temp/:itemId/item', async (req, res) => {
  const {recordset} = await new mssql.Request()   
  .query(`
  DELETE FROM prod.ROUTING_TEMP WHERE ITEM_ID = ${req.params.itemId}
  `)
  res.status(200).send(recordset)
})

routing.post('/temp/:itemId/boms', async (req, res) => {
  console.log("body", req.body);
  const query = `
  INSERT INTO prod.ROUTING_TEMP (ITEM_ID, STEP_ID, [ORDER], FACTORY_ID, CREATE_BY, CREATE_AT, STATUS)
  VALUES(${req.body.itemId}, ${req.body.stepId}, ${req.body.order}, ${req.body.factoryId}, ${req.body.createBy}, GETDATE(), 'insert')
  `;
  console.log("query", query);
  const {recordset} = await new mssql.Request()
  .query(
  query
  )
  res.status(200).send(recordset)
})

routing.put('/temp/:id/boms', async (req, res) => {
const query = `
UPDATE prod.ROUTING_TEMP 
  SET 
  ITEM_ID = ${req.body.itemId}, 
  STEP_ID = ${req.body.stepId}, 
  [ORDER] = ${req.body.order},
  STATUS = 'update' 
  WHERE ID = ${req.params.id}
`;
console.log("query", query);

  const {recordset} = await new mssql.Request()
  .query(query)
  res.status(200).send(recordset)
})
routing.put('/temp/:id/send', async (req, res) => {
const query = `
UPDATE prod.ROUTING_TEMP
SET
IS_SEND = 1
WHERE CREATE_BY = ${req.body.accountId} AND FACTORY_ID = ${req.body.factoryId}
`;
console.log("query", query);

  const {recordset} = await new mssql.Request()
  .query(query)
  res.status(200).send(recordset)
})


routing.post('/routing-to-temp/:itemId', async (req, res) => {
  const {recordset} = await new mssql.Request()
  .query(`
  INSERT INTO prod.ROUTING_TEMP (ITEM_ID, STEP_ID, [ORDER], FACTORY_ID, CREATE_BY, CREATE_AT, STATUS)
  SELECT ITEM_ID, STEP_ID, [ORDER], factoryId, ${req.body.accountId}, GETDATE(), 'created' 
  FROM prod.ROUTING WHERE ITEM_ID = ${req.params.itemId} and factoryId = ${req.body.factoryId}
  `)
  res.status(200).send(recordset)
})

routing.post('/routing-to-accept', async (req, res) => {
  const {recordset} = await new mssql.Request()
  .query(`
  DELETE FROM prod.ROUTING WHERE ITEM_ID = ${req.query.itemId} and factoryId = ${req.query.factoryId}
  INSERT prod.ROUTING (ITEM_ID, STEP_ID, [ORDER], factoryId)
  SELECT ITEM_ID, STEP_ID, [ORDER], FACTORY_ID 
  FROM prod.ROUTING_TEMP WHERE ITEM_ID = ${req.query.itemId} and FACTORY_ID = ${req.query.factoryId} and STATUS != 'delete'
  `)
  res.status(200).send(recordset)
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
    routing.modifyBy = req.body.modifyBy
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
