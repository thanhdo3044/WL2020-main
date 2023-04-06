const express = require('express')
const bom = express.Router()
const mssql = require('mssql')
const {
  getBomByProductId,
  getBom,
  deleteBomWithId,
  insertBom
} = require('./../../../core/query/index')
const {
  getErrorMessage
} = require('./../../../core/config')

const {
  Bom
} = require('../../../../models')

bom.get('/', (req, res, next) => {
  new mssql.Request()
    .query(getBom, (err, record) => {
      if (err) {
        return res.api.sendFail({
          number: 4907,
          message: err
        })
      }
      req.result = []
      record.recordset.forEach(e => {
        req.result.push({
          item: e.ITEM_ID,
          materials: e.MATERIALS_ID,
          rate: e.RATE
        })
      })
      next()
    })
}, (req, res, next) => {
  res.setHeader('x-response-description', JSON.stringify({
    field: {
      item: 'itemId',
      materials: 'itemId'
    }
  }))
  req.api.sendData(req.result)
})

bom.get('/:factoryId/xem', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  select b.ID, i.NAME itemName, i.LENGTH itemLength, i.WIDTH itemWidth, i.HEIGHT itemHeight, i.VOLUMN itemVolumn, b.RATE rate, b.factoryId factoryId from prod.BOM b
    left JOIN base.ITEM i on i.ID = b.ITEM_ID
    where i.ID is not null
  `)
  res.status(200).send(recordset)
})

bom.get('/:itemId/materials', async (req, res) => {
  const data = await new mssql.Request().query(`
  IF OBJECT_ID('tempdb..#TempTable') IS NOT NULL DROP TABLE #TempTable
  CREATE TABLE #TempTable
  (
      ID   INT IDENTITY, 
      ITEM_ID INT,
      MATERIALS_ID INT,
      RATE MONEY,
      parentId INT
  );
  delete prod.BOM where MATERIALS_ID = ITEM_ID;
              
  INSERT INTO #TempTable (ITEM_ID, MATERIALS_ID, RATE, parentId) 
  select ID as ITEM_ID, ID as MATERIALS_ID, null as RATE, 0 as parentId from base.ITEM
  SET IDENTITY_INSERT #TempTable ON
  INSERT INTO #TempTable (ID, ITEM_ID, MATERIALS_ID, RATE, parentId)
  SELECT b.ID, b.ITEM_ID, b.MATERIALS_ID, b.RATE, t.ID as parentId
  from #TempTable as t, prod.BOM b
  where t.ITEM_ID = b.ITEM_ID;
  SET IDENTITY_INSERT #TempTable OFF;
  
  WITH temp(ID, ITEM_ID, MATERIALS_ID, RATE, parentId)
          as (
                  Select distinct ID, ITEM_ID, MATERIALS_ID, RATE, parentId
                  From #TempTable
                  Where ITEM_ID = ${req.params.itemId}
                  Union All
                  Select b.ID, b.ITEM_ID, b.MATERIALS_ID, b.RATE, b.parentId
                 From temp as a, #TempTable as b
                  Where a.MATERIALS_ID = b.ITEM_ID and b.parentId !=0
          ) select x.*, i.CODE code, i.NAME name, i.LENGTH length, i.WIDTH width, i.HEIGHT height from (select distinct * from temp
          union
          select distinct t0.ID, t0.ITEM_ID, t0.MATERIALS_ID, null as RATE, t0.parentId from #TempTable as t0, temp as t1
      where  t0.ID = t1.parentId) as x left join base.ITEM i on i.ID = x.MATERIALS_ID
      `)
  console.log('lấy toàn bộ')
  res.status(200).send(data.recordset)
})

bom.get('/:itemId/root', async (req, res, next) => { // Lấy cả bộ
  new mssql.Request()
    .input('itemId', req.params.itemId)
    .query(timRootByItemId, (err, record) => {
      if (err) { return res.api.sendFail(getErrorMessage(4907)) }

      if (record.recordset.length > 0) {
        req.rootId = record.recordset[0].productId
      } else {
        req.rootId = req.params.itemId
      }
      next()
    })
}, (req, res, next) => {
  new mssql.Request()
    .input('rootId', req.rootId)
    .query(getBomByRootId, (err, record) => {
      if (err) { return res.api.sendFail(getErrorMessage(4907)) }
      res.api.sendData(record.recordset)
    })
})

const getBomByRootId = `
WITH temp(id,itemId,materialsId , rate ,alevel)
        as (
                Select id,ITEM_ID itemId, MATERIALS_ID materialsId, RATE rate ,0 as aLevel
                From prod.BOM
                Where ITEM_ID = @rootId
                Union All
                Select b.id, b.ITEM_ID itemId, b.MATERIALS_ID materialsId, b.RATE rate ,a.alevel + 1
                From temp as a, prod.BOM as b
                Where a.materialsId = b.ITEM_ID
        )
        Select 
        t.ID id,
        P.ID productId,
        P.CODE productCode,
        P.NAME productName,
        P.LENGTH productLength,
        P.WIDTH productWidth,
        P.HEIGHT productHeight,
        M.ID materialsId,
        M.CODE materialsCode,
        M.NAME materialsName,
        M.LENGTH materialsLength,
        M.WIDTH materialsWidth,
        M.HEIGHT materialsHeight,
        t.rate rate
        From temp t
        left join base.ITEM P ON P.ID = t.itemId
        left join base.ITEM M ON M.ID = t.materialsId
        -- order by t.alevel asc
        UNION ALL
        select
        null id,
        null productId,
        null productCode,
        null productName,
        null productLength,
        null productWidth,
        null productHeight,
        I.ID materialsId,
        I.CODE materialsCode,
        I.NAME materialsName,
        I.LENGTH materialsLength,
        I.WIDTH materialsWidth,
        I.HEIGHT materialsHeight,
        1 rate
        from base.ITEM I
        where I.ID = @rootId
`

const timRootByItemId = `WITH temp(id,itemId,materialsId , rate ,alevel)
as (
        Select id,ITEM_ID itemId, MATERIALS_ID materialsId, RATE rate ,0 as aLevel
        From prod.BOM
        Where MATERIALS_ID = @itemId
        Union All
        Select b.id, b.ITEM_ID itemId, b.MATERIALS_ID materialsId, b.RATE rate ,a.alevel + 1
        From temp as a, prod.BOM as b
        Where a.itemId = b.MATERIALS_ID
)
Select 
P.ID productId,
P.CODE productCode,
P.NAME productName,
P.TYPE_ID typeId
From temp t
left join base.ITEM P ON P.ID = t.itemId
left join base.ITEM M ON M.ID = t.materialsId
order by t.alevel desc
`

bom.get('/:productId', (req, res, next) => {
  new mssql.Request()
    .input('ITEM_ID', req.params.productId)
    .query(getBomByProductId, (err, record) => {
      if (err) {
        return res.api.sendFail({
          number: 4907,
          message: err
        })
      }
      req.result = []
      record.recordset.forEach(e => {
        req.result.push({
          id: e.ID,
          product: e.ITEM_ID,
          materials: e.MATERIALS_ID,
          rate: e.RATE
        })
      })
      next()
    })
}, (req, res, next) => {
  res.setHeader('x-response-description', JSON.stringify({
    field: {
      product: 'itemId',
      materials: 'itemId'
    }
  }))
  req.api.sendData(req.result)
})

bom.post('/', (req, res) => {
  console.log(req.body)
  new mssql.Request()
    .input('ITEM_ID', req.body.itemId)
    .input('MATERIALS_ID', req.body.materialsId)
    .input('RATE', req.body.rate)
    .input('factoryId', req.body.factoryId)
    .input('ACCOUNT_ID', req.token.accountId)
    .query(insertBom, (err, record) => {
      if (err) {
        return res.api.sendFail({
          number: 4907,
          message: err
        })
      }
      res.api.sendData([])
    })
})

bom.delete('/:id', (req, res) => {
  new mssql.Request()
    .input('ID', req.params.id)
    .query(deleteBomWithId, (err, record) => {
      if (err) {
        return res.api.sendFail({
          number: 4907,
          message: err
        })
      }
      res.api.sendData([])
    })
})

bom.post('/:itemId/materials', async (req, res) => {
  req.body.forEach(async materialsId => {
    await Bom.findOrCreate({
      where: {
        itemId: req.params.itemId,
        materialsId
      }
    })
  })
  res.status(201).send([])
})

bom.put('/:id', async (req, res) => {
  const result = await Bom.update({ rate: req.body.rate }, {
    where: { id: req.params.id }
  })
  res.status(200).send(result)
})

module.exports = bom
