SELECT *
FROM 
(
SELECT 
    CASE
        WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[ID]
        WHEN L1.TYPE = N'Nhà máy' THEN L1.[ID]
        WHEN L2.TYPE = N'Nhà máy' THEN L2.[ID]
        WHEN L3.TYPE = N'Nhà máy' THEN L3.[ID]
        ELSE '-'
    END AS 'factoryId',
    CASE
        WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[NAME]
        WHEN L1.TYPE = N'Nhà máy' THEN L1.[NAME]
        WHEN L2.TYPE = N'Nhà máy' THEN L2.[NAME]
        WHEN L3.TYPE = N'Nhà máy' THEN L3.[NAME]
        ELSE '-'
    END AS 'Nhà máy',
    CASE
        WHEN L0.[TYPE] = N'Xưởng' OR L0.[TYPE] = N'Kho' THEN L0.[NAME]
        WHEN L1.TYPE = N'Xưởng' OR L1.[TYPE] = N'Kho' THEN L1.[NAME]
        WHEN L2.TYPE = N'Xưởng' OR L2.[TYPE] = N'Kho' THEN L2.[NAME]
        WHEN L3.TYPE = N'Xưởng' OR L3.[TYPE] = N'Kho' THEN L3.[NAME]
        ELSE '-'
    END AS 'Kho/Xưởng',
    CASE
        WHEN L0.[TYPE] = N'Tổ' OR L0.[TYPE] = N'QC' THEN L0.NAME
        WHEN L1.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L1.[NAME]
        WHEN L2.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L2.[NAME]
        WHEN L3.TYPE = N'Tổ' OR L0.[TYPE] = N'QC' THEN L3.[NAME]
        ELSE '-'
    END AS 'Tổ',
    CASE
        WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
        WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
        WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
        WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
        ELSE '-'
    END AS 'Nhóm',
    A.departmentId,
    A.departmentCode,
    A.departmentName,
    A.[year],
    A.week,
    A.dayOfWeek,
    A.parentId,
    A.parentName,
    A.itemId,
    A.itemName,
    A.rate,
    A.volumn,
    A.quantity
FROM 
(
SELECT 
CASE
    WHEN DIM.departmentId IS NULL THEN DT.departmentId
    ELSE DIM.departmentId
END AS departmentId,
CASE
    WHEN DIM.departmentId IS NULL THEN DT.departmentCode
    ELSE DIM.departmentCode
END AS departmentCode,
CASE
    WHEN DIM.departmentId IS NULL THEN DT.departmentName
    ELSE DIM.departmentName
END AS departmentName,
CASE
    WHEN DIM.departmentId IS NULL THEN DT.[year]
    ELSE DIM.[year]
END AS [year],
CASE
    WHEN DIM.departmentId IS NULL THEN DT.[week]
    ELSE DIM.[week]
END AS [week],
CASE
    WHEN DIM.departmentId IS NULL THEN DT.[dayOfWeek]
    ELSE DIM.[dayOfWeek]
END AS [dayOfWeek],
DIM.parentId,
DIM.parentName,
CASE 
    WHEN DT.itemId IS NULL THEN M.ID
    ELSE DT.itemId
END AS itemId,
CASE
    WHEN DT.itemId IS NULL THEN M.NAME
    ELSE DT.itemName
END AS itemName,
DIM.RATE rate,
CASE
    WHEN DT.itemId IS NULL THEN 0
    ELSE DT.volumn
END AS volumn,
CASE
    WHEN DT.itemId IS NULL THEN 0
    ELSE DT.quantity
END AS quantity
FROM (
    SELECT *
    FROM (
        SELECT 
        P.SOURCE_ID departmentId,
        D.[CODE] departmentCode,
        D.[NAME] departmentName,
        GD.[YEAR] [year],
        GD.WEEK week,
        IP.ID parentId,
        IP.NAME parentName
        FROM prod.PACKAGE P
        LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
        LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
        LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
        WHERE P.DESTINATION_ID <> 100078
        AND  P.DESTINATION_ID <> 100079
        AND  P.DESTINATION_ID <> 100080
        AND  P.DESTINATION_ID <> 100081
        AND GD.[YEAR] = 2020
        AND GD.WEEK = 2020
        --AND P.SOURCE_ID = @DEPARTMENT_ID
        AND IP.ID IS NOT NULL
        GROUP BY P.SOURCE_ID ,
        D.CODE,
        D.NAME ,
        GD.[YEAR] ,
        GD.WEEK ,
        IP.ID ,
        IP.NAME
    ) PR
    LEFT JOIN prod.BOM B ON B.ITEM_ID = PR.parentId
    LEFT JOIN (
        SELECT N'Thứ 2' dayOfWeek
        UNION ALL
        SELECT N'Thứ 3' dayOfWeek
        UNION ALL
        SELECT N'Thứ 4' dayOfWeek
        UNION ALL
        SELECT N'Thứ 5' dayOfWeek
        UNION ALL
        SELECT N'Thứ 6' dayOfWeek
        UNION ALL
        SELECT N'Thứ 7' dayOfWeek
    ) T ON 1 = 1
) DIM
FULL OUTER JOIN (
    SELECT 
    P.SOURCE_ID departmentId,
    D.[CODE] departmentCode,
    D.[NAME] departmentName,
    GD.[YEAR] [year],
    GD.WEEK week,
    GD.WEEK_DAY dayOfWeek,
    GD.DATE date,
    IP.ID parentId,
    IP.NAME parentName,
    B.RATE rate,
    IIP.ITEM_ID itemId,   
    I.NAME itemName,
    U.NAME unit,
    I.LENGTH length,
    I.WIDTH width,
    I.HEIGHT height,
    I.VOLUMN * SUM(IIP.QUANTITY) volumn,
    SUM(IIP.QUANTITY) quantity
    FROM prod.PACKAGE P
    LEFT JOIN base.GLOBAL_DATE GD ON GD.CODE = CAST(P.CREATE_DATE AS DATE)
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.ITEM I ON I.ID  = IIP.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID = I.UNIT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM IP ON IP.ID = B.ITEM_ID
    WHERE P.DESTINATION_ID <> 100078
    AND  P.DESTINATION_ID <> 100079
    AND  P.DESTINATION_ID <> 100080
    AND  P.DESTINATION_ID <> 100081
    AND GD.[YEAR] = 2020
    AND GD.WEEK = 22
    --AND P.SOURCE_ID = @DEPARTMENT_ID
    GROUP BY P.SOURCE_ID ,
    D.CODE,
    D.NAME ,
    GD.[YEAR] ,
    GD.WEEK ,
    GD.WEEK_DAY,
    GD.DATE ,
    IP.ID ,
    IP.NAME ,
    B.RATE ,
    IIP.ITEM_ID ,   
    I.NAME ,
    U.NAME,
    I.LENGTH ,
    I.WIDTH ,
    I.HEIGHT ,
    I.VOLUMN
) DT ON DT.parentId = DIM.parentId AND DT.itemId = DIM.MATERIALS_ID AND DT.dayOfWeek = DIM.dayOfWeek
LEFT JOIN base.ITEM M ON M.ID = DIM.MATERIALS_ID
) A
LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.departmentId
LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
) X
WHERE X.factoryId = 100000

select * from prod.PO
left join (
select ITEM_ID, sum(QUANTITY) tonDauKy from prod.OPENING_STOCK
where PO_ID is null
group by ITEM_ID
) os on os.ITEM_ID = prod.PO.itemId
where code = 11

select * from prod.PACKAGE

select * from base.ITEM