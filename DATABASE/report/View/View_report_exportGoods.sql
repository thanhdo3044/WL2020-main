CREATE OR ALTER VIEW Report_exportGoods
AS
SELECT L2.[DATE],FS.NAME N'Nhà máy', XS.NAME N'Xưởng', DS.NAME N'Bộ phận',FD.NAME FACTORY_DETINATION, XD.NAME XUONG_DETINATION, DD.NAME N'Nơi xuất',L2.ITEM_ID, 
'['+ CAST( CAST(I.LENGTH AS INT) AS NVARCHAR(50)) + ' ' + CAST( CAST(I.WIDTH AS INT) AS NVARCHAR(50)) + ' ' + CAST( CAST(I.HEIGHT AS INT) AS NVARCHAR(50)) + '] ' + I.NAME N'Chi tiết/cụm',
L2.QUANTITY N'Thanh',
((I.LENGTH * I.WIDTH * I.HEIGHT) * L2.QUANTITY) / 1000000000 'M3'
FROM (
    SELECT L1.[DATE],SS.DEPARTMENT_ID SOURCE_ID,DOD.DEPARTMENT_ID DESTINATION_ID,L1.ITEM_ID,L1.QUANTITY
    FROM (
        SELECT [DATE],SOURCE_ID,DESTINATION_ID,ITEM_ID,SUM(QUANTITY) QUANTITY
        FROM (
            SELECT CONVERT(DATE,P.CREATE_DATE) DATE, P.SOURCE_ID,P.DESTINATION_ID, IIP.ITEM_ID,IIP.QUANTITY
            FROM dbo.PACKAGE P
            LEFT JOIN dbo.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
            WHERE P.SOURCE_ID <> 100001 
            AND P.SOURCE_ID <> 100098              --100001 100098  Xe nâng không cần thống kê
        ) L0 -- Lấy ra số lượng item chuyển đi sang công đoạn khác, loại bỏ những công đoạn không cần thiết ( xe nâng dữ liệu null )
        GROUP BY L0.[DATE], L0.SOURCE_ID,L0.DESTINATION_ID, L0.ITEM_ID
    ) L1 -- Tổng hợp số lượng sản phẩm chuyển sang công đoạn khác theo ngày, công đoạn, sản phẩm.
    LEFT JOIN base.STEP SS ON SS.ID = L1.SOURCE_ID -- Lấy ra bộ phận của công đoạn
    LEFT JOIN base.STEP SOD ON SOD.DEPARTMENT_ID = SS.DEPARTMENT_ID AND SOD.ID = L1.DESTINATION_ID -- join với công đoạn mà phải chung công đoạn và đích giống với công đoạn đó, để loại đi
    LEFT JOIN base.STEP DOD ON DOD.ID = L1.DESTINATION_ID
    WHERE SOD.ID IS NULL
) L2 -- upto lên cấp bộ phận
LEFT JOIN base.DEPARTMENT DS ON DS.ID = L2.SOURCE_ID
LEFT JOIN base.XUONG XS ON XS.ID = DS.XUONG_ID
LEFT JOIn base.FACTORY FS ON FS.ID = XS.FACTORY_ID
LEFT JOIN base.DEPARTMENT DD ON DD.ID = L2.DESTINATION_ID
LEFT JOIN base.XUONG XD ON XD.ID = DD.XUONG_ID
LEFT JOIN base.FACTORY FD ON FD.ID = XD.FACTORY_ID
LEFT JOIN base.ITEM I ON I.ID = L2.ITEM_ID
WHERE DS.ID <> 100006 AND DS.ID <> 100015 -- bỏ thống kê của QC



--SELECT * FROM Report_exportGoods












