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
    deleteBomWithId: `DELETE prod.[BOM] WHERE ID = @ID`,
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
    select *
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
        A.DEPARTMENT_ID,
        CONCAT('[',PR.CODE,'] ',PR.NAME) PARENT,
        B.RATE rate,
        A.ITEM_ID,
        CONCAT('[', A.ITEM_CODE , '] ',A.ITEM_NAME) N'Sản phẩm',
        A.VOLUMN N'Khối lượng',
        A.TONDAUKY N'Tồn đầu kỳ',
        A.NHAP N'Nhập',
        A.XUAT N'Xuất',
        CASE
            WHEN A.TON > 0 THEN A.TON
            ELSE 0
        END N'Tồn',
        A.TONDAUKY * A.VOLUMN N'Tồn đầu kỳ m3',
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
                WHEN XN.ITEM_ID IS NOT NULL THEN I.NAME
                ELSE I2.NAME
            END AS ITEM_NAME,
            CASE
                WHEN XN.ITEM_ID IS NOT NULL THEN I.VOLUMN
                ELSE I2.VOLUMN
            END AS VOLUMN,
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
            ) XN 
            FULL OUTER JOIN (
                select *
                from prod.OPENING_STOCK OS
                where OS.WEEK = @WEEK AND YEAR(OS.[DATE]) = @YEAR
            ) OS ON OS.ITEM_ID = XN.ITEM_ID AND OS.DEPARTMENT_ID = XN.DEPARTMENT_ID
            LEFT JOIN base.DEPARTMENT D ON D.ID = XN.DEPARTMENT_ID
            LEFT JOIN base.ITEM I ON I.ID = XN.ITEM_ID
            LEFT JOIN base.DEPARTMENT D2 ON D2.ID = OS.DEPARTMENT_ID
            LEFT JOIN base.ITEM I2 ON I2.ID = OS.ITEM_ID
        ) AS A
        LEFT JOIN base.DEPARTMENT L0 ON L0.ID = A.DEPARTMENT_ID
        LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
        LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
        LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
        LEFT JOIN prod.BOM B ON B.MATERIALS_ID = A.ITEM_ID
        LEFT JOIN base.ITEM PR ON PR.ID = B.ITEM_ID
    ) X
    where X.factoryId = @FACTORY_ID
    `,
    getBaoCaoQCXuLyHang: `SELECT *
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
        PT.NAME N'Loại lỗi',
        RM.NAME N'Biện pháp xử lý',
        I.NAME N'Chi tiết/cụm',
        IIP.QUANTITY N'Số lượng',
        CB.LAST_NAME N'Người tạo',
        P.CREATE_DATE N'Ngày tạo',
        VB.LAST_NAME N'Người nhận',
        P.VERIFY_DATE N'Ngày nhận'
        FROM prod.PACKAGE P
        LEFT JOIN prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
        LEFT JOIN prod.REMEDIES RM ON RM.ID = P.REMEDIES_ID
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN base.DEPARTMENT S ON S.ID = P.SOURCE_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.DESTINATION_ID
        LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
        LEFT JOIN base.GLOBAL_DATE GD ON GD.[DATE] = CAST(P.CREATE_DATE AS DATE)
        LEFT JOIN base.ACCOUNT CB ON CB.ID = P.CREATE_BY
        LEFT JOIN base.ACCOUNT VB ON VB.ID = P.VERIFY_BY
            LEFT JOIN base.DEPARTMENT L0 ON L0.ID = S.ID
        LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
        LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
        LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
        WHERE S.[TYPE] = 'QC'
        AND P.CREATE_DATE BETWEEN @FROM AND @TO
        ) X WHERE X.factoryId = @FACTORY_ID`,
    getBaoCaoHangDayDenKhoQC: `SELECT *
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
        D.CODE N'Mã kho QC',
        I.NAME N'Chi tiết/cụm',
        IIP.QUANTITY N'Số lượng',
        CB.LAST_NAME N'Người tạo',
        P.CREATE_DATE N'Ngày tạo',
        VB.LAST_NAME N'Người nhận',
        P.VERIFY_DATE N'Ngày nhận'
        FROM prod.PACKAGE P
        LEFT JOIN prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
        LEFT JOIN base.DEPARTMENT S ON S.ID = P.SOURCE_ID
        LEFT JOIN base.DEPARTMENT D ON D.ID = P.DESTINATION_ID
        LEFT JOIN base.GLOBAL_DATE GD ON GD.[DATE] = CAST(P.CREATE_DATE AS DATE)
        LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
        LEFT JOIN base.ACCOUNT CB ON CB.ID = P.CREATE_BY
        LEFT JOIN base.ACCOUNT VB ON VB.ID = P.VERIFY_BY
        LEFT JOIN base.DEPARTMENT L0 ON L0.ID = S.ID
        LEFT JOIN base.DEPARTMENT L1 ON L1.ID = L0.PARENT_ID
        LEFT JOIN base.DEPARTMENT L2 ON L2.ID = L1.PARENT_ID
        LEFT JOIN base.DEPARTMENT L3 ON L3.ID = L2.PARENT_ID
        WHERE D.[TYPE] = 'QC'
        AND P.CREATE_DATE BETWEEN @FROM AND @TO
    ) X
    WHERE X.factoryId = @FACTORY_ID
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
    getBaoCaoPhoiTheoMeSay: `    SELECT 
    --KB.ID N'ID mẻ',
    CONCAT(KB.NUMBER,'.',KB.WEEK,'.',KB.[YEAR]) N'Mã mẻ',
    K.NAME N'Lò',
    IIP.ITEM_ID N'Mã',
    CONCAT(CAST(I.LENGTH AS FLOAT),'x', CAST(I.HEIGHT AS FLOAT),'x',CAST(I.WIDTH AS FLOAT)) N'Quy cách',
    I.[NAME] N'Chi tiết/cụm',
    I.VOLUMN N'Khối lượng',
    SUM(IIP.QUANTITY) N'Số lượng',
    ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,2) N'Tổng khối lượng'
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
    I.VOLUMN`,
    getBaoCaoSoSanhTyLeDatQCvaLuaPhoi: `SELECT 
    TLCD.[Tổ],
    TLCD.[id vào],
    TLCD.[Quy cách đầu vào],
    TLCD.[Tên đầu vào],
    TLCD.[Số lượng vào],
    TLCD.[id ra],
    TLCD.[Quy cách đầu ra],
    TLCD.[Tên đầu ra],
    TLCD.[Số lượng ra],
    CASE
        WHEN TLHC.[Tỷ lệ hạ cấp QC] IS NULL THEN 0
        ELSE TLHC.[Tỷ lệ hạ cấp QC]
        END AS N'Tỷ lệ hạ cấp QC'
    FROM(
        SELECT
        P.SOURCE_ID N'ID tổ',
        D.NAME N'Tổ',
        IM.ID N'id vào',
        CONCAT(CAST(IM.HEIGHT AS FLOAT), CAST(IM.WIDTH AS FLOAT),CAST(IM.LENGTH AS FLOAT)) N'code',
        CONCAT(CAST(IM.LENGTH AS FLOAT),'x', CAST(IM.WIDTH AS FLOAT),'x',CAST(IM.HEIGHT AS FLOAT)) N'Quy cách đầu vào',
        IM.NAME N'Tên đầu vào',
        SUM(MIP.QUANTITY) N'Số lượng vào',
        II.ID N'id ra',
        CONCAT(CAST(II.HEIGHT AS FLOAT), CAST(II.WIDTH AS FLOAT),CAST(II.LENGTH AS FLOAT)) N'codeout',
        CONCAT(CAST(II.LENGTH AS FLOAT),'x', CAST(II.WIDTH AS FLOAT),'x',CAST(II.HEIGHT AS FLOAT)) N'Quy cách đầu ra',
        II.NAME N'Tên đầu ra',
        SUM(IIP.QUANTITY) N'Số lượng ra'
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
        ROUND(AVG(ROUND(CAST(HC.[SOTHANH] AS FLOAT)/CAST(PT.[SAMPLEQTY]*PT.SOTHANH_BO AS FLOAT),4)),2) AS N'Tỷ lệ hạ cấp QC'
        FROM NLG.WoodslandNLG.dbo.PHIEUNHAPKHO_DT AS PT
        INNER JOIN NLG.WoodslandNLG.dbo.HACAP AS HC ON HC.ID_DT = PT.ID
        WHERE PT.DEL_FLAG='N' AND HC.DEL_FLAG='N' AND PT.DELAI='N' AND TRIM(HC.CODE)<>'' --AND PT.CODE = '21100600'
        GROUP BY PT.CODE,HC.CODE
    ) TLHC ON TLHC.PTCODE = TLCD.[code] AND TLHC.HCCODE = TLCD.[codeout]`
}