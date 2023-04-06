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

bom.post('/insert-bom-temp', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  WITH TEMP(ITEM_ID, MATERIALS_ID, RATE)
AS
(
	SELECT ITEM_ID, MATERIALS_ID, RATE
	FROM prod.BOM WHERE ITEM_ID = ${req.body.itemId}
	UNION ALL
	SELECT B.ITEM_ID, B.MATERIALS_ID, B.RATE
	FROM TEMP AS A INNER JOIN prod.BOM B ON A.MATERIALS_ID = B.ITEM_ID
)
INSERT INTO prod.BOM_TEMP (ITEM_ID, MATERIALS_ID, RATE, CREATED_BY, CREATED_AT, STATUS)
SELECT distinct *, ${req.body.accountId}, GETDATE(), 'created' FROM TEMP
  `)
  res.status(200).send(recordset)
})

bom.get('/temp/pending', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  select distinct i.ID, i.CODE, i.NAME from prod.BOM_TEMP bt 
inner join base.ITEM i on bt.ITEM_ID = i.ID
where bt.CREATED_BY = ${req.query.accountId} and bt.IS_SEND = 1
and ITEM_ID not in (
select MATERIALS_ID from prod.BOM_TEMP
)
  `)
  res.status(200).send(recordset)
})
bom.get('/temp/remove', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  IF OBJECT_ID('tempdb..#TempTable') IS NOT NULL DROP TABLE #TempTable
  CREATE TABLE #TempTable
  (
      ID   INT IDENTITY(100000,1), 
      ITEM_ID INT,
      MATERIALS_ID INT,
      RATE MONEY,
      parentId INT,factoryId INT
  );
  delete prod.BOM_TEMP where MATERIALS_ID = ITEM_ID;
              
  INSERT INTO #TempTable (ITEM_ID, MATERIALS_ID, RATE, parentId) 
  select ID as ITEM_ID, ID as MATERIALS_ID, null as RATE, 0 as parentId from base.ITEM
  SET IDENTITY_INSERT #TempTable ON
  INSERT INTO #TempTable (ID, ITEM_ID, MATERIALS_ID, RATE, parentId,factoryId)
  SELECT b.ID, b.ITEM_ID, b.MATERIALS_ID, b.RATE, t.ID as parentId,b.factoryId
  from #TempTable as t, prod.BOM_TEMP b
  where t.ITEM_ID = b.ITEM_ID and b.STATUS != 'delete' ;
  delete #TempTable where #TempTable.factoryId is not null

  SET IDENTITY_INSERT #TempTable OFF;
  
  WITH temp(ID, ITEM_ID, MATERIALS_ID, RATE, parentId)
          as (
                  Select distinct ID, ITEM_ID, MATERIALS_ID, RATE, parentId
                  From #TempTable
                  Where ITEM_ID = ${req.query.itemId} 
                  Union All
                  Select b.ID, b.ITEM_ID, b.MATERIALS_ID, b.RATE, b.parentId
                 From temp as a, #TempTable as b
                  Where a.MATERIALS_ID = b.ITEM_ID and b.parentId !=0
          ) select x.*, i.CODE code, i.NAME name, i.LENGTH length, i.WIDTH width, i.HEIGHT height from (select distinct * from temp
          union
          select distinct t0.ID, t0.ITEM_ID, t0.MATERIALS_ID, null as RATE, t0.parentId from #TempTable as t0, temp as t1
      where  t0.ID = t1.parentId) as x left join base.ITEM i on i.ID = x.MATERIALS_ID
  `)
  res.status(200).send(recordset)
})

bom.post('/update-bom-temp', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  UPDATE prod.BOM_TEMP
  SET
  RATE = ${req.body.rate},
  STATUS = 'insert'
  WHERE ID = ${req.body.id}

  `)
  res.status(200).send(recordset)
})
bom.post('/remove-bom-temp', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  UPDATE prod.BOM_TEMP
  SET
  STATUS = 'delete'
  WHERE ID = ${req.body.id}
  `)
  res.status(200).send(recordset)
})
bom.post('/send-bom-temp-approve', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  UPDATE prod.BOM_TEMP
  SET
  IS_SEND = 1
  WHERE CREATED_BY = ${req.body.accountId}
  `)
  res.status(200).send(recordset)
})
bom.post('/add-bom-temp', async (req, res) =>{
  let recordset;
  req.body.materials.forEach(async materialsId => {
    recordset = await new mssql.Request().query(`
    INSERT INTO prod.BOM_TEMP (ITEM_ID, MATERIALS_ID, RATE, CREATED_BY, CREATED_AT, STATUS)
    VALUES (${req.body.itemId}, ${materialsId}, 1, ${req.body.accountId}, GETDATE(), 'insert')
  `)
  })
  res.status(200).send(recordset)
})

bom.post('/approve-bom-temp', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  WITH TEMP(ITEM_ID, MATERIALS_ID, RATE, factoryId, CREATED_BY, CREATED_AT)
AS
(
	SELECT ITEM_ID, MATERIALS_ID, RATE, factoryId , CREATED_BY, CREATED_AT
	FROM prod.BOM_TEMP WHERE ITEM_ID = ${req.body.itemId} and STATUS != 'delete'
	UNION ALL
	SELECT B.ITEM_ID, B.MATERIALS_ID, B.RATE, B.factoryId , b.CREATED_BY, b.CREATED_AT 
	FROM TEMP AS A INNER JOIN prod.BOM_TEMP B ON A.MATERIALS_ID = B.ITEM_ID where B.STATUS != 'delete'
)
INSERT INTO prod.BOM (ITEM_ID, MATERIALS_ID, RATE, factoryId, CREATE_BY, CREATE_DATE )
SELECT distinct * FROM TEMP
  `)
  res.status(200).send(recordset)
})

bom.post('/delete-bom-temp', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  WITH TEMP(ITEM_ID, MATERIALS_ID, RATE, factoryId)
AS
(
	SELECT ITEM_ID, MATERIALS_ID, RATE, factoryId 
	FROM prod.BOM_TEMP WHERE ITEM_ID = ${req.body.itemId}
	UNION ALL
	SELECT B.ITEM_ID, B.MATERIALS_ID, B.RATE, B.factoryId  
	FROM TEMP AS A INNER JOIN prod.BOM_TEMP B ON A.MATERIALS_ID = B.ITEM_ID
)
DELETE FROM prod.BOM_TEMP WHERE ITEM_ID IN (
  SELECT ITEM_ID FROM TEMP
  )
  `)
  res.status(200).send(recordset)
})

bom.post('/delete-bom', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  WITH TEMP(ITEM_ID, MATERIALS_ID, RATE, factoryId)
AS
(
	SELECT ITEM_ID, MATERIALS_ID, RATE, factoryId 
	FROM prod.BOM WHERE ITEM_ID = ${req.body.itemId}
	UNION ALL
	SELECT B.ITEM_ID, B.MATERIALS_ID, B.RATE, B.factoryId  
	FROM TEMP AS A INNER JOIN prod.BOM B ON A.MATERIALS_ID = B.ITEM_ID
)
DELETE FROM prod.BOM WHERE ITEM_ID IN (
  SELECT distinct ITEM_ID FROM TEMP
  )
  `)
  res.status(200).send(recordset)
})

bom.get('/bomTemp/item-bom-temp', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  select distinct I.ID id, I.CODE code, I.NAME name, I.LENGTH length, I.WIDTH width, I.HEIGHT height, A.LAST_NAME
  from prod.BOM_TEMP BT INNER JOIN base.ITEM I ON BT.ITEM_ID = I.ID
  INNER JOIN base.ACCOUNT A ON BT.CREATED_BY = A.ID
  WHERE BT.ITEM_ID NOT IN (
  SELECT MATERIALS_ID FROM prod.BOM_TEMP 
  ) and IS_SEND = 1
  `)
  res.status(200).send(recordset)
})
bom.get('/bomTemp/check-send-bom-temp', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  select * from prod.BOM_TEMP where ITEM_ID = ${req.query.itemId}
  `)
  res.status(200).send(recordset)
})

bom.get('/bomTemp/parent-item-bom', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  with temp(ITEM_ID, MATERIALS_ID, level) as
(
	select ITEM_ID, MATERIALS_ID, 0 level from prod.BOM where MATERIALS_ID = ${req.query.itemId}
	union all 
	select b.ITEM_ID, b.MATERIALS_ID, a.level + 1 from temp a inner join prod.BOM b on a.ITEM_ID = b.MATERIALS_ID
)
select top 1 * from temp order by level desc
  `)
  res.status(200).send(recordset)
})
bom.get('/bomTemp/parent-item-bom-temp', async (req, res) =>{
  const {recordset} = await new mssql.Request().query(`
  select * from prod.BOM_TEMP where ITEM_ID = ${req.query.itemId}
  `)
  res.status(200).send(recordset)
})

bom.get('/:itemId/materials', async (req, res) => {
  const data = await new mssql.Request().query(`
  IF OBJECT_ID('tempdb..#TempTable') IS NOT NULL DROP TABLE #TempTable
  CREATE TABLE #TempTable
  (
      ID   INT IDENTITY(100000,1) , 
      ITEM_ID INT,
      MATERIALS_ID INT,
      RATE MONEY,
      parentId INT,factoryId INT
  );
  delete prod.BOM where MATERIALS_ID = ITEM_ID;
              
  INSERT INTO #TempTable (ITEM_ID, MATERIALS_ID, RATE, parentId) 
  select ID as ITEM_ID, ID as MATERIALS_ID, null as RATE, 0 as parentId from base.ITEM
  SET IDENTITY_INSERT #TempTable ON
  INSERT INTO #TempTable (ID, ITEM_ID, MATERIALS_ID, RATE, parentId,factoryId)
  SELECT b.ID, b.ITEM_ID, b.MATERIALS_ID, b.RATE, t.ID as parentId,b.factoryId
  from #TempTable as t, prod.BOM b
  where t.ITEM_ID = b.ITEM_ID;
  delete #TempTable where #TempTable.factoryId is not null 

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

bom.get('/:itemId/bom-temp', async (req, res) => {
  const data = await new mssql.Request().query(`
  IF OBJECT_ID('tempdb..#TempTable') IS NOT NULL DROP TABLE #TempTable
  CREATE TABLE #TempTable
  (
      ID   INT IDENTITY(100000,1), 
      ITEM_ID INT,
      MATERIALS_ID INT,
      RATE MONEY,
      parentId INT,factoryId INT
  );
  delete prod.BOM_TEMP where MATERIALS_ID = ITEM_ID;
              
  INSERT INTO #TempTable (ITEM_ID, MATERIALS_ID, RATE, parentId) 
  select ID as ITEM_ID, ID as MATERIALS_ID, null as RATE, 0 as parentId from base.ITEM
  SET IDENTITY_INSERT #TempTable ON
  INSERT INTO #TempTable (ID, ITEM_ID, MATERIALS_ID, RATE, parentId,factoryId)
  SELECT b.ID, b.ITEM_ID, b.MATERIALS_ID, b.RATE, t.ID as parentId,b.factoryId
  from #TempTable as t, prod.BOM_TEMP b
  where t.ITEM_ID = b.ITEM_ID;
  delete #TempTable where #TempTable.factoryId is not null

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
    .input('factoryId', req.query.factoryId)
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
        materialsId,
     
      }
    })
  })
  res.status(201).send([])
})

// bom.post('/add-bom-temp', async (req, res) => {
//   const {recordset} = await new mssql.Request().query(`
//   INSERT INTO prod.BOM_TEMP (ITEM_ID, MATERIALS_ID, factoryId)
//   VALUES(${req.body.itemId},${req.body.materialId},${req.body.factoryId})
//   `)
//   res.status(200).send(recordset)
// })

bom.put('/:id', async (req, res) => {
  const result = await Bom.update({ rate: req.body.rate }, {
    where: { id: req.params.id}
  })
  res.status(200).send(result)
  // const {recordset} = await new mssql.Request().query(`
  // UPDATE prod.BOM_TEMP SET RATE = ${req.body.rate} 
  // WHERE ID =  ${req.params.id} and factoryId = ${req.query.factoryId}
  // `)
  // res.status(200).send(recordset)
})

module.exports = bom
