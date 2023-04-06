
CREATE OR ALTER VIEW View_baoCaoTinhHinhTHucHien
AS
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

