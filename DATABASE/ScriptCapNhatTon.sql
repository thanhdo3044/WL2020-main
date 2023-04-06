
--select * from prod.OPENING_STOCK
DECLARE @YEAR INT = YEAR(GETDATE())
DECLARE @WEEK INT = DATEPART(WK,GETDATE()) - 1
DECLARE @FACTORY_ID INT = 100000


DELETE prod.OPENING_STOCK
WHERE YEAR([DATE]) = @YEAR
AND WEEK = DATEPART(WK,GETDATE())

-- select * from prod.OPENING_STOCK
INSERT INTO prod.OPENING_STOCK([DATE], [MONTH], WEEK,DEPARTMENT_ID,ITEM_ID,QUANTITY)
SELECT 
GETDATE(),
MONTH(GETDATE()),
DATEPART(WK,GETDATE()),
CASE
    WHEN A.departmentId IS NOT NULL THEN A.departmentId
    ELSE OS.DEPARTMENT_ID
END AS departmentId,
CASE
    WHEN A.itemId IS NOT NULL THEN A.itemId
    ELSE OS.ITEM_ID
END AS itemId,
CASE 
    WHEN A.departmentId IS NOT NULL THEN A.[Tồn]
    ELSE OS.QUANTITY
END AS quantity
FROM (
select 
X.departmentId,
X.itemId,
X.[Tồn]
FROM (
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
    A.DEPARTMENT_ID departmentId,
    A.ITEM_ID itemId,
    A.ITEM_NAME N'Sản phẩm',
    A.VOLUMN N'Khối lượng',
    A.XUAT N'Xuất',
    A.NHAP N'Nhập',
    A.TONDAUKY N'Tồn đầu kỳ',
    A.TON N'Tồn',
    (A.NHAP * A.VOLUMN) N'Nhập m3',
    (A.XUAT * A.VOLUMN) N'Xuất m3',
    A.TONDAUKY * A.VOLUMN N'Tồn đầu kỳ m3',
    A.TON * A.VOLUMN N'Tồn m3'
    FROM (
        SELECT 
        XN.DEPARTMENT_ID, 
        D.NAME DEPARTMENT_NAME,
        XN.ITEM_ID, 
        I.NAME ITEM_NAME,
        I.VOLUMN,
        XN.XUAT ,
        XN.NHAP ,
        CASE WHEN OS.QUANTITY IS NULL THEN 0
            ELSE OS.QUANTITY
        END AS TONDAUKY, 
        CASE WHEN OS.QUANTITY IS NULL THEN XN.NHAP - XN.XUAT
            ELSE XN.NHAP - XN.XUAT + OS.QUANTITY
            END AS TON
        FROM (
            SELECT
                CASE WHEN X.DEPARTMENT_ID IS NOT NULL THEN X.DEPARTMENT_ID
                    ELSE N.DEPARTMENT_ID
                END AS DEPARTMENT_ID,
                CASE WHEN X.ITEM_ID IS NOT NULL THEN X.ITEM_ID
                    ELSE N.ITEM_ID 
                END AS ITEM_ID,
                CASE WHEN X.XUAT IS NULL THEN 0
                    ELSE X.XUAT
                END AS XUAT,
                CASE WHEN N.NHAP IS NULL THEN 0
                    ELSE N.NHAP
                END AS NHAP
            FROM (
            -- Xuất nvl
            SELECT DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) XUAT
            FROM (
                SELECT P.SOURCE_ID  DEPARTMENT_ID, MIP.ITEM_ID, MIP.QUANTITY
                FROM prod.PACKAGE P
                LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
                WHERE YEAR(P.CREATE_DATE) = @YEAR AND DATEPART(WK, P.CREATE_DATE) = @WEEK
            ) L0
            GROUP BY L0.DEPARTMENT_ID, L0.ITEM_ID
            ) X
            FULL OUTER JOIN (
            -- Nhập nvl
            SELECT DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) NHAP
            FROM (
                SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.DESTINATION_ID DEPARTMENT_ID, IIP.ITEM_ID,IIP.QUANTITY
                FROM prod.PACKAGE P
                LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                WHERE YEAR(P.CREATE_DATE) = @YEAR AND DATEPART(WK, P.CREATE_DATE) = @WEEK
            ) L0
            GROUP BY L0.DEPARTMENT_ID, L0.ITEM_ID
            ) N ON N.DEPARTMENT_ID = X.DEPARTMENT_ID AND N.ITEM_ID = X.ITEM_ID
        ) XN FULL OUTER JOIN prod.OPENING_STOCK OS ON OS.ITEM_ID = XN.ITEM_ID AND OS.DEPARTMENT_ID = XN.DEPARTMENT_ID AND OS.WEEK = @WEEK AND YEAR(OS.[DATE]) = @YEAR
        LEFT JOIN base.DEPARTMENT D ON D.ID = XN.DEPARTMENT_ID
        LEFT JOIN base.ITEM I ON I.ID = XN.ITEM_ID
    ) AS A
    LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
    LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
    LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
    LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
) X
where X.factoryId = @FACTORY_ID
) A
FULL OUTER JOIN (
    SELECT *
    FROM prod.OPENING_STOCK
) OS ON OS.DEPARTMENT_ID = A.departmentId AND OS.ITEM_ID = A.itemId