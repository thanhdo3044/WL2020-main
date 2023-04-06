
SELECT R.[DATE],R.STEP,R.NAME,R.ITEM_ID,R.ITEM_NAME,R.UNIT,SUM(R.XUAT),SUM(R.NHAP),SUM(R.TON),SUM(R.XTT)
FROM (
    SELECT XNT.[DATE],
    XNT.STEP,
    S.NAME,
    I.ID ITEM_ID,
    '['+ CAST( CAST(I.LENGTH AS INT) AS NVARCHAR(50)) + ' ' + CAST( CAST(I.WIDTH AS INT) AS NVARCHAR(50)) + ' ' + CAST( CAST(I.HEIGHT AS INT) AS NVARCHAR(50)) + '] ' + I.NAME ITEM_NAME,
    U.NAME UNIT,
    XNT.XUAT,
    XNT.NHAP,
    XNT.TON,
    XNT.XTT
    FROM (
        SELECT 
            CASE
                WHEN X.DATE IS NOT NULL THEN X.[DATE]
                WHEN N.DATE IS NOT NULL THEN N.[DATE]
                WHEN XTT.DATE IS NOT NULL THEN XTT.[DATE]
            END AS [DATE],
            CASE
                WHEN X.STEP IS NOT NULL THEN X.STEP
                WHEN N.STEP IS NOT NULL THEN N.STEP
                WHEN XTT.STEP IS NOT NULL THEN XTT.STEP
            END AS STEP,
            CASE
                WHEN X.ITEM_ID IS NOT NULL THEN X.ITEM_ID
                WHEN N.ITEM_ID IS NOT NULL THEN N.ITEM_ID
                WHEN XTT.ITEM_ID IS NOT NULL THEN XTT.ITEM_ID
            END AS ITEM_ID,
            X.XUAT,
            N.NHAP,
            CASE 
                WHEN N.NHAP IS NULL AND XTT.XTT IS NOT NULL THEN XTT.XTT * (-1)
                WHEN N.NHAP IS NOT NULL AND XTT.XTT IS NULL THEN N.NHAP
                WHEN N.NHAP IS NULL AND XTT.XTT IS NULL THEN 0
                ELSE N.NHAP -  XTT  
            END AS TON,
            XTT.XTT
        FROM (
            SELECT [DATE],SOURCE_ID STEP,ITEM_ID,SUM(QUANTITY) XUAT
            FROM (
                SELECT CONVERT(DATE,P.CREATE_DATE) DATE, P.SOURCE_ID, IIP.ITEM_ID,IIP.QUANTITY
                FROM prod.PACKAGE P
                LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                WHERE P.SOURCE_ID <> 100001 
                AND P.SOURCE_ID <> 100098              --100001 100098  Xe nâng không cần thống kê
            ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
            GROUP BY L0.[DATE], L0.SOURCE_ID, L0.ITEM_ID
        ) X
        FULL OUTER JOIN (
            SELECT [DATE],STEP,ITEM_ID,SUM(QUANTITY) NHAP
            FROM (
                SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.DESTINATION_ID STEP, IIP.ITEM_ID,IIP.QUANTITY
                FROM prod.PACKAGE P
                LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                WHERE P.SOURCE_ID <> 100001 
                AND P.SOURCE_ID <> 100098              --100001 100098  Xe nâng không cần thống kê
            ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
            GROUP BY L0.[DATE], L0.STEP, L0.ITEM_ID
        ) N ON N.[DATE] = X.[DATE] AND N.STEP = X.STEP AND N.ITEM_ID = X.ITEM_ID
        FULL OUTER JOIN (
            SELECT [DATE],STEP,ITEM_ID,SUM(QUANTITY) XTT
            FROM (
                SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.SOURCE_ID  STEP, MIP.ITEM_ID, MIP.QUANTITY
                FROM prod.PACKAGE P
                LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
                WHERE P.SOURCE_ID <> 100001 
                AND P.SOURCE_ID <> 100098              --100001 100098  Xe nâng không cần thống kê
            ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
            GROUP BY L0.[DATE], L0.STEP, L0.ITEM_ID
        ) XTT ON XTT.[DATE] = X.[DATE] AND XTT.STEP = X.STEP AND XTT.ITEM_ID = X.ITEM_ID
    ) XNT
    LEFT JOIN base.ITEM I ON I.ID = XNT.ITEM_ID
    LEFT JOIN base.UNIT U ON U.ID =  I.UNIT_ID
    LEFT JOIN base.DEPARTMENT S ON S.ID = XNT.STEP
    --WHERE XNT.[DATE] = '2019-12-23'
    --ORDER BY XNT.[DATE] ASC,STEP ASC, ITEM_ID ASC
) R
GROUP BY R.[DATE],R.STEP,R.NAME,R.ITEM_ID,R.ITEM_NAME,R.UNIT










