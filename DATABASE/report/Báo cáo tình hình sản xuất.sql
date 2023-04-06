
-- DROP TABLE #BOM
SELECT *
INTO #BOM
FROM (
    VALUES 
    ('San pham A','Cum B1',2),
    ('San pham A','Cum B2',1),
    ('Cum B1','Chi tiet C1',2),
    ('Cum B1','Chi tiet C2',1),
    ('Cum B2','Chi tiet C3',1)
)AS T (itemId, materials,rate)

-- DROP TABLE #ROUTING
SELECT *
INTO #ROUTING
FROM (
    VALUES 
    ('San pham A','Dong goi','1'),
    ('San pham A','Kho thanh pham','2'),
    ('Cum B1','Hoan thien','1'),
    ('Cum B1','Dong goi','2'),
    ('Cum B2','Hoan thien','1'),
    ('Cum B2','Dong goi','2'),
    ('Chi tiet C1','So che','1'),
    ('Chi tiet C1','Tinh che','2'),
    ('Chi tiet C1','Hoan thien','3'),
    ('Chi tiet C2','So che','1'),
    ('Chi tiet C2','Tinh che','2'),
    ('Chi tiet C2','Hoan thien','3'),
    ('Chi tiet C3','So che','1'),
    ('Chi tiet C3','Tinh che','2'),
    ('Chi tiet C3','Hoan thien','3')
) AS T (itemId,stepId,[order])

-- DROP TABLE #SX
SELECT *
INTO #SX
FROM (
    VALUES 
    (2,'Dong goi', 'San pham A', 100,0),
    (8,'Hoan thien', 'Cum B2', 150,10),
    (3,'Hoan thien', 'Cum B1', 300,10)
) AS T (code,stepId, itemId, quantity, error)

SELECT *
FROM #BOM

SELECT *
FROM #ROUTING

SELECT *
FROM #SX

SELECT PO.code,
PO.parent,
PO.[time],
PO.shift,
PO.stepId,
PO.itemId,
PO.quantity mucTieu,
SX.quantity daSanXuat,
SX.error,
B.materials,
B.rate,
(PO.quantity*B.rate) phoiCan, 
TH.phoiDaNhan,
TH.phoiLoi,
TH.dat,
SX.quantity*B.rate phoiTieuHao, 
((PO.quantity*B.rate) - Th.dat) phoiConThieu,
(TH.dat - SX.quantity*B.rate) phoiTon,
(TH.dat - SX.quantity*B.rate)/B.rate sanSang,
PO.quantity - SX.quantity conPhaiSX,
CONCAT(TH.dat/(PO.quantity*B.rate)*100, ' %') tyLeDongBo
FROM prod.PO PO
LEFT JOIN #BOM B ON B.itemId = PO.itemId
LEFT JOIN #SX SX ON SX.code = PO.code
LEFT JOIN (
    SELECT SX.itemId,SUM(SX.quantity) phoiDaNhan,SUM(SX.error) phoiLoi, (SUM(SX.quantity) - SUM(SX.error)) dat
    FROM prod.PO PO
    LEFT JOIN #SX SX ON SX.code = PO.code
    WHERE PO.parent = 2
    GROUP BY SX.itemId
) TH ON TH.itemId = B.materials
WHERE PO.code = 2

