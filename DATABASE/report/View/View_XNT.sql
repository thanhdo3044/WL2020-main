-- Xuất
SELECT *
FROM (
    SELECT [DATE],DEPARTMENT_ID ,ITEM_ID,SUM(QUANTITY) XUAT
    FROM (
        SELECT CONVERT(DATE,P.CREATE_DATE) DATE, P.SOURCE_ID DEPARTMENT_ID, IIP.ITEM_ID,IIP.QUANTITY
        FROM prod.PACKAGE P
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
    GROUP BY L0.[DATE], L0.DEPARTMENT_ID, L0.ITEM_ID
) X

-- Xuất trừ tồn (Xuất nguyên vật liệu, để tính tồn nguyên vật liệu)
 SELECT * 
 FROM(
    SELECT [DATE],DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) XTT
    FROM (
        SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.SOURCE_ID  DEPARTMENT_ID, MIP.ITEM_ID, MIP.QUANTITY
        FROM prod.PACKAGE P
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
    ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
    GROUP BY L0.[DATE], L0.DEPARTMENT_ID, L0.ITEM_ID
) XTT 

-- Nhập
SELECT *
FROM (
    SELECT [DATE],DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) NHAP
    FROM (
        SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.DESTINATION_ID DEPARTMENT_ID, IIP.ITEM_ID,IIP.QUANTITY
        FROM prod.PACKAGE P
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
    GROUP BY L0.[DATE], L0.DEPARTMENT_ID, L0.ITEM_ID
) N



-- merge
SELECT XNT.[DATE],XNT.DEPARTMENT_ID, D.NAME DEPARTMENT_NAME,XNT.ITEM_ID, I.NAME ITEM_NAME, SUM(XNT.XUAT) XUAT_TP, SUM(XNT.NHAP) NHAP_NVL, SUM(XNT.XTT) XUAT_NVL
FROM 
(
    SELECT CASE
                    WHEN X.DATE IS NOT NULL THEN X.[DATE]
                    WHEN N.DATE IS NOT NULL THEN N.[DATE]
                    WHEN XTT.DATE IS NOT NULL THEN XTT.[DATE]
                END AS [DATE],
                CASE
                    WHEN X.DEPARTMENT_ID IS NOT NULL THEN X.DEPARTMENT_ID
                    WHEN N.DEPARTMENT_ID IS NOT NULL THEN N.DEPARTMENT_ID
                    WHEN XTT.DEPARTMENT_ID IS NOT NULL THEN XTT.DEPARTMENT_ID
                END AS DEPARTMENT_ID,
                CASE
                    WHEN X.ITEM_ID IS NOT NULL THEN X.ITEM_ID
                    WHEN N.ITEM_ID IS NOT NULL THEN N.ITEM_ID
                    WHEN XTT.ITEM_ID IS NOT NULL THEN XTT.ITEM_ID
                END AS ITEM_ID,
                X.XUAT,
                N.NHAP,
                XTT.XTT
    FROM (
        SELECT [DATE],DEPARTMENT_ID ,ITEM_ID,SUM(QUANTITY) XUAT
        FROM (
            SELECT CONVERT(DATE,P.CREATE_DATE) DATE, P.SOURCE_ID DEPARTMENT_ID, IIP.ITEM_ID,IIP.QUANTITY
            FROM prod.PACKAGE P
            LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
        GROUP BY L0.[DATE], L0.DEPARTMENT_ID, L0.ITEM_ID
    ) X
    FULL OUTER JOIN (
        SELECT [DATE],DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) XTT
        FROM (
            SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.SOURCE_ID  DEPARTMENT_ID, MIP.ITEM_ID, MIP.QUANTITY
            FROM prod.PACKAGE P
            LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
            LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
        ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
        GROUP BY L0.[DATE], L0.DEPARTMENT_ID, L0.ITEM_ID
    ) XTT ON XTT.[DATE] = X.[DATE] AND XTT.DEPARTMENT_ID = X.DEPARTMENT_ID AND XTT.ITEM_ID = X.ITEM_ID
    FULL OUTER JOIN (
        SELECT [DATE],DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) NHAP
        FROM (
            SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.DESTINATION_ID DEPARTMENT_ID, IIP.ITEM_ID,IIP.QUANTITY
            FROM prod.PACKAGE P
            LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
        GROUP BY L0.[DATE], L0.DEPARTMENT_ID, L0.ITEM_ID
    ) N ON N.[DATE] = X.[DATE] AND N.DEPARTMENT_ID = X.DEPARTMENT_ID AND N.ITEM_ID = X.ITEM_ID
) XNT
LEFT JOIN base.DEPARTMENT D ON D.ID = XNT.DEPARTMENT_ID
LEFT JOIN base.ITEM I ON I.ID = XNT.ITEM_ID
GROUP BY XNT.[DATE],XNT.DEPARTMENT_ID, D.NAME,XNT.ITEM_ID, I.NAME


DECLARE @FROM DATE =  '2019-12-01 00:00:00'
DECLARE @TO DATE = GETDATE()

SELECT XN.DEPARTMENT_ID N'Mã tổ', D.NAME N'Tổ',XN.ITEM_ID N'Mã', I.NAME N'Chi tiết/cụm',XN.XUAT N'Xuất',XN.NHAP N'Nhập',
    CASE WHEN OS.QUANTITY IS NULL THEN 0
        ELSE OS.QUANTITY
    END AS N'Tồn đầu kỳ', 
    CASE WHEN OS.QUANTITY IS NULL THEN XN.NHAP - XN.XUAT
        ELSE XN.NHAP - XN.XUAT + OS.QUANTITY
        END AS N'Tồn'
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
            WHERE P.CREATE_DATE BETWEEN @FROM AND @TO
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
            WHERE P.CREATE_DATE BETWEEN @FROM AND @TO
        ) L0
        GROUP BY L0.DEPARTMENT_ID, L0.ITEM_ID
        ) N ON N.DEPARTMENT_ID = X.DEPARTMENT_ID AND N.ITEM_ID = X.ITEM_ID
    ) XN FULL OUTER JOIN prod.OPENING_STOCK OS ON OS.MONTH = MONTH(@FROM) AND OS.ITEM_ID = XN.ITEM_ID AND OS.DEPARTMENT_ID = XN.DEPARTMENT_ID
    LEFT JOIN base.DEPARTMENT D ON D.ID = XN.DEPARTMENT_ID
    LEFT JOIN base.ITEM I ON I.ID = XN.ITEM_ID
    ORDER BY D.ID, I.ID













-- 