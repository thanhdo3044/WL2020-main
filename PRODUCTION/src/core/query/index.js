module.exports = {
    View_in_not_verify: `SELECT STEP_ID,STEP_NEXT_ID,ITEM_ID,PASS,PALLET_ID,PALLET_CODE,PACKAGE_ID,CREATE_BY,CREATE_DATE 
                        FROM prod.View_in_not_verify
                        WHERE STEP_NEXT_ID = @STEP_ID`,
    View_in_not_verify_item: `SELECT ID,ITEM_ID,QUANTITY FROM prod.View_in_not_verify_item
                            WHERE STEP_NEXT_ID = @STEP_ID`,
    View_not_verify: `SELECT STEP_ID,STEP_NEXT_ID,ITEM_ID,PASS,PALLET_ID,PALLET_CODE,PACKAGE_ID,CREATE_BY,CREATE_DATE
                        FROM prod.View_out_not_verify
                        WHERE STEP_ID = @STEP_ID`,
    View_not_verify_item: `SELECT ID,ITEM_ID,QUANTITY
                            FROM prod.View_out_not_verify_item
                            WHERE STEP_ID = @STEP_ID`,
    View_not_out: `SELECT * FROM prod.View_not_out
                    WHERE STEP_NEXT_ID = @STEP_ID`,
    View_not_out_item: `SELECT ID,ITEM_ID,QUANTITY FROM prod.View_not_out_item
                        WHERE STEP_NEXT_ID = @STEP_ID`,
    View_packages_not_verify: `SELECT ID,SOURCE_ID,DESTINATION_ID,TYPE_ID,CREATE_BY,CREATE_DATE FROM prod.View_packages_not_verify
                            WHERE DESTINATION_ID = @DESTINATION_ID`,
    View_packages_not_verify_item: `SELECT PACKAGE_ID,ITEM_ID,QUANTITY FROM prod.View_packages_not_verify_item
                                WHERE DESTINATION_ID = @DESTINATION_ID`,
    Proc_verifyPackage: `Proc_verifyPackage`,
    getPackageById: `
    SELECT P.ID packageId,
    CONCAT('PO', P.PO) po,
    F.ID fromId,
    F.NAME fromName,
    T.ID toId,
    T.NAME toName,
    I.ID itemId,
    I.CODE itemCode,
    I.NAME itemName,
    I.LENGTH itemLenght,
    I.WIDTH itemWidth,
    I.HEIGHT itemHeight,
    IIP.QUANTITY quantity,
    C.LAST_NAME createBy,
    P.CREATE_DATE createDate,
    V.LAST_NAME verifyBy,
    P.VERIFY_DATE verifyDate 
    FROM prod.[PACKAGE] P
    left join base.DEPARTMENT F ON F.ID = P.SOURCE_ID
    left join base.DEPARTMENT T ON T.ID = P.DESTINATION_ID
    left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
    left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    left join base.ITEM I ON I.ID = IIP.ITEM_ID
    left join base.ACCOUNT C ON C.ID = P.CREATE_BY
    left join base.ACCOUNT V ON V.ID = P.VERIFY_BY
    WHERE P.ID = @packageId 
    
    `,
    Proc_createPackage: `Proc_createPackage`,
    getPalletByCode: `SELECT PL.ID,PL.PARCEL,WT.[NAME] WOOD_TYPE_NAME,PO.NAME PRODUCTION_ORDERS_NAME,PL.CREATE_BY,PL.CREATE_DATE, PL.TYPE_ID
                        FROM prod.[PALLET] PL
                        LEFT JOIN prod.WOOD_TYPE WT ON WT.ID = PL.WOOD_TYPE_ID
                        LEFT JOIN prod.PRODUCTION_ORDERS PO ON PO.ID = PL.PRODUCTION_ORDERS_ID
                        WHERE PL.CODE = @CODE`,
    View_kilnBatch: `SELECT * FROM prod.View_kilnBatch`,
    View_palletInKilnBatch: `SELECT * FROM prod.View_palletInKilnBatch`,
    View_itemInPalletInKilnBatch: `SELECT * FROM prod.View_itemInPalletInKilnBatch`,
    addSuppliesForPallet: `INSERT INTO prod.PALLET_SUPPLIES(GUID,STEP_OF_PALLET_ID,SUPPLIES_ID,QUANTITY,PARCEL_ID,PARCEL,VENDOR_ID,CREATE_BY,CREATE_DATE)
                            VALUES (NEWID(),@STEP_OF_PALLET_ID,@SUPPLIES_ID,@QUANTITY,@PARCEL_ID,@PARCEL,@VENDOR_ID,@CREATE_BY,GETDATE())`,
    getSuppliesByPalletId: `SELECT SOP.STEP_ID,PLS.SUPPLIES_ID,PLS.QUANTITY,PC.CODE PARCEL_CODE,PLS.PARCEL,PLS.VENDOR_ID,PLS.CREATE_BY,PLS.CREATE_DATE
                            FROM prod.PALLET_SUPPLIES PLS
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.ID = PLS.STEP_OF_PALLET_ID
                            LEFT JOIN prod.PARCEL PC ON PC.ID = PLS.PARCEL_ID
                            WHERE SOP.PALLET_ID = @PALLET_ID`,
    getKilnBatch: `SELECT KB.ID ID,
                    KB.[YEAR],KB.[WEEK],KB.[NUMBER],
                    KB.KILN_ID,
                    KB.TIME_OUT_TARGET,
                    KB.CREATE_BY,
                    KB.CREATE_DATE,
                    COUNT(SOP.ID) TOTAL_PALLET
                    FROM prod.[KILN_BATCH] KB
                    LEFT JOIN prod.[STEP_OF_PALLET] SOP ON SOP.KILN_BATCH_ID = KB.ID
                    LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                    WHERE KB.TIME_OUT_REAL IS NULL
                    GROUP BY KB.ID,
                    KB.[YEAR],KB.[WEEK],KB.[NUMBER],
                    KB.KILN_ID,
                    KB.TIME_OUT_TARGET,
                    KB.CREATE_BY,
                    KB.CREATE_DATE
                   `,
    baoCaoTinhHinhThucHien: `	SELECT WEEKDAY,WEEK,DATE,FACTORY,XUONG,DEPARTMENT,SOURCE_ID,SOURCE,DESTINATION_ID,DESTINATION,PARENT,ITEM_CODE,ITEM_NAME,ITEM_LENGTH,ITEM_WIDTH,ITEM_HEIGHT,RATE,SUM(QUANTITY) QUANTITY,STEP_DES
    FROM (
    SELECT 
        CASE
        WHEN DATENAME(WEEKDAY, P.CREATE_DATE) = 'Monday' THEN N'Thứ 2'
        WHEN DATENAME(WEEKDAY, P.CREATE_DATE) = 'Tuesday' THEN N'Thứ 3'
        WHEN DATENAME(WEEKDAY, P.CREATE_DATE) = 'Wednesday' THEN N'Thứ 4'
        WHEN DATENAME(WEEKDAY, P.CREATE_DATE) = 'Thursday' THEN N'Thứ 5'
        WHEN DATENAME(WEEKDAY, P.CREATE_DATE) = 'Friday' THEN N'Thứ 6'
        WHEN DATENAME(WEEKDAY, P.CREATE_DATE) = 'Saturday' THEN N'Thứ 7'
        WHEN DATENAME(WEEKDAY, P.CREATE_DATE) = 'Sunday' THEN N'Chủ nhật'
        ELSE  DATENAME(WEEKDAY, P.CREATE_DATE)
        END AS WEEKDAY,
    DATEPART(WEEK,P.CREATE_DATE) [WEEK],CONVERT(DATE,P.CREATE_DATE) DATE,F.[NAME] FACTORY,X.[NAME] XUONG,DE.[NAME] DEPARTMENT,S.ID SOURCE_ID,S.[NAME] SOURCE,D.ID DESTINATION_ID,D.[NAME] DESTINATION,PRI.[NAME] PARENT,I.CODE ITEM_CODE, I.[NAME] ITEM_NAME,I.[LENGTH] ITEM_LENGTH, I.[WIDTH] ITEM_WIDTH,I.HEIGHT ITEM_HEIGHT,B.RATE, IIP.QUANTITY,SD.ID STEP_DES
    FROM prod.PACKAGE P
    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
    LEFT JOIN base.STEP S ON S.ID = P.SOURCE_ID
    LEFT JOIN base.DEPARTMENT DE ON DE.ID = S.DEPARTMENT_ID
    LEFT JOIN base.XUONG X ON X.ID = DE.XUONG_ID
    LEFT JOIN base.FACTORY F ON F.ID = X.ID
	LEFT JOIN base.STEP D ON D.ID = P.DESTINATION_ID
    LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
    LEFT JOIN prod.BOM B ON B.MATERIALS_ID = I.ID
    LEFT JOIN base.ITEM PRI ON PRI.ID = B.ITEM_ID
	LEFT JOIN (
		SELECT ST.ID
		FROM base.STEP ST
		LEFT JOIN base.DEPARTMENT DPM ON DPM.ID = ST.DEPARTMENT_ID
		WHERE DPM.ID = @DEPARTMENT_ID -- Lấy các công đoạn thuộc bộ phận đó để loại đi dữ liệu xuất trong tổ
	) SD ON SD.ID = D.ID
	WHERE DE.ID = @DEPARTMENT_ID -- Lấy theo cấp bộ phận
	AND D.ID <> 100025 -- Bỏ các trường hợp xuất sang QC
    ) DATA
	WHERE [WEEK] = @WEEK -- Tuần
	AND STEP_DES IS NULL
    GROUP BY WEEKDAY,[WEEK], DATE,FACTORY,XUONG,DEPARTMENT,SOURCE_ID,SOURCE,DESTINATION_ID,DESTINATION,PARENT,ITEM_CODE,ITEM_NAME,ITEM_LENGTH,ITEM_WIDTH,ITEM_HEIGHT,RATE,STEP_DES
    ORDER BY DATE ASC`,
    getProductOfOrder: `SELECT ID,PRODUCT_ID,QUANTITY
                        FROM prod.PRODUCT_OF_ORDERS
                        WHERE PRODUCTION_ORDERS_ID = @PRODUCTION_ORDERS_ID
                        `,
    getItemOfPalletId: `SELECT ITEM_ID,QUANTITY
                        FROM prod.[ITEM_IN_PALLET]
                        WHERE PALLET_ID = @PALLET_ID`,
    getStepOfPalletId: `SELECT ID,STEP_ID,STEP_NEXT_ID,PASS,NOT_PASS,KILN_BATCH_ID,PLAN_ID
                        FROM prod.[STEP_OF_PALLET]
                        WHERE PALLET_ID = @PALLET_ID`,
    getPackageOfPalletId: `SELECT P.ID,P.STEP_OF_PALLET_ID,P.SOURCE_ID,P.DESTINATION_ID,TYPE_ID,P.CREATE_BY,P.CREATE_DATE,P.VERIFY_BY,P.VERIFY_DATE
                            FROM prod.[PACKAGE] P
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.ID = P.STEP_OF_PALLET_ID
                            WHERE SOP.PALLET_ID = @PALLET_ID`,
    getStepNextIdByPalletId: `EXECUTE [dbo].[Proc_getStepNextId] 
                            @PALLET_ID = @PALLET_ID`,
    getPalletWithIkeaGuid: `SELECT PL.CODE,IIP.QUANTITY
                            FROM prod.PALLET PL
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            WHERE PL.IKEA_GUID = @IKEA_GUID`,
    getBomByProductId: `SELECT ID, ITEM_ID,MATERIALS_ID,RATE 
    FROM prod.[BOM]
    WHERE ITEM_ID = @ITEM_ID`,
    getBom: `SELECT ID,ITEM_ID,MATERIALS_ID,RATE 
                FROM prod.[BOM]`,
    deleteBomWithId: `DELETE prod.[BOM] WHERE ID = @ID AND (factoryId is null or factoryId = @factoryId)`,
    insertBom: `INSERT INTO prod.[BOM]([GUID],ITEM_ID,MATERIALS_ID,RATE,CREATE_BY,CREATE_DATE,factoryId)
                    VALUES(NEWID(),@ITEM_ID,@MATERIALS_ID, @RATE, @ACCOUNT_ID,GETDATE(),@factoryId)`,
    getRouting: `SELECT [ID],[ITEM_ID],[STEP_ID],[ORDER],[CREATE_DATE] FROM prod.[ROUTING]`,
    getRoutingWithItemId: `    SELECT * 
                                FROM prod.[ROUTING]
                                WHERE ITEM_ID = @ITEM_ID`,
    deleteRouting: `DELETE prod.[ROUTING] WHERE ITEM_ID = @ITEM_ID`,
    getParcelWoods: `SELECT PARCEL FROM prod.PALLET GROUP BY PARCEL`,
    createBieuMauKiemTraDoAm: `INSERT INTO prod.BM_KIEM_TRA_DO_AM([KILN_BATCH_ID],[DATA],CREATE_BY,CREATE_DATE)
                            VALUES (@KILN_BATCH_ID,@DATA,@CREATE_BY,GETDATE())`,
    getBieuMauKiemTraDoAm: `SELECT * FROM prod.BM_KIEM_TRA_DO_AM`,
    getBieuMauKiemTraDoAmByKilnBatchId: `SELECT * FROM prod.BM_KIEM_TRA_DO_AM WHERE KILN_BATCH_ID = @KILN_BATCH_ID`,
    createBaoCaoKhuyetTat: `INSERT INTO prod.BC_KHUYET_TAT([KILN_BATCH_ID],[DATA],CREATE_BY,CREATE_DATE)
                            VALUES (@KILN_BATCH_ID,@DATA,@CREATE_BY,GETDATE())`,
    getBaoCaoKhuyetTat: `SELECT * FROM prod.BC_KHUYET_TAT`,
    getBaoCaoKhuyetTatByKilnBatchId: `SELECT * FROM prod.BC_KHUYET_TAT WHERE KILN_BATCH_ID = @KILN_BATCH_ID`,
    getPackageByDestinationIdAndDay: `SELECT P.ID,P.SOURCE_ID,P.DESTINATION_ID,P.CREATE_BY,P.CREATE_DATE
                                    FROM prod.PACKAGE P
                                    WHERE P.DESTINATION_ID = @DESTINATION_ID
                                    AND CREATE_DATE BETWEEN CAST(GETDATE() - 7 AS DATE) AND GETDATE()`, // 7 ngayf
    getItemInPackageByDestinationIdAndDay: `SELECT IIP.PACKAGE_ID,IIP.ITEM_ID,IIP.QUANTITY
                                        FROM prod.ITEM_IN_PACKAGE IIP
                                        LEFT JOIN prod.PACKAGE P ON P.ID = IIP.PACKAGE_ID
                                        WHERE P.DESTINATION_ID = @DESTINATION_ID
                                        AND CREATE_DATE BETWEEN CAST(GETDATE() - 7 AS DATE) AND GETDATE()`, // 7 ngay
    getPackageByDestinationIdAndFromAndDay: `SELECT P.ID,P.SOURCE_ID,P.DESTINATION_ID,P.CREATE_BY,P.CREATE_DATE
                                        FROM prod.PACKAGE P
                                        WHERE P.DESTINATION_ID = @DESTINATION_ID
                                        AND P.SOURCE_ID = @SOURCE_ID
                                        AND CREATE_DATE BETWEEN CAST(GETDATE() - 7 AS DATE) AND GETDATE()`, // 7 ngayf
    getItemInPackageByDestinationIdAndFromAndDay: `SELECT IIP.PACKAGE_ID,IIP.ITEM_ID,IIP.QUANTITY
                                            FROM prod.ITEM_IN_PACKAGE IIP
                                            LEFT JOIN prod.PACKAGE P ON P.ID = IIP.PACKAGE_ID
                                            WHERE P.DESTINATION_ID = @DESTINATION_ID
                                            AND P.SOURCE_ID = @SOURCE_ID
                                            AND CREATE_DATE BETWEEN CAST(GETDATE() - 7 AS DATE) AND GETDATE()`, // 7 ngay,
    getProductionOrders: ` SELECT TOP(10) PO.ID id,PO.CODE code,PO.[NAME] name, PO.[TYPE] type, 
                                POT.ID typeId,
                                POT.NAME typeName,
                                PO.CREATE_BY createBy,PO.CREATE_DATE createDate
                            FROM prod.PRODUCTION_ORDERS PO
                            LEFT JOIN prod.PRODUCTION_ORDERS_TYPE POT ON POT.ID = PO.PRODUCTION_ORDERS_TYPE_ID
                            WHERE FACTORY_ID = @FACTORY_ID
                            ORDER BY PO.ID DESC`,
    getProductionOrdersAll: `SELECT PO.ID id,PO.CODE code,PO.[NAME] name, PO.[TYPE] type, 
                                        PO.ROUTING_NAME routingName,
                                        POT.ID typeId,
                                        POT.NAME typeName,
                                        PO.CREATE_BY createBy,PO.CREATE_DATE createDate
                            FROM prod.PRODUCTION_ORDERS PO
                            LEFT JOIN prod.PRODUCTION_ORDERS_TYPE POT ON POT.ID = PO.PRODUCTION_ORDERS_TYPE_ID
                            WHERE FACTORY_ID = @FACTORY_ID
                            ORDER BY PO.ID DESC`,
    addParcelToProductionOrders: `INSERT INTO prod.PARCEL_WOOD([GUID],PRODUCTION_ORDERS_ID,CODE)
                                    VALUES (NEWID(),@PRODUCTION_ORDERS_ID, @CODE)`,
    getBaoCaoTinhHInhThucHien: `SELECT * FROM View_baoCaoTinhHinhTHucHien
                                WHERE week = @WEEK
                                AND [year] = @YEAR`,
    getView_raw_data: `SELECT * FROM View_raw_data
                        WHERE [Năm] = @YEAR
                        AND [Tuần] = @WEEK
                        `,
    getView_ton: `
    select DISTINCT  *
    FROM (
    SELECT 
        CASE
            WHEN L0.[TYPE] = N'Nhà máy' THEN L0.[factoryId]
            WHEN L1.TYPE = N'Nhà máy' THEN L1.[factoryId]
            WHEN L2.TYPE = N'Nhà máy' THEN L2.[factoryId]
            WHEN L3.TYPE = N'Nhà máy' THEN L3.[factoryId]
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
        A.DEPARTMENT_ID,
		CASE WHEN A.DEPARTMENT_ID in (100274,100264) then 100000
		else
        B.factoryId end NM, CASE WHEN A.ITEM_ID in (120053,120052) then N'XChung Đôn 450,700' 
        WHEN A.ITEM_ID = 120049 THEN  N'Xchung bench 1200,600' 
        WHEN A.ITEM_ID in (126737,125777) THEN N'HOVLIG chId tent' 
		when A.ITEM_ID = 10 THEN 'QC-THO'  ELSE
        CONCAT('[',PR.CODE,'] ',PR.NAME) end AS PARENT,
      
        A.ITEM_ID,
        A.ITEM_NAME SP,
        A.VOLUMN N'Khối lượng',
       
        A.NHAP N'Nhập',
        A.XUAT N'Xuất',
         A.TON
           N'Tồn',
  
        (A.NHAP * A.VOLUMN) N'Nhập m3',
        (A.XUAT * A.VOLUMN) N'Xuất m3',
        A.TON * A.VOLUMN N'Tồn m3'
        FROM (
            SELECT 
            CASE
                WHEN XN.DEPARTMENT_ID IS NOT NULL THEN XN.DEPARTMENT_ID
                ELSE OS.DEPARTMENT_ID
            END AS DEPARTMENT_ID,
            CASE
                WHEN XN.DEPARTMENT_ID IS NOT NULL THEN D.NAME
                ELSE D2.NAME
            END AS DEPARTMENT_NAME,
            CASE 
                WHEN XN.ITEM_ID IS NOT NULL THEN XN.ITEM_ID
                ELSE OS.ITEM_ID
            END AS ITEM_ID,
            CASE
                WHEN XN.ITEM_ID IS NOT NULL THEN I.CODE
                ELSE I2.CODE
            END AS ITEM_CODE,
            CASE
			when XN.ITEM_ID = 10 THEN 'QC-THO'
                WHEN XN.ITEM_ID IS NOT NULL THEN I.NAME
                ELSE I2.NAME
            END AS ITEM_NAME,
            CASE when XN.ITEM_ID = 10 THEN 1
                WHEN XN.ITEM_ID IS NOT NULL THEN I.VOLUMN
                ELSE I2.VOLUMN
            END AS VOLUMN,
            XN.XUAT ,
            XN.NHAP ,
            
            ISNULL(OS.QUANTITY,0) +ISNULL(XN.NHAP,0) - ISNULL(XN.XUAT,0) - ISNULL(XN.LOI,0) AS TON
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
					
                    CASE WHEN L1.LOI IS NULL THEN 0
                    ELSE L1.LOI
                END AS LOI,
               
                    CASE WHEN N.NHAP IS NULL THEN 0
                        ELSE N.NHAP
                    END AS NHAP
				
                    
                FROM (
                -- Xuất nvl
				select * from (
                SELECT DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) XUAT
                FROM (
                    SELECT P.SOURCE_ID  DEPARTMENT_ID,CASE when MIP.ITEM_ID is null then IIP.ITEM_ID else MIP.ITEM_ID end as ITEM_ID,
                    CASE WHEN MIP.QUANTITY is null then IIP.QUANTITY else MIP.QUANTITY end as QUANTITY
                    FROM prod.PACKAGE P
                    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                    LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
                    WHERE P.CREATE_DATE >= '2021-05-06 18:00:45.1033333 +00:00'  AND P.CREATE_DATE  <= @YEAR AND P.TYPE_ID = 100026 AND  P.REMEDIES_ID IS NULL
					and SOURCE_ID not in (100274,100264)
                ) L0
                GROUP BY L0.DEPARTMENT_ID, L0.ITEM_ID
				union all
				 SELECT DEPARTMENT_ID,10 ITEM_ID,SUM(QUANTITY) XUAT
                FROM (
                    SELECT P.SOURCE_ID  DEPARTMENT_ID, IIP.ITEM_ID  as ITEM_ID,
                    IIP.QUANTITY*I.VOLUMN*3 as QUANTITY,I.VOLUMN
                    FROM prod.PACKAGE P
                    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                    LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
					left join base.ITEM I on I.ID = IIP.ITEM_ID
                    WHERE P.CREATE_DATE >= '2021-09-30 18:00:45.1033333 +00:00'  AND P.CREATE_DATE  <= @YEAR AND P.TYPE_ID = 100026 
					and SOURCE_ID  in (100274,100264)
                ) L0
                GROUP BY L0.DEPARTMENT_ID
                ) X1) X
		
                FULL OUTER JOIN (
                -- Nhập nvl
				select * from (
                SELECT DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) NHAP
                FROM (
                    SELECT CONVERT(DATE,P.CREATE_DATE) DATE,P.DESTINATION_ID DEPARTMENT_ID, IIP.ITEM_ID,IIP.QUANTITY
                    FROM prod.PACKAGE P
                    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                    WHERE P.CREATE_DATE >= '2021-05-06 18:00:45.1033333 +00:00' AND P.CREATE_DATE <= @YEAR AND  P.TYPE_ID = 100026 AND P.VERIFY_DATE is not null AND P.KH_VERIFY_BY IS NULL
					and DESTINATION_ID not in (100274,100264)
                ) L0
                GROUP BY L0.DEPARTMENT_ID, L0.ITEM_ID
				union all
				select DESTINATION_ID DEPARTMENT_ID,10 ITEM_ID,SUM(KLC_TH) NHAP from prod.XUAT_GO where DESTINATION_ID in (100274,100264) and createdAt < @YEAR
				GROUP BY DESTINATION_ID
                ) N1)N ON N.DEPARTMENT_ID = X.DEPARTMENT_ID AND N.ITEM_ID = X.ITEM_ID
					
				LEFT JOIN
			
                (select * from
				 (SELECT DEPARTMENT_ID,ITEM_ID,SUM(QUANTITY) LOI
                FROM (
                    SELECT P.SOURCE_ID  DEPARTMENT_ID, MIP.ITEM_ID, MIP.QUANTITY
                    FROM prod.PACKAGE P
                    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                    LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
                    WHERE P.CREATE_DATE >'2021-05-06 18:00:45.1033333 +00:00'  AND P.CREATE_DATE  <= @YEAR  AND P.TYPE_ID = 100004 AND  P.REMEDIES_ID IS NULL
					and SOURCE_ID not in (100274,100264)
                ) L0
                GROUP BY L0.DEPARTMENT_ID, L0.ITEM_ID
				union all
				SELECT DEPARTMENT_ID,10 ITEM_ID,SUM(QUANTITY) LOI
                FROM (
                    SELECT P.SOURCE_ID  DEPARTMENT_ID, MIP.ITEM_ID, MIP.QUANTITY*I.VOLUMN*2.4 QUANTITY
                    FROM prod.PACKAGE P
                    LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                    LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
					left join base.ITEM I on I.ID = IIP.ITEM_ID
                    WHERE P.CREATE_DATE >'2021-05-06 18:00:45.1033333 +00:00'  AND P.CREATE_DATE  <= @YEAR  AND P.TYPE_ID = 100004 AND  P.REMEDIES_ID IS NULL
					and SOURCE_ID in (100274,100264)
                ) L0
                GROUP BY L0.DEPARTMENT_ID
                ) L5 )L1 ON (L1.DEPARTMENT_ID = X.DEPARTMENT_ID and L1.ITEM_ID = X.ITEM_ID) or (L1.DEPARTMENT_ID = N.DEPARTMENT_ID and L1.ITEM_ID = N.ITEM_ID)
            ) XN 
	
          
            FULL OUTER JOIN (
                select ITEM_ID,DEPARTMENT_ID,SUM(QUANTITY) QUANTITY
                from prod.OPENING_STOCK OS
                where OS.createdAt >='2021-05-06 05:00:45.1033333 +00:00' AND OS.createdAt  <= @YEAR and QUANTITY>0 and OS.daXuat = 0 and OS.DEPARTMENT_ID not in (100274,100264)
				GROUP BY DEPARTMENT_ID,ITEM_ID
            ) OS ON OS.ITEM_ID = XN.ITEM_ID AND OS.DEPARTMENT_ID = XN.DEPARTMENT_ID
           
            LEFT JOIN base.DEPARTMENT D ON D.ID = XN.DEPARTMENT_ID
            LEFT JOIN base.ITEM I ON I.ID = XN.ITEM_ID or I.ID = OS.ITEM_ID
            LEFT JOIN base.DEPARTMENT D2 ON D2.ID = OS.DEPARTMENT_ID
            LEFT JOIN base.ITEM I2 ON I2.ID = OS.ITEM_ID
        ) AS A
        LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
        LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
        LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
        LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
        LEFT JOIN (select DISTINCT * from [prod].[STEP_ITEM_SP] 
         ) B ON B.ITEM_ID = A.ITEM_ID and B.STEP_ID = A.DEPARTMENT_ID
        LEFT JOIN base.ITEM PR ON PR.ID = B.paren_id
    ) X
    where X.factoryId = @FACTORY_ID and X.NM = @FACTORY_ID AND  X.DEPARTMENT_ID not in (100274,100264,100013,102484,100071) 
    order by X.SP
    `,
    getBaoCaoQCXuLyHang: `WITH temp(id,NAME)
    as (
            Select id,NAME
            From base.DEPARTMENT
            Where ID = @departmentId
            Union All
            Select d.ID,d.NAME
            From temp as a, base.DEPARTMENT as d
            Where a.id = d.PARENT_ID
    )
    SELECT *
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
        GD.WEEK N'Tuần',
        GD.[DATE] N'Ngày',
        S.CODE N'Mã tổ QC',
        D.NAME N'Kho đến',
        F.NAME N'Nguồn lỗi',
        F.ID nguonloi,
        PT.NAME N'Loại lỗi',
        RM.NAME N'Biện pháp xử lý',
        I.NAME N'Chi tiết/cụm',
        I.LENGTH,
        I.WIDTH,
        I.HEIGHT,IIP.ITEM_ID ITEM_ID,
        IIP.QUANTITY soluong,
        CB.LAST_NAME N'Người tạo',
        P.CREATE_DATE N'Ngày tạo',
        VB.LAST_NAME N'Người nhận',
        P.VERIFY_DATE N'Ngày nhận',P.ID PACKAGE_ID,
        D.ID,
        CB.factoryId hqc,
        po.number,
        IE.CODE,
        i.VOLUMN* iip.QUANTITY volumn,
		case 
		when ie.VERIFY_BY is not null and ie.QC_VERIFY_BY is not null then N'Đã duyệt' 
		else N'Chưa duyệt' end verify
      
        FROM prod.PACKAGE P
        Left join prod.PO po on po.code = P.PO
        LEFT JOIN prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
        LEFT JOIN prod.REMEDIES RM ON RM.ID = P.REMEDIES_ID
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN base.DEPARTMENT S ON S.ID = P.SOURCE_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.DESTINATION_ID
        LEFT JOIN base.DEPARTMENT F ON F.ID = P.ITEM_FROM_ID
        LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
        LEFT JOIN base.GLOBAL_DATE GD ON GD.[DATE] = CAST(P.CREATE_DATE AS DATE)
        LEFT JOIN base.ACCOUNT CB ON CB.ID = P.CREATE_BY
        LEFT JOIN base.ACCOUNT VB ON VB.ID = P.VERIFY_BY
            LEFT JOIN base.DEPARTMENT L0 ON L0.ID = S.ID
        LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
        LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
        LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
        LEFT JOIN prod.QC_ITEM_ERROR IE ON P.ID = IE.PACKAGE_ID
       
        WHERE P.SOURCE_ID = 100081
        AND P.CREATE_DATE BETWEEN @FROM AND @TO
        ) X WHERE X.ID in (select ID
            From temp t)`,
    getBaoCaoHangDayDenKhoQC: `WITH temp(id,NAME)
    as (
            Select id,NAME
            From base.DEPARTMENT
            Where ID = @departmentId
            Union All
            Select d.ID,d.NAME
            From temp as a, base.DEPARTMENT as d
            Where a.id = d.PARENT_ID
    )
    
    SELECT *
        FROM (
        SELECT 
      
    P.ID,
    P.PO,
    P.SOURCE_ID SOURCE_ID,
       S.NAME AS 'congdoan',
      D1.NAME noibaoloi,
            (GD.WEEK - 1) N'Tuần',
            GD.[DATE] N'Ngày',
            D.CODE N'Mã kho QC',
            I.NAME N'Chi tiết/cụm',
            I.LENGTH,
			I.WIDTH,
			I.HEIGHT,
            IIP.ITEM_ID ITEM_ID,
            IIP.QUANTITY QUANTITY,
            CB.LAST_NAME N'Người tạo',
            P.CREATE_DATE N'Ngày tạo',
            VB.LAST_NAME N'Người nhận',
            P.VERIFY_DATE N'Ngày nhận',
            P.factoryId fa
            FROM prod.PACKAGE P
            LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
            LEFT JOIN base.DEPARTMENT S ON S.ID = P.SOURCE_ID
            LEFT JOIN base.DEPARTMENT D ON D.ID = P.DESTINATION_ID
            LEFT JOIN base.DEPARTMENT D1 ON D1.ID = P.ITEM_FROM_ID
            LEFT JOIN base.GLOBAL_DATE GD ON GD.[DATE] = CAST(P.CREATE_DATE AS DATE)
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
            LEFT JOIN base.ACCOUNT CB ON CB.ID = P.CREATE_BY
            LEFT JOIN base.ACCOUNT VB ON VB.ID = P.VERIFY_BY
        
           where P.DESTINATION_ID = 100081
            AND P.CREATE_DATE BETWEEN @FROM AND @TO
           
        ) X
        WHERE X.fa = @FACTORY_ID
   order by X.[Ngày tạo] desc
    `,
    getBaoCaoMeSay: `SELECT --Kb.ID,
    CONCAT(KB.NUMBER,'.',KB.WEEK,'.',KB.[YEAR]) N'Mã mẻ',
    K.NAME 'Tên lò',
    KB.HEIGHT N'Chiều dày phôi',
    KB.[TYPE] N'Loại phôi',
    ROUND(L2.M3,2) N'Tổng khối lượng',
    C.LAST_NAME N'Người tạo',
    X.LAST_NAME N'Người ra lò',
    KB.CREATE_DATE N'Ngày tạo',
    CAST(KB.CREATE_DATE + KB.TIME_OUT_TARGET AS DATE) N'Dự kiến',
    CAST(KB.EXPORT_DATE AS DATE) N'Thực tế',
    CASE
        WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
        WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
        WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
        ELSE KB.[STATUS]
        END AS N'Trạng thái'
    FROM prod.KILN_BATCH KB
    LEFT JOIN prod.KILN K ON K.ID= KB.KILN_ID
    LEFT JOIN base.ACCOUNT C ON C.ID = KB.CREATE_BY
    LEFT JOIN base.ACCOUNT X ON X.ID = KB.EXPORT_BY
    LEFT JOIN (
        SELECT L1.ID,SUM(L1.M3) M3
        FROM(
            SELECT 
            KB.ID,
            IIP.ITEM_ID,
            SUM(IIP.QUANTITY) * I.VOLUMN M3
            FROM prod.KILN_BATCH KB
            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
            GROUP BY     KB.ID,
            IIP.ITEM_ID,
            I.VOLUMN
        ) L1
        GROUP BY L1.ID
    ) L2 ON L2.ID = KB.ID
    WHERE KB.CREATE_DATE BETWEEN @FROM AND @TO
    AND K.FACTORY_ID = @FACTORY_ID
    `,
    getBaoCaoPhoiTheoMeSay2: `
    SELECT * FROM (
        SELECT 
            K.NAME N'Lò',
            IIP.ITEM_ID N'Mã',
            CONCAT(CAST(I.LENGTH AS FLOAT),'x', CAST(I.HEIGHT AS FLOAT),'x',CAST(I.WIDTH AS FLOAT)) N'Quy cách', 
            I.LENGTH length, I.HEIGHT height, I.WIDTH width, KB.CREATE_DATE CREATE_DATE, KB.EXPORT_DATE,
            CASE 
            WHEN KB.TYPE IN (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') AND K.FACTORY_ID != 100000 THEN DATEADD(DAY, 3, KB.CREATE_DATE)
            WHEN KB.STATUS = 'finish' THEN KB.EXPORT_DATE
            ELSE DATEADD(DAY, KB.TIME_OUT_TARGET, KB.CREATE_DATE)
            END AS 'du_kien_ra_lo',
            I.[NAME] N'Chi tiết/cụm',
            I.VOLUMN N'Khối lượng',
            SUM(IIP.QUANTITY) N'Số lượng',
            KB.[STATUS],
            ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4) N'Tổng khối lượng',
            CASE
            WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
            WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
            WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
            ELSE KB.[STATUS]
            END AS N'Trạng thái'
            FROM prod.KILN_BATCH KB
            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
            WHERE KB.[STATUS] != 'created' AND
            K.FACTORY_ID = @FACTORY_ID
            GROUP BY KB.ID,
            K.NAME,
            I.LENGTH,
            I.WIDTH,
            I.HEIGHT,
            IIP.ITEM_ID,
            KB.NUMBER,
            KB.WEEK,
            KB.[YEAR],
            I.[NAME],
            I.VOLUMN,
            KB.STATUS,
            KB.CREATE_DATE,
            KB.EXPORT_DATE,
            KB.TYPE,
            K.FACTORY_ID,
            TIME_OUT_TARGET
        ) TEMP
        WHERE du_kien_ra_lo BETWEEN @FROM AND @TO
    `,
    getBaoCaoPhoiTheoMeSay3: `
    SELECT 
    P.CODE,P.MODIFY_BY,P.MODIFY_DATE,
	CONCAT(K.NAME,'-',KB.[TYPE]) N'Lò',
    IIP.ITEM_ID N'Mã',
    CONCAT(CAST(I.LENGTH AS FLOAT),'x', CAST(I.HEIGHT AS FLOAT),'x',CAST(I.WIDTH AS FLOAT)) N'Quy cách', 
    I.LENGTH length, I.HEIGHT height, I.WIDTH width, KB.EXPORT_DATE exportDate,
    I.[NAME] N'Chi tiết/cụm',
    I.VOLUMN N'Khối lượng',
    IIP.QUANTITY N'Số lượng',
    ROUND(IIP.QUANTITY * I.VOLUMN,4) N'Tổng khối lượng',
    CASE
    WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
    WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
    WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
    ELSE KB.[STATUS]
    END AS N'Trạng thái'
    FROM prod.KILN_BATCH KB
    LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
    LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
    LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
    LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
    LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
	LEFT JOIN prod.PALLET P ON IIP.PALLET_ID = P.ID
    WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE BETWEEN @FROM AND @TO
    AND K.FACTORY_ID = @FACTORY_ID
    GROUP BY 
	P.CODE,P.MODIFY_BY,P.MODIFY_DATE,
	KB.ID,
    K.NAME,
    I.LENGTH,
    I.WIDTH,
    I.HEIGHT,
    IIP.ITEM_ID,
    KB.NUMBER,KB.[TYPE],
    KB.WEEK,
    KB.[YEAR],
    I.[NAME],
    I.VOLUMN,
	IIP.QUANTITY,
    KB.STATUS,
	KB.EXPORT_DATE
    order by P.MODIFY_BY
    `,
    getBaoCaoPhoiTheoMeSay3kho: `
    SELECT 
    P.CODE,P.MODIFY_BY,P.MODIFY_DATE,
	CONCAT(K.NAME,'-',KB.[TYPE]) N'Lò',
    IIP.ITEM_ID N'Mã',
    CONCAT(CAST(I.LENGTH AS FLOAT),'x', CAST(I.HEIGHT AS FLOAT),'x',CAST(I.WIDTH AS FLOAT)) N'Quy cách', 
    I.LENGTH length, I.HEIGHT height, I.WIDTH width, KB.EXPORT_DATE exportDate,
    I.[NAME] N'Chi tiết/cụm',
    I.VOLUMN N'Khối lượng',
    IIP.QUANTITY N'Số lượng',
    ROUND(IIP.QUANTITY * I.VOLUMN,4) N'Tổng khối lượng',
    CASE
    WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
    WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
    WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
    ELSE KB.[STATUS]
    END AS N'Trạng thái'
    FROM prod.KILN_BATCH KB
    LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
    LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
    LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
    LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
    LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
	LEFT JOIN prod.PALLET P ON IIP.PALLET_ID = P.ID
    WHERE KB.STATUS = 'finish' AND P.MODIFY_DATE BETWEEN @FROM AND @TO
    AND K.FACTORY_ID = @FACTORY_ID
    GROUP BY 
	P.CODE,P.MODIFY_BY,P.MODIFY_DATE,
	KB.ID,
    K.NAME,
    I.LENGTH,
    I.WIDTH,
    I.HEIGHT,
    IIP.ITEM_ID,
    KB.NUMBER,KB.[TYPE],
    KB.WEEK,
    KB.[YEAR],
    I.[NAME],
    I.VOLUMN,
	IIP.QUANTITY,
    KB.STATUS,
	KB.EXPORT_DATE
    order by P.MODIFY_BY
    `,
    getBaoCaoPhoiTheoMeSay: `    SELECT 
    --KB.ID N'ID mẻ',
    PL.CODE,
    CONCAT(KB.NUMBER,'.',KB.WEEK,'.',KB.[YEAR]) N'Mã mẻ',
    K.NAME N'Lò',
    IIP.ITEM_ID N'Mã',
    CONCAT(CAST(I.LENGTH AS FLOAT),'x', CAST(I.HEIGHT AS FLOAT),'x',CAST(I.WIDTH AS FLOAT)) N'Quy cách',
    I.[NAME] N'Chi tiết/cụm',
    I.VOLUMN N'Khối lượng',
    SUM(IIP.QUANTITY) N'Số lượng',
    ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,2) N'Tổng khối lượng',
    CASE
    WHEN KB.[STATUS] = 'finish'  THEN N'Hoàn thành'
    WHEN KB.[STATUS] = 'process' THEN N'Đang sấy'
    WHEN KB.[STATUS] = 'created' THEN N'Khởi tạo'
    ELSE KB.[STATUS]
    END AS N'Trạng thái'
    FROM prod.KILN_BATCH KB
    LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
    LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
    LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
    LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
    LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
    WHERE KB.CREATE_DATE BETWEEN @FROM AND @TO
    AND K.FACTORY_ID = @FACTORY_ID
    GROUP BY KB.ID,
    K.NAME,
    I.LENGTH,
    I.WIDTH,
    I.HEIGHT,
    IIP.ITEM_ID,
    KB.NUMBER,
    KB.WEEK,
    KB.[YEAR],
    I.[NAME],
    PL.CODE,
    I.VOLUMN,
    KB.STATUS`,
    getBaoCaoSoSanhTyLeDatQCvaLuaPhoi: `SELECT 
    TLCD.condoan,
    TLCD.ID_VAO,
    TLCD.QC_DV,
    TLCD.TEN_DV,
    TLCD.SL_DV,
    TLCD.ID_RA,
    TLCD.QC_DR,
    TLCD.TEN_DR,
    TLCD.SL_DR,
    CASE
        WHEN TLHC.TLHCQC IS NULL THEN 0
        ELSE TLHC.TLHCQC
        END AS TLHCQC
    FROM(
        SELECT
        P.SOURCE_ID ID_TO,
        D.NAME condoan,
        IM.ID ID_VAO,
        CONCAT(CAST(IM.HEIGHT AS FLOAT), CAST(IM.WIDTH AS FLOAT),CAST(IM.LENGTH AS FLOAT)) code,
        CONCAT(CAST(IM.LENGTH AS FLOAT),'x', CAST(IM.WIDTH AS FLOAT),'x',CAST(IM.HEIGHT AS FLOAT)) QC_DV,
        IM.NAME TEN_DV,
        SUM(MIP.QUANTITY) SL_DV,
        II.ID ID_RA,
        CONCAT(CAST(II.HEIGHT AS FLOAT), CAST(II.WIDTH AS FLOAT),CAST(II.LENGTH AS FLOAT)) codeout,
        CONCAT(CAST(II.LENGTH AS FLOAT),'x', CAST(II.WIDTH AS FLOAT),'x',CAST(II.HEIGHT AS FLOAT)) QC_DR,
        II.NAME TEN_DR,
        SUM(IIP.QUANTITY) SL_DR
        FROM prod.PACKAGE P
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN prod.MATERIALS_IN_PACKAGE MIP ON MIP.ITEM_IN_PACKAGE_ID = IIP.ID
        LEFT JOIN base.ITEM IM ON IM.ID = MIP.ITEM_ID
        LEFT JOIN base.ITEM II ON II.ID = IIP.ITEM_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.SOURCE_ID
        WHERE 
        SOURCE_ID = 100012
        --OR SOURCE_ID = 100058
        --OR SOURCE_ID = 100076
        GROUP BY 
        P.SOURCE_ID,
        D.NAME,
        IM.ID,
        II.ID,
        MIP.ITEM_ID,
        IM.NAME,
        IM.LENGTH,
        IM.WIDTH,
        IM.HEIGHT,
        IIP.ITEM_ID,
        II.NAME,
        II.LENGTH,
        II.WIDTH,
        II.HEIGHT
    ) TLCD
    LEFT JOIN (
        SELECT PT.CODE  AS [PTCODE],
        CASE WHEN TRIM(HC.CODE)='' THEN PT.CODE  ELSE HC.CODE END AS [HCCODE],
        ROUND(AVG(ROUND(CAST(HC.[SOTHANH] AS FLOAT)/CAST(PT.[SAMPLEQTY]*PT.SOTHANH_BO AS FLOAT),4)),2) AS TLHCQC
        FROM NLG.PHIEUNHAPKHO_DT AS PT
        INNER JOIN NLG.HACAP AS HC ON HC.ID_DT = PT.ID
        WHERE PT.DEL_FLAG='N' AND HC.DEL_FLAG='N' AND PT.DELAI='N' AND TRIM(HC.CODE)<>'' --AND PT.CODE = '21100600'
        GROUP BY PT.CODE,HC.CODE
    ) TLHC ON TLHC.PTCODE = TLCD.code AND TLHC.HCCODE = TLCD.codeout`
}