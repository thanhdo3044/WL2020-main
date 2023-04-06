const express = require("express");
const router = express.Router();
const mssql = require("mssql");
const { Po, Op, VItemInPackage, Item, Package, sequelize } = require("../../../models");
const {
    Proc_verifyPackage,
    getPackageById,
} = require("./../../core/query/index");
const { getErrorMessage } = require("./../../core/config");

router.get("/", (req, res) => {
    new mssql.Request()
        .input("packageId", req.query.packageId)
        .query(getPackageById, (err, record) => {
            res.api.sendData(record.recordset[0] || []);
        });
});
router.get("/listPackage", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("DESTINATION_ID", req.query.DESTINATION_ID)
        .query(`SELECT *
        FROM (
        SELECT  GD.WEEK N'Tuần',
            GD.[DATE] N'Ngày',
            S.CODE N'Ma_to_QC',
            D.NAME N'Kho_den',
            P.DESTINATION_ID,
            IE.QC_VERIFY_AT,
            IE.VERIFY_BY,
            I.LENGTH,I.WIDTH,I.HEIGHT,
            PT.NAME N'Loai_loi',
            RM.NAME N'BP_xu_ly',
            I.NAME N'Chi_tiet_cum',
            IIP.QUANTITY N'So_luong',
            CB.LAST_NAME N'Nguoi_tao',
            P.CREATE_DATE Ngay_tao,
            VB.LAST_NAME N'Nguoi_nhan',
            P.VERIFY_DATE,
            P.ID,
            P.PO
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
             LEFT JOIN prod.QC_ITEM_ERROR IE ON P.ID = IE.PACKAGE_ID
            WHERE  P.CREATE_DATE >='2021-03-01 00:00' 
            and DESTINATION_ID = @DESTINATION_ID and P.VERIFY_BY is null and VERIFY_DATE is null
            ) X 
            where (X.QC_VERIFY_AT IS NOT NULL AND X.VERIFY_BY IS NOT NULL) --or X.PO = 'HC'
            order by X.[Ngay_tao] desc
    `)
    res.api.sendData(recordset)
});
router.get("/listPackageRough", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("DESTINATION_ID", req.query.DESTINATION_ID)
        .query(`
        select D.NAME SOURCE_ID_NAME, pa.id as ID,iip.PACKAGE_ID,iip.QUANTITY,i.NAME,i.LENGTH,i.WIDTH,i.HEIGHT,acc.LAST_NAME,convert(nvarchar(30), pa.CREATE_DATE, 103)as ngay from prod.PACKAGE pa 
        left join prod.ITEM_IN_PACKAGE iip on pa.ID =iip.PACKAGE_ID
        left join base.ITEM i on iip.ITEM_ID = i.ID
        left join base.DEPARTMENT D on pa.SOURCE_ID = D.ID
        left join base.ACCOUNT acc on pa.CREATE_BY = acc.ID 
        where  pa.DESTINATION_ID = @DESTINATION_ID and pa.VERIFY_BY is null and pa.CREATE_DATE > '20210901'
        `)
    res.api.sendData(recordset)
});
router.get("/congdoannhanloi", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("itemId", req.query.itemId)
        .query(`
        select D.ID,D.NAME from prod.ROUTING R
        left join base.DEPARTMENT D on D.ID = R.STEP_ID
        where R.factoryId = @factoryId and R.ITEM_ID =@itemId
        `)
    res.api.sendData(recordset)
});
router.get("/confirmPackageluadat", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("id", req.query.id)
        .query(`
update prod.XUAT_GO_BAO set approvedByAccount = @verifyBy , approvedAt = SYSDATETIMEOFFSET() where ID = @id
    `)

    res.api.sendData(recordset)
})

router.get("/listPackageluadat", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("DESTINATION_ID", req.query.DESTINATION_ID)
        .query(`
        select D.NAME SOURCE_ID_NAME, XGB.id as ID,XGB.SL_TH QUANTITY,i.NAME,i.DAI,i.RONG,i.DAY,acc.LAST_NAME,convert(nvarchar(30), XGB.createdAt, 103)as ngay from prod.XUAT_GO_BAO XGB 
       
        left join nlg.BOM i on XGB.DAY = i.DAY and XGB.RONG = i.RONG and XGB.DAI = i.DAI
        left join base.DEPARTMENT D on XGB.SOURCE_ID = D.ID
        left join base.ACCOUNT acc on XGB.createdby = acc.ID 
        where  XGB.DESTINATION_ID = @DESTINATION_ID and XGB.approvedByAccount is null
        `)
    res.api.sendData(recordset)
});
router.get("/listPackagexuatluadat", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("sourceId", req.query.sourceId)
        .input("to", req.query.to)
        .input("from", req.query.from)
        .query(`
        select  ID,createdAt,SOURCE_ID,DESTINATION_ID,createdby,approvedByAccount,approvedAt from [prod].[XUAT_GO_BAO] 
        where XUATNHAP = 'xuatluaphoi' and SOURCE_ID = @sourceId
        and ID in (select BAO_ID from prod.QC_LUA_DAT) and createdAt between @from and @to
        `)
    res.api.sendData(recordset)
});
router.get("/yeu-cau-ky-thuat", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("number", req.query.number)
    
        .query(`  
  select  KT.*,AC.LAST_NAME,AC1.LAST_NAME KH_LAST_NAME,AC2.LAST_NAME SX_LAST_NAME,DATEPART(month, PO.createdAt) AS thang,DATEPART(DAY, PO.createdAt) AS ngay,DATEPART(year, PO.createdAt) AS nam,
  PO.number lenhsx,market,M.NAME,PO.keHoach, u.NAME DVT,I.VOLUMN,PO.approvedByAccount,PO.KH_approvedByAccount,
   ROUND(PO.keHoach*I.VOLUMN,4) KL  from [prod].[PO] PO
  left join base.MARKET M on PO.root = M.CODE
  left join base.ITEM I on I.ID = M.PRODUCT_ID
  left join base.UNIT u on U.ID = I.UNIT_ID
  left join base.ACCOUNT AC on AC.ID = PO.createBy
  left join base.ACCOUNT AC1 on AC1.ID = PO.KH_approvedByAccount
  left join base.ACCOUNT AC2 on AC2.ID = PO.approvedByAccount
  left join prod.YEUCAUKYTHUAT KT on KT.number = PO.number
  where Po.number = @number and market is not null and PO.stepId in (100270,100273,100282)
  order by PO.ID
        `)
    res.api.sendData(recordset)
});
router.get("/listPackageRough-temp", async (req, res) => {
     let condition = ``
     if (req.query.DESTINATION_ID == 100081) {
        condition = `and pa.factoryId = @factoryId`
     }
    const { recordset } = await new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("DESTINATION_ID", req.query.DESTINATION_ID)
        .query(`
        select PO.root MATP,pa.ITEM_ID,pa.SOURCE_ID, pa.DESTINATION_ID,D.NAME SOURCE_ID_NAME, pa.id as ID,pa.QUANTITY,i.NAME,i.LENGTH,i.WIDTH,i.HEIGHT,acc.LAST_NAME,convert(nvarchar(30), pa.CREATE_DATE, 103)as ngay
        ,pa.CREATE_DATE,pa.CREATE_BY,pa.TYPE_ID,pa.pallet_full_top_ID,pa.SL_PALLET,F.NAME pallet,ITEM_FROM_ID,pa.root,STEP_QC
        ,pa.PO,DATEPART(HOUR, pa.CREATE_DATE) AS giogiao, DATEPART(minute, pa.CREATE_DATE) AS phutgiao, DATEPART(second, pa.CREATE_DATE) AS giaygiao
        from (select ID,ITEM_ID,SOURCE_ID,CASE WHEN STEP_QC = 100081 and QC_VERIFY_BY is null then STEP_QC else DESTINATION_ID end DESTINATION_ID,QUANTITY,CREATE_DATE,CREATE_BY,VERIFY_BY,pallet_full_top_ID,SL_PALLET,[root],PO,QC_VERIFY_BY,STEP_QC
         ,ITEM_FROM_ID,TYPE_ID,factoryId    from prod.PACKAGE_TEMP) pa 
        left join prod.PALLET_FULL_TOP F on F.ID = pa.pallet_full_top_ID
        left join prod.PO PO on pa.PO = CONCAT('PO',PO.code)
        left join base.ITEM i on pa.ITEM_ID = i.ID
        left join base.DEPARTMENT D on pa.SOURCE_ID = D.ID
        left join base.ACCOUNT acc on pa.CREATE_BY = acc.ID 
        where  pa.DESTINATION_ID = @DESTINATION_ID and pa.VERIFY_BY is null and pa.ID not in (select ITEM_HC from prod.PACKAGE where ITEM_HC is not null)   ${condition}
        `)
    res.api.sendData(recordset)
});
router.get("/listPackageRough-temp-pallet", async (req, res) => {
    const { recordset } = await new mssql.Request()
        
        .query(`
        select P.ID,QUANTITY,PACKAGE_TEMP_ID,PA.NAME tenpallet from [prod].[PALLET_NHAP_KHO_TP] P
        left join prod.PALLET_FULL_TOP PA on PA.ID = P.PALLET_ID
        where PACKAGE_TEMP_ID in (select ID from prod.PACKAGE_TEMP where [status] is null)
        `)
    res.api.sendData(recordset)
});
router.get("/listPackageRough-temp-status", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("po", req.query.po)
        .query(`
        select pa.ITEM_ID,pa.SOURCE_ID,pa.DESTINATION_ID,D.NAME SOURCE_ID_NAME, pa.id as ID,pa.QUANTITY,i.NAME,i.LENGTH,i.WIDTH,i.HEIGHT,acc.LAST_NAME,convert(nvarchar(30), pa.CREATE_DATE, 103)as ngay,pa.CREATE_DATE 
        ,pa.PO,pa.VERIFY_BY,pa.status, DATEPART(HOUR, pa.CREATE_DATE) AS gio, DATEPART(minute, pa.CREATE_DATE) AS phut, DATEPART(second, pa.CREATE_DATE) AS giay, pa.TYPE_ID,pa.QC_VERIFY_BY,pa.STEP_QC
        from prod.PACKAGE_TEMP pa 

        left join base.ITEM i on pa.ITEM_ID = i.ID
        left join base.DEPARTMENT D on pa.SOURCE_ID = D.ID
        left join base.ACCOUNT acc on pa.CREATE_BY = acc.ID 
        where  pa.PO = CONCAT('PO',@po) and pa.ID not in (select ITEM_HC from prod.PACKAGE where ITEM_HC is not null)
        order by pa.VERIFY_DATE
        `)
    res.api.sendData(recordset)
});
router.get("/listPackageRough-temp-del", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("id", req.query.id)
        
        .query(`
        delete from prod.PACKAGE_TEMP where ID = @id
        `)
    res.api.sendData(recordset)
});

router.get("/confirmPackage-temp", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("id", req.query.id)
        .query(`
delete prod.PACKAGE_TEMP where ID = @id
    `)

    res.api.sendData(recordset)
})
router.get("/qc-dau-vao", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("PACKAGE_TEMP_ID", req.query.PACKAGE_TEMP_ID)
        .input("id", req.query.id)
        .query(`
update prod.QC_DAU_VAO 
set PACKAGE_ID = @id where PACKAGE_TEMP_ID = @PACKAGE_TEMP_ID
    `)

    res.api.sendData(recordset)
})
router.get("/xac-nhan-qc1", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("ID", req.query.ID)
        .query(`
update prod.PACKAGE_TEMP 
set QC_VERIFY_BY = @verifyBy,QC_VERIFY_DATE = GETDATE() where ID = @ID
insert into prod.PACKAGE_QC (QC_VERIFY_BY,QC_VERIFY_DATE,PACKAGE_TEMP_ID)
values (@verifyBy,GETDATE(),@ID) 
    `)

    res.api.sendData(recordset)
})
router.get("/update-pallet-nhap-kho", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("PACKAGE_TEMP_ID", req.query.PACKAGE_TEMP_ID)
        .input("id", req.query.id)
        .query(`
update prod.PALLET_NHAP_KHO_TP
set PACKAGE_ID = @id where PACKAGE_TEMP_ID = @PACKAGE_TEMP_ID
    `)

    res.api.sendData(recordset)
})
router.get("/confirmPackage-temp-update", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("id", req.query.id)
        .query(`
        update prod.PACKAGE_TEMP
        set status = 
        N'${req.query.status}',
        VERIFY_BY = @verifyBy
        ,VERIFY_DATE = GETDATE()  
        where ID = @id
    `)

    res.api.sendData(recordset)
})
router.get("/confirmPackage-update-2", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("id", req.query.id)
        .query(`
        update prod.PACKAGE
        set DESCRIPTION = 
        N'${req.query.status}'
        where ID = @id
    `)

    res.api.sendData(recordset)
})
router.get("/historyPackageRough", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("DESTINATION_ID", req.query.DESTINATION_ID)
        .query(`
        select pa.id,iip.PACKAGE_ID,iip.QUANTITY,i.NAME,d.NAME as congDoan,acc.LAST_NAME as nguoiGiao,acc.ACCOUNT as idGiao,
        acc1.LAST_NAME as nguoinhan,acc1.ACCOUNT as idNhan,convert(nvarchar(30), pa.CREATE_DATE, 103)as ngayGiao,
        convert(nvarchar(30), pa.VERIFY_DATE, 103)as ngayNhan from prod.PACKAGE pa 
        left join prod.ITEM_IN_PACKAGE iip on pa.ID =iip.PACKAGE_ID
        left join base.ITEM i on iip.ITEM_ID = i.ID
        left join base.ACCOUNT acc on pa.CREATE_BY = acc.ID 
        left join base.DEPARTMENT d on pa.SOURCE_ID = d.ID
        left join base.ACCOUNT acc1 on pa.VERIFY_BY = acc1.ID
        where pa.SOURCE_ID =102484 and pa.DESTINATION_ID = @DESTINATION_ID and pa.VERIFY_BY = @verifyBy
        `)
    res.api.sendData(recordset)
});

router.get("/qc-item-error-by-code", (req, res, next) => {
    new mssql.Request()
        .input("code", req.query.code)
        .query(
            `
            SELECT A.LAST_NAME, P.ID,P.ITEM_HC, D2.NAME ITEM_FROM_NAME, PO.number, D.NAME DEPARTMENT_NAME, I.ID ITEM_ID, CONCAT(I.NAME,'(',I.HEIGHT,'x',I.WIDTH,'x',I.LENGTH,')') ITEM_NAME, PT.NAME TYPE_NAME, 
            CONCAT(R.NAME,' ',I1.NAME,'(',I1.HEIGHT,'x',I1.WIDTH,'x',I1.LENGTH,')') REMEDIES_NAME, I.HEIGHT height, I.WIDTH width, 
            I.LENGTH length, U.NAME UNIT_NAME, IIP.QUANTITY, IIP.QUANTITY*I.VOLUMN AS KL, P.CREATE_DATE createDate, P.DESCRIPTION, IE.PACKAGE_ID, IE.VERIFY_BY, A2.LAST_NAME VERIFY_NAME, IE.QC_VERIFY_BY, A3.LAST_NAME QC_VERIFY_NAME, IE.VERIFY_AT, IE.QC_VERIFY_AT
            FROM prod.QC_ITEM_ERROR IE
            INNER JOIN prod.PACKAGE P ON IE.PACKAGE_ID = P.ID
            LEFT JOIN prod.PACKAGE P2 ON P.ID_QC = P2.ID
			LEFT JOIN prod.PO ON P2.PO = PO.code
            INNER JOIN prod.PACKAGE_TYPE PT ON P.TYPE_ID = PT.ID
            INNER JOIN prod.REMEDIES R ON P.REMEDIES_ID = R.ID
            INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN base.ITEM I ON IIP.ITEM_ID = I.ID
            INNER JOIN base.UNIT U ON I.UNIT_ID = U.ID
            LEFT JOIN base.ITEM I1 ON P.ITEM_HC = I1.ID
            LEFT JOIN base.DEPARTMENT D ON P.DESTINATION_ID = D.ID
            LEFT JOIN base.DEPARTMENT D2 ON P.ITEM_FROM_ID = D2.ID
            INNER JOIN base.ACCOUNT A ON IE.CREATED_BY = A.ID
            LEFT JOIN base.ACCOUNT A2 ON IE.VERIFY_BY = A2.ID
            LEFT JOIN base.ACCOUNT A3 ON IE.QC_VERIFY_BY = A3.ID
            WHERE IE.CODE = @code
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/qc-item-error-khieu-nai", (req, res, next) => {
    new mssql.Request()
        .input("code", req.query.code)
        .query(
            `
            SELECT A.LAST_NAME, I.ID ITEM_ID, CONCAT(I.NAME,'(',I.HEIGHT,'x',I.WIDTH,'x',I.LENGTH,')') ITEM_NAME, IE.TYPE_NAME, 
            I.HEIGHT height, I.WIDTH width, D.NAME congdoanloi,IE.QC_VERIFY_AT1,IE.KH_VERIFY_AT,A4.LAST_NAME QC_VERIFY_NAME1,A5.LAST_NAME KH_VERIFY_NAME,IE.QC_VERIFY_BY1,IE.KH_VERIFY_BY,
            I.LENGTH length, U.NAME UNIT_NAME, IE.QUANTITY, IE.QUANTITY*I.VOLUMN AS KL, IE.CREATED_AT createDate, IE.DESCRIPTION, IE.VERIFY_BY, A2.LAST_NAME VERIFY_NAME, IE.QC_VERIFY_BY, A3.LAST_NAME QC_VERIFY_NAME, IE.VERIFY_AT, IE.QC_VERIFY_AT
            FROM prod.BB_KHIEU_NAI IE
            INNER JOIN base.ITEM I ON IE.ITEM_ID = I.ID
            INNER JOIN base.UNIT U ON I.UNIT_ID = U.ID
            INNER JOIN base.ACCOUNT A ON IE.CREATED_BY = A.ID
            LEFT JOIN base.ACCOUNT A2 ON IE.VERIFY_BY = A2.ID
            LEFT JOIN base.ACCOUNT A3 ON IE.QC_VERIFY_BY = A3.ID
            LEFT JOIN base.ACCOUNT A4 ON IE.QC_VERIFY_BY1 = A4.ID
            LEFT JOIN base.ACCOUNT A5 ON IE.KH_VERIFY_BY = A5.ID
            LEFT JOIN base.DEPARTMENT D on D.ID = IE.STEP_ID
            WHERE IE.CODE = @code
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/delete-qc-item-error", (req, res, next) => {
    new mssql.Request()
        .input("id", req.query.id)
      
        .query(
            `
       DELETE from prod.PACKAGE where ID = @id
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/list-code-khieu-nai", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .query(
            `
            SELECT DISTINCT IE.CODE, CONVERT(VARCHAR, IE.CREATED_AT, 23) AS CREATED_DATE, DATEPART(HOUR, IE.CREATED_AT) gio, DATEPART(MINUTE, IE.CREATED_AT) phut, A.LAST_NAME, IE.CREATED_BY , IE.VERIFY_BY
            ,D.NAME nhamaygiao,D1.NAME nhamaynhan
            FROM prod.BB_KHIEU_NAI IE 
            left join base.DEPARTMENT D on D.ID = IE.FACTORY_ID
            left join base.DEPARTMENT D1 on D1.ID = IE.FACTORY_NHAN
            INNER JOIN base.ACCOUNT A ON IE.CREATED_BY = A.ID 
            WHERE FACTORY_ID = @factoryId AND IE.CREATED_AT BETWEEN @start AND @end AND
			(VERIFY_BY IS NULL OR QC_VERIFY_BY IS NULL)
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/list-code-qc-item-error", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .query(
            `
            SELECT DISTINCT IE.CODE, CONVERT(VARCHAR, IE.CREATED_AT, 23) AS CREATED_DATE, DATEPART(HOUR, IE.CREATED_AT) gio, DATEPART(MINUTE, IE.CREATED_AT) phut, A.LAST_NAME, IE.CREATED_BY , IE.VERIFY_BY
            FROM prod.QC_ITEM_ERROR IE 
            INNER JOIN base.ACCOUNT A ON IE.CREATED_BY = A.ID 
            WHERE FACTORY_ID = @factoryId AND IE.CREATED_AT BETWEEN @start AND @end AND
			(VERIFY_BY IS NULL OR QC_VERIFY_BY IS NULL)
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/list-code-qc-item-error-da-duyet", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .query(
            `
            SELECT DISTINCT IE.CODE, CONVERT(VARCHAR, IE.CREATED_AT, 23) AS CREATED_DATE, DATEPART(HOUR, IE.CREATED_AT) gio, DATEPART(MINUTE, IE.CREATED_AT) phut, A.LAST_NAME, IE.CREATED_BY , IE.VERIFY_BY
            FROM prod.QC_ITEM_ERROR IE 
            INNER JOIN base.ACCOUNT A ON IE.CREATED_BY = A.ID 
            WHERE FACTORY_ID = @factoryId AND IE.CREATED_AT BETWEEN @start AND @end AND
			(VERIFY_BY IS NOT NULL AND QC_VERIFY_BY IS NOT NULL)
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/list-code-qc-item-khieu-nai-da-duyet", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .query(
            `
            SELECT DISTINCT IE.CODE, CONVERT(VARCHAR, IE.CREATED_AT, 23) AS CREATED_DATE, DATEPART(HOUR, IE.CREATED_AT) gio, DATEPART(MINUTE, IE.CREATED_AT) phut, A.LAST_NAME, IE.CREATED_BY , IE.VERIFY_BY
            ,D.NAME nhamaygiao,D1.NAME nhamaynhan
            FROM prod.BB_KHIEU_NAI IE 
            left join base.DEPARTMENT D on D.ID = IE.FACTORY_ID
            left join base.DEPARTMENT D1 on D1.ID = IE.FACTORY_NHAN
            INNER JOIN base.ACCOUNT A ON IE.CREATED_BY = A.ID 
            WHERE FACTORY_ID = @factoryId AND IE.CREATED_AT BETWEEN @start AND @end AND
			(VERIFY_BY IS NOT NULL AND QC_VERIFY_BY IS NOT NULL)
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/delete-bc-khieu-nai", (req, res, next) => {
    let query = `delete from prod.BB_KHIEU_NAI
    WHERE CODE = @code`;
    new mssql.Request()
    .input("code", req.body.code)
        .query(query,
            (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/delete-bc-xu-ly-loi", (req, res, next) => {
    new mssql.Request()
        .input('CODE', req.body.code)
     
        .execute('[prod].[Proc_del_handleQC]', (err, result) => {
            if (err) {
                console.log(error)
                return res.status(500).send(error)
            }
            res.status(200).json({ result, success: true, message: 'OK' })
        }

        )
});

router.put("/bc-xu-ly-loi", (req, res, next) => {
    const packageIds = req.body.packageIds;
    let query = `UPDATE prod.PACKAGE SET VERIFY_BY = ${req.body.accountId}, VERIFY_DATE = GETDATE() WHERE ID IN (`;
    for (let i = 0; i < packageIds.length - 1; i++) {
        query += `${parseInt(packageIds[i])},`;
    }
    query += `${packageIds[packageIds.length - 1]})`;
    new mssql.Request()
        .query(query,
            (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
        );
});

router.put("/qc-item-error-gdsx", (req, res, next) => {
    let query = `UPDATE prod.QC_ITEM_ERROR
    SET VERIFY_BY = @accountId, VERIFY_AT = GETDATE()
    WHERE CODE = @code`;
    new mssql.Request()
    .input("accountId", req.body.accountId)
    .input("code", req.body.code)
        .query(query,
            (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/qc-item-khieu-nai-gdsx", (req, res, next) => {
    let query = `UPDATE prod.BB_KHIEU_NAI
    SET VERIFY_BY = @accountId, VERIFY_AT = GETDATE()
    WHERE CODE = @code`;
    new mssql.Request()
    .input("accountId", req.body.accountId)
    .input("code", req.body.code)
        .query(query,
            (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/qc-item-error-qc", (req, res, next) => {
    let query = `UPDATE prod.QC_ITEM_ERROR
    SET QC_VERIFY_BY = @accountId, QC_VERIFY_AT = GETDATE()
    WHERE CODE = @code`;
    new mssql.Request()
    .input("accountId", req.body.accountId)
    .input("code", req.body.code)
        .query(query,
            (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/qc-item-khieu-nai-qc", (req, res, next) => {
    let query = `UPDATE prod.BB_KHIEU_NAI
    SET QC_VERIFY_BY = @accountId, QC_VERIFY_AT = GETDATE()
    WHERE CODE = @code`;
    new mssql.Request()
    .input("accountId", req.body.accountId)
    .input("code", req.body.code)
        .query(query,
            (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/qc-item-khieu-nai-qc1", (req, res, next) => {
    let query = `UPDATE prod.BB_KHIEU_NAI
    SET QC_VERIFY_BY1 = @accountId, QC_VERIFY_AT1 = GETDATE()
    WHERE CODE = @code`;
    new mssql.Request()
    .input("accountId", req.body.accountId)
    .input("code", req.body.code)
        .query(query,
            (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/qc-item-khieu-nai-kh", (req, res, next) => {
    let query = `UPDATE prod.BB_KHIEU_NAI
    SET KH_VERIFY_BY = @accountId, KH_VERIFY_AT = GETDATE()
    WHERE CODE = @code`;
    new mssql.Request()
    .input("accountId", req.body.accountId)
    .input("code", req.body.code)
        .query(query,
            (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/qc-item-error", (req, res, next) => {
    let packageIds = req.body.packageIds.packageId;
    let query = "INSERT INTO prod.QC_ITEM_ERROR(CODE, PACKAGE_ID, CREATED_BY, FACTORY_ID,VERIFY_BY,VERIFY_AT,QC_VERIFY_BY,QC_VERIFY_AT) VALUES";
    for (let i = 0; i < packageIds.length; i++) {
        if (i == packageIds.length - 1) {
            query += `( '${req.body.code}', ${packageIds[i]}, ${req.body.accountId}, ${req.body.factoryId}, ${req.body.accountIdsx},GETDATE(), ${req.body.accountIdqc},GETDATE())`
        } else {
            query += `( '${req.body.code}', ${packageIds[i]}, ${req.body.accountId}, ${req.body.factoryId}, ${req.body.accountIdsx},GETDATE(), ${req.body.accountIdqc},GETDATE()),`
        }
    }
    new mssql.Request()
        .query(query, (err, record) => {
            if (err) return res.api.sendFail(query);
            res.api.sendData(record.recordset);
        }
        );
});
router.post("/insert-bb-kn", (req, res, next) => {
    let packageIds = req.body.packageIds;
   
    packageIds.forEach(element => {
        const query = `INSERT INTO   [prod].[BB_KHIEU_NAI] ([CODE],[TYPE_NAME],[DESCRIPTION],[ITEM_ID],[QUANTITY],[CREATED_BY],[FACTORY_ID],[FACTORY_NHAN],STEP_ID) 
        VALUES ('${req.body.code}',N'${element.TYPE_NAME}',N'${element.DESCRIPTION}','${element.ITEM_ID}','${element.QUANTITY}','${req.body.accountId}','${req.body.factoryId}'
        ,'${req.body.factoryIdnhan}','${element.STEP_ID}')`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.get("/code-qc-item-error", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .query(
            `
            SELECT TOP 1 CODE FROM prod.QC_ITEM_ERROR WHERE FACTORY_ID = @factoryId ORDER BY CREATED_AT DESC
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/code-item-kn", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .query(
            `
            SELECT TOP 1 CODE FROM prod.BB_KHIEU_NAI WHERE FACTORY_ID = @factoryId ORDER BY CREATED_AT DESC
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/code-phieu-nhan-phoi", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .query(
            `
            SELECT TOP 1 CODE FROM prod.PHIEU_NHAN_PHOI ORDER BY CREATED_AT DESC
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/code-phieu-nhan-phoi-by-factory", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .query(
            `
            SELECT DISTINCT CODE label, CODE value FROM prod.PHIEU_NHAN_PHOI
            WHERE FACTORY_ID = @factoryId AND CREATED_AT BETWEEN @start AND @end
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/bien-ban-nhan-phoi", (req, res, next) => {
    new mssql.Request()
        .input("code", req.query.code)
        .query(
            `
            SELECT I.NAME, I.HEIGHT, I.WIDTH, I.LENGTH, IIP.QUANTITY, IIP.QUANTITY*I.VOLUMN KL, PNP.CODE, PNP.NGAY_NHAP
FROM prod.PHIEU_NHAN_PHOI PNP LEFT JOIN
prod.PACKAGE P ON PNP.PACKAGE_ID = P.ID LEFT JOIN
prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID LEFT JOIN
base.ITEM I ON IIP.ITEM_ID = I.ID
WHERE PNP.CODE = @code
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.post("/phieu-nhan-phoi", (req, res, next) => {
    const packageIds = req.body.packageIds
    packageIds.forEach(element => {
        const query = `
        INSERT INTO prod.PHIEU_NHAN_PHOI (CODE, PACKAGE_ID, LOCATION, NGAY_NHAP, CREATED_BY, CREATED_AT, FACTORY_ID)
        VALUES (N'${req.body.code}', ${element.id},N'${req.body.location}','${req.body.ngayNhap}',${req.body.accountId},GETDATE(),${req.body.factoryId})
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});

router.get("/bb-san-pham-loi", (req, res, next) => {
    new mssql.Request()
        .input("start", req.query.start)
        .input("end", req.query.end)
        .input("factoryId", req.query.factoryId)
        .query(
            ` select * from
            (SELECT  A.LAST_NAME, P.ID, D2.NAME ITEM_FROM_NAME, PO.number, D.NAME DEPARTMENT_NAME, I.ID ITEM_ID,  CONCAT(I.NAME,'(',I.HEIGHT,'x',I.WIDTH,'x',I.LENGTH,')') ITEM_NAME, PT.NAME TYPE_NAME, 
            CONCAT(R.NAME,' ',I1.NAME,'(',I1.HEIGHT,'x',I1.WIDTH,'x',I1.LENGTH,')') REMEDIES_NAME, I.HEIGHT height, I.WIDTH width, 
            I.LENGTH length, U.NAME UNIT_NAME, IIP.QUANTITY, IIP.QUANTITY*I.VOLUMN AS KL, P.CREATE_DATE createDate, P.DESCRIPTION,
            CASE WHEN  P.factoryId is null then AC.factoryId else P.factoryId END AS  factoryId
            FROM [prod].[PACKAGE] P
            LEFT JOIN prod.PACKAGE P2 ON P.ID_QC = P2.ID
			LEFT JOIN prod.PO ON P2.PO = PO.code
            INNER JOIN prod.PACKAGE_TYPE PT ON P.TYPE_ID = PT.ID
            INNER JOIN prod.REMEDIES R ON P.REMEDIES_ID = R.ID
            INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN base.ITEM I ON IIP.ITEM_ID = I.ID
            INNER JOIN base.UNIT U ON I.UNIT_ID = U.ID
            LEFT JOIN base.ITEM I1 ON P.ITEM_HC = I1.ID
            LEFT JOIN base.DEPARTMENT D ON P.DESTINATION_ID = D.ID
            INNER JOIN base.DEPARTMENT D2 ON P.ITEM_FROM_ID = D2.ID
            INNER JOIN base.ACCOUNT A ON P.CREATE_BY = A.ID
            LEFT JOIN prod.QC_ITEM_ERROR IE ON P.ID = IE.PACKAGE_ID
            LEFT JOIN base.ACCOUNT AC on AC.ID = P.CREATE_BY
            WHERE P.SOURCE_ID = 100081 and P.DESTINATION_ID != 100070 
            AND P.CREATE_DATE BETWEEN @start AND @end AND P.VERIFY_BY IS NULL AND IE.PACKAGE_ID IS NULL) K
            where K.factoryId = @factoryId
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/historyPackage", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("DESTINATION_ID", req.query.DESTINATION_ID)
        .query(`SELECT *
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
    END AS 'To',
    CASE
        WHEN L0.[TYPE] = N'Nhóm' THEN L0.NAME
        WHEN L1.TYPE = N'Nhóm' THEN L1.NAME
        WHEN L2.TYPE = N'Nhóm' THEN L2.NAME
        WHEN L3.TYPE = N'Nhóm' THEN L3.NAME
        ELSE '-'
    END AS 'Nhóm',
        GD.WEEK N'Tuần',
        GD.[DATE] N'Ngày',
        S.CODE N'Ma_to_QC',
        D.NAME N'Kho_den',
		P.DESTINATION_ID,
        PT.NAME N'Loai_loi',
        RM.NAME N'BP_xu_ly',
        I.NAME N'Chi_tiet_cum',
        IIP.QUANTITY N'So_luong',
        CB.LAST_NAME N'Nguoi_tao',
        P.CREATE_DATE N'Ngay_tao',
        P.CREATE_BY,
        VB.LAST_NAME N'Nguoi_nhan',
        P.VERIFY_BY,
        P.VERIFY_DATE,
        P.ID
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
        and P.CREATE_DATE >='2021-03-01 00:00'
		and DESTINATION_ID = @DESTINATION_ID and P.VERIFY_BY = @verifyBy
        ) X 
    `)
    res.api.sendData(recordset)
});

router.get("/:ID/:CREATE_BY/san-luong-nhan-2", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("ID", req.params.ID)
        .input("CREATE_BY", req.params.CREATE_BY)
        .query(`
select p.ID id, iip.QUANTITY quantiy, iip.ITEM_ID itemId, iip.ID x from prod.PACKAGE p
left join prod.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID

where p.ID = @ID and p.CREATE_BY = @CREATE_BY

    order by p.CREATE_DATE desc
    `)
    res.api.sendData(recordset)
})
router.get("/confirmPackage", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("id", req.query.id)
        .query(`
update prod.PACKAGE set VERIFY_BY = @verifyBy , VERIFY_DATE = SYSDATETIMEOFFSET() where ID = @id
    `)

    res.api.sendData(recordset)
})
router.get("/confirmPackagehuyloi", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("id", req.query.id)
        .query(`
delete  from prod.MATERIALS_IN_PACKAGE where ITEM_IN_PACKAGE_ID in (select ID from prod.ITEM_IN_PACKAGE where PACKAGE_ID = @id)
delete from prod.ITEM_IN_PACKAGE where PACKAGE_ID = @id
delete from prod.[PACKAGE] where ID = @id
    `)

    res.api.sendData(recordset)
})
router.get("/confirmPackage-create-by", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("id", req.query.id)
        .input("CREATE_BY", req.query.CREATE_BY)
        .input("CREATE_DATE", req.query.CREATE_DATE)
        .query(`
update prod.PACKAGE set VERIFY_BY = @verifyBy , VERIFY_DATE = SYSDATETIMEOFFSET(),CREATE_BY = @CREATE_BY,
SX_VERIFY_DATE = @CREATE_DATE where ID = @id
    `)

    res.api.sendData(recordset)
})
router.get("/ton-tai-to", async (req, res) => {
    const { start, end } = req.query;
    let data = await new mssql.Request().query(`
    select b.*, ROUND(b.nhap*i.volumn,4) as nhapM3, ROUND(b.xuat*i.volumn,4) as xuatM3, round(b.tonDauKy*i.volumn,4) as tonDauKyM3, round(b.tonCuoiKy*i.volumn,4) as tonCuoiKyM3, i.NAME as tenCT, i.CODE as maCT, i.HEIGHT as height, i.WIDTH as width, i.LENGTH as length, i2.NAME as tenSP, d.NAME as tenCongDoan from (
        select tonDK.itemId, tonDK.stepId, tonDK.tonDauKy, nhap.nhap, xuat.xuat, tonCK.tonCuoiKy, (tonDK.tonDauKy + nhap.nhap - xuat.xuat) as ct, xuat.item2 from (
        
                select itemId, stepId, sum(quantity) as tonCuoiKy from (
            SELECT        mip.ITEM_ID AS itemId,p.SOURCE_ID AS stepId, -mip.QUANTITY AS quantity
                FROM            prod.MATERIALS_IN_PACKAGE AS mip LEFT OUTER JOIN
                                         prod.ITEM_IN_PACKAGE AS iip ON iip.ID = mip.ITEM_IN_PACKAGE_ID LEFT OUTER JOIN
                                         prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
                WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL) and p.CREATE_DATE < '${end}'
                Union all
                SELECT        iip.ITEM_ID AS itemId, p.DESTINATION_ID AS stepId, iip.QUANTITY AS quantity
                FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                         prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
                WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL)  and p.CREATE_DATE < '${end}'
                union all
				select ITEM_ID as itemId, DEPARTMENT_ID as stepId, sum(-QUANTITY) as quantity from prod.OPENING_STOCK where PO_ID is not null and createdAt < '${end}'
				group by ITEM_ID, DEPARTMENT_ID
				union all
				select ITEM_ID as itemId, CASE
					--WHEN nguonPhoi = N'Tại tổ' THEN 102290
					WHEN nguonPhoi = N'Yên Sơn 1' THEN 101289
					WHEN nguonPhoi = N'Thái Bình' THEN 102289
				END as stepId, SUM(QUANTITY) as quantity from prod.OPENING_STOCK where createdAt < '${end}'

				group by ITEM_ID, nguonPhoi
                ) as t
                group by itemId, stepId
                ) as tonCK,

           ( SELECT        mip.ITEM_ID AS itemId, p.SOURCE_ID AS stepId, iip.ITEM_ID as item2, sum(mip.QUANTITY) AS xuat
        FROM            prod.MATERIALS_IN_PACKAGE AS mip LEFT OUTER JOIN
                                 prod.ITEM_IN_PACKAGE AS iip ON iip.ID = mip.ITEM_IN_PACKAGE_ID LEFT OUTER JOIN
                                 prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
        WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL) and (p.CREATE_DATE BETWEEN '${start}' AND '${end}')
        group by mip.ITEM_ID, p.SOURCE_ID, iip.ITEM_ID 
		union all
		select ITEM_ID as itemId, CASE
					--WHEN nguonPhoi = N'Tại tổ' THEN 102290
					WHEN nguonPhoi = N'Yên Sơn 1' THEN 101289
					WHEN nguonPhoi = N'Thái Bình' THEN 102289
				END as stepId,ITEM_ID as item2, SUM(-QUANTITY) as xuat from prod.OPENING_STOCK where PO_ID is not null and (createdAt BETWEEN '${start}' AND '${end}')
				group by ITEM_ID, nguonPhoi
		) as  xuat,
    
        (SELECT        iip.ITEM_ID AS itemId, p.DESTINATION_ID AS stepId, sum(iip.QUANTITY) AS nhap
        FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                 prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
        WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL)  and (p.CREATE_DATE BETWEEN '${start}' AND '${end}')
        group by iip.ITEM_ID, p.DESTINATION_ID
        
        union all
		select ITEM_ID as itemId, DEPARTMENT_ID as stepId, sum(-QUANTITY) as nhap from prod.OPENING_STOCK where PO_ID is not null and (createdAt BETWEEN '${start}' AND '${end}')
		group by ITEM_ID, DEPARTMENT_ID

		union all
				select ITEM_ID as itemId, CASE
					--WHEN nguonPhoi = N'Tại tổ' THEN 102290
					WHEN nguonPhoi = N'Yên Sơn 1' THEN 101289
					WHEN nguonPhoi = N'Thái Bình' THEN 102289
				END as stepId, SUM(QUANTITY) as quantity from prod.OPENING_STOCK where PO_ID is null and (createdAt BETWEEN '${start}' AND '${end}')
				group by ITEM_ID, nguonPhoi

        ) as nhap,
        
        (
        select itemId, stepId, sum(quantity) as tonDauKy from (
    SELECT        mip.ITEM_ID AS itemId,p.SOURCE_ID AS stepId, -mip.QUANTITY AS quantity
        FROM            prod.MATERIALS_IN_PACKAGE AS mip LEFT OUTER JOIN
                                 prod.ITEM_IN_PACKAGE AS iip ON iip.ID = mip.ITEM_IN_PACKAGE_ID LEFT OUTER JOIN
                                 prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
        WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL) and p.CREATE_DATE < '${start}'
        Union all
        SELECT        iip.ITEM_ID AS itemId, p.DESTINATION_ID AS stepId, iip.QUANTITY AS quantity
        FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                 prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
        WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL)  and p.CREATE_DATE < '${start}'
        union all
		select ITEM_ID as itemId, DEPARTMENT_ID as stepId, sum(-QUANTITY) as quantity from prod.OPENING_STOCK where PO_ID is not null and createdAt < '${start}'
		group by ITEM_ID, DEPARTMENT_ID 
        ) as t
        group by itemId, stepId
		union all
				select ITEM_ID as itemId, CASE
					--WHEN nguonPhoi = N'Tại tổ' THEN 102290
					WHEN nguonPhoi = N'Yên Sơn 1' THEN 101289
					WHEN nguonPhoi = N'Thái Bình' THEN 102289
				END as stepId, SUM(QUANTITY) as quantity from prod.OPENING_STOCK where createdAt < '${start}'

				group by ITEM_ID, nguonPhoi
        ) as tonDK
    
        
    
        where xuat.itemId = nhap.itemId and xuat.stepId = nhap.stepId and tonDK.itemId = nhap.itemId and tonDK.stepId = nhap.stepId and tonCK.itemId = nhap.itemId and tonCK.stepId = nhap.stepId
    ) as b
    left join base.ITEM i on i.ID = b.itemId
    left join base.ITEM i2 on i2.ID = b.item2
    left join base.DEPARTMENT d on d.ID = b.stepId
    `)

    res.status(200).send(data.recordset)
})
router.get("/ton-Vanity", async (req, res) => {
    const { start, end } = req.query;
    let data = await new mssql.Request().query(`
    select CODE,SP sanpham,NAME tenCT,SUM(tondauky) tondauky,sum(nhap) nhap,sum(xuat) xuat,SUM(toncuoiky) toncuoiky from
    (select M.CODE, M.NAME SP, I.NAME,SUM(IT.QUANTITY) tondauky,0 nhap,0 xuat,0 toncuoiky from prod.PACKAGE P
    left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
    left join base.ITEM I on I.ID = IT.ITEM_ID
    left join prod.PO PO on PO.code = P.PO
    left join base.MARKET M on M.CODE = PO.[root]
    where I.NAME like 'VA%' and P.DESTINATION_ID = 100071 and P.VERIFY_BY is not null and P.CREATE_DATE <'${start}'
    GROUP BY I.NAME,M.NAME,M.CODE
    union all
    select M.CODE,M.NAME SP, I.NAME,0 tondauky,SUM(IT.QUANTITY) nhap,0 xuat,0 toncuoiky from prod.PACKAGE P
    left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
    left join base.ITEM I on I.ID = IT.ITEM_ID
    left join prod.PO PO on PO.code = P.PO
    left join base.MARKET M on M.CODE = PO.[root]
    where I.NAME like 'VA%' and P.DESTINATION_ID = 100071 and P.VERIFY_BY is not null and P.CREATE_DATE >='${start}' and P.CREATE_DATE <'${end}'
    GROUP BY I.NAME,M.NAME,M.CODE
    union all
    select M.CODE,M.NAME SP, I.NAME,0 tondauky,0 nhap,0 xuat,SUM(IT.QUANTITY) toncuoiky from prod.PACKAGE P
    left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
    left join base.ITEM I on I.ID = IT.ITEM_ID
    left join prod.PO PO on PO.code = P.PO
    left join base.MARKET M on M.CODE = PO.[root]
    where I.NAME like 'VA%' and P.DESTINATION_ID = 100071 and P.VERIFY_BY is not null and  P.CREATE_DATE <'${end}'
    GROUP BY I.NAME,M.NAME,M.CODE) k
    GROUP BY SP,NAME,CODE
    `)

    res.status(200).send(data.recordset)
})
router.get("/LSX", async (req, res) => {
    const {
        week,
        year,
        factoryId
    } = req.query
    const { recordset } = await new mssql.Request()
    .input('week', week)
    .input('year', year)
    .input('factoryId', factoryId)
        .query(`
        select DISTINCT number from prod.PO where factoryId = @factoryId and week = @week 
        and year = @year and number not like '%BTP%' and PO.itemId in 
		(select PRODUCT_ID from prod.DINH_MUC_VAT_TU dm
		inner join base.MARKET m on dm.MARKET_CODE = m.CODE)
    `)

    res.api.sendData(recordset)
})
router.get("/khoi-luong-giao-nhan", async (req, res) => {
    const {factoryId, start, end } = req.query;
    let data = await new mssql.Request()
    .input('factoryId', factoryId)
    .query(`
    select DISTINCT I.HEIGHT,I.WIDTH,I.LENGTH,TY.NAME TYPE, I.NAME chitiet,I.CODE, I.ID ITEM_ID,D.NAME tenCongDoan,B.paren,B.paren_id,B.STEP_ID stepId,(select TOP 1 G.dongia from [prod].[GIA_TINH_LUONG] G where 
        G.stepId = B.STEP_ID  and G.itemId = B.ITEM_ID
        order by G.createdAt desc) gia,(select TOP 1 G.ngayapdung from [prod].[GIA_TINH_LUONG] G where 
            G.stepId = B.STEP_ID  and G.itemId = B.ITEM_ID
            order by G.createdAt desc) createdAt
        from 
          ((  select DISTINCT R.ITEM_ID, congdoan,paren,paren_id,R.STEP_ID from (SELECT DISTINCT [ITEM_ID]
            ,[STEP_ID] ,[ORDER],[factoryId] FROM [dbo].[View_Routings]) R
		  left join (select DISTINCT ITEM_ID,STEP_ID,congdoan,paren,paren_id from prod.STEP_ITEM_SP) S on R.ITEM_ID = S.ITEM_ID and R.STEP_ID = S.STEP_ID
		  where R.STEP_ID not in (102347,102789,102809,100264,100274) and R.factoryId = @factoryId
          union all
          select DISTINCT ITEM_ID, CASE when STEP_ID = 100265 then  N'2.Tổ Lựa phôi X1'
          else N'2.Tổ Lựa phôi X3' end as congdoan,paren,paren_id,
          CASE when STEP_ID = 100265  then 100264 
          else 100274 end as STEP_ID from (select DISTINCT R.ITEM_ID, congdoan,paren,paren_id,R.STEP_ID,factoryId from prod.ROUTING R
		  left join (select DISTINCT ITEM_ID,STEP_ID,congdoan,paren,paren_id from prod.STEP_ITEM_SP) S on R.ITEM_ID = S.ITEM_ID and R.STEP_ID = S.STEP_ID) SP
          left join base.ITEM I1 on I1.ID = SP.ITEM_ID 
          where STEP_ID in (100278,100265) and SP.factoryId = @factoryId
          union all
           select DISTINCT ITEM_ID, CASE when I1.TYPE_ID = 100012 and STEP_ID = 102355 then  N'2.Tổ Lựa phôi X5'
           else N'2.Tổ Lựa phôi X3 mới' end as congdoan,paren,paren_id,
           CASE when I1.TYPE_ID = 100012 and STEP_ID = 102355  then 102347 
           else 102789 end as STEP_ID from (select DISTINCT R.ITEM_ID, congdoan,paren,paren_id,R.STEP_ID,factoryId from prod.ROUTING R
		  left join (select DISTINCT ITEM_ID,STEP_ID,congdoan,paren,paren_id from prod.STEP_ITEM_SP) S on R.ITEM_ID = S.ITEM_ID and R.STEP_ID = S.STEP_ID) SP
           left join base.ITEM I1 on I1.ID = SP.ITEM_ID 
           where STEP_ID in (102355,102353) and SP.factoryId = @factoryId
           union all
           select DISTINCT ITEM_ID,CASE when ITEM_ID in (127807,127800,127817,127848) then  N'2.Tổ Lựa phôi X5' else N'2.Tổ Lựa phôi X3' end as congdoan,paren,paren_id,
           CASE when ITEM_ID in (127807,127800,127817,127848) then 102347 else 102855 end as STEP_ID from (select DISTINCT R.ITEM_ID, congdoan,paren,paren_id,R.STEP_ID,factoryId from (SELECT DISTINCT [ITEM_ID]
            ,[STEP_ID] ,[ORDER],[factoryId] FROM [dbo].[View_Routings]) R
		  left join (select DISTINCT ITEM_ID,STEP_ID,congdoan,paren,paren_id from prod.STEP_ITEM_SP) S on R.ITEM_ID = S.ITEM_ID and R.STEP_ID = S.STEP_ID) SP
           left join base.ITEM I1 on I1.ID = SP.ITEM_ID 
           where STEP_ID in (102355,102353) and SP.factoryId = @factoryId and ITEM_ID in (127807,127800,127817,127848,127289)
           union all
           select DISTINCT ITEM_ID,  N'2.Tổ Lựa phôi X5' as congdoan,paren,paren_id,
            102347 STEP_ID from (select DISTINCT R.ITEM_ID, congdoan,paren,paren_id,R.STEP_ID,factoryId from prod.ROUTING R
		  left join (select DISTINCT ITEM_ID,STEP_ID,congdoan,paren,paren_id from prod.STEP_ITEM_SP) S on R.ITEM_ID = S.ITEM_ID and R.STEP_ID = S.STEP_ID) SP
           left join base.ITEM I1 on I1.ID = SP.ITEM_ID 
           where STEP_ID in (102357) and SP.factoryId = @factoryId and SP.ITEM_ID  in  (124544,124545)
           union all
           select DISTINCT ITEM_ID, CASE when I1.TYPE_ID = 100012  then  N'2.Tổ Lựa phôi ghép'
           else N'2. Tổ Lựa phôi' end as congdoan,paren,paren_id,
           CASE when I1.TYPE_ID = 100012  then 102370 
           else 102809 end as STEP_ID from (select DISTINCT R.ITEM_ID, congdoan,paren,paren_id,R.STEP_ID,factoryId from prod.ROUTING R
		  left join (select DISTINCT ITEM_ID,STEP_ID,congdoan,paren,paren_id from prod.STEP_ITEM_SP) S on R.ITEM_ID = S.ITEM_ID and R.STEP_ID = S.STEP_ID) SP
           left join base.ITEM I1 on I1.ID = SP.ITEM_ID 
           where STEP_ID in (102380) and SP.factoryId = @factoryId
           union all
           select DISTINCT ITEM_ID, 
            N'2.Tổ Lựa phôi X3 mới'  congdoan,paren,paren_id,
           102789 STEP_ID from (select DISTINCT R.ITEM_ID, congdoan,paren,paren_id,R.STEP_ID,factoryId from prod.ROUTING R
		  left join (select DISTINCT ITEM_ID,STEP_ID,congdoan,paren,paren_id from prod.STEP_ITEM_SP) S on R.ITEM_ID = S.ITEM_ID and R.STEP_ID = S.STEP_ID) SP
           left join base.ITEM I1 on I1.ID = SP.ITEM_ID 
           where STEP_ID in (102357) and SP.factoryId = @factoryId and ITEM_ID in (125552,125553,125554,125568,125569,125570,129081)
           union all
           select DISTINCT ITEM_ID,D.NAME congdoan,I.NAME paren,I.ID paren_id,STEP_ID from prod.ROUTING R
    left join base.ITEM I on I.ID = R.ITEM_ID
    left join base.DEPARTMENT D on D.ID = R.STEP_ID
    where ITEM_ID not in (select MATERIALS_ID from prod.BOM) and ITEM_ID not in (select ITEM_ID from prod.BOM)
    and R.factoryId = @factoryId) B
    left join base.DEPARTMENT D on D.ID = B.STEP_ID
          left join base.ITEM I on I.ID = B.ITEM_ID
          left join  base.ITEM_TYPE TY on I.TYPE_ID = TY.ID
              ) 
                  where B.STEP_ID is not null
    `)

    res.status(200).send(data.recordset)
})
router.get("/xac-nhan-qc", async (req, res) => {
    const {factoryId, start, end } = req.query;
    let data = await new mssql.Request()
    .input('factoryId', factoryId)
    .query(`
    select B.ID ID, I.HEIGHT,I.WIDTH,I.LENGTH,TY.NAME TYPE, I.NAME chitiet,I.CODE, B.ITEM_ID,D.NAME tenCongDoan,
    B.STEP_ID stepId,SP.paren,xacnhanqc
        from 
          ((  select ID, ITEM_ID, STEP_ID,xacnhanqc from [prod].[ROUTING] where factoryId = @factoryId
      ) B
          left join base.ITEM I on I.ID = B.ITEM_ID
          left join  base.ITEM_TYPE TY on I.TYPE_ID = TY.ID
          left join base.DEPARTMENT D on D.ID = B.STEP_ID
          left join [prod].[STEP_ITEM_SP] SP on SP.ITEM_ID = B.ITEM_ID and SP.STEP_ID = B.STEP_ID
              ) 
                  where B.STEP_ID is not null
    `)

    res.status(200).send(data.recordset)
})


router.get("/khoi-luong-giao-nhan-2", async (req, res) => {
    const { start, end } = req.query;
    let data = await new mssql.Request().query(`
    select b.*, i.NAME as tenCT, i.CODE as maCT, i.HEIGHT as height, i.WIDTH as width, i.LENGTH as length, d.NAME as tenCongDoan, 0 as donGia, 0 as thanhTien from (
		select paren,ITEM_ID,stepId,sum(QUANTITY) AS xuat,sum(xuatM3) as xuatM3,WEEK from
		(SELECT    B.paren,  iip.ITEM_ID ITEM_ID, p.SOURCE_ID AS stepId, iip.QUANTITY AS QUANTITY, ROUND(iip.QUANTITY * i.VOLUMN,4) as xuatM3,       CASE
            WHEN DATEPART(DW,p.CREATE_DATE) = 7 THEN DATEPART(WK,p.CREATE_DATE) + 1
            ELSE DATEPART(WK,p.CREATE_DATE)
        END WEEK
        FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                 prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
								 LEFT JOIN prod.PO on PO.code = p.PO
                                 left join base.ITEM i on i.ID = iip.ITEM_ID
								 LEFT JOIN (select DISTINCT * from dbo.View_SP) B on B.ITEM_ID = iip.ITEM_ID and B.STEP_ID = p.SOURCE_ID
        WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL)  and (p.CREATE_DATE BETWEEN '20210501' AND '20210601' ) 
        and p.TYPE_ID = 100026) D
        group by  paren, ITEM_ID, stepId,WEEK
    ) as b

	left join base.ITEM i on i.ID = b.ITEM_ID
    left join base.DEPARTMENT d on d.ID = b.stepId
	where b.paren is not null
    `)

    res.status(200).send(data.recordset)
})

router.get("/lich-su-xuat-phoi-ton", async (req, res) => {
    const { start, end } = req.query;
    let data = await new mssql.Request().query(`
    select b.*, p.number as lsx, b.xuat * i.VOLUMN as xuatM3, b.nhap * i.VOLUMN as nhapM3, a.LAST_NAME as nguoiCap , i.NAME as tenCT, i.CODE as maCT, i.HEIGHT as height, i.WIDTH as width, i.LENGTH as length, d.NAME as tenCongDoan from (
        select x.*, t.nhap from (
        select PO_ID code, ITEM_ID itemId, DEPARTMENT_ID stepId, nguonPhoi,CREATE_BY accountId, createdAt, -QUANTITY as xuat
        from prod.OPENING_STOCK where PO_ID is not null and (createdAt BETWEEN '${start}' AND '${end}')
        ) as x,
        (select ITEM_ID itemId, DEPARTMENT_ID stepId, nguonPhoi, SUM(QUANTITY) as nhap from prod.OPENING_STOCK where PO_ID is null and (createdAt BETWEEN '${start}' AND '${end}')
        group by ITEM_ID, DEPARTMENT_ID, nguonPhoi
        ) as t
        where t.itemId = x.itemId and t.stepId=x.stepId and t.nguonPhoi = x.nguonPhoi
     )as b
    left join base.ITEM i on i.ID = b.itemId
    left join base.DEPARTMENT d on d.ID = b.stepId
    left join prod.PO p on p.code = b.code
    left join base.ACCOUNT a on a.ID = b.accountId
    `)
    res.status(200).send(data.recordset)
})

router.get("/cho-xac-nhan", (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input("stepId", req.query.stepId).query(
            `
            select
			P.PO,
            P.ID packageId,
            PO.number,
            PO.week,
            CONCAT('PO',PO.code) code,
            M.NAME market,
            F.ID fromId,
            F.NAME fromName,
            T.ID toId,
            T.NAME toName,
            I.ID itemId,
            I.CODE itemCode,
            I.NAME itemName,
            I.LENGTH itemLength,
            I.WIDTH itemWidth,
            I.HEIGHT itemHeight,
            PO.keHoach - PO.quantity as nhanTon,
            PO.daNhanTon as daNhanTon,
            --PO.quantity target,
            IIP.QUANTITY quantity,
			PO.quantity as Quantity,
			PO.keHoach,
            A.LAST_NAME createBy,
            P.CREATE_DATE createDate
            from prod.PACKAGE P
            left join prod.PO PO ON P.PO = PO.code
            left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
            left join base.ITEM I ON I.ID = IIP.ITEM_ID
            left join base.ACCOUNT A ON A.ID = P.CREATE_BY
            left join base.DEPARTMENT F ON F.ID = P.SOURCE_ID
            left join base.DEPARTMENT T ON T.ID = P.DESTINATION_ID
            left join base.MARKET M ON M.CODE = PO.root
            where P.DESTINATION_ID = @stepId and P.VERIFY_BY iS null
            and PO.endPO = 0 
                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else {
        res.api.sendData([]);
    }
});
router.get("/cho-xac-nhan-lua-dat", (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input("stepId", req.query.stepId).query(
            `
            select '2' bang, ID,createdAt,SOURCE_ID,DESTINATION_ID,createdby from [prod].[XUAT_GO_BAO] 
            where XUATNHAP = 'xuatluaphoi' and approvedByAccount is null and [STATUS] is null
            and DESTINATION_ID = @stepId and ID in (select BAO_ID from prod.QC_LUA_DAT)
                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else {
        res.api.sendData([]);
    }
});
router.get("/get-lua-dat", (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input("stepId", req.query.stepId).query(
            `
            select  Q.ID,Q.ITEM_ID,Q.BAO_ID,I.NAME,I.LENGTH,I.WIDTH,I.HEIGHT,Q.QUANTITY from prod.QC_LUA_DAT Q
            left join base.ITEM I on I.ID = Q.ITEM_ID
            where Q.BAO_ID in (select ID from prod.XUAT_GO_BAO  
            where XUATNHAP = 'xuatluaphoi' and approvedByAccount is null and [STATUS] is null and DESTINATION_ID = @stepId)
                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else {
        res.api.sendData([]);
    }
});
router.get("/get-xuat-lua-dat", (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input("stepId", req.query.stepId)
        .input("to", req.query.to)
        .input("from", req.query.from).query(
            `
            select  Q.ID,Q.ITEM_ID,Q.BAO_ID,I.NAME,I.LENGTH,I.WIDTH,I.HEIGHT,Q.QUANTITY from prod.QC_LUA_DAT Q
            left join base.ITEM I on I.ID = Q.ITEM_ID
            where Q.BAO_ID in (select ID from prod.XUAT_GO_BAO  
            where XUATNHAP = 'xuatluaphoi' and SOURCE_ID = @stepId and createdAt between @from and @to)
                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else {
        res.api.sendData([]);
    }
});
router.get("/get-xuat-ha-cap", (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input("stepId", req.query.stepId)
        .input("to", req.query.to)
        .input("from", req.query.from).query(
            `
            select  P.ID,IT.ITEM_ID,I.NAME,I.LENGTH,I.WIDTH,I.HEIGHT,IT.QUANTITY,P.PO,P.CREATE_DATE 
            ,P.CREATE_BY,P.VERIFY_BY,P.VERIFY_DATE,P.DESTINATION_ID from prod.PACKAGE P
            left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
                  left join base.ITEM I on I.ID = IT.ITEM_ID
            where P.SOURCE_ID = @stepId and P.CREATE_DATE between @from and @to and P.PO = 'HC'
                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else {
        res.api.sendData([]);
    }
});
router.get("/get-xac-nhan-qc", (req, res, next) => {
   
        new mssql.Request().input("stepId", req.query.stepId)
        .input("itemId", req.query.itemId)
        .query(
            `
            select TOP 1 * from [prod].[ROUTING] where ITEM_ID = @itemId and STEP_ID  = @stepId
                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
   
});

router.get("/cho-xac-nhan-phuong", (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input("stepId", req.query.stepId).query(
            `
            select 1 as bang , I.ID itemId,
            I.CODE itemCode,
            I.NAME itemName,
            I.LENGTH itemLength,
            I.WIDTH itemWidth,
            I.HEIGHT itemHeight,
			t.* from (
	select IIP.ITEM_ID, IIP.QUANTITY as quantity, P.CREATE_BY, p.CREATE_DATE, p.ID from prod.PACKAGE P
	left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
	
	where P.DESTINATION_ID = @stepId and P.VERIFY_BY iS null and P.STEP_OF_PALLET_ID is  null  and IIP.QUANTITY>0 and P.SOURCE_ID !=100081
    and P.CREATE_DATE >'20220501'
) as t
left join base.ITEM I ON I.ID = t.ITEM_ID
union all
select 2 as bang ,I.ID itemId, I.CODE itemCode, I.NAME itemName, I.DAI itemLength, I.RONG itemWidth, I.DAY itemHeight, xgb.ID ITEM_ID, 
abs(xgb.SL_TH) quantity, xgb.createdby CREATE_BY, xgb.createdAt CREATE_DATE,xgb.ID
from prod.XUAT_GO_BAO xgb 
inner join nlg.BOM I on xgb.DAI = I.DAI and xgb.RONG = I.RONG and xgb.DAY = I.DAY
where  xgb.DESTINATION_ID = @stepId and xgb.SOURCE_ID != 102378 and xgb.approvedByAccount is null 
and (xgb.XUATNHAP in ('xuat','xuatluanchuyen')) and xgb.STATUS is null and abs(xgb.SL_TH)>0 and xgb.createdAt >'20220301'
union all
select 2 as bang, I.ID itemId, I.CODE itemCode, I.NAME itemName, I.LENGTH itemLength, I.WIDTH itemWidth, I.HEIGHT itemHeight, xgb.ID ITEM_ID, 
abs(xgb.SL_HC) quantity, xgb.createdby CREATE_BY, xgb.createdAt CREATE_DATE, xgb.ID
from prod.XUAT_GO_BAO xgb 
inner join base.ITEM i on xgb.itemId = i.id
where  xgb.DESTINATION_ID = @stepId and xgb.SOURCE_ID != 102378 and xgb.approvedByAccount is null 
and ( xgb.XUATNHAP = 'xuat-cat-ha-cap' ) and xgb.STATUS is null and abs(xgb.SL_HC)>0 and xgb.createdAt >'20220301'
union all
select bang,itemId,itemCode,itemName,itemLength,itemWidth,itemHeight,ITEM_ID,quantity,CREATE_BY,CREATE_DATE,ID from (
select 3 as bang ,I.ID itemId, I.CODE itemCode, I.NAME itemName, I.DAI itemLength, I.RONG itemWidth, I.DAY itemHeight, xg.ID ITEM_ID, 
abs(xg.SL_TH) quantity, xg.createdby CREATE_BY, xg.createdAt CREATE_DATE,xg.ID
,case when xg.DESTINATION_ID = 102340 then 102493 else 102494 end as DESTINATION_ID
from prod.XUAT_GO xg 
inner join nlg.BOM I on xg.DAI = I.DAI and xg.RONG = I.RONG and xg.DAY = I.DAY
where  xg.DESTINATION_ID in (102340,102366)  and xg.approvedByAccount is null 
 and abs(xg.SL_TH)>0 and xg.createdAt >'20220901'  and xg.XUATNHAP = 'xuat') K
 where DESTINATION_ID = @stepId

                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else {
        res.api.sendData([]);
    }
});

router.get("/cho-xac-nhan2", (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input("stepId", req.query.stepId).query(
            `
            SELECT distinct * , p.keHoach - p.quantity as nhanTon  from prod.PO p
            left join base.ITEM i on i.ID = p.itemId
            left join base.DEPARTMENT d on d.ID = p.stepId
            left join prod.OPENING_STOCK s on s.DEPARTMENT_ID = d.id
            where stepId = @stepId and p.keHoach - p.quantity > 0 and p.endPO = 0
                    `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                console.log("selected PO : ", req.query.stepId);
                res.api.sendData(record.recordset);
            }
        );
    } else {
        res.api.sendData([]);
    }
});
router.get("/historyPackage2", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("verifyBy", req.query.verifyBy)
        .input("stepId", req.query.stepId)
        .query(`
        SELECT 
        IIP.QUANTITY AS QUANTITY
        , I.NAME ITEM_NAME, I.HEIGHT, I.WIDTH, I.LENGTH,
        A1.LAST_NAME CREATED_NAME, A2.LAST_NAME VERIFY_NAME,
        CASE WHEN P.SX_VERIFY_DATE is not null then
        CONVERT(VARCHAR, P.SX_VERIFY_DATE, 23) else CONVERT(VARCHAR, P.CREATE_DATE, 23) END AS ngaygiao,
        DATEPART(HOUR, P.SX_VERIFY_DATE) AS giogiao, DATEPART(minute, P.SX_VERIFY_DATE) AS phutgiao, DATEPART(second, P.SX_VERIFY_DATE) AS giaygiao,
        DATEPART(HOUR, P.VERIFY_DATE) AS gionhan, DATEPART(minute, P.VERIFY_DATE) AS phutnhan, DATEPART(second, P.VERIFY_DATE) AS giaynhan,
        CONVERT(VARCHAR, P.CREATE_DATE, 23) AS CREATED_DATE, CONVERT(VARCHAR, P.VERIFY_DATE, 23) AS VERIFY_DATE
        FROM prod.PACKAGE P
        INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
        INNER JOIN base.ITEM I ON IIP.ITEM_ID = I.ID
        INNER JOIN base.ACCOUNT A1 ON P.CREATE_BY = A1.ID
        INNER JOIN base.ACCOUNT A2 ON P.VERIFY_BY = A2.ID
        WHERE P.DESTINATION_ID = @stepId and VERIFY_DATE between '${req.query.from} 00:00' and '${req.query.to} 23:59' and P.STEP_OF_PALLET_ID is null
       
    `)
    res.api.sendData(recordset)
});

router.put("/update-status-go-bao", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("id", req.body.id)
        .query(`
        update prod.XUAT_GO_BAO set STATUS = N'${req.body.status}' where ID = @id
       
    `)
    res.api.sendData(recordset)
});
router.put("/nhan-go-bao-cat", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("id", req.body.ID)
        .query(`
        update prod.XUAT_GO_BAO set approvedByAccount = N'${req.body.CREATE_BY}',approvedAt = GETDATE() where ID = @id
       
    `)
    res.api.sendData(recordset)
});
router.put("/nhan-go-th", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("id", req.body.ID)
        .query(`
        update prod.XUAT_GO set approvedByAccount = N'${req.body.CREATE_BY}',approvedAt = GETDATE() where ID = @id
       
    `)
    res.api.sendData(recordset)
});
router.get("/:stepId/xac-nhan-phoi", async (req, res, next) => {
    let data = await VItemInPackage.findAll({
        where: {
            stepId2: req.params.stepId,
            accountId2: {
                [Op.ne]: null
            }
        },
        order: [
            ["updatedAt", "DESC"]
        ],
        include: [{
            model: Item
        }]
    });
    res.status(200).send(data)
});

router.get("/:stepId/phoi-cho-nhan", async (req, res, next) => {
    let data = await VItemInPackage.findAll({
        where: {
            stepId2: req.params.stepId,
            accountId2: {
                [Op.eq]: null
            }
        },
        order: [
            ["updatedAt", "DESC"]
        ],
        include: [{
            model: Item
        }]
    });
    res.status(200).send(data)
});
router.get("/:stepId/ghi-nhan-phoi", async (req, res, next) => {
    let data = await VItemInPackage.findAll({
        where: {
            stepId1: req.params.stepId
        },
        order: [
            ["createdAt", "DESC"]
        ],
        include: [{
            model: Item
        }]
    });
    res.status(200).send(data)
});
router.get("/:stepId/ghi-nhan-phoi1", async (req, res, next) => {
    let data = await VItemInPackage.findAll({
        where: {
            stepId1: req.params.stepId,
            createdAt: {
                [Op.and]: {
                    [Op.gte]: req.query.from,
                    [Op.lt]: req.query.to
                }
            }
        },
        order: [
            ["updatedAt"],
            ["createdAt", "DESC"]
        ],
        include: [{
            model: Item
        }]
    });
    res.status(200).send(data)
});

router.get("/:stepId/ghi-nhan-phoi-loi", async (req, res, next) => {
    const data = await new mssql.Request()
        .input("from", req.query.from)
        .input("to", req.query.to)
        .input("stepId", req.params.stepId)
        .query(
            `
            SELECT        NULL AS id, x.itemId, x.name ITEM_NAME, x.QUANTITY, CONVERT(varchar, x.createdAt, 112) AS createdAt, DATEPART(HOUR, x.createdAt) AS gio, CONVERT(varchar, x.updatedAt, 112) AS updatedAt, x.accountId, 
            x.accountId2, NULL AS code, x.stepId1, x.stepId2, x.HEIGHT, x.WIDTH, x.LENGTH, DATEPART(minute, x.createdAt) AS phutgiao, DATEPART(second, x.createdAt) AS giaygiao,x.DESCRIPTION
FROM            (SELECT        iip.ID, p.ID AS packageId, iip.ITEM_ID AS itemId, T.NAME AS name, T.HEIGHT, T.WIDTH, T.LENGTH, iip.QUANTITY, p.PO AS code, p.CREATE_DATE AS createdAt, p.CREATE_BY AS accountId, 
                                       p.VERIFY_BY AS accountId2, p.VERIFY_DATE AS updatedAt, p.SOURCE_ID AS stepId1, p.DESTINATION_ID AS stepId2,p.DESCRIPTION
             FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                       prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID LEFT OUTER JOIN
                                       base.ITEM AS T ON T.ID = iip.ITEM_ID
             WHERE       P.SOURCE_ID = @stepId AND P.CREATE_DATE BETWEEN @from AND @to AND P.SX_VERIFY_DATE IS NULL AND (p.PO IS NOT NULL) AND (p.TYPE_ID = 100004) AND (p.PO IN
                                           (SELECT        code
                                             FROM            prod.PO
                                             WHERE        (deletedAt IS NULL) AND (approvedAt IS NOT NULL)))) AS x LEFT OUTER JOIN
            prod.PO AS p ON x.code = p.code
			UNION ALL
			SELECT        NULL AS id, x.itemId, x.name ITEM_NAME, x.QUANTITY, CONVERT(varchar, x.createdAt, 112) AS createdAt, DATEPART(HOUR, x.createdAt) AS gio, CONVERT(varchar, x.updatedAt, 112) AS updatedAt, x.accountId, 
            x.accountId2, NULL AS code, x.stepId1, x.stepId2, x.HEIGHT, x.WIDTH, x.LENGTH, DATEPART(minute, x.createdAt) AS phutgiao, DATEPART(second, x.createdAt) AS giaygiao,x.DESCRIPTION
FROM            (SELECT        iip.ID, p.ID AS packageId, iip.ITEM_ID AS itemId, T.NAME AS name, T.HEIGHT, T.WIDTH, T.LENGTH, iip.QUANTITY, p.PO AS code, p.CREATE_DATE AS createdAt, p.CREATE_BY AS accountId, 
                                       p.VERIFY_BY AS accountId2, p.VERIFY_DATE AS updatedAt, p.SOURCE_ID AS stepId1, p.DESTINATION_ID AS stepId2,p.DESCRIPTION
             FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                       prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID LEFT OUTER JOIN
                                       base.ITEM AS T ON T.ID = iip.ITEM_ID
             WHERE       P.SOURCE_ID = @stepId AND P.SX_VERIFY_DATE BETWEEN @from AND @to AND (p.PO IS NOT NULL) AND (p.TYPE_ID = 100004) AND (p.PO IN
                                           (SELECT        code
                                             FROM            prod.PO
                                             WHERE        (deletedAt IS NULL) AND (approvedAt IS NOT NULL)))) AS x LEFT OUTER JOIN
            prod.PO AS p ON x.code = p.code
			UNION ALL 
			select null id, ITEM_ID, I.NAME ITEM_NAME, PT.QUANTITY, CONVERT(varchar, PT.CREATE_DATE , 112),  DATEPART(HOUR, PT.CREATE_DATE) AS gio, CONVERT(varchar, PT.VERIFY_BY, 112) AS updatedAt, PT.CREATE_BY, 
			PT.VERIFY_BY, NULL CODE, PT.SOURCE_ID, PT.DESTINATION_ID, I.HEIGHT, I.WIDTH, I.LENGTH,DATEPART(minute, PT.CREATE_DATE) AS phutgiao, DATEPART(second, PT.CREATE_DATE) AS giaygiao , PT.DESCRIPTION
			from prod.PACKAGE_TEMP pt LEFT JOIN
			base.ITEM I ON PT.ITEM_ID = I.ID
			WHERE PT.SOURCE_ID = @stepId AND PT.CREATE_DATE BETWEEN @from AND @to AND PT.TYPE_ID = 100004
            `);
            res.status(200).send(data.recordset)
});
router.get("/:stepId/ghi-nhan-pallet", async (req, res, next) => {
    const data = await new mssql.Request()
        .input("from", req.query.from)
        .input("to", req.query.to)
        .input("stepId", req.params.stepId)
        .query(
            `SELECT        NULL AS id, x.itemId, x.name ITEM_NAME, x.QUANTITY QUANTITY, CONVERT(varchar, x.createdAt, 112) AS createdAt,   x.accountId, 
            x.accountId2, NULL AS code, x.stepId1, x.stepId2, x.HEIGHT, x.WIDTH, x.LENGTH,x.pallet
FROM            (SELECT        iip.ID, p.ID AS packageId, iip.ITEM_ID AS itemId, T.NAME AS name, T.HEIGHT, T.WIDTH, T.LENGTH, iip.QUANTITY, p.PO AS code, p.CREATE_DATE AS createdAt, p.CREATE_BY AS accountId, 
                                       p.VERIFY_BY AS accountId2, p.VERIFY_DATE AS updatedAt, p.SOURCE_ID AS stepId1, p.DESTINATION_ID AS stepId2,PA.CODE pallet
             FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                       prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID  INNER JOIN
                                       base.ITEM AS T ON T.ID = iip.ITEM_ID
                                       inner join
                           prod.STEP_OF_PALLET ST on ST.ID = p.STEP_OF_PALLET_ID
                           inner join
                           prod.PALLET PA on PA.ID = ST.PALLET_ID
             WHERE  p.SOURCE_ID = @stepId AND p.CREATE_DATE BETWEEN @from AND @to  and  (p.TYPE_ID =100012 ) and p.factoryId = 100000) AS x 
   
            `);
            res.status(200).send(data.recordset)
});
router.get("/:stepId/ghi-nhan-SL1", async (req, res, next) => {
    let data = await VItemInPackage.findAll({
        attributes: [
            'itemId', 'name', 'LENGTH', 'HEIGHT', 'WIDTH', [sequelize.fn('SUM', sequelize.col('quantity')), 'quantity']
        ],
        where: {
            stepId1: req.params.stepId,
            createdAt: {
                [Op.and]: {
                    [Op.gte]: req.query.from,
                    [Op.lt]: req.query.to
                }
            }
        },
        group: ['itemId', 'name', 'LENGTH', 'HEIGHT', 'WIDTH'],
        order: [
            ["createdAt", "DESC"]
        ],
        include: [{
            model: Item
        }],
        raw: true
    });
    res.status(200).send(data)
});
router.get("/:stepId/ghi-nhan-SL", async (req, res, next) => {
    new mssql.Request()
        .input("from", req.query.from)
        .input("to", req.query.to)
        .input("stepId", req.params.stepId)
        .query(
            `select itemId,name,VOLUMN,HEIGHT,WIDTH,LENGTH,sum(QUANTITY) QUANTITY,
            ROUND(sum(QUANTITY*VOLUMN),4) TONGKL from [dbo].[View_ItemInPackages]
        where stepId1 =@stepId and createdAt between @from and @to
        group by itemId,name,VOLUMN,HEIGHT,WIDTH,LENGTH
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/GET_ITEMS_ADD_BY_ACCOUNT", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `select I.*,AC.LAST_NAME from base.ITEM_ADD I
            left join base.ACCOUNT AC on I.CREATE_BY = AC.ID
            where (I.approvedByAccount is null OR I.approvedByAccountGD IS NULL) AND I.CREATE_BY = ${req.query.accountId} ORDER BY ID DESC
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/he-so-lua-phoi", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `
            DELETE FROM [prod].[HSLP] WHERE 
            [MONTH] = ${req.body.month} AND [YEAR] = ${req.body.year} AND [FACTORY_ID] = ${req.body.factoryId}
            INSERT INTO [prod].[HSLP]
           ([MONTH]
           ,[YEAR]
           ,[FACTORY_ID]
           ,[HE_SO]
           ,[CREATED_BY]
           ,[CREATED_AT])
     VALUES
           (${req.body.month}
           ,${req.body.year}
           ,${req.body.factoryId}
           ,${req.body.heSo}
           ,${req.body.accountId}
           ,GETDATE())
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/he-so-lua-phoi", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `
            select * from prod.HSLP
where DATEPART(MONTH, GETDATE()) > ${req.query.month}
and [MONTH] = ${req.query.month} and [YEAR] = ${req.query.year} and FACTORY_ID = ${req.query.factoryId}
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/GET_ITEMS_ADD", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `select I.*,AC.LAST_NAME from base.ITEM_ADD I
            left join base.ACCOUNT AC on I.CREATE_BY = AC.ID
            where I.approvedByAccount is null
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/GET_ITEMS_ADD_GD", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `select I.*,AC.LAST_NAME from base.ITEM_ADD I
            left join base.ACCOUNT AC on I.CREATE_BY = AC.ID
            where I.approvedByAccount is not null and I.approvedByAccountGD is null 
			order by I.approvedAt desc
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/UPDATE_ITEMS_ADD", async (req, res, next) => {
    new mssql.Request()
        .query(
            `update base.ITEM_ADD
            set approvedAtGD = GETDATE(),approvedByAccountGD = '${req.query.approvedByAccountGD}'
            where ID = '${req.query.ID}'
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/UPDATE_ITEMS_ADD_BEFORE", async (req, res, next) => {
    new mssql.Request()
        .query(
            `update base.ITEM_ADD
            set approvedAt = GETDATE(),approvedByAccount = '${req.query.approvedByAccount}'
            where ID = '${req.query.ID}'
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
                
            }
        );
});
router.get("/DEL_ITEMS_ADD", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `delete from base.ITEM_ADD
            where ID = '${req.query.ID}'
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
// xóa các items add đã được phê duyệt hoặc hủy
router.get("/DELETE_ITEM_ADD_DONE", async (req, res, next) => {
    new mssql.Request()
     
        .query(
            `delete from base.ITEM_ADD
            where approvedByAccountGD IS NOT NULL 
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/lich-su", (req, res, next) => {
    new mssql.Request()
        .input("from", req.query.from)
        .input("to", req.query.to)
        .input("stepId", req.query.stepId)
        .query(
            `select 
                P.ID packageId,
                CONCAT('PO',P.PO) po,
                M.NAME market,
                PT.[DESCRIPTION] packageTypeGroup,
                PT.NAME packageType,
                I.Id itemId,
                I.CODE itemCode,
                I.NAME itemName,
                I.LENGTH itemLenght,
                I.WIDTH itemWidth,
                I.HEIGHT itemHeight,
                IIP.QUANTITY quantity,
                C.LAST_NAME createBy,
            P.CREATE_DATE createDate,
            V.LAST_NAME verifyBy,
            PO.number,
            P.VERIFY_DATE verifyDate 
            from prod.PACKAGE P
            left join prod.PO PO ON P.PO = PO.code
            left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
            left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
            left join base.ITEM I ON I.ID = IIP.ITEM_ID
            left join base.ACCOUNT C ON C.ID = P.CREATE_BY
            left join base.ACCOUNT V ON V.ID = P.VERIFY_BY
            left join base.MARKET M ON M.CODE = PO.root
            where P.CREATE_DATE BETWEEN @from AND @to
            and P.SOURCE_ID = @stepId`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/lich-su-ghi-loi", (req, res, next) => {
    new mssql.Request()
        .input("ID", req.query.ID)
       
        .query(
            `select P.CREATE_DATE,IT.QUANTITY,I.LENGTH,I.WIDTH,I.HEIGHT,AC.LAST_NAME from prod.PACKAGE  P
            left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
            left join base.ITEM I on I.ID = IT.ITEM_ID
            left join base.ACCOUNT AC on AC.ID = P.CREATE_BY
            where P.ID = @ID`,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/:id/verify", (req, res, next) => {
    let query = `UPDATE prod.[PACKAGE]
    SET VERIFY_BY = @ACCOUNT_ID, VERIFY_DATE = GETDATE()
    WHERE ID = @PACKAGE_ID`;
    new mssql.Request()
        .input("PACKAGE_ID", req.params.id)
        // .input('QUANITY', req.query.quantity)
        .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
        .query(query, (err, record) => {
            if (err) return res.api.sendFail(getErrorMessage(4907));
            console.log(query);
            res.api.sendData([]);
        });
    // req.input('PACKAGE_ID', req.params.id)
    //     .input('TYPE_ID', req.body.typeId)
    //     .execute(Proc_verifyPackage)
});
router.post('/packageAfterDrying', async (req, res, next) => {
    try {
        const data = await Package.bulkCreate(req.body)
        if (!data)
            return res.status(400).json({ success: false, message: "create erro" })
        return res.status(201).json({ success: true, message: "creaate success", data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "server err", err })
    }
})
router.post("/:ID/:QUANTITY/sua-san-luong3", (req, res, next) => {
    console.log(req.params.QUANTITY)
    console.log(req.params.ID)

    let query = `UPDATE prod.[ITEM_IN_PACKAGE]
    SET QUANTITY = ${req.params.QUANTITY}
    WHERE ID = ${req.params.ID}`;
    console.log('query cap nhat so luong iip')
    console.log(query)
    new mssql.Request()
        .input("ID", req.params.ID)
        .input('QUANITY', req.params.QUANTITY)

        .query(query, (err, record) => {
            // if (err) return res.api.sendFail(getErrorMessage(4907));
            // console.log(query);
            res.api.sendData([]);
        });
    // req.input('PACKAGE_ID', req.params.id)
    //     .input('TYPE_ID', req.body.typeId)
    //     .execute(Proc_verifyPackage)
});

router.post("/:id/verify2", (req, res) => {
    new mssql.Request()
        .input("PO", req.body.PO)
        .input("nhanTon", req.body.nhanTon)
        .input("id", req.body.id)
        .query(
            "update prod.po set quantity = quantity + @nhanTon, ton = ton - @nhanTon,daNhanTon = @nhanTon,status = null where code = @PO",
            (err, record) => {
                console.log("err", err);
                console.log("updated po", record);
                res.api.sendData([]);
            }
        );
});

router.post("/ghi-nhan-1", (req, res) => {
    let data = req.body;
    console.log(data)
    new mssql.Request()
        .input("FROM_ID", data.sourceId)
        .input("TO_ID", data.destinationId)
        .input("ITEM_FROM_ID", data.itemFromId)
        .input("ITEM_ID", data.itemId)
        .input("QUANTITY", data.quantity)
        .input("factoryIdQC", data.factoryId)
        .input("MATERIALS_ID", data.materialsId)
        .input("MATERIALS_QUANTITY", data.materialsQuantity)
        .input("TYPE_ID", data.typeId)
        .input("ITEM_HC", data.ITEM_HC)
        .input("REMEDIES_ID", data.remediesId)
        .input("DESCRIPTION", data.description)
        .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
        .input("PO", req.body.po ? req.body.po.replace("PO", "") : "")
        .output("ERROR")
        .execute("Proc_createPackage", async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            if (record.output.ERROR > 0 && record.output.ERROR != null) {
                console.log("err2", getErrorMessage(record.output.ERROR));
                return req.api.sendFail(getErrorMessage(record.output.ERROR));
            }
            res.api.sendData(record.recordset);

            if (data.typeId === 100004 && req.body.po) {

                const poCode = req.body.po.slice(2)
                //kiểm tra poCode
                const po = await Po.findOne({
                    where: {
                        code: poCode
                    }
                });

                if (po === null) return;
                // Phân tích định mức của sản phẩm
                let dinhMuc = await new mssql.Request().query(`
                WITH temp0(id, rate)
                as(
                  select ITEM_ID as id, RATE as rate from prod.BOM where ITEM_ID in (${po.itemId})
                  Union All
                  select b.MATERIALS_ID as id, b.RATE as rate
                  from temp0 as a, prod.BOM as b
                  where a.id = b.ITEM_ID and b.factoryId = ${po.factoryId}
                )
                select distinct * from temp0
              GO;
                
                `);

                //Trừ các công đoạn ở dưới

                const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from dbo.View_Routings where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} and number =  '${po.number}'
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from dbo.View_Routings as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.number = '${po.number}'
                    )
                select distinct * from temp0
                `);
                //Nếu có công đoạn ở dưới thì thực hiện trừ sản lượng nhé!
                if (congDoanDuois.recordset.length > 0) {
                    const congDonBiTrus = congDoanDuois.recordset.filter(c => c.stepId != po.stepId).map(s => s.stepId)
                    console.log("Cac cong doan bi tru la:", congDonBiTrus);
                    const pos = await Po.findAll({
                        where: {
                            number: po.number,
                            itemId: po.itemId
                        }
                    });

                    pos.forEach(async p => {
                        console.log(p.stepId)
                        let foundStep = congDonBiTrus.find(s => s == p.stepId)
                        if (foundStep) {
                            await p.increment({
                                loiCongDon: req.body.quantity
                            })
                        } else {
                            console.log("Khong bao gom")
                        }
                    })
                }

                // Trừ các tiếp chi tiết con nếu có nhé!

                if (dinhMuc.recordset.length > 0) {
                    //
                    const chiTiets = dinhMuc.recordset.filter(d => d.id != po.itemId).map(i => i.id)
                    console.log("Chi tiết:", chiTiets)
                    const lsx = await Po.findAll({
                        where: {
                            number: po.number,
                            itemId: {
                                [Op.in]: chiTiets
                            }
                        }
                    });
                    lsx.forEach(async p => {
                        let foundDinhMuc = await dinhMuc.recordset.find(d => d.id == p.itemId)
                        await p.increment({
                            loiCongDon: foundDinhMuc ? foundDinhMuc.rate * req.body.quantity : req.body.quantity
                        })
                    })
                }
            }
        });
});

router.post("/xoa-qc-loi", (req, res) => {
    let data = req.body;
    console.log(data)
    new mssql.Request()
       
        .input("ID", data.ID)
      
     
      
       
        .execute("Proc_xoa_qc_loi", async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
           
            res.api.sendData(record.recordset);

            if (data.typeId === 100004 && req.body.po) {

                const poCode = req.body.po
                //kiểm tra poCode
                const po = await Po.findOne({
                    where: {
                        code: poCode
                    }
                });

                if (po === null) return;
                // Phân tích định mức của sản phẩm
                let dinhMuc = await new mssql.Request().query(`
                WITH temp0(id, rate)
                as(
                  select ITEM_ID as id, RATE as rate from prod.BOM where ITEM_ID in (${po.itemId})
                  Union All
                  select b.MATERIALS_ID as id, b.RATE as rate
                  from temp0 as a, prod.BOM as b
                  where a.id = b.ITEM_ID and b.factoryId = ${po.factoryId}
                )
                select distinct * from temp0
              GO;
                
                `);

                //Trừ các công đoạn ở dưới

                const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} and factoryId = ${po.factoryId}
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.factoryId = ${po.factoryId}
                    )
                select distinct * from temp0
                `);
                //Nếu có công đoạn ở dưới thì thực hiện trừ sản lượng nhé!
                if (congDoanDuois.recordset.length > 0) {
                    const congDonBiTrus = congDoanDuois.recordset.filter(c => c.stepId != po.stepId).map(s => s.stepId)
                    console.log("Cac cong doan bi tru la:", congDonBiTrus);
                    const pos = await Po.findAll({
                        where: {
                            number: po.number,
                            itemId: po.itemId
                        }
                    });

                    pos.forEach(async p => {
                        console.log(p.stepId)
                        let foundStep = congDonBiTrus.find(s => s == p.stepId)
                        if (foundStep) {
                            await p.increment({
                                loiCongDon: req.body.quantity
                            })
                        } else {
                            console.log("Khong bao gom")
                        }
                    })
                }

                // Trừ các tiếp chi tiết con nếu có nhé!

                if (dinhMuc.recordset.length > 0) {
                    //
                    const chiTiets = dinhMuc.recordset.filter(d => d.id != po.itemId).map(i => i.id)
                    console.log("Chi tiết:", chiTiets)
                    const lsx = await Po.findAll({
                        where: {
                            number: po.number,
                            itemId: {
                                [Op.in]: chiTiets
                            }
                        }
                    });
                    lsx.forEach(async p => {
                        let foundDinhMuc = await dinhMuc.recordset.find(d => d.id == p.itemId)
                        await p.increment({
                            loiCongDon: foundDinhMuc ? foundDinhMuc.rate * req.body.quantity : req.body.quantity
                        })
                    })
                }
            }
        });
});
    
    
router.post("/ghi-nhan", (req, res) => {

    let data = req.body;
    console.log(data)
    new mssql.Request()
        .input("FROM_ID", data.sourceId)
        .input("TO_ID", data.destinationId)
        .input("ITEM_FROM_ID", data.itemFromId)
        .input("ITEM_ID", data.itemId)
        .input("QUANTITY", data.quantity)
        .input("TONCONLAI", data.tonconlai)
        .input("MATERIALS_ID", data.materialsId)
        .input("MATERIALS_QUANTITY", data.materialsQuantity)
        .input("TYPE_ID", data.typeId)
        .input("REMEDIES_ID", data.remediesId)
        .input("DESCRIPTION", data.description)
        .input("ACCOUNT_ID", data.ACCOUNT_ID)
        .input("verifyBy", data.verifyBy)
        .input("CREATE_DATE", data.CREATE_DATE)
        .input("ID", data.ID)
        .input("pallet_full_top_ID", data.pallet_full_top_ID)
        .input("SL_PALLET", data.SL_PALLET)
        .input("PO", req.body.po ? req.body.po.replace("PO", "") : "")
        .output("ERROR")
        .execute("Proc_createPackage_1", async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            if (record.output.ERROR > 0 && record.output.ERROR != null) {
                console.log("err2", getErrorMessage(record.output.ERROR));
                return req.api.sendFail(getErrorMessage(record.output.ERROR));
            }
            res.api.sendData(record.recordset);

        //     if (data.typeId === 100004 && req.body.po && (data.sourceId === 102339 || data.sourceId === 102340 || data.sourceId === 102366)) {

        //         const poCode = req.body.po.slice(2)
        //         //kiểm tra poCode
        //         const po = await Po.findOne({
        //             where: {
        //                 code: poCode
        //             }
        //         });

        //         if (po === null) return;
        //         // Phân tích định mức của sản phẩm


        //         //Trừ các công đoạn ở dưới
        //         console.log('nha may:', po.factoryId)
        //         const congDoanDuois = await new mssql.Request().query(`
        //         WITH temp0(itemId, stepId, seq)
        //             as(
        //                 select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from dbo.View_Routings where STEP_ID = ${po.stepId}
        //                 and ITEM_ID = ${po.itemId} and number =  '${po.number}'
        //                 Union All
        //                 select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
        //                 from dbo.View_Routings as r, temp0 as t
        //                 where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.number = '${po.number}'
        //             )
        //         select distinct * from temp0
        //         `);
        //         //Nếu có công đoạn ở dưới thì thực hiện trừ sản lượng nhé!
        //         if (congDoanDuois.recordset.length > 0) {
        //             const congDonBiTrus = congDoanDuois.recordset.filter(c => c.stepId != po.stepId).map(s => s.stepId)
        //             console.log("Cac cong doan bi tru la:", congDonBiTrus);
        //             const pos = await Po.findAll({
        //                 where: {
        //                     number: po.number,
        //                     itemId: po.itemId,
        //                     hanMucTon: 0,
        //                     ys1a: 0,
        //                     ys1b: 0,
        //                     tb: 0
        //                 }
        //             });

        //             pos.forEach(async p => {
        //                 console.log(p.stepId)
        //                 let foundStep = congDonBiTrus.find(s => s == p.stepId)
        //                 if (foundStep) {
        //                     await p.increment({
        //                         loiCongDon: req.body.quantity
        //                     })
        //                 } else {
        //                     console.log("Khong bao gom")
        //                 }
        //             })
        //         }




        //     } else {
        //         if (data.typeId === 100004 && req.body.po && data.sourceId != 102339 && data.sourceId != 102340 && data.sourceId != 102366) {

        //             const poCode = req.body.po.slice(2)
        //             //kiểm tra poCode
        //             const po = await Po.findOne({
        //                 where: {
        //                     code: poCode
        //                 }
        //             });

        //             if (po === null) return;
        //             // Phân tích định mức của sản phẩm
        //             let dinhMuc = await new mssql.Request().query(`
        //         WITH temp0(id, rate)
        //         as(
        //           select ITEM_ID as id, RATE as rate from prod.BOM where ITEM_ID in (${po.itemId})
        //           Union All
        //           select b.MATERIALS_ID as id, b.RATE as rate
        //           from temp0 as a, prod.BOM as b
        //           where a.id = b.ITEM_ID 
        //         )
        //         select distinct * from temp0
        //       GO;
                
        //         `);

        //             //Trừ các công đoạn ở dưới

        //             const congDoanDuois = await new mssql.Request().query(`
        //         WITH temp0(itemId, stepId, seq)
        //             as(
        //                 select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from dbo.View_Routings where STEP_ID = ${po.stepId}
        //                 and ITEM_ID = ${po.itemId} and number = '${po.number}'
        //                 Union All
        //                 select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
        //                 from dbo.View_Routings as r, temp0 as t
        //                 where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.number = '${po.number}'
        //             )
        //         select distinct * from temp0
        //         `);
        //             //Nếu có công đoạn ở dưới thì thực hiện trừ sản lượng nhé!
        //             if (congDoanDuois.recordset.length > 0) {
        //                 const congDonBiTrus = congDoanDuois.recordset.filter(c => c.stepId != po.stepId).map(s => s.stepId)
        //                 console.log("Cac cong doan bi tru la:", congDonBiTrus);
        //                 const pos = await Po.findAll({
        //                     where: {
        //                         number: po.number,
        //                         itemId: po.itemId
        //                     }
        //                 });

        //                 pos.forEach(async p => {
        //                     console.log(p.stepId)
        //                     let foundStep = congDonBiTrus.find(s => s == p.stepId)
        //                     if (foundStep) {
        //                         await p.increment({
        //                             loiCongDon: req.body.quantity
        //                         })
        //                     } else {
        //                         console.log("Khong bao gom")
        //                     }
        //                 })
        //             }

        //             // Trừ các tiếp chi tiết con 

        //             if (dinhMuc.recordset.length > 0) {
        //                 //
        //                 const chiTiets = dinhMuc.recordset.filter(d => d.id != po.itemId).map(i => i.id)
        //                 console.log("Chi tiết:", chiTiets)
        //                 const lsx = await Po.findAll({
        //                     where: {
        //                         number: po.number,
        //                         itemId: {
        //                             [Op.in]: chiTiets
        //                         }
        //                     }
        //                 });
        //                 lsx.forEach(async p => {
        //                     let foundDinhMuc = await dinhMuc.recordset.find(d => d.id == p.itemId)
        //                     await p.increment({
        //                         loiCongDon: foundDinhMuc ? foundDinhMuc.rate * req.body.quantity : req.body.quantity
        //                     })
        //                 })
        //             }
        //         }
        //     }
         });
});
router.post("/ghi-nhan-QM", (req, res) => {

    let data = req.body;
    console.log(data)
    new mssql.Request()
        .input("FROM_ID", data.sourceId)
        .input("TO_ID", data.destinationId)
        .input("ITEM_FROM_ID", data.itemFromId)
        .input("ITEM_ID", data.itemId)
        .input("QUANTITY", data.quantity)
        .input("TONCONLAI", data.tonconlai)
        .input("MATERIALS_ID", data.materialsId)
        .input("MATERIALS_QUANTITY", data.materialsQuantity)
        .input("TYPE_ID", data.typeId)
        .input("REMEDIES_ID", data.remediesId)
        .input("DESCRIPTION", data.description)
        .input("ACCOUNT_ID", data.ACCOUNT_ID)
        .input("ID", data.ID)
        .input("createdat", data.createdat)
        .input("PO", req.body.po ? req.body.po.replace("PO", "") : "")
        .output("ERROR")
        .execute("Proc_createPackage_QM", async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            if (record.output.ERROR > 0 && record.output.ERROR != null) {
                console.log("err2", getErrorMessage(record.output.ERROR));
                return req.api.sendFail(getErrorMessage(record.output.ERROR));
            }
            res.api.sendData(record.recordset);
        });
    });

router.post("/", (req, res) => {
    //console.log("package", req.body.factoryId1);
    let data = req.body;
    new mssql.Request()
        .input("FROM_ID", data.sourceId)
        .input("TO_ID", data.destinationId)
        .input("ITEM_FROM_ID", data.itemFromId)
        .input("ITEM_ID", data.itemId)
        .input("QUANTITY", data.quantity)
       .input("factoryIdQC", data.factoryId)
        .input("MATERIALS_ID", data.materialsId)
        .input("MATERIALS_QUANTITY", data.materialsQuantity)
        .input("TYPE_ID", data.typeId)
        .input("REMEDIES_ID", data.remediesId)
        .input("DESCRIPTION", data.description)
        .input("ITEM_HC", data.itemHC)
        .input("ID_QC", data.ID_QC)
        .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
        .input("PO", req.body.po ? req.body.po: "")
        .output("ERROR")
        .execute("Proc_createPackage", async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            if (record.output.ERROR > 0 && record.output.ERROR != null) {
                console.log("err2", getErrorMessage(record.output.ERROR));
                return req.api.sendFail(getErrorMessage(record.output.ERROR));
            }
            res.api.sendData(record.recordset);

            if (req.body.po && req.body.itemFromId != 102340 && req.body.itemFromId != 102366 && data.factoryId == 100000) {

                const poCode = req.body.po
             //Xử lý lỗi QC
                const po = await Po.findOne({
                    where: {
                        code: poCode
                    }
                });

                if (po === null) return;
                console.log("Tim thay Po:", po.code)

                // Phân tích định mức của sản phẩm
            
                let dinhMuc = await new mssql.Request().query(`
                WITH temp0(id, rate)
                as(
                  select ITEM_ID as id, RATE as rate from prod.BOM where ITEM_ID in (${data.itemId})
                  Union All
                  select b.MATERIALS_ID as id, b.RATE as rate
                  from temp0 as a, prod.BOM as b
                  where a.id = b.ITEM_ID
                )
                select distinct * from temp0
              GO;
                
                `);
                
                console.log("Lay dinh muc san pham")
                console.log(dinhMuc.recordset.map(d => d.id))

                //Trừ các công đoạn ở dưới
                let congDoanDuois = null
                if (req.body.sua == false) 
        {
                congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${data.itemId} 
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq
                    )
                select distinct * from temp0
                `);
                    }
                if (req.body.sua == true) {
                            congDoanDuois = await new mssql.Request().query(`
                        WITH temp0(itemId, stepId, seq)
                            as(
                                select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                                and ITEM_ID = ${data.itemId} 
                                Union All
                                select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                                from prod.ROUTING as r, temp0 as t
                                where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.[ORDER] >= (select [ORDER] from prod.ROUTING where STEP_ID = ${req.body.destinationId}
                                    and ITEM_ID = ${data.itemId} )
                            )
                        select distinct * from temp0
                        `);
                                }
                    
                //Nếu có công đoạn ở dưới thì thực hiện trừ sản lượng nhé!
                if (congDoanDuois.recordset.length > 0) {
                    const congDonBiTrus = congDoanDuois.recordset.filter(c => c.stepId != po.stepId).map(s => s.stepId)
                    console.log("Cac cong doan bi tru la:", congDonBiTrus);
                    const pos = await Po.findAll({  
                        where: {
                            week:po.week,
                            year:po.year,
                           // number: po.number,
                            factoryId:po.factoryId,
                            itemId: data.itemId
                        }
                    });

                    pos.forEach(async p => {
                        console.log(p.stepId)
                        let foundStep = congDonBiTrus.find(s => s == p.stepId)
                        if (foundStep) {
                            await p.increment({
                                loiCongDon: req.body.quantity
                            })
                        } else {
                            console.log("Khong bao gom")
                        }
                    })
                }

                // Trừ các tiếp chi tiết con nếu có nhé!
               if (!req.body.sua){
                if (dinhMuc.recordset.length > 0) {
                    //
                    const chiTiets = dinhMuc.recordset.filter(d => d.id != data.itemId).map(i => i.id)
                    console.log("Chi tiết:", chiTiets)
                    const lsx = await Po.findAll({
                        where: {
                            week:po.week,
                            year:po.year,
                           // number: po.number,
                            factoryId:po.factoryId,
                            itemId: {
                                [Op.in]: chiTiets
                            }
                        }
                    });
                    lsx.forEach(async p => {
                        let foundDinhMuc = await dinhMuc.recordset.find(d => d.id == p.itemId)
                        await p.increment({
                            loiCongDon: foundDinhMuc ? foundDinhMuc.rate * req.body.quantity : req.body.quantity
                        })
                    })
                }
            }
            }
            if (req.body.po && req.body.itemFromId != 102340 && req.body.itemFromId != 102366 && data.factoryId != 100000) {

                const poCode = req.body.po
             //Xử lý lỗi QC
                const po = await Po.findOne({
                    where: {
                        code: poCode
                    }
                });

                if (po === null) return;
                console.log("Tim thay Po:", po.code)

                // Phân tích định mức của sản phẩm
            
                let dinhMuc = await new mssql.Request().query(`
                WITH temp0(id, rate)
                as(
                  select ITEM_ID as id, RATE as rate from prod.BOM where ITEM_ID in (${data.itemId})
                  Union All
                  select b.MATERIALS_ID as id, b.RATE as rate
                  from temp0 as a, prod.BOM as b
                  where a.id = b.ITEM_ID
                )
                select distinct * from temp0
              GO;
                
                `);
                
                console.log("Lay dinh muc san pham")
                console.log(dinhMuc.recordset.map(d => d.id))

                //Trừ các công đoạn ở dưới
                let congDoanDuois = null
                if (req.body.sua == false) 
        {
                congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${data.itemId} 
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq
                    )
                select distinct * from temp0
                `);
                    }
                if (req.body.sua == true) {
                            congDoanDuois = await new mssql.Request().query(`
                        WITH temp0(itemId, stepId, seq)
                            as(
                                select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                                and ITEM_ID = ${data.itemId} 
                                Union All
                                select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                                from prod.ROUTING as r, temp0 as t
                                where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq and r.[ORDER] >= (select [ORDER] from prod.ROUTING where STEP_ID = ${req.body.destinationId}
                                    and ITEM_ID = ${data.itemId} )
                            )
                        select distinct * from temp0
                        `);
                                }
                    
                //Nếu có công đoạn ở dưới thì thực hiện trừ sản lượng nhé!
                if (congDoanDuois.recordset.length > 0) {
                    const congDonBiTrus = congDoanDuois.recordset.filter(c => c.stepId != po.stepId).map(s => s.stepId)
                    console.log("Cac cong doan bi tru la:", congDonBiTrus);
                    const pos = await Po.findAll({  
                        where: {
                            week:po.week,
                            year:po.year,
                            number: po.number,
                            factoryId:po.factoryId,
                            itemId: data.itemId
                        }
                    });

                    pos.forEach(async p => {
                        console.log(p.stepId)
                        let foundStep = congDonBiTrus.find(s => s == p.stepId)
                        if (foundStep) {
                            await p.increment({
                                loiCongDon: req.body.quantity
                            })
                        } else {
                            console.log("Khong bao gom")
                        }
                    })
                }

                // Trừ các tiếp chi tiết con nếu có nhé!
               if (!req.body.sua){
                if (dinhMuc.recordset.length > 0) {
                    //
                    const chiTiets = dinhMuc.recordset.filter(d => d.id != data.itemId).map(i => i.id)
                    console.log("Chi tiết:", chiTiets)
                    const lsx = await Po.findAll({
                        where: {
                            week:po.week,
                            year:po.year,
                           number: po.number,
                            factoryId:po.factoryId,
                            itemId: {
                                [Op.in]: chiTiets
                            }
                        }
                    });
                    lsx.forEach(async p => {
                        let foundDinhMuc = await dinhMuc.recordset.find(d => d.id == p.itemId)
                        await p.increment({
                            loiCongDon: foundDinhMuc ? foundDinhMuc.rate * req.body.quantity : req.body.quantity
                        })
                    })
                }
            }
        }
         });
});

router.post("/insertPackage", (req, res) => {
    let data = req.body;
    console.log("req.body", req.body);
    new mssql.Request()
        .input("FROM_ID", data.sourceId)
        .input("TO_ID", data.numberInventory)
        .input("ITEM_FROM_ID", data.itemFromId)
        .input("ITEM_ID", data.itemId)
        .input("QUANTITY", data.nhanTon)
        .input("MATERIALS_ID", data.materialsId)
        .input("MATERIALS_QUANTITY", data.materialsQuantity)
        .input("TYPE_ID", data.typeId)
        .input("ITEM_HC", data.ITEM_HC)
        .input("REMEDIES_ID", data.remediesId)
        .input("DESCRIPTION", data.description)
        .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
        .input("PO", req.body.PO)
        .output("ERROR")
        .execute("Proc_createPackage", (err, record) => {
            if (err) return res.api.sendFail(err);
            if (record.output.ERROR > 0 && record.output.ERROR != null)
                return req.api.sendFail(getErrorMessage(record.output.ERROR));
            res.api.sendData(record.recordset);
            // push event
            let packages = JSON.parse(JSON.stringify(record.recordsets[1]));
            let items = JSON.parse(JSON.stringify(record.recordsets[2]));
            let materials = JSON.parse(JSON.stringify(record.recordsets[3]));

            materials.forEach((e) => {
                let itemInPackage = items.find(
                    (i) => i.itemInPackageId == e.itemInPackageId
                );
                if (itemInPackage.materials == undefined) {
                    itemInPackage.materials = [];
                }
                itemInPackage.materials.push({
                    id: e.materialsInPackageId,
                    itemId: e.itemId,
                    quantity: e.quantity,
                });
            });

            items.forEach((e) => {
                let package = packages.find((i) => i.packageId == e.packageId);
                if (package.items === undefined) {
                    package.items = [];
                }
                package.items.push({
                    id: e.itemInPackageId,
                    itemId: e.itemId,
                    quantity: e.quantity,
                    materials: e.materials,
                });
            });
        });
});
router.get("/getPerformTable", async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        
			IF OBJECT_ID('tempdb..#TempDongGoi') IS NOT NULL
            DROP TABLE #TempDongGoi
             IF OBJECT_ID('tempdb..#TempDongGoi1') IS NOT NULL
            DROP TABLE #TempDongGoi1
             CREATE TABLE #TempDongGoi
             (
                 ITEM_ID INT,
                 CODE CHAR(20),
                 quantity decimal(19, 6),
                 name nvarchar(50),
                 number char(50),
                 thuchien decimal(19, 6),
                 thu int
             );
             insert into #TempDongGoi(
             ITEM_ID,CODE,quantity,name,number,thuchien,thu
             )
           select po.itemId,i.code,po.quantity,mk.NAME,po.number,iip.QUANTITY as thuchien,DATEPART(WEEKDAY,(pa.CREATE_DATE)) as thu  from 
             prod.PO po left join base.ITEM i on po.itemId = i.ID LEFT join
             prod.PACKAGE pa on po.code = pa.PO left join prod.ITEM_IN_PACKAGE iip
             on pa.ID = iip.PACKAGE_ID left join
             base.MARKET mk on po.market = mk.CODE 
                where year = ${req.query.year} and week = ${req.query.week} and stepId in(select id from  base.DEPARTMENT where NAME like N'% Gói%')
                and po.number like 'PO%'  and
                 po.factoryId = ${req.query.factoryId} and
    
                ((iip.QUANTITY is not null and pa.TYPE_ID = 100026) or (iip.QUANTITY is null and pa.TYPE_ID is null)) order by NAME
             --where
             --stepId in(select id from  base.DEPARTMENT where NAME like N'% Gói%')
             --and po.number like 'PO%'
             --and po.endPO = 0
             --and pa.TYPE_ID = 100026 and po.factoryId = ${req.query.factoryId}
           
               CREATE TABLE #TempDongGoi1
             (
                 CODE CHAR(20),
                 quantity decimal(19, 6),
                 name nvarchar(50),
                 thuchien decimal(19, 6),
                 thu int,
               number char(50)
             );
             insert into #TempDongGoi1(CODE,quantity,name,thuchien,thu,number)
             select CODE,quantity,name,SUM(thuchien) as thuchien,thu,number  from #TempDongGoi group by CODE,name,thu,number,quantity
           select ac.CODE,ac.name,ac.number,quantity,
           sum(ac.[2]) as thu2,
           sum(ac.[3]) as thu3,
           sum(ac.[4]) as thu4,
           sum(ac.[5]) as thu5,
           sum(ac.[6]) as thu6,
           sum(ac.[7]) as thu7,
           sum(ac.[8]) as thu8 from #TempDongGoi1 pivot (SUM(thuchien) for thu in([2],[3],[4],[5],[6],[7],[8])) as ac
           group by ac.CODE,ac.name,ac.number,quantity

        `)
        // where po.number like 'PO%' and DATEPART(WEEK,(pa.CREATE_DATE)) =${req.query.week} and DATEPART(YEAR,(pa.CREATE_DATE)) =${req.query.year} and stepId in(select id from  base.DEPARTMENT where NAME like N'% Gói%')


        res.api.sendData(data)
    } catch (e) {
        return res.send(e)
    }
})
router.get("/getPerformTableByStep", async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        IF OBJECT_ID('tempdb..#TempTHTHTungCongDoan') IS NOT NULL
        DROP TABLE #TempTHTHTungCongDoan
         CREATE TABLE #TempTHTHTungCongDoan
         (
             codePo CHAR(50),
             KHSX decimal(19, 6),
             codeItem char(20),
             nameItem nvarchar(100),
             length money,
             width money,
             height money,
             thu int,
             thuchien decimal(19, 6)
         );
           insert into #TempTHTHTungCongDoan
         (
             codePo ,
             KHSX,
             codeItem,
             nameItem,
             length ,
             width ,
             height ,
             thu ,
             thuchien 
         )
                select po.number as codePo, po.quantity as KHSX,i.CODE as codeItem ,i.NAME as nameItem,i.LENGTH,i.WIDTH,i.HEIGHT, DATEPART(WEEKDAY,(pa.CREATE_DATE)) as thu ,iip.QUANTITY as thuchien from prod.PO po left join 
                base.ITEM i on po.itemId = i.ID left join
                prod.PACKAGE pa on po.code = pa.PO left join
                prod.ITEM_IN_PACKAGE iip on pa.ID = iip.PACKAGE_ID
                where po.number like 'PO%' and po.year =${req.query.year} and po.week =${req.query.week} and stepId = ${req.query.stepId}
                and ((iip.QUANTITY is not null and pa.TYPE_ID = 100026) or (iip.QUANTITY is null and pa.TYPE_ID is null))

                --where po.number like 'PO%' and stepId = ${req.query.stepId}
                --2 where po.number like 'PO%' and DATEPART(WEEK,(pa.CREATE_DATE)) =${req.query.week} and DATEPART(YEAR,(pa.CREATE_DATE)) =${req.query.year} and stepId = ${req.query.stepId}

                select distinct ccc.codeItem,ccc.codePo,
                ccc.nameItem,
                sum(ccc.KHSX) as KHSX,
                ccc.length,
                ccc.width,
                ccc.height,
                sum(ccc.[2]) as thu2,
                sum(ccc.[3]) as thu3,
                sum(ccc.[4]) as thu4,
                sum(ccc.[5]) as thu5,
                sum(ccc.[6]) as thu6,
                sum(ccc.[7]) as thu7,
                sum(ccc.[8]) as thu8
                from #TempTHTHTungCongDoan pivot(sum(thuchien) 
                for thu in([2],[3],[4],[5],[6],[7],[8])) as ccc group by ccc.codeItem,ccc.nameItem,ccc.length,ccc.width,ccc.height,ccc.codePo
               
       
        `)


        res.api.sendData(data)
    } catch (e) {
        return res.send(e)
    }
})

router.get("/getExportVanity", async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        
        IF OBJECT_ID('tempdb..#TempXNTThanhPham') IS NOT NULL
        DROP TABLE #TempXNTThanhPham
         CREATE TABLE #TempXNTThanhPham
         (
             itemName CHAR(30),
             itemCode char(30),
             itemId int,
             itemiip int,
             thuchien decimal(19, 6),
             NAME nvarchar(50),
             date nvarchar(20)
            
         );
         insert into #TempXNTThanhPham(
         itemName,
             itemCode ,
             itemId ,
             itemiip ,
             thuchien ,
             NAME ,
             date
             
         )
                select 
                i.NAME as itemName,i.CODE itemCode,i.ID as itemId,iip.ITEM_ID as itemiip,iip.QUANTITY as thuchien,mk.NAME,SUBSTRING(CONVERT(nvarchar,pa.CREATE_DATE),1,10) as date
                from base.ITEM i
                left join prod.ITEM_IN_PACKAGE iip on i.ID = iip.ITEM_ID
                left join prod.PACKAGE pa on iip.PACKAGE_ID = pa.ID
                left join prod.PO po on pa.PO = po.code
                left join base.MARKET mk on po.market = mk.CODE 
                where i.NAME like'VA3%' and i.TYPE_ID =100003
                and pa.SOURCE_ID in(select id from  base.DEPARTMENT where NAME like N'% Gói%') and i.ID =${req.query.itemId} and po.factoryId=${req.query.factoryId}
                DECLARE @Columns as NVARCHAR(MAX)
                   SELECT @Columns =
                   COALESCE(@Columns + ', ','') + QUOTENAME(NAME)
                   FROM
                      (select distinct NAME from #TempXNTThanhPham
                      ) AS B
                      DECLARE @SQL as NVARCHAR(MAX)
                      print @Columns
               SET @SQL = 'select * from  (select itemName,itemCode,itemId,itemiip,sum(thuchien) as thuchien ,NAME,date,DATEPART(WEEK,(date)) as week from #TempXNTThanhPham group by itemCode,itemName,itemId,itemiip,NAME,date)as b pivot(sum(thuchien) for NAME in ('+@Columns+')) as temsad order by date'
               Exec (@SQL)

       
        `)
        res.api.sendData(data)
    } catch (e) {
        return res.send(e)
    }
})
router.get("/getPerformTableByStepPaint", async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        IF OBJECT_ID('tempdb..#TempPaint') IS NOT NULL
        DROP TABLE #TempPaint
         IF OBJECT_ID('tempdb..#TempPaint1') IS NOT NULL
        DROP TABLE #TempPaint1
         CREATE TABLE #TempPaint
         (
             ITEM_ID INT,
             CODE CHAR(20),
			 length money,
			 width money,
			 height money,
             quantity decimal(19, 6),
             name nvarchar(50),
             number char(50),
             thuchien decimal(19, 6),
             thu int,
			 mau char(30),
			 nameItem nvarchar(50)


         );
         insert into #TempPaint(
         ITEM_ID,CODE,length,width,height,quantity,name,number,thuchien,thu,mau,nameItem
         )
       select po.itemId,i.code,i.LENGTH as length,i.WIDTH as width,i.HEIGHT as height,po.quantity,mk.NAME,po.number,iip.QUANTITY as thuchien,DATEPART(WEEKDAY,(pa.CREATE_DATE)) as thu,po.root as mau,i.NAME as nameItem  from 
         prod.PO po left join base.ITEM i on po.itemId = i.ID LEFT join
         prod.PACKAGE pa on po.code = pa.PO left join prod.ITEM_IN_PACKAGE iip
         on pa.ID = iip.PACKAGE_ID left join
         base.MARKET mk on po.market = mk.CODE 
         where
		 stepId in(select id from  base.DEPARTMENT where id =${req.query.stepId})
         and po.number like 'PO%'
		 and po.week = ${req.query.week} 
		 and po.year = ${req.query.year}
         and ((iip.QUANTITY is not null and pa.TYPE_ID = 100026) or (iip.QUANTITY is null and pa.TYPE_ID is null))

		 
       
           CREATE TABLE #TempPaint1
         (
             CODE CHAR(20),
			 length money,
			 width money,
			 height money,
             quantity decimal(19, 6),
             name nvarchar(50),
             thuchien decimal(19, 6),
             thu int,
           number char(50),
		   			 mau char(30),
					 			 nameItem nvarchar(50)


         );
         insert into #TempPaint1(CODE,length,width,height,quantity,name,thuchien,thu,number,mau,nameItem)
         select CODE,length,width,height,sum(quantity)as quantity,name,SUM(thuchien) as thuchien,thu,number,mau,nameItem  from #TempPaint group by CODE,name,thu,number,mau,nameItem,length,width,height
       select * from (select ac.CODE,ac.name,ac.mau,ac.nameItem,ac.number,ac.length,ac.width,ac.height,
       sum(ac.quantity) as quantity,
       sum(ac.[2]) as thu2,
       sum(ac.[3]) as thu3,
       sum(ac.[4]) as thu4,
       sum(ac.[5]) as thu5,
       sum(ac.[6]) as thu6,
       sum(ac.[7]) as thu7,
       sum(ac.[8]) as thu8 from #TempPaint1 pivot (SUM(thuchien) for thu in([2],[3],[4],[5],[6],[7],[8])) as ac
       group by ac.CODE,ac.name,ac.mau,nameItem,ac.number,ac.length,ac.width,ac.height)  as ttt  order by number 
               
       
        `)


        res.api.sendData(data)
    } catch (e) {
        return res.send(e)
    }
})
router.get("/bc-xu-ly-loi", (req, res, next) => {
    new mssql.Request()
        .input("start", req.query.start)
        .input("end", req.query.end)
        .input("department", req.query.department)
        .query(
            `
            SELECT AC.LAST_NAME nguoinhan, P.ID, D2.NAME ITEM_FROM_NAME, D.NAME DEPARTMENT_NAME, I.NAME ITEM_NAME, PT.NAME TYPE_NAME, R.NAME REMEDIES_NAME, I.HEIGHT height, I.WIDTH width, 
            I.LENGTH length, IIP.QUANTITY, IIP.QUANTITY*I.VOLUMN AS KL, P.CREATE_DATE createDate, P.DESCRIPTION,P.VERIFY_BY
            FROM [prod].[PACKAGE] P
            left join base.ACCOUNT AC on AC.ID = P.VERIFY_BY
            INNER JOIN prod.PACKAGE_TYPE PT ON P.TYPE_ID = PT.ID
            INNER JOIN prod.REMEDIES R ON P.REMEDIES_ID = R.ID
            INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
            INNER JOIN base.ITEM I ON IIP.ITEM_ID = I.ID
            INNER JOIN base.DEPARTMENT D ON P.DESTINATION_ID = D.ID
            INNER JOIN base.DEPARTMENT D2 ON P.ITEM_FROM_ID = D2.ID
            WHERE SOURCE_ID = 100081 and DESTINATION_ID = @department
            AND P.CREATE_DATE BETWEEN @start AND @end 
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/bc-nhan-thanh-pham", (req, res, next) => {
    new mssql.Request()
        .input("end", req.query.end)
        .query(
            `
            SELECT I.ID, I.NAME itemName,D.NAME DEPARTMENT_NAME, SUM(IIP.QUANTITY)+ isnull(OS1.QUANTITY,0) QUANTITY,
		
            I.HEIGHT height, I.WIDTH width, I.LENGTH length, 
			
			
				 SUM(IIP.QUANTITY)+ isnull(OS1.QUANTITY,0) - isnull(OS.QUANTITY,0) 
				 AS QUANTITY_CON_LAI,
			 0 SLNhan, OS.QUANTITY QUANTITY_DA_NHAN,P.VERIFY_BY,
	       0 market
            FROM [prod].[PACKAGE] P
            --LEFT JOIN prod.PO PO on PO.code = P.PO
         
            LEFT JOIN prod.ITEM_IN_PACKAGE IIP on IIP.PACKAGE_ID = P.ID
           LEFT JOIN (
			SELECT M.PRODUCT_ID ITEM_ID, SUM(QUANTITY) QUANTITY FROM prod.OPENING_STOCK OP
			left join base.MARKET M on M.CODE = OP.market_code
			WHERE DEPARTMENT_ID = 100071 and OP.QUANTITY >0 and OP.DATE >= '20211018' and OP.DATE <= @end 
			GROUP BY M.PRODUCT_ID 
		) AS OS ON OS.ITEM_ID = IIP.ITEM_ID 
		  LEFT JOIN (
			SELECT ITEM_ID, SUM(QUANTITY) QUANTITY FROM prod.OPENING_STOCK OP
			
			WHERE CREATE_BY = 101633 and OP.QUANTITY >0 and OP.createdAt >= '20211018'
			GROUP BY ITEM_ID 
		) AS OS1 ON OS1.ITEM_ID = IIP.ITEM_ID 
            INNER JOIN base.ITEM I ON IIP.ITEM_ID = I.ID
            INNER JOIN base.DEPARTMENT D ON P.SOURCE_ID = D.ID
            WHERE P.SOURCE_ID IN (100282,100270,100273) AND P.CREATE_DATE >= '2021/10/18' AND P.TYPE_ID = 100026
            AND P.CREATE_DATE <= @end 
			GROUP BY
			I.ID, I.NAME ,D.NAME ,I.HEIGHT , I.WIDTH , I.LENGTH, I.VOLUMN,OS.QUANTITY,OS1.QUANTITY, P.VERIFY_BY
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.post("/bc-nhan-thanh-pham", (req, res, next) => {
    new mssql.Request()
        .input("accountId", req.body.accountId)
        .input("itemId", req.body.itemId)
        .input("quantity", req.body.quantity)
        .input("market_code", req.body.market_code)
        .input("week", req.body.week)
        .input("thang", req.body.thang)
        .query(
            `
            INSERT INTO prod.OPENING_STOCK (DATE,DEPARTMENT_ID,market_code, ITEM_ID, QUANTITY, CREATE_BY, createdAt, nguonPhoi,WEEK,MONTH)
            VALUES(GETDATE(),100071,@market_code, @itemId, @quantity, @accountId, GETDATE(), 'Thuan Hung',@week,@thang)
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/update-sua-po", (req, res, next) => {
    new mssql.Request()
        .input("accountId", req.body.accountId)
        .input("code", req.body.code)
        .input("number", req.body.number)
        .input("namhong", req.body.namhong)
        .input("updatekh", req.body.updatekh)
        .input("ys1a", req.body.ys1a)
        .input("ys1b", req.body.ys1b)
        .input("tb", req.body.tb)
        .input("th", req.body.th)
        .input("keHoach", req.body.keHoach)
        .query(
            `
            INSERT INTO prod.SUA_PO(code,number,keHoach,createdAt,CREATE_BY, th, ys1a,ys1b,tb,namhong,updatekh)
            VALUES(@code,@number,@keHoach,GETDATE(),@accountId,@th,@ys1a,@ys1b,@tb,@namhong,@updatekh)
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/bc-nhan-sau-say", (req, res, next) => {
    new mssql.Request()
        .input("start", req.query.start)
        .input("end", req.query.end)
        .query(
            `
            SELECT P.ID, I.NAME itemName,I.VOLUMN, IIP.QUANTITY*I.VOLUMN as KL
            , I.HEIGHT height, I.WIDTH width, I.LENGTH length, IIP.QUANTITY, P.CREATE_DATE createDate, 
	        CASE 
	            WHEN VERIFY_BY IS NULL THEN N'Chưa nhận'
	            ELSE N'Đã nhận'
	        END AS VERIFY_BY
            FROM [prod].[PACKAGE] P
            LEFT JOIN prod.ITEM_IN_PACKAGE IIP on IIP.PACKAGE_ID = P.ID
            INNER JOIN base.ITEM I ON IIP.ITEM_ID = I.ID
            INNER JOIN prod.REMEDIES R ON R.ID = P.REMEDIES_ID
            WHERE SOURCE_ID = 100081 and DESTINATION_ID = 100070 
            AND P.CREATE_DATE BETWEEN @start AND @end
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.put("/bc-nhan-sau-say", (req, res, next) => {
    new mssql.Request()
        .input("accountId", req.body.accountId)
        .input("packageId", req.body.packageId)
        .query(
            `
            UPDATE prod.PALLET SET MODIFY_BY = @accountId,MODIFY_DATE = GETDATE() WHERE CODE = @packageId
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/bc-nhan-sau-say-ngay", (req, res, next) => {
    new mssql.Request()
        .input("MODIFY_DATE", req.body.MODIFY_DATE)
        .input("packageId", req.body.packageId)
        .query(
            `
            UPDATE prod.PALLET SET MODIFY_DATE = @MODIFY_DATE  WHERE CODE = @packageId
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/bc-nhan-sau-say-theo-lo", (req, res, next) => {
    const datanhan = req.body.datanhan
    datanhan.forEach(element => {
        const query = `update prod.PALLET
        set  MODIFY_BY = '${req.body.createBy}',MODIFY_DATE = GETDATE()
        
        where CODE = '${element.CODE}'
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.post("/ma-pallet", (req, res, next) => {
    new mssql.Request()
        .input("year", req.body.year)
        .input("week", req.body.week)
        .input("factoryId", req.body.factoryId)
        .query(
            `
            select CODE from [prod].[PALLET]
            where YEAR = @year and WEEK = @week and factoryId = @factoryId
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/duyet", (req, res, next) => {
    new mssql.Request()
      
        .query(
            `INSERT INTO   base.ITEM_ADD ([CODE],[NAME],[LENGTH],[WIDTH],[HEIGHT],[TYPE_ID]
                ,[UNIT_ID],[CREATE_DATE],[CREATE_BY]
                ,[VOLUMN]
                ,[FACTORY_ID]
                ,[GOODS_TYPE],GHICHU) 
            VALUES ('${req.body.code}',N'${req.body.name}','${req.body.length}','${req.body.width}','${req.body.height}',
            '${req.body.typeId}','${req.body.unitId}',GETDATE(),'${req.body.CREATE_BY}','${req.body.volumn}'
            ,'${req.body.factoryId}',N'${req.body.GOODS_TYPE}',N'${req.body.GHICHU}')
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/update-xac-nhan-qc", (req, res, next) => {
    new mssql.Request()
      
        .query(
            `update [prod].[ROUTING] 
            set xacnhanqc = '${req.body.xacnhanqc}' where ID = ${req.body.ID}
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/nhap-don-gia", (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[GIA_TINH_LUONG] ([dongia],[createdAt],[createdby],[factoryId]
          ,stepId,parentId,itemId,ngayapdung ) 
        VALUES ('${element.donGia}', GETDATE(),'${req.body.createBy}','${req.body.factoryId}'
        ,'${element.stepId}','${element.paren_id}','${element.ITEM_ID}','${req.body.ngayapdung}')`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});
router.get("/don-gia-tinh-luong", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            WITH CTE AS
            (
                SELECT *, ROW_NUMBER() OVER (PARTITION BY itemId, parentId ORDER BY approvedAt DESC) AS LEVEL
                FROM [prod].[GIA_TINH_LUONG] WHERE approvedAt IS NOT NULL
            )
            SELECT GTL.ID ,I1.NAME PARENT_NAME, I2.NAME ITEM_NAME, GTL.dongia GIA_MOI, CTE.dongia GIA_CU, A.LAST_NAME CREATE_NAME, D.NAME DEPARTMENT_NAME 
            FROM prod.GIA_TINH_LUONG GTL
            LEFT JOIN CTE ON GTL.itemId = CTE.itemId AND GTL.parentId = CTE.parentId AND CTE.LEVEL = 1
            INNER JOIN base.ITEM I1 ON GTL.parentId = I1.ID
            INNER JOIN base.ITEM I2 ON GTL.itemId = I2.ID
            INNER JOIN base.ACCOUNT A ON  GTL.createdby = A.ID
            INNER JOIN base.DEPARTMENT D ON GTL.stepId = D.ID
            WHERE GTL.approvedByAccount IS NULL
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.put("/don-gia-tinh-luong", (req, res, next) => {
    const giaTinhLuongIds = req.body.giaTinhLuongIds.giaTinhLuongIds;

    let query = `UPDATE prod.GIA_TINH_LUONG SET approvedByAccount = ${req.body.accountId}, approvedAt = '${req.body.selectDate}' WHERE ID IN (`;
    for (let i = 0; i < giaTinhLuongIds.length; i++) {
        if (i != giaTinhLuongIds.length - 1) {
            query += `${giaTinhLuongIds[i]},`;
        } else {
            query += `${giaTinhLuongIds[i]})`;
        }
    }

    new mssql.Request()
        .query(query, (err, record) => {
            if (err) return res.api.sendFail(query);
            res.api.sendData(record.recordset);
        }
        );
});

router.get("/department-kho", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            SELECT * FROM base.DEPARTMENT WHERE TYPE2 = 'kho' and factoryId in (102339,102366,102340)
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/xuat-nhap-kho", (req, res, next) => {
    if (req.query.stepId == 102610 || req.query.stepId == 102608 ) {
        new mssql.Request()
        .input("stepId", req.query.stepId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .input("ngay", req.query.ngay)
        .query(
            `  select DISTINCT CONCAT(H.HEIGHT,'x',H.WIDTH,'x',H.LENGTH) NAME,CASE when H.LENGTH>0 THEN CAST(H.HEIGHT as float)*H.WIDTH*H.LENGTH/1000000000 
             else 1 END as VOLUMN, H.HEIGHT,H.WIDTH,H.LENGTH,TON_DAU_KY,NHAP, isnull(X.XUAT,0) XUAT from
            (select LENGTH,WIDTH,HEIGHT, SUM(QUANTITY) TON_DAU_KY  from
          
            (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY, CONVERT(VARCHAR, OS.createdAt, 23) AS CREATED_DATE, createdAt FROM   prod.OPENING_STOCK OS
            left join base.ITEM I on I.ID = OS.ITEM_ID
                          WHERE OS.DEPARTMENT_ID = @stepId and OS.createdAt >@ngay
          union 
          SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY QUANTITY, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
          INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
          left join base.ITEM I on I.ID = IIP.ITEM_ID
          WHERE P.DESTINATION_ID = @stepId AND  P.CREATE_DATE <@start AND  P.CREATE_DATE >@ngay and P.VERIFY_BY is not null
        
          union
          SELECT I.LENGTH,I.WIDTH,I.HEIGHT, -QUANTITY QUANTITY, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
          INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
          left join base.ITEM I on I.ID = IIP.ITEM_ID
          WHERE P.SOURCE_ID = @stepId AND  P.CREATE_DATE <@start AND  P.CREATE_DATE >@ngay ) k
          group by LENGTH,WIDTH,HEIGHT
        ) H
          
          left join 
          (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(NHAP) NHAP from
          (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
          INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
          left join base.ITEM I on I.ID = IIP.ITEM_ID
          WHERE P.DESTINATION_ID = @stepId AND P.CREATE_DATE >@ngay AND  P.CREATE_DATE BETWEEN @start and @end and P.VERIFY_BY is not null ) K
          GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT) N
          on N.LENGTH = H.LENGTH and N.WIDTH = H.WIDTH and N.HEIGHT = H.HEIGHT
          left join
          (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(XUAT) XUAT from
          (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
          INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
          left join base.ITEM I on I.ID = IIP.ITEM_ID
          WHERE P.SOURCE_ID = @stepId AND P.CREATE_DATE >@ngay AND  P.CREATE_DATE BETWEEN @start and @end  ) K
          GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT) X
          on  X.LENGTH = H.LENGTH and X.WIDTH = H.WIDTH and X.HEIGHT = H.HEIGHT
          
           
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else 
    if (req.query.stepId == 102493 || req.query.stepId == 102494)
    {
        new mssql.Request()
        .input("stepId", req.query.stepId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .input("factoryId", req.query.factoryId)
        .input("ngay", req.query.ngay)
        .query(
            `
  select DISTINCT B.NAME,B.DAI LENGTH,B.RONG WIDTH,B.DAY HEIGHT,(B.DAY*B.RONG*B.DAI/1000000000) VOLUMN,isnull(R.SLRALO,0)+isnull(XN.NHAP,0) NHAP,
  isnull(T.QUANTITY,0)+isnull(XTN.NHAP,0) - isnull(XT.XUAT,0)- isnull(XGT.SL_TH,0)-isnull(XGBT.SL_TH,0)+ isnull(PH.SLRALO1,0) as TON_DAU_KY,
  isnull(XG.SL_TH,0) + isnull(XGB.SL_TH,0)+isnull(X.XUAT,0) XUAT from nlg.BOM B
  
  left join
  ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY from prod.OPENING_STOCK P
   left join base.ITEM I on I.ID = P.ITEM_ID
   where DEPARTMENT_ID = @stepId 
   GROUP BY 
   I.LENGTH,
   I.WIDTH,
   I.HEIGHT) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY
   left join
   (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(NHAP) NHAP from
   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
   left join base.ITEM I on I.ID = IIP.ITEM_ID
   WHERE P.DESTINATION_ID = @stepId AND P.CREATE_DATE >@ngay and P.CREATE_DATE<@start and P.STEP_OF_PALLET_ID is null  ) K
   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT) XTN
   on  XTN.LENGTH = B.DAI and XTN.WIDTH = B.RONG and XTN.HEIGHT = B.DAY 
   left join
   (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(NHAP) NHAP from
   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
   left join base.ITEM I on I.ID = IIP.ITEM_ID
   WHERE P.DESTINATION_ID = @stepId AND P.CREATE_DATE >@ngay and P.CREATE_DATE BETWEEN @start  AND @end and P.STEP_OF_PALLET_ID is null ) K
   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT) XN
   on  XN.LENGTH = B.DAI and XN.WIDTH = B.RONG and XN.HEIGHT = B.DAY 
   left join
   (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(XUAT) XUAT from
   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
   left join base.ITEM I on I.ID = IIP.ITEM_ID
   WHERE P.SOURCE_ID = @stepId AND P.CREATE_DATE >@ngay and P.CREATE_DATE<@start and P.STEP_OF_PALLET_ID is null  ) K
   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT) XT
   on  XT.LENGTH = B.DAI and XT.WIDTH = B.RONG and XT.HEIGHT = B.DAY 
   left join
   (select K.LENGTH,K.WIDTH,K.HEIGHT, SUM(XUAT) XUAT from
   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT, QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
   left join base.ITEM I on I.ID = IIP.ITEM_ID
   WHERE P.SOURCE_ID = @stepId AND P.CREATE_DATE >@ngay and P.CREATE_DATE BETWEEN @start  AND @end and P.STEP_OF_PALLET_ID is null ) K
   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT) X
   on  X.LENGTH = B.DAI and X.WIDTH = B.RONG and X.HEIGHT = B.DAY 
    left join
    (SELECT 
       I.LENGTH length, I.HEIGHT height, I.WIDTH width,I.VOLUMN,        
           SUM(IIP.QUANTITY)  SLRALO,        
           ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)  NhapGoRALO,
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
           WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE BETWEEN @start  AND @end and KB.EXPORT_DATE >=@ngay
           AND K.FACTORY_ID = @factoryId and PL.MODIFY_BY is not null
           GROUP BY 
           I.LENGTH,
           I.WIDTH,
           I.HEIGHT,
       
         
         
           I.VOLUMN,
           KB.STATUS) R  on R.height =  B.DAY and R.length = B.DAI and R.width = B.RONG
           left join (SELECT 
           
         
           I.LENGTH length, I.HEIGHT height, I.WIDTH width,
         
           SUM(IIP.QUANTITY) SLRALO1,
           
           ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)  NhapGoRALO1,
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
           WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE <@start and KB.EXPORT_DATE >=@ngay
           AND K.FACTORY_ID = @factoryId
           GROUP BY 
           I.LENGTH,
           I.WIDTH,
           I.HEIGHT,
           I.VOLUMN,
           KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG
         left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= @stepId and DESTINATION_ID <>102380 and createdAt BETWEEN @start  AND @end and createdAt > @ngay
         GROUP BY DAY,RONG,DAI) XG on XG.DAI = B.DAI and XG.RONG = B.RONG and XG.DAY = B.DAY
      left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= @stepId and DESTINATION_ID <>102380 and createdAt < @start and createdAt > @ngay
         GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY
        -- left join
      --   (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from (select DAY,RONG,DAI,SL_TH,createdAt,CASE when DESTINATION_ID = 102340
        --    then 102493 when DESTINATION_ID = 102366 then 102494 else DESTINATION_ID end DESTINATION_ID from  prod.XUAT_GO ) k
     --    where DESTINATION_ID= @stepId  and createdAt BETWEEN @start  AND @end and createdAt > @ngay and createdAt>'20220729'
     --    GROUP BY DAY,RONG,DAI) NG on NG.DAI = B.DAI and NG.RONG = B.RONG and NG.DAY = B.DAY
     -- left join
      --   (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from (select DAY,RONG,DAI,SL_TH,createdAt,CASE when DESTINATION_ID = 102340
       --     then 102493 when DESTINATION_ID = 102366 then 102494 else DESTINATION_ID end DESTINATION_ID from  prod.XUAT_GO ) k
      --   where DESTINATION_ID= @stepId  and createdAt < @start and createdAt > @ngay and createdAt>'20220729'
      --   GROUP BY DAY,RONG,DAI ) NGT on NGT.DAI = B.DAI and NGT.RONG = B.RONG and NGT.DAY = B.DAY
         left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO_BAO where SOURCE_ID= @stepId and createdAt BETWEEN @start  AND @end and createdAt > @ngay
         GROUP BY DAY,RONG,DAI) XGB on XGB.DAI = B.DAI and XGB.RONG = B.RONG and XGB.DAY = B.DAY
      left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO_BAO where SOURCE_ID= @stepId  and createdAt < @start and createdAt > @ngay
         GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY
         where XGBT.SL_TH is not null or XGB.SL_TH is not null or XGT.SL_TH is not null
         or XG.SL_TH is not null or R.SLRALO is not null or PH.SLRALO1 is not null
         or T.QUANTITY is not null or XN.NHAP is not null or XTN.NHAP is not null or X.XUAT is not null or XT.XUAT is not null
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else if (req.query.stepId == 102495 || req.query.stepId == 102487)
    {
        new mssql.Request()
        .input("stepId", req.query.stepId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .input("ngay", req.query.ngay)
        .query(
            ` select  NAME,LENGTH,WIDTH,HEIGHT,VOLUMN,SUM(TON_DAU_KY) TON_DAU_KY,SUM(XUAT) XUAT,SUM(NHAP) NHAP from
            (select DISTINCT B.NAME,B.DAI LENGTH,B.RONG WIDTH,B.DAY HEIGHT,(B.DAY*B.RONG*B.DAI/1000000000) VOLUMN,
             - isnull(XGT.SL_TH,0)+ isnull(XGBT.SL_TH,0) as TON_DAU_KY,
            isnull(XG.SL_TH,0) XUAT,isnull(XGB.SL_TH,0) NHAP from nlg.BOM B 
         
                   left join
                   (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= @stepId  and createdAt BETWEEN @start  AND @end and createdAt >@ngay
                   GROUP BY DAY,RONG,DAI) XG on XG.DAI = B.DAI and XG.RONG = B.RONG and XG.DAY = B.DAY                   
                left join
                   (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= @stepId  and createdAt < @start and createdAt >@ngay
                   GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY
                   left join
                   (select I.HEIGHT DAY,I.WIDTH RONG,I.LENGTH DAI,SUM(ABS(QUANTITY)) SL_TH from prod.XUAT_GO_BAO GB
                   left join prod.QC_LUA_DAT LD on LD.BAO_ID = GB.ID
                   left join base.ITEM I on I.ID = LD.ITEM_ID
                   where DESTINATION_ID= @stepId and createdAt BETWEEN @start  AND @end and createdAt >@ngay and approvedByAccount is not null
                   GROUP BY I.HEIGHT,I.WIDTH,I.LENGTH) XGB on XGB.DAI = B.DAI and XGB.RONG = B.RONG and XGB.DAY = B.DAY
                left join
                   (select I.HEIGHT DAY,I.WIDTH RONG,I.LENGTH DAI,SUM(ABS(QUANTITY)) SL_TH from prod.XUAT_GO_BAO GB
                   left join prod.QC_LUA_DAT LD on LD.BAO_ID = GB.ID
                   left join base.ITEM I on I.ID = LD.ITEM_ID
                    where DESTINATION_ID= @stepId  and createdAt < @start and createdAt >@ngay and approvedByAccount is not null
                   GROUP BY I.HEIGHT,I.WIDTH,I.LENGTH ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY
                   where XGBT.SL_TH is not null or XGB.SL_TH is not null or XGT.SL_TH is not null
                   or XG.SL_TH is not null 

                   union all
                   (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, 0 TON_DAU_KY,0 XUAT,SUM(NHAP) NHAP from
                   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                   left join base.ITEM I on I.ID = IIP.ITEM_ID
                   WHERE P.DESTINATION_ID = @stepId AND P.CREATE_DATE >@ngay AND  P.CREATE_DATE BETWEEN @start and @end and P.VERIFY_BY is not null  ) K
                   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME) 
    
                   union all
                   (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(NHAP) TON_DAU_KY,0 XUAT,0 NHAP from
                   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, QUANTITY NHAP, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                   left join base.ITEM I on I.ID = IIP.ITEM_ID
                   WHERE P.DESTINATION_ID = @stepId AND P.CREATE_DATE >@ngay AND  P.CREATE_DATE < @start and P.VERIFY_BY is not null) K
                   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)
                  
                   union all
                   (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, 0 TON_DAU_KY,SUM(XUAT) XUAT,0 NHAP from
                   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                   left join base.ITEM I on I.ID = IIP.ITEM_ID
                   WHERE P.SOURCE_ID = @stepId AND P.CREATE_DATE >@ngay AND  P.CREATE_DATE BETWEEN @start and @end  ) K
                   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME) 
                   union all
                   ( select I.NAME,I.LENGTH,I.WIDTH,I.HEIGHT,(I.LENGTH*I.WIDTH*I.HEIGHT/1000000000) VOLUMN,SUM(P.QUANTITY) TON_DAU_KY,0 XUAT,0 NHAP from prod.OPENING_STOCK P
                    left join base.ITEM I on I.ID = P.ITEM_ID
                    where DEPARTMENT_ID = @stepId 
                    GROUP BY I.NAME,
                    I.LENGTH,
                    I.WIDTH,
                    I.HEIGHT)
                   union all
                   (select K.NAME, K.LENGTH,K.WIDTH,K.HEIGHT,(K.LENGTH*K.WIDTH*K.HEIGHT/1000000000) VOLUMN, SUM(XUAT) TON_DAU_KY,0 XUAT,0 NHAP from
                   (SELECT I.LENGTH,I.WIDTH,I.HEIGHT,I.NAME, -QUANTITY XUAT, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt FROM prod.PACKAGE P
                   INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                   left join base.ITEM I on I.ID = IIP.ITEM_ID
                   WHERE P.SOURCE_ID = @stepId AND P.CREATE_DATE >@ngay AND  P.CREATE_DATE < @start ) K
                   GROUP BY K.LENGTH,K.WIDTH,K.HEIGHT,K.NAME)) H
                   group by NAME,LENGTH,WIDTH,HEIGHT,VOLUMN
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    } else
    new mssql.Request()
        .input("stepId", req.query.stepId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .input("ngay", req.query.ngay)
        .query(
            `
            WITH CTE (ITEM_ID, QUANTITY, STR_DATE, CREATED_DATE,dt) AS (
                SELECT ITEM_ID, QUANTITY, CONVERT(VARCHAR, OS.createdAt, 23) AS CREATED_DATE, createdAt,1 dt FROM prod.OPENING_STOCK OS
                WHERE OS.DEPARTMENT_ID = @stepId
               -- UNION
             --   SELECT itemId ITEM_ID, SL_TH QUANTITY, CONVERT(VARCHAR, XG.createdAt, 23) AS CREATED_DATE, createdAt FROM prod.XUAT_GO XG
             --   WHERE XG.SOURCE_ID = @stepId and XUATNHAP = 'nhap'
             --   UNION
             --   SELECT itemId ITEM_ID, (-SL_TH) QUANTITY, CONVERT(VARCHAR, XG1.createdAt, 23) AS CREATED_DATE, createdAt FROM prod.XUAT_GO XG1
              --  WHERE XG1.SOURCE_ID = @stepId and XUATNHAP = 'xuat'
            UNION
                SELECT ITEM_ID, QUANTITY, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt,2 dt FROM prod.PACKAGE P
                INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                WHERE P.DESTINATION_ID = @stepId AND P.VERIFY_BY IS NOT NULL and P.CREATE_DATE >=@ngay
                UNION
                SELECT ITEM_ID, (-QUANTITY) QUANTITY, CONVERT(VARCHAR, P.CREATE_DATE, 23) CREATE_DATE,P.CREATE_DATE createdAt,3 dt FROM prod.PACKAGE P
                INNER JOIN prod.ITEM_IN_PACKAGE IIP ON P.ID = IIP.PACKAGE_ID
                WHERE P.SOURCE_ID = @stepId AND P.CREATE_DATE >=@ngay
                )
                SELECT DISTINCT I.ID ITEM_ID,I.NAME, I.HEIGHT, I.LENGTH, I.WIDTH,
                (
                SELECT CASE WHEN SUM(QUANTITY) IS NULL THEN 0 ELSE SUM(QUANTITY) END FROM CTE C2 WHERE C2.ITEM_ID = CTE.ITEM_ID AND CREATED_DATE < @start AND CREATED_DATE >=@ngay
                ) AS TON_DAU_KY,
                (
                SELECT CASE WHEN SUM(QUANTITY) IS NULL THEN 0 ELSE SUM(QUANTITY) END FROM CTE C2 WHERE C2.ITEM_ID = CTE.ITEM_ID AND C2.CREATED_DATE BETWEEN @start AND @end AND C2.QUANTITY > 0
                ) AS NHAP,
                (
                SELECT CASE WHEN SUM(-QUANTITY) IS NULL THEN 0 ELSE SUM(-QUANTITY) END FROM CTE C2 WHERE C2.ITEM_ID = CTE.ITEM_ID AND C2.CREATED_DATE BETWEEN @start AND @end AND C2.QUANTITY < 0 and dt = 3
                ) AS XUAT,
				I.VOLUMN
                FROM CTE
                INNER JOIN base.ITEM I ON CTE.ITEM_ID = I.ID
                WHERE CTE.CREATED_DATE > @ngay and I.STATUS = 1
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
    
});
router.get("/xuat-nhap-kho-go-tho", (req, res, next) => {
    new mssql.Request()
        .input("stepId", req.query.stepId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .input("factoryId", req.query.factoryId)
        .query(
            `
  select DISTINCT B.NAME,B.DAI LENGTH,B.RONG WIDTH,B.DAY HEIGHT,(B.DAY*B.RONG*B.DAI/1000000000) VOLUMN,isnull(R.SLRALO,0) NHAP,
  isnull(T.QUANTITY,0) +isnull(XGT.SL_TH,0)+ isnull(XGBT.SL_TH,0)+ isnull(PH.SLRALO1,0) as TON_DAU_KY,
  isnull(XG.SL_TH,0) + isnull(XGB.SL_TH,0) XUAT from nlg.BOM B
  left join
  ( select I.LENGTH,I.WIDTH,I.HEIGHT,SUM(P.QUANTITY) QUANTITY from prod.OPENING_STOCK P
   left join base.ITEM I on I.ID = P.ITEM_ID
   where DEPARTMENT_ID = @stepId and QUANTITY>=0
   GROUP BY 
   I.LENGTH,
   I.WIDTH,
   I.HEIGHT) T on T.LENGTH = B.DAI and T.WIDTH = B.RONG and T.HEIGHT = B.DAY
    left join
    (SELECT 
       I.LENGTH length, I.HEIGHT height, I.WIDTH width,I.VOLUMN,        
           SUM(IIP.QUANTITY)  SLRALO,        
           ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)  NhapGoRALO,
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
           WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE BETWEEN @start  AND @end and KB.EXPORT_DATE >='20210801'
           AND K.FACTORY_ID = @factoryId
           GROUP BY 
           I.LENGTH,
           I.WIDTH,
           I.HEIGHT,        
           I.VOLUMN,
           KB.STATUS) R  on R.height =  B.DAY and R.length = B.DAI and R.width = B.RONG
           left join (SELECT 
           I.LENGTH length, I.HEIGHT height, I.WIDTH width,
           SUM(IIP.QUANTITY) SLRALO1,
           ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)  NhapGoRALO1,
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
           WHERE KB.STATUS = 'finish' AND KB.EXPORT_DATE <@start and KB.EXPORT_DATE >='20210801'
           AND K.FACTORY_ID = @factoryId
           GROUP BY 
           I.LENGTH,
           I.WIDTH,
           I.HEIGHT,
           I.VOLUMN,
           KB.STATUS) PH on PH.height = B.DAY and PH.length = B.DAI and PH.width= B.RONG
         left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= 102494 and createdAt BETWEEN @start  AND @end
         GROUP BY DAY,RONG,DAI) XG on XG.DAI = B.DAI and XG.RONG = B.RONG and XG.DAY = B.DAY
      left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO where SOURCE_ID= 102494 and createdAt < @start
         GROUP BY DAY,RONG,DAI ) XGT on XGT.DAI = B.DAI and XGT.RONG = B.RONG and XGT.DAY = B.DAY
         left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO_BAO where SOURCE_ID= 102494 and createdAt BETWEEN @start  AND @end
         GROUP BY DAY,RONG,DAI) XGB on XGB.DAI = B.DAI and XGB.RONG = B.RONG and XGB.DAY = B.DAY
      left join
         (select DAY,RONG,DAI,SUM(SL_TH) SL_TH from prod.XUAT_GO_BAO where SOURCE_ID= 102494 and createdAt < @start
         GROUP BY DAY,RONG,DAI ) XGBT on XGBT.DAI = B.DAI and XGBT.RONG = B.RONG and XGBT.DAY = B.DAY
         where XGBT.SL_TH is not null or XGB.SL_TH is not null or XGT.SL_TH is not null
         or XG.SL_TH is not null or R.SLRALO is not null or PH.SLRALO1 is not null
         or T.QUANTITY is not null
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/xuat-nhap-kho-go-tuoi", (req, res, next) => {
    new mssql.Request()
        .input("makho", req.query.makho)
        .input("factoryId", req.query.factoryId)
        .input("stepId", req.query.stepId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .input("ngay", req.query.ngay)
        .query(
            `
            select DISTINCT B.GROUP_QC nhom,B.NAME,B.DAY,B.RONG,B.DAI,isnull(THT.QUANTITY,0) + isnull(TH.TH,0) - isnull(PH.KL,0)-isnull(TXLC.SL_TH,0)+isnull(TNLC.SL_TH,0) TON_DAU_KY,isnull(YSN.TH,0) NHAP,isnull(NLC.SL_TH,0) nhapnb,isnull(PHX.KL,0) xepsay,isnull(XLC.SL_TH,0) xuatnb,isnull(TH.TH,0) + isnull(THT.QUANTITY,0) - isnull(PH.KL,0) 
  - isnull(PHX.KL,0) + isnull(YSN.TH,0)- isnull(XLC.SL_TH,0)-isnull(TXLC.SL_TH,0)+isnull(NLC.SL_TH,0)+isnull(TNLC.SL_TH,0) as TONKKHOYS
     
        from NLG.BOM B
        left join
        (select   PD.DAY,PD.RONG,PD.CAO,SUM((CAST(PD.SOBO AS float)*PD.SOTHANH_BO)) AS TH
             from nlg.PHIEUNHAPKHO_DT PD
             LEFT JOIN 
             nlg.PHIEUNHAPKHO P On P.SOPHIEU = PD.SOPHIEUNHAP
            
           
             where P.MAKHO = @makho and P.CREATED_AT BETWEEN @ngay AND @start and PD.DEL_FLAG = 'N' and PD.DELAI in ('N','M')
             GROUP BY PD.DAY,PD.RONG,PD.CAO) TH ON TH.DAY = B.DAY and TH.RONG = B.RONG and TH.CAO = B.DAI
			      left join
        (select   PD.DAY,PD.RONG,PD.CAO,SUM((CAST(PD.SOBO AS float)*PD.SOTHANH_BO)) AS TH
             from nlg.PHIEUNHAPKHO_DT PD
             LEFT JOIN 
             nlg.PHIEUNHAPKHO P On P.SOPHIEU = PD.SOPHIEUNHAP
            
           
             where P.MAKHO = @makho and P.CREATED_AT BETWEEN @start AND @end and PD.DEL_FLAG = 'N' and PD.DELAI = 'N' and P.CREATED_AT > @ngay
             GROUP BY PD.DAY,PD.RONG,PD.CAO) YSN ON YSN.DAY = B.DAY and YSN.RONG = B.RONG and YSN.CAO = B.DAI
        left join 
        (select DISTINCT I.LENGTH,I.HEIGHT,I.WIDTH,SUM(ST.QUANTITY) as QUANTITY from prod.OPENING_STOCK ST
             LEFT JOIN
             base.ITEM I ON ST.ITEM_ID = I.ID
             where DEPARTMENT_ID = @stepId and ST.createdAt> @ngay
             GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) THT ON B.DAI = THT.LENGTH and B.DAY = THT.HEIGHT and B.RONG = THT.WIDTH
        left join 
        (  select DAY,RONG,DAI,SUM(SL_TH) SL_TH from [prod].[XUAT_GO_BAO] where XUATNHAP = 'xuatluanchuyen' and SOURCE_ID = @stepId
        and createdAt BETWEEN @start AND @end and createdAt> @ngay
        GROUP BY  DAY,RONG,DAI) XLC on B.DAI = XLC.DAI and B.DAY = XLC.DAY and B.RONG = XLC.RONG
        left join 
        (  select DAY,RONG,DAI,SUM(SL_TH) SL_TH from [prod].[XUAT_GO_BAO] where XUATNHAP = 'xuatluanchuyen' and SOURCE_ID = @stepId
        and createdAt < @start  and createdAt> @ngay
        GROUP BY  DAY,RONG,DAI) TXLC on B.DAI = TXLC.DAI and B.DAY = TXLC.DAY and B.RONG = TXLC.RONG
        left join 
        (  select DAY,RONG,DAI,SUM(SL_TH) SL_TH from [prod].[XUAT_GO_BAO] where XUATNHAP = 'xuatluanchuyen' and DESTINATION_ID = @stepId                                 
        and createdAt BETWEEN @start AND @end and createdAt> @ngay
        GROUP BY  DAY,RONG,DAI) NLC on B.DAI = NLC.DAI and B.DAY = NLC.DAY and B.RONG = NLC.RONG
        left join 
        (  select DAY,RONG,DAI,SUM(SL_TH) SL_TH from [prod].[XUAT_GO_BAO] where XUATNHAP = 'xuatluanchuyen' and DESTINATION_ID = @stepId                                 
        and createdAt < @start and createdAt> @ngay
        GROUP BY  DAY,RONG,DAI) TNLC on B.DAI = TNLC.DAI and B.DAY = TNLC.DAY and B.RONG = TNLC.RONG
              LEFT JOIN
          (select DISTINCT I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY) KL from prod.PALLET P 
          
          LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
          LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
          where  P.factoryId = @factoryId and P.CREATE_DATE BETWEEN @ngay AND @start and P.TYPE_ID not in (100014,100048,100049)
          GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PH ON PH.HEIGHT = B.DAY and PH.WIDTH = B.RONG and PH.LENGTH = B.DAI
		     LEFT JOIN
          (select DISTINCT I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY) KL from prod.PALLET P 
          
          LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
          LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
          where  P.factoryId = @factoryId and P.CREATE_DATE BETWEEN @start AND @end and P.TYPE_ID not in (100014,100048,100049) and P.CREATE_DATE >@ngay
          GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PHX ON PHX.HEIGHT = B.DAY and PHX.WIDTH = B.RONG and PHX.LENGTH = B.DAI
		  where THT.QUANTITY >0 or TH.TH >0 or PH.KL >0 or YSN.TH >0 or PHX.KL >0
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/kiem-phieu-xuat-kho", (req, res, next) => {
    new mssql.Request()
        .input("stepId", req.query.stepId)
        .input("date", req.query.date)
        .query(
            `
            SELECT 
           P.ID,
			I.NAME, I.LENGTH, I.WIDTH, I.HEIGHT, 
           
           D1.NAME congdoannhan,
            U.NAME AS UNIT_NAME,
            IT.QUANTITY QUANTITY, 
            IT.QUANTITY*I.VOLUMN AS KL, 
            I.GOODS_TYPE,
            P.CREATE_DATE createdAt,
            [DESCRIPTION]
            FROM prod.PACKAGE P
            left join prod.ITEM_IN_PACKAGE IT on P.ID = IT.PACKAGE_ID
            INNER JOIN base.ITEM I ON IT.ITEM_ID = I.ID
            INNER JOIN base.UNIT U ON I.UNIT_ID = U.ID
            left join base.DEPARTMENT D ON D.ID =  P.SOURCE_ID
            left join base.DEPARTMENT D1 ON D1.ID =  P.DESTINATION_ID
            WHERE P.SOURCE_ID = @stepId AND P.CREATE_DATE BETWEEN @date and '${req.query.date} 23:59:59' 
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/kiem-phieu-xuat-kho/so-phieu", (req, res, next) => {
    new mssql.Request()
        .input("stepId", req.query.stepId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .query(
            `
            SELECT DISTINCT number SO_PHIEU, createdAt [DATE] FROM prod.XUAT_GO_BAO 
			WHERE SOURCE_ID = @stepId 
			AND number IS NOT NULL
			AND createdAt BETWEEN @start AND @end
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/kiem-phieu-xuat-kho-by-so-phieu", (req, res, next) => {
    new mssql.Request()
        .input("soPhieu", req.query.soPhieu)
        .input("department", req.query.department)
        .input("month", req.query.month)
        .query(
            `
            SELECT 
            XGB.ID,
			B.NAME,XGB.DAI LENGTH,XGB.RONG WIDTH,XGB.DAY HEIGHT, 
            XGB.SL_TH,XGB.KLC_TH,
            D.NAME congdoannhan,
            'T' UNIT_NAME,
            
            GHICHU,
			XGB.BSX BKS
            FROM prod.XUAT_GO_BAO XGB
            INNER JOIN nlg.BOM B on B.DAY = XGB.DAY and B.DAI = XGB.DAI and B.RONG = XGB.RONG
            
            left join base.DEPARTMENT D ON D.ID =  XGB.DESTINATION_ID
            WHERE XGB.number = @soPhieu and XUATNHAP = 'xuatluanchuyen' and SOURCE_ID = @department
            and DATEPART(month,createdAt) = @month
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.put("/kiem-phieu-xuat-kho", (req, res, next) => {
    new mssql.Request()
        .input("id", req.body.id)
        .input("sl_pl", req.body.sl_pl)
        .input("soPhieu", req.body.soPhieu)
        .input("bks", req.body.bks)
        .input("description", req.body.description)
        .query(
            `
            UPDATE prod.OPENING_STOCK
			SET SL_PL = @sl_pl, SO_PHIEU = @soPhieu, BKS = @bks, description = @description 
			WHERE ID = @id
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/ton-go-tuoi", (req, res, next) => {
    new mssql.Request()
        .input("makho", req.query.makho)
        .input("factoryId", req.query.factoryId)
        .input("stepId", req.query.stepId)
        .input("end", req.query.end)
        .input("ngay", req.query.ngay)
        .query(
            `
            select DISTINCT B.GROUP_QC nhom, B.NAME, B.DAY, B.RONG, B.DAI, isnull(THT.QUANTITY,0) 
  - isnull(PHX.KL,0) + isnull(YSN.TH,0)- isnull(XLC.SL_TH,0)+isnull(NLC.SL_TH,0) as TONKKHOYS
     
        from NLG.BOM B
        left join
        (select   PD.DAY,PD.RONG,PD.CAO,SUM((CAST(PD.SOBO AS float)*PD.SOTHANH_BO)) AS TH
             from nlg.PHIEUNHAPKHO_DT PD
             LEFT JOIN 
             nlg.PHIEUNHAPKHO P On P.SOPHIEU = PD.SOPHIEUNHAP
             where P.MAKHO = @makho and P.CREATED_AT < @end and PD.DEL_FLAG = 'N' and PD.DELAI in ('N','M') and P.CREATED_AT > @ngay
             GROUP BY PD.DAY,PD.RONG,PD.CAO) YSN ON YSN.DAY = B.DAY and YSN.RONG = B.RONG and YSN.CAO = B.DAI
        left join 
        (select DISTINCT I.LENGTH,I.HEIGHT,I.WIDTH,SUM(ST.QUANTITY) as QUANTITY from prod.OPENING_STOCK ST
             LEFT JOIN
             base.ITEM I ON ST.ITEM_ID = I.ID
             where DEPARTMENT_ID = @stepId and ST.createdAt> @ngay
             GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) THT ON B.DAI = THT.LENGTH and B.DAY = THT.HEIGHT and B.RONG = THT.WIDTH
        left join 
        (  select DAY,RONG,DAI,SUM(SL_TH) SL_TH from [prod].[XUAT_GO_BAO] where XUATNHAP = 'xuatluanchuyen' and SOURCE_ID = @stepId
        and createdAt < @end and createdAt> @ngay
        GROUP BY  DAY,RONG,DAI) XLC on B.DAI = XLC.DAI and B.DAY = XLC.DAY and B.RONG = XLC.RONG
        left join 
        (  select DAY,RONG,DAI,SUM(SL_TH) SL_TH from [prod].[XUAT_GO_BAO] where XUATNHAP = 'xuatluanchuyen' and DESTINATION_ID = @stepId                                 
        and createdAt < @end and createdAt> @ngay
        GROUP BY  DAY,RONG,DAI) NLC on B.DAI = NLC.DAI and B.DAY = NLC.DAY and B.RONG = NLC.RONG
		     LEFT JOIN
          (select DISTINCT I.HEIGHT,I.WIDTH,I.LENGTH,  SUM(IT.QUANTITY) KL from prod.PALLET P 
          
          LEFT JOIN prod.ITEM_IN_PALLET IT ON IT.PALLET_ID = P.ID
          LEFT JOIN base.ITEM I ON I.ID = IT.ITEM_ID
          where  P.factoryId = @factoryId and P.CREATE_DATE < @end and P.TYPE_ID <>100014 and P.CREATE_DATE > @ngay
          GROUP BY  I.LENGTH,I.HEIGHT,I.WIDTH) PHX ON PHX.HEIGHT = B.DAY and PHX.WIDTH = B.RONG and PHX.LENGTH = B.DAI
		  where THT.QUANTITY >0 or YSN.TH >0 or PHX.KL >0
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/ma-lo-go-by-cc", (req, res, next) => {
    new mssql.Request()
        .input("dai", req.query.dai)
        .input("rong", req.query.rong)
        .input("day", req.query.day)
        .query(
            `
            select distinct MALOGONHAP label, MALOGONHAP value from nlg.PHIEUNHAPKHO_DT where DAY = @day and RONG = @rong and CAO = @dai and MALOGONHAP is not null and MALOGONHAP != ''
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/ton-say-lai", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .query(
            `
            select HEIGHT DAY, WIDTH RONG, LENGTH DAI, SUM(QUANTITY) TONKKHOYS from (
                select i.HEIGHT, i.WIDTH, i.LENGTH, iip.QUANTITY from prod.PACKAGE p
                inner join prod.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
                inner join base.ITEM i on iip.ITEM_ID = i.ID
                where p.REMEDIES_ID = 100049 and p.CREATE_DATE > '2022-05-04 00:00' 
                AND p.factoryId = @factoryId and p.VERIFY_BY is not null
                union all
                select distinct i.HEIGHT, i.WIDTH, i.LENGTH, -iip.QUANTITY QUANTITY from prod.KILN_BATCH kb
                inner join prod.STEP_OF_PALLET sop on kb.ID = sop.KILN_BATCH_ID
                INNER JOIN prod.PALLET P ON SOP.PALLET_ID = P.ID
                inner join prod.ITEM_IN_PALLET iip on sop.PALLET_ID = iip.PALLET_ID
                inner join base.ITEM i on iip.ITEM_ID = i.ID
                where kb.CREATE_DATE > '2022-05-04 00:00' and kb.TYPE like N'SẤY LẠI%' AND P.factoryId = @factoryId
                ) t 
                group by HEIGHT, WIDTH, LENGTH 
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/xuat-kho-detail", (req, res, next) => {
    new mssql.Request()
        .input("stepId", req.query.stepId)
        .input("start", req.query.start)
        .input("end", req.query.end)
        .query(
            `
           select * from [dbo].[View_raw_data]
            WHERE  DEPARTMENT_ID = @stepId AND [ngaygiao] BETWEEN @start AND @end 
            UNION ALL
            SELECT XG.[id], XG.[year], XG.[week], XG.number, GD.[WEEK_DAY] N'Thứ', XG.SOURCE_ID, S.NAME, D.NAME, NULL, NULL, NULL, B.NAME, 
null, SL_TH, CB.LAST_NAME, XG.createdAt, 
CONCAT(CONVERT(varchar, XG.createdAt, 103), '  ', DATEPART(HOUR, XG.createdAt), ':', DATEPART(minute, XG.createdAt), ':', DATEPART(second, XG.createdAt)),
VB.LAST_NAME, 
CONCAT(CONVERT(varchar, XG.approvedAt, 103), '  ', DATEPART(HOUR, XG.approvedAt), ':', DATEPART(minute, XG.approvedAt), ':', DATEPART(second, XG.approvedAt)),
B.DAY HEIGHT, B.RONG WIDTH,B.DAI LENGTH, NULL,B.DAY*B.RONG*B.DAI/1000000000 VOLUMN, XG.KLC_TH, NULL ,NULL
  FROM [prod].[XUAT_GO] XG LEFT JOIN
  base.GLOBAL_DATE GD ON GD.[DATE] = CAST(XG.createdAt AS DATE) LEFT JOIN
  base.DEPARTMENT S ON XG.SOURCE_ID = S.ID LEFT JOIN
  base.DEPARTMENT D ON XG.DESTINATION_ID = D.ID LEFT JOIN
  nlg.BOM B ON XG.DAY = B.DAY AND XG.RONG = B.RONG AND XG.DAI = B.DAI LEFT JOIN
  
  base.ACCOUNT CB ON XG.createdby = CB.ID LEFT JOIN
  base.ACCOUNT VB ON XG.approvedByAccount = VB.ID
  WHERE XG.SOURCE_ID = @stepId AND XG.createdAt BETWEEN @start AND @end 
  UNION ALL
  SELECT XGB.[id], XGB.[year], XGB.[week], XGB.number, GD.[WEEK_DAY] N'Thứ', XGB.SOURCE_ID, S.NAME, D.NAME, NULL, NULL, NULL, B.NAME, 
null, SL_TH, CB.LAST_NAME, XGB.createdAt, 
CONCAT(CONVERT(varchar, XGB.createdAt, 103), '  ', DATEPART(HOUR, XGB.createdAt), ':', DATEPART(minute, XGB.createdAt), ':', DATEPART(second, XGB.createdAt)),
VB.LAST_NAME, 
CONCAT(CONVERT(varchar, XGB.approvedAt, 103), '  ', DATEPART(HOUR, XGB.approvedAt), ':', DATEPART(minute, XGB.approvedAt), ':', DATEPART(second, XGB.approvedAt)),
B.DAY HEIGHT, B.RONG WIDTH,B.DAI LENGTH, NULL,B.DAY*B.RONG*B.DAI/1000000000 VOLUMN, XGB.KLC_TH, NULL,NULL 
FROM [prod].[XUAT_GO_BAO] XGB LEFT JOIN
base.GLOBAL_DATE GD ON GD.[DATE] = CAST(XGB.createdAt AS DATE) LEFT JOIN
base.DEPARTMENT S ON XGB.SOURCE_ID = S.ID LEFT JOIN
base.DEPARTMENT D ON XGB.DESTINATION_ID = D.ID LEFT JOIN
nlg.BOM B ON XGB.DAY = B.DAY AND XGB.RONG = B.RONG AND XGB.DAI = B.DAI LEFT JOIN

base.ACCOUNT CB ON XGB.createdby = CB.ID LEFT JOIN
base.ACCOUNT VB ON XGB.approvedByAccount = VB.ID
WHERE XGB.SOURCE_ID = @stepId AND XGB.createdAt BETWEEN @start AND @end 
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/number-active", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .query(
            `
            SELECT distinct number, factoryId FROM prod.PO where endPO = 0 and factoryId = @factoryId
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/department-po", (req, res, next) => {
    new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("week", req.query.week)
        .query(
            `
            SELECT DISTINCT D.ID, D.NAME FROM prod.PO
            INNER JOIN base.DEPARTMENT D ON PO.stepId = D.ID
            WHERE PO.endPO = 0 AND PO.week = @week AND PO.factoryId = @factoryId
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/code-in-doi-tra", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select top 1 CODE from prod.DOITRA_OD order by CREATED_AT desc
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.post("/phieu-doi-tra", (req, res, next) => {
    new mssql.Request()
    .input("code", req.body.code)
    .input("qcReturn", req.body.qcReturn)
    .input("quantity", req.body.quantity)
    .input("reason", req.body.reason)
    .input("accountId", req.body.accountId)
        .query(
            `
            INSERT INTO prod.DOITRA_OD (CODE , QC_RETURN, QUANTITY, REASON, CREATED_BY, CREATED_AT)
            VALUES (@code , @qcReturn, @quantity, @reason, @accountId, GETDATE())
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/list-code-doi-tra", (req, res, next) => {
    new mssql.Request()
    .input("start", req.query.start)
    .input("end", req.query.end)
        .query(
            `
            select distinct CODE, convert(nvarchar, CREATED_AT, 23) CREATED_AT, a.LAST_NAME, QC_VERIFY_BY 
            from prod.DOITRA_OD od
            inner join base.ACCOUNT a on od.CREATED_BY = a.id where od.CREATED_AT between @start and @end
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/lsx-vat-tu-by-factory", (req, res, next) => {
    new mssql.Request()
    .input("factoryId", req.query.factoryId)
    .input("year", req.query.year)
    .input("week", req.query.week)
        .query(
            `
            select distinct vt.NUMBER label, vt.NUMBER value from prod.PHIEU_YEU_CAU_VT vt 
            inner join prod.PO on vt.NUMBER = PO.number
            where po.[year] = @year and po.[week] = @week and vt.factoryId = @factoryId
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/so-lan-cap-vt-by-lsx", (req, res, next) => {
    new mssql.Request()
    .input("number", req.query.number)
        .query(
            `
            select distinct case 
            when approvedByAccount is null then N'Lần ' + CONVERT(varchar, soLan) + N'| chưa xác nhận' 
            else N'Lần ' + CONVERT(varchar, soLan) + N'| đã xác nhận' end label
            , soLan value
            from prod.PHIEU_YEU_CAU_VT 
            where NUMBER = @number
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/lsx-in-vt-son", (req, res, next) => {
    new mssql.Request()
    .input("year", req.query.year)
    .input("week", req.query.week)
    .input("factoryId", req.query.factoryId)
        .query(
            `
            select distinct NUMBER number from prod.PHIEU_YEU_CAU_VT
            where DATEPART(YEAR, CREATED_DATE) = @year and DATEPART(WEEK, CREATED_DATE)-1 = @week and factoryId = @factoryId
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/so-lan-in-vt-son", (req, res, next) => {
    new mssql.Request()
    .input("number", req.query.number)
        .query(
            `
            select MAX(soLan) soLan from prod.PHIEU_YEU_CAU_VT where NUMBER = @number and approvedByAccount is not null
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/report-vt-son", (req, res, next) => {
    new mssql.Request()
    .input("number", req.query.number)
        .query(
            `
            SELECT *
FROM
(
select v.ma_vt, v.ten_vt, m.NAME marketName,
vt.SLSX, vt.SLYC, vt.soLan,
(
select SUM(SLYC) from prod.PHIEU_YEU_CAU_VT vt2 where NUMBER = @number and approvedByAccount is not null and vt2.MA_VT = vt.MA_VT
) as total
from prod.PHIEU_YEU_CAU_VT vt
inner join view_VatTuPhuKien_Fast v on vt.MA_VT = v.ma_vt
inner join base.MARKET m on vt.MARKET_CODE = m.CODE
inner join base.ACCOUNT a on vt.CREATED_BY = a.ID
where NUMBER = @number and vt.approvedByAccount is not null
) AS BangNguon
PIVOT
(
SUM(SLYC)
FOR soLan IN (${req.query.arrSoLan})
) AS BangChuyen;
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/phieu-cap-vat-tu", (req, res, next) => {
    new mssql.Request()
    .input("number", req.query.number)
    .input("soLan", req.query.soLan)
        .query(
            `
            select case when v.ma_vt = '43.02.0061' then '43.02.0061/43.02.0062' 
            else v.ma_vt END as MA_VT, case when v.ma_vt = '43.02.0061' then 'Sơn lót WB sealer clear (860-7226-20W)/Sơn bóng WB Lacquer clear (900-6105-20W)'
            else v.ten_vt end as ten_vt, v.dvt, pvt.SLSX, pvt.SLYC,
(select SUM(pvt2.SLYC) from prod.PHIEU_YEU_CAU_VT pvt2 where NUMBER = @number and pvt.MA_VT = pvt2.MA_VT and pvt2.approvedByAccount is not null) as SLDC
, pvt.DESCRIPTION, PVT.CREATED_DATE, a.LAST_NAME createName, a2.LAST_NAME TK_NAME, pvt.approvedAt TK_DATE, 
pvt.isPass, pvt.VERIFY_AT GDSX_DATE, a3.LAST_NAME GDSX_NAME, pvt.VT_VERIFY_AT VT_DATE, a4.LAST_NAME VT_NAME
            from prod.PHIEU_YEU_CAU_VT pvt 
            inner join view_VatTuPhuKien_Fast v on pvt.MA_VT = v.ma_vt
            inner join base.ACCOUNT a on pvt.CREATED_BY = a.ID
            left join base.ACCOUNT a2 on pvt.approvedByAccount = a2.ID
			left join base.ACCOUNT a3 on pvt.VERIFY_BY = a3.ID 
			left join base.ACCOUNT a4 on pvt.VT_VERIFY_BY = a4.ID
            where NUMBER = @number and soLan = @soLan
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/update-phieu-yeu-cau-vt", (req, res, next) => {
    new mssql.Request()
    .input("number", req.body.number)
    .input("soLan", req.body.soLan)
    .input("accountId", req.body.accountId)
        .query(
            `
            update prod.PHIEU_YEU_CAU_VT set approvedByAccount = @accountId, approvedAt = GETDATE() 
            where NUMBER = @number and soLan = @soLan
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/update-phieu-yeu-cau-vt-gdsx", (req, res, next) => {
    new mssql.Request()
    .input("number", req.body.number)
    .input("soLan", req.body.soLan)
    .input("accountId", req.body.accountId)
        .query(
            `
            update prod.PHIEU_YEU_CAU_VT set VERIFY_BY = @accountId, VERIFY_AT = GETDATE() 
            where NUMBER = @number and soLan = @soLan
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/update-phieu-yeu-cau-vt-vat-tu", (req, res, next) => {
    new mssql.Request()
    .input("number", req.body.number)
    .input("soLan", req.body.soLan)
    .input("accountId", req.body.accountId)
        .query(
            `
            update prod.PHIEU_YEU_CAU_VT set VT_VERIFY_BY = @accountId, VT_VERIFY_AT = GETDATE() 
            where NUMBER = @number and soLan = @soLan
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/department-by-factoryId", (req, res, next) => {
    new mssql.Request()
    .input("factoryId", req.query.factoryId)
        .query(
            `
            select ID id, NAME name, TYPE type, TYPE2 type2, factoryId from base.DEPARTMENT
            where factoryId = @factoryId and (TYPE2 = 'to' or TYPE2 = 'kho')
            order by NAME
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/ghi-nhan-san-luong", (req, res, next) => {
    new mssql.Request()
    .input("number", req.query.number)
    .input("departmentId", req.query.departmentId)
        .query(
            `select * from (
            select
            M.NAME ID_CHA,
            I.ID itemId,
            I.CODE itemCode,
            I.NAME itemName,
            D.ID stepId,
            I.LENGTH itemLength,
            I.WIDTH itemWidth,
            I.HEIGHT itemHeight,
            D.NAME congdoan,
            (select TOP 1 D.NAME from View_Routings  R
            left join base.DEPARTMENT D ON D.ID  = R.STEP_ID
            where R.number =  @number and R.ITEM_ID = PO.itemId and R.[ORDER]=PO.[order] + 1) noinhan,
            (select TOP 1 D.ID from View_Routings  R
                left join base.DEPARTMENT D ON D.ID  = R.STEP_ID
                where R.number =  @number and R.ITEM_ID = PO.itemId and R.[ORDER]=PO.[order] + 1) next_id,
            concat('PO',PO.code) code,
           
           ROUND(PO.keHoach - PO.ys1a - PO.ys1b - PO.tb + PO.hanMucTon + PO.loiCongDon -(CASE
                WHEN SL.quantity IS NULL THEN 0
                ELSE ROUND(SL.quantity,6)
            END),6) conThucHien,PO.keHoach,
           null GHINHAN
            
            from prod.PO PO
            left join base.ITEM I ON I.ID = PO.itemId
        
            left join base.DEPARTMENT D ON D.ID  = PO.stepId
            left join base.MARKET M on M.CODE = PO.root
        
            LEFT JOIN (
                select P.PO,SUM(IIP.QUANTITY) quantity
                from prod.PACKAGE P
                left join prod.PACKAGE_TYPE PT ON PT.ID = P.TYPE_ID
                left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
                WHERE 
                (PT.TYPE_ID <> 100000 OR PT.TYPE_ID IS NULL)
                AND (PT.TYPE_ID <> 400000 OR PT.TYPE_ID IS NULL)
                GROUP BY P.PO
            ) SL ON SL.PO = PO.code
      
    where  approvedAt is not null and deletedAt is null and PO.stepId = @departmentId and PO.year >=2021 and PO.endPO = 0 and PO.number = @number) k
    where conThucHien>0

            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/department-bao-cat", (req, res, next) => {
    new mssql.Request()
    .input("factoryId", req.query.factoryId)
        .query(
            `
            select ID id, NAME name, TYPE type from base.DEPARTMENT
            where factoryId = @factoryId and TYPE2 = 'nhom'
            order by NAME
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/losay-by-factoryId", (req, res, next) => {
    new mssql.Request()
    .input("factoryId", req.query.factoryId)
        .query(
            `
            select * from
            [prod].[KILN]
               where FACTORY_ID = @factoryId
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/bang-gia-cat-bao", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            SELECT ID, MASP, DEPARTMENT_NAME, NAME, PRICE PRICEYS, GHI_CHU, START_DATE,(0.8*PRICE + PRICE) PRICE 
            FROM prod.BANG_GIA_BAO_CAT
            WHERE IS_OPEN = 1
            ORDER BY NAME
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/bang-gia-cat-bao-not-verify-by-masp", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select BG.ID, MASP, DEPARTMENT_NAME, NAME, PRICE, GHI_CHU, START_DATE , LAST_NAME, CREATED_AT
            from prod.BANG_GIA_BAO_CAT BG
            INNER JOIN base.ACCOUNT A ON BG.CREATED_BY = A.ID
            Where MASP = N'${req.query.maSp}' and VERIFY_BY is null
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/bang-gia-cat-bao-not-verify", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select BG.ID, MASP, DEPARTMENT_NAME, NAME, PRICE, GHI_CHU, START_DATE , LAST_NAME, CREATED_AT
            from prod.BANG_GIA_BAO_CAT BG
            INNER JOIN base.ACCOUNT A ON BG.CREATED_BY = A.ID
            Where VERIFY_BY is null
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.post("/bang-gia-cat-bao", (req, res, next) => {
    const { maSP, departmentName, name, price, ghiChu, startDate, accountId} = req.body;
    new mssql.Request()
        .query(
            `
            INSERT INTO prod.BANG_GIA_BAO_CAT (MASP, DEPARTMENT_NAME, NAME, PRICE, GHI_CHU, START_DATE, CREATED_BY, CREATED_AT)
            VALUES
            (N'${maSP}', N'${departmentName}', N'${name}', ${price}, N'${ghiChu}', '${startDate}',${accountId} , GETDATE())
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.post("/approve-bang-gia-cat-bao", (req, res, next) => {
    let query = `
UPDATE prod.BANG_GIA_BAO_CAT
SET 
IS_OPEN = 0,
END_DATE = '${req.body.startDate}'
WHERE MASP = '${req.body.maSP}' AND IS_OPEN = 1
UPDATE prod.BANG_GIA_BAO_CAT
SET
IS_OPEN = 1,
VERIFY_BY = ${req.body.accountId},
VERIFY_AT = GETDATE()
WHERE ID = ${req.body.id}
    `;
    new mssql.Request()
        .query(
            query,
            (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/reject-bang-gia-cat-bao", (req, res, next) => {
    let query = `
    DELETE FROM prod.BANG_GIA_BAO_CAT 
            WHERE ID = ${req.body.id}
    `
    new mssql.Request()
        .query(
            query,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/doi-tra-by-code", (req, res, next) => {
    new mssql.Request()
    .input("code", req.query.code)
        .query(
            `
            select OD.*, A1.LAST_NAME GDSX_NAME, A2.LAST_NAME QC_NAME from prod.DOITRA_OD OD 
            LEFT JOIN base.ACCOUNT A1 ON OD.GDSX_VERIFY_BY = A1.ID
            LEFT JOIN base.ACCOUNT A2 ON OD.QC_VERIFY_BY = A2.ID
            where OD.CODE = @code
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.put("/delete-doi-tra", (req, res, next) => {
    new mssql.Request()
    .input("code", req.query.code)
        .query(
            `
            DELETE FROM prod.DOITRA_OD WHERE CODE = @code
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.put("/update-qc-doi-tra", (req, res, next) => {
    new mssql.Request()
    .input("code", req.body.code)
    .input("accountId", req.body.accountId)
        .query(
            `
            UPDATE prod.DOITRA_OD
            SET 
            QC_VERIFY_BY = @accountId,
            QC_VERIFY_AT = GETDATE()
            WHERE CODE = @code
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.put("/update-gdsx-doi-tra", (req, res, next) => {
    new mssql.Request()
    .input("code", req.body.code)
    .input("accountId", req.body.accountId)
        .query(
            `
            UPDATE prod.DOITRA_OD
            SET 
            GDSX_VERIFY_BY = @accountId,
            GDSX_VERIFY_AT = GETDATE()
            WHERE CODE = @code
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/chart-san-luong-quy", (req, res, next) => {
    new mssql.Request()
    .input("start", req.query.start)
    .input("end", req.query.end)
        .query(
            `
            SELECT  createdDate, [TH], [YS1A], [YS1B], [TB] from (
                select 
                case 
                when Tổ like '%(TH)' then 'TH'
                when Tổ like '%(YS1A)' then 'YS1A'
                when Tổ like '%(YS1B)' then 'YS1B'
                when Tổ like '%(TB)' then 'TB'
                else Tổ
                end factoryCode, 
				[Số lượng]*volumn m3
				,
				case
				when DATEPART(MONTH, [Ngày tạo]) = 1 or DATEPART(MONTH, [Ngày tạo]) = 2 or DATEPART(MONTH, [Ngày tạo]) = 3 then 'Quý 1'
				when DATEPART(MONTH, [Ngày tạo]) = 4 or DATEPART(MONTH, [Ngày tạo]) = 5 or DATEPART(MONTH, [Ngày tạo]) = 6 then 'Quý 2'
				when DATEPART(MONTH, [Ngày tạo]) = 7 or DATEPART(MONTH, [Ngày tạo]) = 8 or DATEPART(MONTH, [Ngày tạo]) = 9 then 'Quý 3'
				when DATEPART(MONTH, [Ngày tạo]) = 10 or DATEPART(MONTH, [Ngày tạo]) = 11 or DATEPART(MONTH, [Ngày tạo]) = 12 then 'Quý 4'
                end createdDate
                from View_raw_data 
                WHERE [Ngày tạo] BETWEEN @start AND @end)
				AS BANG_NGUON
PIVOT
(
SUM(m3)
FOR factoryCode IN ([TH], [YS1A], [YS1B], [TB])
) AS BANG_CHUYEN order by createdDate
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/chart-san-luong-month", (req, res, next) => {
    new mssql.Request()
    .input("start", req.query.start)
    .input("end", req.query.end)
        .query(
            `
            SELECT  createdDate, [TH], [YS1A], [YS1B], [TB] from (
                select 
                case 
                when Tổ like '%(TH)' then 'TH'
                when Tổ like '%(YS1A)' then 'YS1A'
                when Tổ like '%(YS1B)' then 'YS1B'
                when Tổ like '%(TB)' then 'TB'
                else Tổ
                end factoryCode, 
				[Số lượng]*volumn m3
				,
                case
				when DATENAME(month, [Ngày tạo]) = 'January' then 'Tháng  1'
				when DATENAME(month, [Ngày tạo]) = 'February' then 'Tháng  2'
				when DATENAME(month, [Ngày tạo]) = 'March' then 'Tháng  3'
				when DATENAME(month, [Ngày tạo]) = 'April' then 'Tháng  4'
				when DATENAME(month, [Ngày tạo]) = 'May' then 'Tháng  5'
				when DATENAME(month, [Ngày tạo]) = 'June' then 'Tháng  6'
				when DATENAME(month, [Ngày tạo]) = 'July' then 'Tháng  7'
				when DATENAME(month, [Ngày tạo]) = 'August' then 'Tháng  8'
				when DATENAME(month, [Ngày tạo]) = 'September' then 'Tháng  9'
				when DATENAME(month, [Ngày tạo]) = 'October' then 'Tháng 10'
				when DATENAME(month, [Ngày tạo]) = 'November' then 'Tháng 11'
				when DATENAME(month, [Ngày tạo]) = 'December' then 'Tháng 12'
                end createdDate
                from View_raw_data 
                WHERE [Ngày tạo] BETWEEN @start AND @end)
				AS BANG_NGUON
                PIVOT
                (
                SUM(m3)
                FOR factoryCode IN ([TH], [YS1A], [YS1B], [TB])
                ) AS BANG_CHUYEN order by createdDate
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/nha-may-dong-goi", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select NAME, 
				CASE
				WHEN NAME LIKE '%(TH)%' THEN N'Thuận Hưng'
				WHEN NAME LIKE '%(YS1B)%' THEN N'Yên Sơn 1B'
				WHEN NAME LIKE '%(TB)%' THEN N'Thái Bình'
				END FactoryName
				from base.DEPARTMENT where NAME like '%óng gói%'
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/department-by-factory", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select distinct v.DEPARTMENT_ID ID, d.NAME from View_raw_data v 
            inner join base.DEPARTMENT d on v.DEPARTMENT_ID = d.ID 
            where factoryId = ${req.query.factoryId} and TYPE2 != 'close' and TYPE2 != 'kho'
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/item-in-department-name", (req, res, next) => {
    new mssql.Request()
    .input("fromDate", req.query.fromDate)
    .input("toDate", req.query.toDate)
        .query(
            `
            select distinct paren ,[Chi tiết/cụm] sanpham, sum([Số lượng]*volumn) m3 , (
                select SUM([Số lượng]*volumn) from View_raw_data
                where Tổ =  N'${req.query.departmentName}'
                and [Ngày tạo] between @fromDate and @toDate
                ) total
            from View_raw_data v
			left join(
            select DISTINCT * from dbo.View_SP
			) B ON B.NAME = v.[Chi tiết/cụm] and B.STEP_ID = v.DEPARTMENT_ID		
            where Tổ = N'${req.query.departmentName}' 
            and [Ngày tạo] between @fromDate and @toDate
            group by [Chi tiết/cụm], paren
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/item-in-ton-department-name", (req, res, next) => {
    new mssql.Request()
    .input("toDate", req.query.toDate)
        .query(
            `
            select sanpham, SUM(KL) m3, 
(select SUM(KL) from View_TON_CONG_DOAN where CREATE_DATE <= @toDate and congdoan = N'${req.query.departmentName}') total
from View_TON_CONG_DOAN
where CREATE_DATE <= @toDate and congdoan = N'${req.query.departmentName}'
group by sanpham
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/item-in-ton-department-name-detail", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select paren, sanpham, QUANTITY, sum(KL) m3 from View_TON_CONG_DOAN v
            left join(
            select DISTINCT * from dbo.View_SP
			) B ON B.ITEM_ID = v.ITEM_ID and B.STEP_ID = v.DEPARTMENT_ID
			where paren_id = ${req.query.itemId} and v.congdoan = N'${req.query.departmentName}' and v.CREATE_DATE <= '${req.query.toDate}'
			group by paren, sanpham, QUANTITY
			order by sanpham
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/chart-san-luong-week", (req, res, next) => {
    new mssql.Request()
    .input("fromWeek", req.query.fromWeek)
    .input("toWeek", req.query.toWeek)
    .input("year", req.query.year)
        .query(
            `
            SELECT  createdDate, [TH], [YS1A], [YS1B], [TB] from (
                select 
                case 
                when Tổ like '%(TH)' then 'TH'
                when Tổ like '%(YS1B)' then 'YS1B'
                when Tổ like '%(YS1A)' then 'YS1A'
                when Tổ like '%(TB)' then 'TB'
                else Tổ
                end factoryCode, 
				[Số lượng]*volumn m3
				,
				'W'+RIGHT(YEAR(GETDATE()),2)+RIGHT('00' + CONVERT(VARCHAR, Tuần), 2) createdDate
                from View_raw_data 
                WHERE Tuần between @fromWeek and @toWeek and Năm = @year)
				AS BANG_NGUON
                PIVOT
                (
                SUM(m3)
                FOR factoryCode IN ([TH], [YS1A], [YS1B], [TB])
                ) AS BANG_CHUYEN order by createdDate
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/chart-san-luong-vgt-week", (req, res, next) => {
    new mssql.Request()
    .input("start", req.query.start)
    .input("end", req.query.end)
        .query(
            `
            SELECT  createdDate, [TH], [YS1A], [TB] from (
                select 
                case 
                when Tổ like '%(TH)' then 'TH'
                when Tổ like '%(YS1A)' then 'YS1A'
                when Tổ like '%(YS1B)' then 'YS1B'
                when Tổ like '%(TB)' then 'TB'
                else Tổ
                end factoryCode, 
				[Số lượng]*volumn m3
				,
				'W'+RIGHT(YEAR(GETDATE()),2)+CONVERT(varchar, DATEPART(WK, [Ngày tạo])) createdDate
                from View_raw_data 
                WHERE [Ngày tạo] BETWEEN @start AND @end
				and DEPARTMENT_ID in (100192,100265,100278,101266,102353,102374,102375,102445,102446,102447))
				AS BANG_NGUON
                PIVOT
                (
                SUM(m3)
                FOR factoryCode IN ([TH], [YS1A], [TB])
                ) AS BANG_CHUYEN order by createdDate
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/chart-san-luong-cong-doan-week", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            DECLARE 
    @columns NVARCHAR(MAX) = '',
	@week NVARCHAR(MAX) = 'W',
	@zero NVARCHAR(MAX) = '00',
	@start NVARCHAR(MAX) = '${req.query.start}',
	@end NVARCHAR(MAX) = '${req.query.end}',
    @sql     NVARCHAR(MAX) = '';

-- select the category names
WITH temp(NAME)
  as (
    select distinct Tổ from View_raw_data where Tổ like '%(${req.query.factoryId})%'
  )
SELECT 
    @columns+=QUOTENAME(NAME) + ','
FROM 
    temp
ORDER BY 
    NAME;

-- remove the last comma
SET @columns = LEFT(@columns, LEN(@columns) - 1);

-- construct dynamic SQL
DECLARE @ParamDefinition NVARCHAR(MAX)
SELECT  @ParamDefinition= ' @start1 VARCHAR(100), @end1 VARCHAR(100), @week1 VARCHAR(100), @zero1 VARCHAR(100)'
SET @sql =N'
 SELECT  * from (
                select 
                [Tổ], 
				[Số lượng]*volumn m3,
				@week1 + RIGHT(YEAR([Ngày tạo]),2) + RIGHT(@zero1 + CONVERT(VARCHAR, Tuần), 2) createdDate
                from View_raw_data where [Ngày tạo] between @start1 and @end1)
				AS BANG_NGUON
PIVOT
(
SUM(m3)
FOR [Tổ] IN ('+ @columns +')
) AS BANG_CHUYEN order by createdDate';

-- execute the dynamic SQL
EXECUTE sp_executesql @sql, @ParamDefinition, @start1 = @start, @end1 = @end, @week1 = @week, @zero1 = @zero;
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.post("/chart-san-luong-week-cong-doan", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            SELECT  NAME, [TH], [YS1A], [YS1B], [TB] from (
                select  CONVERT(varchar, gd.[ORDER]) + '. ' +gd.NAME NAME, iip.QUANTITY*I.VOLUMN VOLUMN,
				case 
                when d.factoryId = 100000 then 'TH'
                when d.factoryId = 102340 then 'YS1B'
                when d.factoryId = 102339 then 'YS1A'
                when d.factoryId = 102366 then 'TB'
                end factoryCode
    from prod.PACKAGE p
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    inner join prod.PO on p.PO = po.code
	inner join base.DEPARTMENT d on p.SOURCE_ID = d.ID
	INNER join prod.GROUP_DEPARTMENT gd on gd.DEPARTMENT_ID = p.SOURCE_ID
    where DATEPART(YEAR, p.CREATE_DATE) = ${req.body.year} and P.TYPE_ID = 100026
				)
				AS BANG_NGUON
                PIVOT
                (
                SUM(VOLUMN)
                FOR factoryCode IN ([TH], [YS1A], [YS1B], [TB])
                ) AS BANG_CHUYEN order by NAME
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/chart-san-luong-with-cong-doan", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select  CONVERT(varchar, gd.[ORDER]) + '. ' +gd.NAME NAME, sum(iip.QUANTITY*I.VOLUMN) m3
    from prod.PACKAGE p
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    inner join prod.PO on p.PO = po.code
	inner join base.DEPARTMENT d on p.SOURCE_ID = d.ID
	INNER join prod.GROUP_DEPARTMENT gd on gd.DEPARTMENT_ID = p.SOURCE_ID
    where DATEPART(YEAR, p.CREATE_DATE) = ${req.body.year} and P.TYPE_ID = 100026
	group by gd.[ORDER], gd.NAME
	order by gd.[ORDER]
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/chart-san-luong-with-cong-doan-2", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select  CONVERT(varchar, gd.[ORDER]) + '. ' +gd.NAME NAME, sum(iip.QUANTITY*I.VOLUMN) m3
    from prod.PACKAGE p
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    inner join prod.PO on p.PO = po.code
	inner join base.DEPARTMENT d on p.SOURCE_ID = d.ID
	INNER join prod.GROUP_DEPARTMENT gd on gd.DEPARTMENT_ID = p.SOURCE_ID
    where DATEPART(YEAR, p.CREATE_DATE) = ${req.body.year} and P.TYPE_ID = 100026
	group by gd.[ORDER], gd.NAME
	order by gd.[ORDER] desc
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/san-luong-in-factory", (req, res, next) => {
    new mssql.Request()
    .input("factoryId", req.body.factoryId)
        .query(
            `
            select gd.NAME groupName ,d.NAME, sum(volumn) volumn from View_raw_data v 
inner join base.DEPARTMENT d on v.DEPARTMENT_ID = d.ID
inner join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
where DATEPART(YEAR, v.[Ngày tạo]) = ${req.body.year} and factoryId = @factoryId
group by gd.NAME ,d.NAME
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/department-ton-by-factory", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select distinct DEPARTMENT_ID ID ,congdoan NAME 
            from View_TON_CONG_DOAN v
            inner join base.DEPARTMENT d on v.DEPARTMENT_ID = d.ID
            where d.factoryId = ${req.query.factoryId} and TYPE2 = 'to' and TYPE = N'Tổ'
            order by congdoan
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/chart-ton-cong-doan-week", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            DECLARE 
    @columns NVARCHAR(MAX) = '',
	@week NVARCHAR(MAX) = 'W',
	@zero NVARCHAR(MAX) = '00',
	@end NVARCHAR(MAX) = '${req.query.end}',
    @sql     NVARCHAR(MAX) = '';

-- select the category names
WITH temp(NAME)
  as (
    select distinct congdoan NAME 
            from View_TON_CONG_DOAN v
            inner join base.DEPARTMENT d on v.DEPARTMENT_ID = d.ID
            where d.factoryId = ${req.query.factoryId} and TYPE2 = 'to' and TYPE = N'Tổ' and  d.ID not in (100264, 100274)
  )
SELECT 
    @columns+=QUOTENAME(NAME) + ','
FROM 
    temp
ORDER BY 
    NAME;

-- remove the last comma
SET @columns = LEFT(@columns, LEN(@columns) - 1);

-- construct dynamic SQL
DECLARE @ParamDefinition NVARCHAR(MAX)
SELECT  @ParamDefinition= ' @end1 VARCHAR(100), @week1 VARCHAR(100), @zero1 VARCHAR(100)'
SET @sql =N'
 SELECT  * from (
                select 
                congdoan, 
				KL,
				@end1 thoiDiem
                from View_TON_CONG_DOAN where CREATE_DATE <= @end1
				)
				AS BANG_NGUON
PIVOT
(
SUM(KL)
FOR congdoan IN ('+ @columns +')
) AS BANG_CHUYEN order by thoiDiem';

-- execute the dynamic SQL
EXECUTE sp_executesql @sql, @ParamDefinition, @end1 = @end, @week1 = @week, @zero1 = @zero;
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/item-ton", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select distinct i.ID, i.NAME from prod.ROUTING r inner join base.ITEM i on r.ITEM_ID = i. ID where STEP_ID in (100270
                ,100273
                ,100282
                ,102363
                ,102365
                ,102390) and [ORDER] = 1
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/department-item-ton", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select distinct STEP_ID, congdoan from
             (
            select DISTINCT * from dbo.View_SP
			) B 
				where paren_id = ${req.query.itemId} and congdoan is not null and congdoan not like N'%lựa phôi%'
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.post("/tieu-thu-dien-ghi-chu", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            DELETE FROM prod.TIEU_THU_DIEN_GHI_CHU WHERE
            [MONTH] = ${req.body.month} AND 
            [YEAR] = ${req.body.year} AND 
            FACTORY_ID = ${req.body.factoryId} AND 
            [GROUP] = N'${req.body.xuong}'

            INSERT INTO [prod].[TIEU_THU_DIEN_GHI_CHU]
           ([MONTH]
           ,[YEAR]
           ,[FACTORY_ID]
           ,[GROUP]
           ,[GHI_CHU]
           ,[CREATED_BY]
           ,[CREATED_AT])
     VALUES
           (${req.body.month}
           ,${req.body.year}
           ,${req.body.factoryId}
           ,N'${req.body.xuong}'
           ,N'${req.body.ghiChu}'
           ,${req.body.accountId}
           ,GETDATE())
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/dinh-muc-dien-tieu-thu", (req, res, next) => {
    let fa = 100000;
    let fa1 = 100000;
    if (req.query.factoryId == 102339) fa = 100003
    if (req.query.factoryId == 102340) {fa = 100003,fa1 = 100004 }
    if (req.query.factoryId == 102366) { fa = 100005,fa1 = 100005}
    new mssql.Request()
        .query(
            `
            SELECT        K.[GROUP], K.NHOMSP_TTD, K.NAME, K.KL, BA.DM_TTD, BA.DM_TTD * K.KL AS SODIENDM, PH.SODIEN AS SODIENTT
FROM            (SELECT        [GROUP], NHOMSP_TTD, NAME, SUM(KL) AS KL, NHOM_DM_TTD, ID
                          FROM            (SELECT        NH.[GROUP], NH.ID, I.NHOMSP_TTD, P.SOURCE_ID, SUM(IT.QUANTITY) * I.VOLUMN AS KL, D.GROUP_ID, NH.NAME, NH.NHOM_DM_TTD
                                                    FROM            prod.PACKAGE AS P LEFT OUTER JOIN
                                                                              prod.ITEM_IN_PACKAGE AS IT ON IT.PACKAGE_ID = P.ID LEFT OUTER JOIN
                                                                              prod.PO po on po.code = P.PO LEFT OUTER JOIN
                                                                              base.ITEM AS I ON I.ID = IT.ITEM_ID LEFT OUTER JOIN
                                                                              base.DEPARTMENT AS D ON D.ID = P.SOURCE_ID LEFT OUTER JOIN
                                                                              prod.NHOM_TIEU_THU_DIEN AS NH ON NH.ID = D.GROUP_ID
  WHERE        (I.NHOMSP_TTD IS NOT NULL) AND (MONTH(P.CREATE_DATE) = ${req.query.month}) and YEAR(P.CREATE_DATE) = ${req.query.year} AND (D.GROUP_ID IS NOT NULL) and NH.factoryId = ${req.query.factoryId} 
  and P.SOURCE_ID not in (102639,102641,102640,102642,102370,102809,102789) and P.TYPE_ID = 100026 and po.code is not null
                                                    GROUP BY I.NHOMSP_TTD, P.SOURCE_ID, I.VOLUMN, D.GROUP_ID, NH.NAME, NH.[GROUP], NH.NHOM_DM_TTD, NH.ID
union all
SELECT        NH.[GROUP], NH.ID, I.NHOMSP_TTD,100265 SOURCE_ID, SUM(IT.QUANTITY) * I.VOLUMN AS KL, D.GROUP_ID, NH.NAME, NH.NHOM_DM_TTD
                                                    FROM            prod.PACKAGE AS P LEFT OUTER JOIN
                                                                              prod.ITEM_IN_PACKAGE AS IT ON IT.PACKAGE_ID = P.ID LEFT OUTER JOIN
                                                                              base.ITEM AS I ON I.ID = IT.ITEM_ID LEFT OUTER JOIN
                                                                              base.DEPARTMENT AS D ON D.ID = 100265 LEFT OUTER JOIN
                                                                              prod.NHOM_TIEU_THU_DIEN AS NH ON NH.ID = D.GROUP_ID
  WHERE        (I.NHOMSP_TTD IS NOT NULL) AND (MONTH(P.CREATE_DATE) = ${req.query.month}) and YEAR(P.CREATE_DATE) = ${req.query.year} AND (D.GROUP_ID IS NOT NULL) and NH.factoryId = ${req.query.factoryId} 
  and P.SOURCE_ID not in (102639,102641,102640,102642,102370,102809,102789) and P.TYPE_ID = 100026 and P.SOURCE_ID = 100264 and I.GOODS_TYPE = N'VIỆT BẮC'
                                                    GROUP BY I.NHOMSP_TTD, P.SOURCE_ID, I.VOLUMN, D.GROUP_ID, NH.NAME, NH.[GROUP], NH.NHOM_DM_TTD, NH.ID) AS k_1
                          GROUP BY [GROUP], NHOMSP_TTD, NAME, NHOM_DM_TTD, ID
                          
    union all
    select D.[GROUP],NHOMSP_TTD,D.NAME,KL,D.NHOM_DM_TTD,D.ID from
(select 'EM' NHOMSP_TTD,100001 NHOM_DM_TTD,SUM(VOLUMN)/1000 KL,MONTH(NGAY_CAN_BI) THANG from prod.EP_MUN where HANG_HOA = 'mun-cua-ep-bang' and FACTORY_ID = ${req.query.factoryId} and MONTH(NGAY_CAN_BI) = ${req.query.month}
and YEAR(NGAY_CAN_BI) = ${req.query.year}
GROUP BY MONTH(NGAY_CAN_BI)) k
left join prod.NHOM_TIEU_THU_DIEN  D on k.NHOM_DM_TTD = D.ID
union all
select k.[GROUP],k.NHOMSP_TTD,k.NAME,k.KL,k.NHOM_DM_TTD,k.ID from
(select D.[GROUP],NHOMSP_TTD,D.NAME,KL,D.NHOM_DM_TTD,D.ID from
(SELECT NHOMSP_TTD,100000 NHOM_DM_TTD,sum(KL) KL FROM (
        SELECT 
       case when KB.TYPE in (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') then 'SL'
	   WHEN I.HEIGHT = 14 then 'Runnen'
	   else KB.TYPE end NHOMSP_TTD,
        IIP.QUANTITY*I.VOLUMN  KL

          
            FROM prod.KILN_BATCH KB
            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
            WHERE KB.STATUS = 'finish' and  DATEPART(MONTH,EXPORT_DATE) = ${req.query.month} and  DATEPART(YEAR,EXPORT_DATE) = ${req.query.year} and K.FACTORY_ID = ${fa}
            and KB.TYPE not in (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR')
        ) TEMP
		Group by NHOMSP_TTD) k
		left join prod.NHOM_TIEU_THU_DIEN  D on k.NHOM_DM_TTD = D.ID) AS k ) AS K LEFT OUTER JOIN
                         prod.BANG_DM_TIEU_THU_DIEN AS BA ON BA.NHOMSP_TTD = K.NHOMSP_TTD AND K.NHOM_DM_TTD = BA.NHOM_DM_TTD LEFT OUTER JOIN
                             (SELECT        NH.[GROUP], SUM(T.SODIEN) AS SODIEN
                               FROM            (SELECT        ID, SODIEN, MANHOM, factoryId, CREATED_DATE, CREATED_BY, MONTH, YEAR, GHICHU
                                                         FROM            prod.TIEU_THU_DIEN
                                                         WHERE        (MONTH =${req.query.month}) and year = ${req.query.year} and factoryId = ${req.query.factoryId}) AS T LEFT OUTER JOIN
                                                         prod.NHOM_TIEU_THU_DIEN AS NH ON NH.ID = T.MANHOM
                               GROUP BY NH.[GROUP]) AS PH ON PH.[GROUP] = K.[GROUP]
             ORDER BY [GROUP], NAME
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});
router.post("/bieu-do-tieu-thu-dien", (req, res, next) => {
    console.log("req.body", req.body);
    let fa = 100000;
    if (req.body.factoryId == 102339) fa = 100003
    if (req.body.factoryId == 102366) fa = 100005
    new mssql.Request()
        .query(
            `
            WITH Temp_CTE ([GROUP], TOTAL_SODIEN, SODIENTT , thang)  
            as
            (
            SELECT [GROUP], SUM(SODIENDM) TOTAL_SODIEN,SODIENTT , thang  FROM 
            (
            SELECT        K.[GROUP], BA.DM_TTD * K.KL AS SODIENDM, PH.SODIEN AS SODIENTT, ${req.body.month1} thang
            FROM            (SELECT        [GROUP], NHOMSP_TTD, NAME, SUM(KL) AS KL, NHOM_DM_TTD, ID
                                      FROM            (SELECT        NH.[GROUP], NH.ID, I.NHOMSP_TTD, P.SOURCE_ID, SUM(IT.QUANTITY) * I.VOLUMN AS KL, D.GROUP_ID, NH.NAME, NH.NHOM_DM_TTD
                                                                FROM            prod.PACKAGE AS P LEFT OUTER JOIN
                                                                                          prod.ITEM_IN_PACKAGE AS IT ON IT.PACKAGE_ID = P.ID LEFT OUTER JOIN
                                                                                          base.ITEM AS I ON I.ID = IT.ITEM_ID LEFT OUTER JOIN
                                                                                          base.DEPARTMENT AS D ON D.ID = P.SOURCE_ID LEFT OUTER JOIN
                                                                                          prod.NHOM_TIEU_THU_DIEN AS NH ON NH.ID = D.GROUP_ID
              WHERE        (I.NHOMSP_TTD IS NOT NULL) AND (MONTH(P.CREATE_DATE) = ${req.body.month1}) and YEAR(P.CREATE_DATE) = ${req.body.year1} AND (D.GROUP_ID IS NOT NULL) and NH.factoryId = ${req.body.factoryId} 
              and P.SOURCE_ID not in (102639,102641,102640,102642) and P.TYPE_ID = 100026
                                                                GROUP BY I.NHOMSP_TTD, P.SOURCE_ID, I.VOLUMN, D.GROUP_ID, NH.NAME, NH.[GROUP], NH.NHOM_DM_TTD, NH.ID) AS k_1
                                      GROUP BY [GROUP], NHOMSP_TTD, NAME, NHOM_DM_TTD, ID
                                      union all
                                      select D.[GROUP],NHOMSP_TTD,D.NAME,SUM(KL) KL,D.NHOM_DM_TTD,D.ID from
                (select MONTH(approvedAt) THANG,SUM(KLC_TH) KL, '1A' NHOMSP_TTD,SOURCE_ID from prod.XUAT_GO_BAO  where XUATNHAP in ('xuatluaphoi','xuat-cat-ha-cap') and approvedByAccount is not null and MONTH(approvedAt) = ${req.body.month1} and factoryId = ${req.body.factoryId}
                and YEAR(approvedAt) = ${req.body.year1}
                GROUP BY MONTH(approvedAt),SOURCE_ID) k
                left join base.DEPARTMENT H on H.ID = k.SOURCE_ID
                left join prod.NHOM_TIEU_THU_DIEN  D on H.GROUP_ID = D.ID 
                GROUP BY D.[GROUP],NHOMSP_TTD,D.NAME,D.NHOM_DM_TTD,D.ID
                union all
                select D.[GROUP],NHOMSP_TTD,D.NAME,KL,D.NHOM_DM_TTD,D.ID from
            (select 'EM' NHOMSP_TTD,100001 NHOM_DM_TTD,SUM(VOLUMN)/1000 KL,MONTH(NGAY_CAN_BI) THANG from prod.EP_MUN where HANG_HOA = 'mun-cua-ep-bang' and FACTORY_ID = ${req.body.factoryId}  and MONTH(NGAY_CAN_BI) = ${req.body.month1}
            and YEAR(NGAY_CAN_BI) = ${req.body.year1}
            GROUP BY MONTH(NGAY_CAN_BI)) k
            left join prod.NHOM_TIEU_THU_DIEN  D on k.NHOM_DM_TTD = D.ID
            union all
select k.[GROUP],k.NHOMSP_TTD,k.NAME,case when k.NHOMSP_TTD = 'SL' then k.KL*0.15 else k.KL end KL,k.NHOM_DM_TTD,k.ID from
(select D.[GROUP],NHOMSP_TTD,D.NAME,KL,D.NHOM_DM_TTD,D.ID from
(SELECT NHOMSP_TTD,100000 NHOM_DM_TTD,sum(KL) KL FROM (
        SELECT 
       case when KB.TYPE in (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') then 'SL'
	   WHEN I.HEIGHT = 14 then 'Runnen'
	   else KB.TYPE end NHOMSP_TTD,
        IIP.QUANTITY*I.VOLUMN  KL

          
            FROM prod.KILN_BATCH KB
            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
            WHERE KB.STATUS = 'finish' and  DATEPART(MONTH,EXPORT_DATE) = ${req.body.month1} and  DATEPART(YEAR,EXPORT_DATE) = ${req.body.year1} and K.FACTORY_ID = ${fa}
        ) TEMP
		Group by NHOMSP_TTD) k
		left join prod.NHOM_TIEU_THU_DIEN  D on k.NHOM_DM_TTD = D.ID) AS k
            ) AS K LEFT OUTER JOIN
                                     prod.BANG_DM_TIEU_THU_DIEN AS BA ON BA.NHOMSP_TTD = K.NHOMSP_TTD AND K.NHOM_DM_TTD = BA.NHOM_DM_TTD LEFT OUTER JOIN
                                         (SELECT        NH.[GROUP], SUM(T.SODIEN) AS SODIEN
                                           FROM            (SELECT        ID, SODIEN, MANHOM, factoryId, CREATED_DATE, CREATED_BY, MONTH, YEAR, GHICHU
                                                                     FROM            prod.TIEU_THU_DIEN
                                                                     WHERE        (MONTH = ${req.body.month1}) and year = ${req.body.year1} and factoryId = ${req.body.factoryId}) AS T LEFT OUTER JOIN
                                                                     prod.NHOM_TIEU_THU_DIEN AS NH ON NH.ID = T.MANHOM
                                           GROUP BY NH.[GROUP]) AS PH ON PH.[GROUP] = K.[GROUP]
            
                         union all
            
            SELECT        K.[GROUP], BA.DM_TTD * K.KL AS SODIENDM, PH.SODIEN AS SODIENTT, ${req.body.month2} thang
            FROM            (SELECT        [GROUP], NHOMSP_TTD, NAME, SUM(KL) AS KL, NHOM_DM_TTD, ID
                                      FROM            (SELECT        NH.[GROUP], NH.ID, I.NHOMSP_TTD, P.SOURCE_ID, SUM(IT.QUANTITY) * I.VOLUMN AS KL, D.GROUP_ID, NH.NAME, NH.NHOM_DM_TTD
                                                                FROM            prod.PACKAGE AS P LEFT OUTER JOIN
                                                                                          prod.ITEM_IN_PACKAGE AS IT ON IT.PACKAGE_ID = P.ID LEFT OUTER JOIN
                                                                                          base.ITEM AS I ON I.ID = IT.ITEM_ID LEFT OUTER JOIN
                                                                                          base.DEPARTMENT AS D ON D.ID = P.SOURCE_ID LEFT OUTER JOIN
                                                                                          prod.NHOM_TIEU_THU_DIEN AS NH ON NH.ID = D.GROUP_ID
              WHERE        (I.NHOMSP_TTD IS NOT NULL) AND (MONTH(P.CREATE_DATE) = ${req.body.month2}) and YEAR(P.CREATE_DATE) = ${req.body.year2} AND (D.GROUP_ID IS NOT NULL) and NH.factoryId = ${req.body.factoryId} 
              and P.SOURCE_ID not in (102639,102641,102640,102642)
                                                                GROUP BY I.NHOMSP_TTD, P.SOURCE_ID, I.VOLUMN, D.GROUP_ID, NH.NAME, NH.[GROUP], NH.NHOM_DM_TTD, NH.ID) AS k_1
                                      GROUP BY [GROUP], NHOMSP_TTD, NAME, NHOM_DM_TTD, ID
                                      union all
                                      select D.[GROUP],NHOMSP_TTD,D.NAME,SUM(KL) KL,D.NHOM_DM_TTD,D.ID from
                (select MONTH(approvedAt) THANG,SUM(KLC_TH) KL, '1A' NHOMSP_TTD,SOURCE_ID from prod.XUAT_GO_BAO  where XUATNHAP in ('xuatluaphoi','xuat-cat-ha-cap') and approvedByAccount is not null and MONTH(approvedAt) = ${req.body.month2} and factoryId = ${req.body.factoryId}
                and YEAR(approvedAt) = ${req.body.year2}
                GROUP BY MONTH(approvedAt),SOURCE_ID) k
                left join base.DEPARTMENT H on H.ID = k.SOURCE_ID
                left join prod.NHOM_TIEU_THU_DIEN  D on H.GROUP_ID = D.ID 
                GROUP BY D.[GROUP],NHOMSP_TTD,D.NAME,D.NHOM_DM_TTD,D.ID
                union all
                select D.[GROUP],NHOMSP_TTD,D.NAME,KL,D.NHOM_DM_TTD,D.ID from
            (select 'EM' NHOMSP_TTD,100001 NHOM_DM_TTD,SUM(VOLUMN)/1000 KL,MONTH(NGAY_CAN_BI) THANG from prod.EP_MUN where HANG_HOA = 'mun-cua-ep-bang' and FACTORY_ID = ${req.body.factoryId} and MONTH(NGAY_CAN_BI) = ${req.body.month2}
            and YEAR(NGAY_CAN_BI) = ${req.body.year2}
            GROUP BY MONTH(NGAY_CAN_BI)) k
            left join prod.NHOM_TIEU_THU_DIEN  D on k.NHOM_DM_TTD = D.ID
			union all
select k.[GROUP],k.NHOMSP_TTD,k.NAME,case when k.NHOMSP_TTD = 'SL' then k.KL*0.15 else k.KL end KL,k.NHOM_DM_TTD,k.ID from
(select D.[GROUP],NHOMSP_TTD,D.NAME,KL,D.NHOM_DM_TTD,D.ID from
(SELECT NHOMSP_TTD,100000 NHOM_DM_TTD,sum(KL) KL FROM (
        SELECT 
       case when KB.TYPE in (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') then 'SL'
	   WHEN I.HEIGHT = 14 then 'Runnen'
	   else KB.TYPE end NHOMSP_TTD,
        IIP.QUANTITY*I.VOLUMN  KL

          
            FROM prod.KILN_BATCH KB
            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
            WHERE KB.STATUS = 'finish' and  DATEPART(MONTH,EXPORT_DATE) = ${req.body.month2} and  DATEPART(YEAR,EXPORT_DATE) = ${req.body.year2} and K.FACTORY_ID = ${fa}
        ) TEMP
		Group by NHOMSP_TTD) k
		left join prod.NHOM_TIEU_THU_DIEN  D on k.NHOM_DM_TTD = D.ID) AS k
			) AS K LEFT OUTER JOIN
                                     prod.BANG_DM_TIEU_THU_DIEN AS BA ON BA.NHOMSP_TTD = K.NHOMSP_TTD AND K.NHOM_DM_TTD = BA.NHOM_DM_TTD LEFT OUTER JOIN
                                         (SELECT        NH.[GROUP], SUM(T.SODIEN) AS SODIEN
                                           FROM            (SELECT        ID, SODIEN, MANHOM, factoryId, CREATED_DATE, CREATED_BY, MONTH, YEAR, GHICHU
                                                                     FROM            prod.TIEU_THU_DIEN
                                                                     WHERE        (MONTH = ${req.body.month2}) and year = ${req.body.year2} and factoryId = ${req.body.factoryId}) AS T LEFT OUTER JOIN
                                                                     prod.NHOM_TIEU_THU_DIEN AS NH ON NH.ID = T.MANHOM
                                           GROUP BY NH.[GROUP]) AS PH ON PH.[GROUP] = K.[GROUP]
                                           ) AS TEMP GROUP BY [GROUP], SODIENTT, thang
            )
            
            SELECT *
            FROM
            (
            select [GROUP], SODIENTT - TOTAL_SODIEN KPI, thang  from Temp_CTE
            ) AS BangNguon
            PIVOT
            (
            SUM(KPI)
            FOR thang IN ([${req.body.month1}], [${req.body.month2}])
            ) AS BangChuyen;
            `,
            (err, record) => {
                if (err){
                console.log("err",err)
                    return res.api.sendFail(getErrorMessage(4907));
                } 
                res.api.sendData(record.recordset);
            }
        );
});
router.get("/xuong-tieu-thu-dien", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            select distinct nttd.[GROUP], ttdgc.GHI_CHU 
from prod.NHOM_TIEU_THU_DIEN nttd
left join 
( select * from
prod.TIEU_THU_DIEN where [MONTH] = ${req.query.month} and [YEAR] = ${req.query.year} and factoryId = ${req.query.factoryId} ) ttd on nttd.ID = ttd.MANHOM
left join 
( select * from 
prod.TIEU_THU_DIEN_GHI_CHU where [MONTH] = ${req.query.month} and [YEAR] = ${req.query.year} and FACTORY_ID = ${req.query.factoryId} ) ttdgc 
on nttd.[GROUP] = ttdgc.[GROUP] and ttd.[MONTH] = ttdgc.[MONTH] 
and ttd.[YEAR] = ttdgc.[YEAR] and ttd.factoryId = ttdgc.FACTORY_ID
where nttd.factoryId = ${req.query.factoryId}
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/chart-item-ton-cong-doan", (req, res, next) => {
    new mssql.Request()
        .query(
            `
            DECLARE 
            @columns NVARCHAR(MAX) = '',
            @end NVARCHAR(MAX) = '${req.query.toDate}',
            @sanpham int = N'${req.query.itemId}',
            @sql     NVARCHAR(MAX) = '';
        
        -- select the category names
        WITH temp(NAME)
          as (
            select distinct congdoan from
             (
            select DISTINCT * from dbo.View_SP
			) B
                    where paren_id = ${req.query.itemId} and congdoan is not null and congdoan not like N'%lựa phôi%'
          )
        SELECT 
            @columns+=QUOTENAME(NAME) + ','
        FROM 
            temp
        ORDER BY 
            NAME;
        
        -- remove the last comma
        SET @columns = LEFT(@columns, LEN(@columns) - 1);
        
        -- construct dynamic SQL
        DECLARE @ParamDefinition NVARCHAR(MAX)
        SELECT  @ParamDefinition= ' @sanpham1 int, @end1 VARCHAR(100)'
        SET @sql =N'
         SELECT  * from (
                        select 
                        v.congdoan, 
                        KL,
                        sanpham
                        from View_TON_CONG_DOAN v
                    left join(
                    select DISTINCT * from dbo.View_SP
                    ) B ON B.ITEM_ID = v.ITEM_ID and B.STEP_ID = v.DEPARTMENT_ID
                        where paren_id = @sanpham1 and v.CREATE_DATE <= @end1
                        )
                        AS BANG_NGUON
        PIVOT
        (
        SUM(KL)
        FOR congdoan IN ('+ @columns +')
        ) AS BANG_CHUYEN';
        
        -- execute the dynamic SQL
        EXECUTE sp_executesql @sql, @ParamDefinition, @sanpham1 = @sanpham, @end1 = @end;
            `,
            (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                res.api.sendData(record.recordset);
            }
        );
});

router.get("/khoi-luong-quy-luong", async (req, res) => {
    const { start, end, strWeek,factoryId } = req.query;
    let data = await new mssql.Request().query(`
    SELECT paren, NAME, departmentId, groupName, groupDepartment, departmentName, departmentName2,null tong,chungloai,loi,total - loi tongcong,
    ${strWeek}, total, dongia,(total - loi)*dongia thanhtien, ID,CODE,LENGTH,WIDTH,HEIGHT
    FROM
    (
    select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
	'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end)  [week],
     p.SOURCE_ID departmentId, 
	convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
	(
	select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
	inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
	inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
	inner join prod.PO po2 on p2.PO = po2.code
	inner join base.MARKET m2 on po2.root = m2.CODE
	where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
	 and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and po2.number not like '%CLAIM%'
	) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
         gtl.itemId = iip.ITEM_ID and  gtl.stepId =p.SOURCE_ID  and ngayapdung <  p.CREATE_DATE
         order by gtl.createdAt desc) dongia
    from prod.PACKAGE p
	left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
	left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
    
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
    inner join prod.PO on p.PO = po.code
    inner join base.MARKET m on po.root = m.CODE
    left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
    left join prod.PACKAGE p1 on qc.packageId = p1.ID
    left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
    left join prod.PO po1 on po1.code = p2.PO
    left join base.MARKET m1 on po1.root = m1.CODE
	where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
	GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
	
	left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
    --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
    where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID not in (102809,102347,102794,102795,102780,102789,102804,100264,100274, 102370, 100266, 100267, 100280, 100281)
    and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
    union all
    select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
    'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], p.SOURCE_ID departmentId,
    convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
   (
   select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
   inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
   inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
   inner join prod.PO po2 on p2.PO = po2.code
   inner join base.MARKET m2 on po2.root = m2.CODE
   where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
    and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and po2.number not like '%CLAIM%'
   ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
       gtl.itemId = i.ID and  gtl.stepId =p.SOURCE_ID  and ngayapdung <  p.CREATE_DATE
       order by gtl.createdAt desc) dongia
   from prod.PACKAGE p
   left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
   left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
   inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID

   inner join base.ITEM i on iip.ITEM_ID = i.ID
   left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
   inner join prod.PO on p.PO = po.code
   inner join base.MARKET m on po.root = m.CODE
   left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
   left join prod.PACKAGE p1 on qc.packageId = p1.ID
   left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
   left join prod.PO po1 on po1.code = p2.PO
   left join base.MARKET m1 on po1.root = m1.CODE
   where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
   GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
   
   left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
   --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
   where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID in (100264,100274) and p.DESTINATION_ID in (102778,100281) 
  -- and i.id in (129543,129578,129546,129547,129580,129544,129583,129581,129542,129545,129584,129582,129577)
  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
  union all
  
  select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
    'week'+CONVERT(varchar, DATEPART(week, p.CREATE_DATE)-1) [week], p.SOURCE_ID departmentId,
    convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
  (
  select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
  inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
  inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
  inner join prod.PO po2 on p2.PO = po2.code
  inner join base.MARKET m2 on po2.root = m2.CODE
  where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
   and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026  and p2.CREATE_DATE < '2022-06-17' and po2.number not like '%CLAIM%'
  ) as total, (select TOP 1  gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId = p.SOURCE_ID and ngayapdung <  p.CREATE_DATE
      order by gtl.createdAt desc) dongia
  from prod.PACKAGE p
  left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
  left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
  inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID

  inner join base.ITEM i on iip.ITEM_ID = i.ID
  left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
  inner join prod.PO on p.PO = po.code
  inner join base.MARKET m on po.root = m.CODE
  left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
  left join prod.PACKAGE p1 on qc.packageId = p1.ID
  left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
  left join prod.PO po1 on po1.code = p2.PO
  left join base.MARKET m1 on po1.root = m1.CODE
  where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
  GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
  
  left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
  --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
  where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100266 and p.CREATE_DATE < '2022-06-17'
  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
  union all
  select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
    'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], p.SOURCE_ID departmentId,
    convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
  (
  select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
  inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
  inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
  inner join prod.PO po2 on p2.PO = po2.code
  inner join base.MARKET m2 on po2.root = m2.CODE
  where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
   and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and p2.CREATE_DATE >= '2022-06-17' and po2.number not like '%CLAIM%'
  ) as total, (select TOP 1 gtl.dongia+isnull((
  select top 1 gtl2.dongia from prod.GIA_TINH_LUONG gtl2 where gtl2.itemId = i.ID and  gtl2.stepId = 100268  
  and ngayapdung <  p.CREATE_DATE
      order by gtl2.createdAt desc
  ),0) from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId = p.SOURCE_ID  
      order by gtl.createdAt desc) dongia
  from prod.PACKAGE p
  left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
  left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
  inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID

  inner join base.ITEM i on iip.ITEM_ID = i.ID
  left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
  inner join prod.PO on p.PO = po.code
  inner join base.MARKET m on po.root = m.CODE
  left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
  left join prod.PACKAGE p1 on qc.packageId = p1.ID
  left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
  left join prod.PO po1 on po1.code = p2.PO
  left join base.MARKET m1 on po1.root = m1.CODE
  where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
  GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
  
  left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
  --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
  where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100266 and p.CREATE_DATE >= '2022-06-17'
  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
  union all
  select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
    'week'+CONVERT(varchar, DATEPART(week, p.CREATE_DATE)-1) [week], p.SOURCE_ID departmentId,
    convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
  (
  select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
  inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
  inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
  inner join prod.PO po2 on p2.PO = po2.code
  inner join base.MARKET m2 on po2.root = m2.CODE
  where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
   and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and p2.CREATE_DATE < '2022-06-17' and po2.number not like '%CLAIM%'
  ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId = p.SOURCE_ID  and ngayapdung <  p.CREATE_DATE
      order by gtl.createdAt desc) dongia
  from prod.PACKAGE p
  left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
  left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
  inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID

  inner join base.ITEM i on iip.ITEM_ID = i.ID
  left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
  inner join prod.PO on p.PO = po.code
  inner join base.MARKET m on po.root = m.CODE
  left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
  left join prod.PACKAGE p1 on qc.packageId = p1.ID
  left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
  left join prod.PO po1 on po1.code = p2.PO
  left join base.MARKET m1 on po1.root = m1.CODE
  where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
  GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
  
  left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
  --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
  where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100280 and p.CREATE_DATE < '2022-06-17'
  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
  union all
  select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
    'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], p.SOURCE_ID departmentId,
    convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
  (
  select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
  inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
  inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
  inner join prod.PO po2 on p2.PO = po2.code
  inner join base.MARKET m2 on po2.root = m2.CODE
  where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
   and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and p2.CREATE_DATE >= '2022-06-17' and po2.number not like '%CLAIM%'
  ) as total, (select TOP 1 gtl.dongia+isnull((
  select top 1 gtl2.dongia from prod.GIA_TINH_LUONG gtl2 where gtl2.itemId = i.ID and  gtl2.stepId = 100275  
  and gtl2.ngayapdung <  p.CREATE_DATE
      order by gtl2.createdAt desc
  ),0) from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId = p.SOURCE_ID  and gtl.ngayapdung <  p.CREATE_DATE
      order by gtl.createdAt desc) dongia
  from prod.PACKAGE p
  left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
  left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
  inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID

  inner join base.ITEM i on iip.ITEM_ID = i.ID
  left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
  inner join prod.PO on p.PO = po.code
  inner join base.MARKET m on po.root = m.CODE
  left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
  left join prod.PACKAGE p1 on qc.packageId = p1.ID
  left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
  left join prod.PO po1 on po1.code = p2.PO
  left join base.MARKET m1 on po1.root = m1.CODE
  where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
  GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
  
  left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
  --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
  where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100280 and p.CREATE_DATE >= '2022-06-17'
  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
  union all
  select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
    'week'+CONVERT(varchar, DATEPART(week, p.CREATE_DATE)-1) [week], p.SOURCE_ID departmentId,
    convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
  (
  select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
  inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
  inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
  inner join prod.PO po2 on p2.PO = po2.code
  inner join base.MARKET m2 on po2.root = m2.CODE
  where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
   and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and p2.CREATE_DATE < '2022-06-17' and po2.number not like '%CLAIM%'
  ) as total, (select TOP 1  gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId = p.SOURCE_ID  and gtl.ngayapdung <  p.CREATE_DATE
      order by gtl.createdAt desc) dongia
  from prod.PACKAGE p
  left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
  left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
  inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID

  inner join base.ITEM i on iip.ITEM_ID = i.ID
  left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
  inner join prod.PO on p.PO = po.code
  inner join base.MARKET m on po.root = m.CODE
  left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
  left join prod.PACKAGE p1 on qc.packageId = p1.ID
  left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
  left join prod.PO po1 on po1.code = p2.PO
  left join base.MARKET m1 on po1.root = m1.CODE
  where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
  GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
  
  left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
  --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
  where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100267 and p.CREATE_DATE < '2022-06-17'
  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
  union all
  select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
    'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], p.SOURCE_ID departmentId,
    convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
  (
  select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
  inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
  inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
  inner join prod.PO po2 on p2.PO = po2.code
  inner join base.MARKET m2 on po2.root = m2.CODE
  where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
   and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and p2.CREATE_DATE >= '2022-06-17' and po2.number not like '%CLAIM%'
  ) as total, (select TOP 1 gtl.dongia+isnull((
  select top 1 gtl2.dongia from prod.GIA_TINH_LUONG gtl2 where gtl2.itemId = i.ID and  gtl2.stepId = 100268  
  and gtl2.ngayapdung <  p.CREATE_DATE
      order by gtl2.createdAt desc 
  ),0) from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId = p.SOURCE_ID  and gtl.ngayapdung <  p.CREATE_DATE
      order by gtl.createdAt desc) dongia
  from prod.PACKAGE p
  left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
  left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
  inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID

  inner join base.ITEM i on iip.ITEM_ID = i.ID
  left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
  inner join prod.PO on p.PO = po.code
  inner join base.MARKET m on po.root = m.CODE
  left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
  left join prod.PACKAGE p1 on qc.packageId = p1.ID
  left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
  left join prod.PO po1 on po1.code = p2.PO
  left join base.MARKET m1 on po1.root = m1.CODE
  where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
  GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
  
  left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
  --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
  where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100267 and p.CREATE_DATE >= '2022-06-17'
  and d.factoryId = ${factoryId}  and po.number not like '%CLAIM%'
  union all
  select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
    'week'+CONVERT(varchar, DATEPART(week, p.CREATE_DATE)-1) [week], p.SOURCE_ID departmentId,
    convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
  (
  select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
  inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
  inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
  inner join prod.PO po2 on p2.PO = po2.code
  inner join base.MARKET m2 on po2.root = m2.CODE
  where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
   and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and p2.CREATE_DATE < '2022-06-17' and po2.number not like '%CLAIM%'
  ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId = p.SOURCE_ID   and gtl.ngayapdung <  p.CREATE_DATE
      order by gtl.createdAt desc) dongia
  from prod.PACKAGE p
  left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
  left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
  inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID

  inner join base.ITEM i on iip.ITEM_ID = i.ID
  left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
  inner join prod.PO on p.PO = po.code
  inner join base.MARKET m on po.root = m.CODE
  left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
  left join prod.PACKAGE p1 on qc.packageId = p1.ID
  left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
  left join prod.PO po1 on po1.code = p2.PO
  left join base.MARKET m1 on po1.root = m1.CODE
  where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
  GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
  
  left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
  --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
  where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100281 and p.CREATE_DATE < '2022-06-17'
  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
  union all
  select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
    'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], p.SOURCE_ID departmentId,
    convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
  (
  select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
  inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
  inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
  inner join prod.PO po2 on p2.PO = po2.code
  inner join base.MARKET m2 on po2.root = m2.CODE
  where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
   and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and p2.CREATE_DATE >= '2022-06-17' and po2.number not like '%CLAIM%'
  ) as total, (select TOP 1 gtl.dongia+isnull((
  select top 1 gtl2.dongia from prod.GIA_TINH_LUONG gtl2 where gtl2.itemId = i.ID and  gtl2.stepId = 100275
  and gtl2.ngayapdung <  p.CREATE_DATE  
      order by gtl2.createdAt desc 
  ),0) from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId = p.SOURCE_ID   and gtl.ngayapdung <  p.CREATE_DATE
      order by gtl.createdAt desc) dongia
  from prod.PACKAGE p
  left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
  left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
  inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID

  inner join base.ITEM i on iip.ITEM_ID = i.ID
  left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
  inner join prod.PO on p.PO = po.code
  inner join base.MARKET m on po.root = m.CODE
  left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
  left join prod.PACKAGE p1 on qc.packageId = p1.ID
  left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
  left join prod.PO po1 on po1.code = p2.PO
  left join base.MARKET m1 on po1.root = m1.CODE
  where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
  GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
  
  left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
  --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
  where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100281 and p.CREATE_DATE >= '2022-06-17'
  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
    union all
    select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
	'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], p.SOURCE_ID departmentId,
	convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,
   (
   select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
   inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
   inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
   left join prod.PO po2 on p2.PO = po2.code
   left join base.MARKET m2 on po2.root = m2.CODE
   where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID 
    and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and p2.VERIFY_BY is not null and po2.number not like '%CLAIM%'
   ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
    gtl.itemId = i.ID and  gtl.stepId =p.SOURCE_ID   and gtl.ngayapdung <  p.CREATE_DATE
    order by gtl.createdAt desc) dongia
   from prod.PACKAGE p
   left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
   left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
   inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID	

   inner join base.ITEM i on iip.ITEM_ID = i.ID
   left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
   left join prod.PO on p.PO = po.code
   left join base.MARKET m on po.root = m.CODE
   left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
   left join prod.PACKAGE p1 on qc.packageId = p1.ID
   left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
   left join prod.PO po1 on po1.code = p2.PO
   left join base.MARKET m1 on po1.root = m1.CODE
   where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
   GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
  
   left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
   --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
   where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID in (102794,102795,102780,102804) and p.VERIFY_BY is not null and iip.ITEM_ID not in (125580)
   and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
    ) AS BangNguon
    PIVOT
    (
    SUM(volumn)
    FOR [week] IN (${strWeek})
    ) AS BangChuyen;
    `)

    res.status(200).send(data.recordset)
})
router.get("/khoi-luong-quy-luong-say-phoi", async (req, res) => {
    const { start, end, strWeek } = req.query;
    let data = await new mssql.Request().query(`

    SELECT       *, dongia*total thanhtien
FROM            (SELECT        
CASE 
WHEN K.FACTORY_ID = 100003 THEN 102342 
WHEN K.FACTORY_ID = 100000 THEN 100013 
WHEN K.FACTORY_ID = 100005 THEN 102368 
END AS departmentId, 
N'1 SẤY PHÔI' groupName, N'Sấy phôi' groupDepartment, 
N'1.Tổ sấy phôi' departmentName,
CASE 
WHEN K.FACTORY_ID = 100003 THEN N'[YS1A-SP] 1.Tổ sấy phôi' 
WHEN K.FACTORY_ID = 100000 THEN N'[TH-SP] 1.Tổ sấy phôi'
WHEN K.FACTORY_ID = 100005 THEN N'[TB-SP] 1.Tổ Sấy Phôi' 
END AS departmentName2, 
i.LENGTH, i.WIDTH, i.HEIGHT,CASE WHEN KB.EXPORT_DATE >'20221201' 
then 'week'+CONVERT(varchar,CASE WHEN DATEPART(year, PL.MODIFY_DATE)<2023 then DATEPART(week, PL.MODIFY_DATE)-1 else DATEPART(week, PL.MODIFY_DATE) end)
else  'week'+CONVERT(varchar, DATEPART(week, KB.EXPORT_DATE)-1) end as [week], 
IIP.ITEM_ID, i.NAME, i.CODE,
CASE when K.FACTORY_ID = 100000 and I.HEIGHT = 14 then 106000
            when K.FACTORY_ID = 100000 and I.HEIGHT != 14 then 118800
            when  K.FACTORY_ID != 100000 and I.HEIGHT = 14 then 97500
            else 99400 end as dongia,
                                                     ROUND(SUM(IIP.QUANTITY) * I.VOLUMN, 4) volumn ,
													 ( select ROUND(SUM(IIP2.QUANTITY) * I2.VOLUMN, 4)
													 FROM            prod.KILN_BATCH KB2 LEFT JOIN
                                                    prod.KILN K2 ON K2.ID = KB2.KILN_ID LEFT JOIN
                                                    prod.STEP_OF_PALLET SOP2 ON SOP2.KILN_BATCH_ID = KB2.ID LEFT JOIN
                                                    prod.PALLET PL2 ON PL2.ID = SOP2.PALLET_ID LEFT JOIN
                                                    prod.ITEM_IN_PALLET IIP2 ON IIP2.PALLET_ID = PL2.ID LEFT JOIN
                                                    base.ITEM I2 ON I2.ID = IIP2.ITEM_ID
                          WHERE        KB2.STATUS = 'finish' AND KB2.TYPE NOT IN (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') AND PL2.MODIFY_BY IS NOT NULL
						  and (CASE WHEN kb2.EXPORT_DATE>'20221201' then PL2.MODIFY_DATE  else  kb2.EXPORT_DATE END) between '${start}' and '${end}' and IIP.ITEM_ID = i2.ID and k.FACTORY_ID = k2.FACTORY_ID
						  group by i2.VOLUMN
													 ) total
                          FROM            prod.KILN_BATCH KB LEFT JOIN
                                                    prod.KILN K ON K.ID = KB.KILN_ID LEFT JOIN
                                                    prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID LEFT JOIN
                                                    prod.PALLET PL ON PL.ID = SOP.PALLET_ID LEFT JOIN
                                                    prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID LEFT JOIN
                                                    base.ITEM I ON I.ID = IIP.ITEM_ID
                          WHERE        KB.STATUS = 'finish' AND KB.TYPE NOT IN (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') AND PL.MODIFY_BY IS NOT NULL
						  and (CASE WHEN KB.EXPORT_DATE>'20221201' then PL.MODIFY_DATE else   KB.EXPORT_DATE END) between '${start}' and '${end}'
                          GROUP BY IIP.ITEM_ID, I.VOLUMN, KB.STATUS,PL.MODIFY_DATE, KB.EXPORT_DATE, K.FACTORY_ID, i.HEIGHT, i.WIDTH, i.LENGTH, i.NAME, i.CODE) 
						  TEMP
						  PIVOT
    (
    SUM(volumn)
    FOR [week] IN (${strWeek})
    ) AS BangChuyen;
    `)

    res.status(200).send(data.recordset)
})

router.get("/khoi-luong-quy-luong-lua-phoi", async (req, res) => {
    const { start, end, strWeek,factoryId } = req.query;
    let data = await new mssql.Request().query(`
    SELECT paren, NAME, departmentId, groupName, groupDepartment, departmentName, departmentName2,null tong,chungloai,loi,total - loi tongcong,
    ${strWeek}, total, dongia,(total - loi)*dongia thanhtien, ID,CODE,LENGTH,WIDTH,HEIGHT
    FROM
    (
        select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
        'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102347 departmentId, N'2 LỰA PHÔI' groupName, 
        N'Lựa phôi' groupDepartment, N'2.Tổ Lựa phôi X5' departmentName, N'[YS1-LP-X5] 2.Tổ Lựa phôi X5' departmentName2,
       (
       select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
       inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
       inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
       inner join prod.PO po2 on p2.PO = po2.code
       inner join base.MARKET m2 on po2.root = m2.CODE
       where p2.SOURCE_ID in (102355,102352)  and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
        and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and i2.[TYPE_ID] = 100012 and po2.number not like '%CLAIM%'
       ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
           gtl.itemId = i.ID and  gtl.stepId =102347   and gtl.ngayapdung <  p.CREATE_DATE
           order by gtl.createdAt desc) dongia
       from prod.PACKAGE p
       inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
       left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
       inner join base.ITEM i on iip.ITEM_ID = i.ID
       left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
       inner join prod.PO on p.PO = po.code
       inner join base.MARKET m on po.root = m.CODE
       left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
       left join prod.PACKAGE p1 on qc.packageId = p1.ID
       left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
       left join prod.PO po1 on po1.code = p2.PO
       left join base.MARKET m1 on po1.root = m1.CODE
       where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
       GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and  H.stepId in (102355,102352) and m.PRODUCT_ID = H.PRODUCT_ID
       
       left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
       --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
       where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID in (102355,102352) 
       and iip.ITEM_ID not in (127764,124413,124643,125334)
       and i.[TYPE_ID] = 100012  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
       union all
       select i1.NAME paren,TY.NAME chungloai,CASE when i.TYPE_ID = 100011 and iip.ITEM_ID != 128652 then isnull(H.quantity*i.VOLUMN,0)*isnull(HS.HE_SO,1)
         else isnull(H.quantity*i.VOLUMN,0) end as loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, 
          iip.QUANTITY*i.VOLUMN  AS volumn, 
         'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102347 departmentId, N'2 LỰA PHÔI' groupName, 
         N'Lựa phôi' groupDepartment,  N'2.Tổ Lựa phôi X5' departmentName, N'[YS1-LP-X5] 2.Tổ Lựa phôi X5' departmentName2,
        (
        select SUM(iip2.QUANTITY*i2.VOLUMN)   from prod.PACKAGE p2 
        inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
        left join [prod].[HSLP] HS1 ON HS1.MONTH = DATEPART(MONTH, p2.CREATE_DATE) AND HS1.YEAR = DATEPART(YEAR, p2.CREATE_DATE) AND HS1.FACTORY_ID = 102340
        inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
        inner join prod.PO po2 on p2.PO = po2.code
        inner join base.MARKET m2 on po2.root = m2.CODE
        where p2.SOURCE_ID =  p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID 
         and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and i2.[TYPE_ID] = 100011 and po2.number not like '%CLAIM%'
         GROUP BY i2.TYPE_ID
        ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
         gtl.itemId = i.ID and  gtl.stepId =102347  and gtl.ngayapdung <  p.CREATE_DATE
         order by gtl.createdAt desc) dongia
        from prod.PACKAGE p
        left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
         left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
        inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
         left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p.CREATE_DATE) AND HS.YEAR = DATEPART(YEAR, p.CREATE_DATE) AND HS.FACTORY_ID = 102340
        inner join base.ITEM i on iip.ITEM_ID = i.ID
        left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
        inner join prod.PO on p.PO = po.code
        inner join base.MARKET m on po.root = m.CODE
        left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
        left join prod.PACKAGE p1 on qc.packageId = p1.ID
        left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
        left join prod.PO po1 on po1.code = p2.PO
        left join base.MARKET m1 on po1.root = m1.CODE
        where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
        GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
        
        left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
        --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
        where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102355  and i.[TYPE_ID] = 100011
       and d.factoryId = ${factoryId} and iip.ITEM_ID in (127807,127800,127817,127848,128652) and po.number not like '%CLAIM%'
       union all
     select i1.NAME paren,TY.NAME chungloai,CASE when i.TYPE_ID = 100011 then isnull(H.quantity*i.VOLUMN,0)*isnull(HS.HE_SO,1)
       else isnull(H.quantity*i.VOLUMN,0) end as loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, 
       CASE when i.TYPE_ID = 100011 then iip.QUANTITY*i.VOLUMN*isnull(HS.HE_SO,1) else iip.QUANTITY*i.VOLUMN end AS volumn, 
       'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102789 departmentId, N'2 LỰA PHÔI' groupName, 
       N'Lựa phôi' groupDepartment,  N'2.Tổ Lựa phôi X3 mới' departmentName, N'[YS1-LP] 2.Tổ Lựa phôi X3 mới' departmentName2,
      (
      select CASE when i2.TYPE_ID = 100011 then SUM(iip2.QUANTITY*i2.VOLUMN*isnull(HS.HE_SO,1)) else SUM(iip2.QUANTITY*i2.VOLUMN) end  from prod.PACKAGE p2 
      inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
      left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p2.CREATE_DATE) AND HS.YEAR = DATEPART(YEAR, p2.CREATE_DATE) AND HS.FACTORY_ID = 102340
      inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
      inner join prod.PO po2 on p2.PO = po2.code
      inner join base.MARKET m2 on po2.root = m2.CODE
      where p2.SOURCE_ID =  p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
       and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and i2.[TYPE_ID] = 100011 and po2.number not like '%CLAIM%'
       GROUP BY i2.TYPE_ID
      ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
       gtl.itemId = i.ID and  gtl.stepId =102789  and gtl.ngayapdung <  p.CREATE_DATE
       order by gtl.createdAt desc) dongia
      from prod.PACKAGE p
      left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
       left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
      inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
       left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p.CREATE_DATE) AND HS.YEAR = DATEPART(YEAR, p.CREATE_DATE)   AND HS.FACTORY_ID = 102340
      inner join base.ITEM i on iip.ITEM_ID = i.ID
      left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
      inner join prod.PO on p.PO = po.code
      inner join base.MARKET m on po.root = m.CODE
      left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
      left join prod.PACKAGE p1 on qc.packageId = p1.ID
      left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
      left join prod.PO po1 on po1.code = p2.PO
      left join base.MARKET m1 on po1.root = m1.CODE
      where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
      GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
      
      left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
      --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
      where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102355  and i.[TYPE_ID] = 100011
     and d.factoryId = ${factoryId} and iip.ITEM_ID not in (127807,127800,127817,127848,128652) and po.number not like '%CLAIM%'
     union all
   select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
      'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 100264 departmentId, N'2 LỰA PHÔI' groupName, 
      convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupDepartment,  gd.NAME departmentName, N'[TH-X1LP] 2.Tổ Lựa phôi X1' departmentName2,
     (
     select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
     inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
     inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
     inner join prod.PO po2 on p2.PO = po2.code
     inner join base.MARKET m2 on po2.root = m2.CODE
     where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
      and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and po2.number not like '%CLAIM%'
     ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId =100264   and gtl.ngayapdung <  p.CREATE_DATE
      order by gtl.createdAt desc) dongia
     from prod.PACKAGE p
     left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
      left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
     inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
   
     inner join base.ITEM i on iip.ITEM_ID = i.ID
     left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
     inner join prod.PO on p.PO = po.code
     inner join base.MARKET m on po.root = m.CODE
     left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
     left join prod.PACKAGE p1 on qc.packageId = p1.ID
     left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
     left join prod.PO po1 on po1.code = p2.PO
     left join base.MARKET m1 on po1.root = m1.CODE
     where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
     GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
     
     left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
     --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
     where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100265 
     and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
     union all
     
     select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
     'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 100274 departmentId, N'2 LỰA PHÔI' groupName, 
     convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupDepartment,  gd.NAME departmentName, N'[TH-X3LP] 2.Tổ Lựa phôi X3' departmentName2,
    (
    select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
    inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
    inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
    inner join prod.PO po2 on p2.PO = po2.code
    inner join base.MARKET m2 on po2.root = m2.CODE
    where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
     and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and po2.number not like '%CLAIM%'
    ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
     gtl.itemId = i.ID and  gtl.stepId =100274  and gtl.ngayapdung <  p.CREATE_DATE
     order by gtl.createdAt desc) dongia
    from prod.PACKAGE p
    left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
     left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
   
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
    inner join prod.PO on p.PO = po.code
    inner join base.MARKET m on po.root = m.CODE
    left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
    left join prod.PACKAGE p1 on qc.packageId = p1.ID
    left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
    left join prod.PO po1 on po1.code = p2.PO
    left join base.MARKET m1 on po1.root = m1.CODE
    where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
    GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
    
    left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
    --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
    where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 100278 
    and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
    union all
    select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
        'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102789 departmentId,
        N'2 LỰA PHÔI' groupName, N'Lựa phôi' groupDepartment, N'2.Tổ Lựa phôi X3 mới' departmentName, N'[YS1-LP] 2.Tổ Lựa phôi X3 mới' departmentName2,
       (
       select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
       inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
       inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
       inner join prod.PO po2 on p2.PO = po2.code
       inner join base.MARKET m2 on po2.root = m2.CODE
       where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
        and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and po2.number not like '%CLAIM%'
       ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
           gtl.itemId = i.ID and  gtl.stepId =102789  and gtl.ngayapdung <  p.CREATE_DATE
           order by gtl.createdAt desc) dongia
       from prod.PACKAGE p
       left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
       left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
       inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
   
       inner join base.ITEM i on iip.ITEM_ID = i.ID
       left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
       inner join prod.PO on p.PO = po.code
       inner join base.MARKET m on po.root = m.CODE
       left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
       left join prod.PACKAGE p1 on qc.packageId = p1.ID
       left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
       left join prod.PO po1 on po1.code = p2.PO
       left join base.MARKET m1 on po1.root = m1.CODE
       where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
       GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
       
       left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
       --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
       where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102357 and iip.ITEM_ID in (125552,125553,125554,125568,125569,125570,129081)
       and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
    union all
    select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
        'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week],
        CASE WHEN p.CREATE_DATE >'20221201' then 102855 else 102347 end as departmentId,
        N'2 LỰA PHÔI' groupName, N'Lựa phôi' groupDepartment,
       CASE WHEN p.CREATE_DATE >'20221201' then N'2.Tổ Lựa phôi X3' else N'2.Tổ Lựa phôi X5' end as departmentName, 
       CASE WHEN p.CREATE_DATE >'20221201' then N'[YS1-LPX3] 2.Tổ Lựa phôi X3' else N'[YS1-LP-X5] 2.Tổ Lựa phôi X5' end as departmentName2,
       (
       select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
       inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
       inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
       inner join prod.PO po2 on p2.PO = po2.code
       inner join base.MARKET m2 on po2.root = m2.CODE
       where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
        and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and po2.number not like '%CLAIM%'
       ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
           gtl.itemId = i.ID and  gtl.stepId =102347  and gtl.ngayapdung <  p.CREATE_DATE
           order by gtl.createdAt desc) dongia
       from prod.PACKAGE p
       left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
       left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
       inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
   
       inner join base.ITEM i on iip.ITEM_ID = i.ID
       left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
       inner join prod.PO on p.PO = po.code
       inner join base.MARKET m on po.root = m.CODE
       left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
       left join prod.PACKAGE p1 on qc.packageId = p1.ID
       left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
       left join prod.PO po1 on po1.code = p2.PO
       left join base.MARKET m1 on po1.root = m1.CODE
       where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
       GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
       
       left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
       --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
       where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102357 and iip.ITEM_ID in (124544,124545)
       and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
   union all
    select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN volumn, 
      'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102370 departmentId,
      N'2 LỰA PHÔI' groupName, N'Lựa phôi' groupDepartment, N'2.Tổ Lựa phôi ghép' departmentName, N'[TB-LPG] 2.Tổ Lựa phôi ghép' departmentName2,
     (
     select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
     inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
     inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
     inner join prod.PO po2 on p2.PO = po2.code
     inner join base.MARKET m2 on po2.root = m2.CODE
     where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
      and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and po2.number not like '%CLAIM%'
     ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
         gtl.itemId = i.ID and  gtl.stepId = 102370  and gtl.ngayapdung <  p.CREATE_DATE
         order by gtl.createdAt desc) dongia
     from prod.PACKAGE p
     left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
     left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
     inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
   
     inner join base.ITEM i on iip.ITEM_ID = i.ID
     left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
     inner join prod.PO on p.PO = po.code
     inner join base.MARKET m on po.root = m.CODE
     left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
     left join prod.PACKAGE p1 on qc.packageId = p1.ID
     left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
     left join prod.PO po1 on po1.code = p2.PO
     left join base.MARKET m1 on po1.root = m1.CODE
     where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
     GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
     
     left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
     --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
     where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102380 and TY.ID = 100012 and i.ID not in (124537)
     and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
     union all
    select i1.NAME paren,TY.NAME chungloai,isnull(H.quantity*i.VOLUMN,0)*isnull(HS.HE_SO,1) loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, iip.QUANTITY*i.VOLUMN*isnull(HS.HE_SO,1) volumn, 
      'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102809 departmentId,
      N'2 LỰA PHÔI' groupName, N'Lựa phôi' groupDepartment, N'2. Tổ Lựa phôi' departmentName, N'[TB-LP] 2. Tổ Lựa phôi' departmentName2,
     (
     select SUM(iip2.QUANTITY*i2.VOLUMN*isnull(HS.HE_SO,1)) from prod.PACKAGE p2 
     inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
     inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
     left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p2.CREATE_DATE) AND HS.YEAR = DATEPART(YEAR, p2.CREATE_DATE) AND HS.FACTORY_ID = 102366
     inner join prod.PO po2 on p2.PO = po2.code
     inner join base.MARKET m2 on po2.root = m2.CODE
     where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
      and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and po2.number not like '%CLAIM%'
     ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
         gtl.itemId = i.ID and  gtl.stepId = 102809  and gtl.ngayapdung <  p.CREATE_DATE
         order by gtl.createdAt desc) dongia
     from prod.PACKAGE p
     left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
     left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
     inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
   
     inner join base.ITEM i on iip.ITEM_ID = i.ID
     left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p.CREATE_DATE) AND HS.YEAR = DATEPART(YEAR, p.CREATE_DATE) AND HS.FACTORY_ID = 102366
     left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
     inner join prod.PO on p.PO = po.code
     inner join base.MARKET m on po.root = m.CODE
     left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
     left join prod.PACKAGE p1 on qc.packageId = p1.ID
     left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
     left join prod.PO po1 on po1.code = p2.PO
     left join base.MARKET m1 on po1.root = m1.CODE
     where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
     GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
     
     left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
     --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
     where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102380 and TY.ID = 100011
     and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
    ) AS BangNguon
    PIVOT
    (
    SUM(volumn)
    FOR [week] IN (${strWeek})
    ) AS BangChuyen;
    `)

    res.status(200).send(data.recordset)
})
router.get("/khoi-luong-quy-luong-lua-phoi-x5", async (req, res) => {
    const { start, end, strWeek,factoryId } = req.query;
    let data = await new mssql.Request().query(`
    SELECT paren, NAME, departmentId, groupName, groupDepartment, departmentName, departmentName2,null tong,chungloai,loi,total - loi tongcong,
    ${strWeek}, total, dongia,(total - loi)*dongia thanhtien, ID,CODE,LENGTH,WIDTH,HEIGHT
    FROM
    (
      select paren,chungloai,loi,CODE,LENGTH,WIDTH,HEIGHT,ID,NAME,SUM(volumn) volumn,[week],departmentId,groupName,groupDepartment,departmentName,departmentName2,
 total,dongia from
        (select i1.NAME paren,TY.NAME chungloai,i.TYPE_ID,
        isnull(H.quantity*i.VOLUMN,0) as loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, 
        CASE when i.TYPE_ID = 100011 then iip.QUANTITY*i.VOLUMN*isnull(HS.HE_SO,1) else iip.QUANTITY*i.VOLUMN end AS volumn, 
        'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102789 departmentId, N'2 LỰA PHÔI' groupName, 
        N'Lựa phôi' groupDepartment,  N'2.Tổ Lựa phôi X3 mới' departmentName, N'[YS1-LP] 2.Tổ Lựa phôi X3 mới' departmentName2,
       (
       select  SUM(iip2.QUANTITY*i2.VOLUMN*isnull(HS.HE_SO,1))   from prod.PACKAGE p2 
       inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
       left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p2.CREATE_DATE)  AND HS.FACTORY_ID = 102340 and HS.YEAR = DATEPART(YEAR, p2.CREATE_DATE)
       inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
       inner join prod.PO po2 on p2.PO = po2.code
       inner join base.MARKET m2 on po2.root = m2.CODE
       where p2.SOURCE_ID =  p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID --and DATEPART(MONTH, p2.CREATE_DATE) = DATEPART(MONTH, p.CREATE_DATE)
        and p2.CREATE_DATE between '${start}' and '${end}' and p2.TYPE_ID = 100026  and i2.TYPE_ID = 100011
        and po2.number not like '%CLAIM%'
       ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
        gtl.itemId = i.ID and  gtl.stepId =102789   and gtl.ngayapdung <  p.CREATE_DATE
        order by gtl.createdAt desc) dongia
       from prod.PACKAGE p
       left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
        left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
       inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
       left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p.CREATE_DATE)  AND HS.FACTORY_ID = 102340 and HS.YEAR = DATEPART(YEAR, p.CREATE_DATE)
       inner join base.ITEM i on iip.ITEM_ID = i.ID
       left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
       inner join prod.PO on p.PO = po.code
       inner join base.MARKET m on po.root = m.CODE
       left join (select qc.itemId,qc.stepId,SUM(qc.quantity* (case when I.TYPE_ID = 100011 then HS.HE_SO else 1 end)) quantity
	   ,m1.PRODUCT_ID,HS.HE_SO from prod.HandleQc qc
       left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, qc.createdAt)  AND HS.FACTORY_ID = 102340 and HS.YEAR = DATEPART(YEAR,qc.createdAt)
       left join prod.PACKAGE p1 on qc.packageId = p1.ID
       left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
       left join prod.PO po1 on po1.code = p2.PO
       left join base.MARKET m1 on po1.root = m1.CODE
	   left join base.ITEM I on I.ID = qc.itemId
       where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
       GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID,HS.HE_SO) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID 
       
       left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
       --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId 
       where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102353  
       and i.ID not in (127279,127273,127270,127287,127288,127289,127284,127261,127367,127262,127264,127263,127265,127267
        ,127319,127345,127347,127322,127344,127329,127342,127346,127321,127336,127343,127325,127320,127326,127333,127330,126958 ) and i.TYPE_ID = 100011
    
      and d.factoryId = 102340 and po.number not like '%CLAIM%') k
     GROUP BY paren,chungloai,TYPE_ID,loi,CODE,LENGTH,WIDTH,HEIGHT,ID,NAME,departmentId,groupName,groupDepartment,departmentName,departmentName2,total,dongia,[week]
      union all
      select i1.NAME paren,TY.NAME chungloai,CASE when i.TYPE_ID = 100011 then isnull(H.quantity*i.VOLUMN,0)*isnull(HS.HE_SO,1)
      else isnull(H.quantity*i.VOLUMN,0) end as loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, 
      CASE when i.TYPE_ID = 100011 then iip.QUANTITY*i.VOLUMN*isnull(HS.HE_SO,1) else iip.QUANTITY*i.VOLUMN end AS volumn, 
      'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102789 departmentId, N'2 LỰA PHÔI' groupName, 
      N'Lựa phôi' groupDepartment,  N'2.Tổ Lựa phôi X3 mới' departmentName, N'[YS1-LP] 2.Tổ Lựa phôi X3 mới' departmentName2,
     (
     select  SUM(iip2.QUANTITY*i2.VOLUMN)   from prod.PACKAGE p2 
     inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
     left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p2.CREATE_DATE) AND HS.YEAR = DATEPART(YEAR, p2.CREATE_DATE) AND HS.FACTORY_ID = 102340 and HS.YEAR = DATEPART(YEAR, p2.CREATE_DATE)
     inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
     inner join prod.PO po2 on p2.PO = po2.code
     inner join base.MARKET m2 on po2.root = m2.CODE
     where p2.SOURCE_ID =  p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
      and p2.CREATE_DATE between '${start}' and '${end}' and p2.TYPE_ID = 100026  and i2.TYPE_ID != 100011
      and po2.number not like '%CLAIM%'
     ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
      gtl.itemId = i.ID and  gtl.stepId =102789   and gtl.ngayapdung <  p.CREATE_DATE
      order by gtl.createdAt desc) dongia
     from prod.PACKAGE p
     left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
      left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
     inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
      left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p.CREATE_DATE)  AND HS.FACTORY_ID = 102340 and HS.YEAR = DATEPART(YEAR, p.CREATE_DATE)
     inner join base.ITEM i on iip.ITEM_ID = i.ID
     left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
     inner join prod.PO on p.PO = po.code
     inner join base.MARKET m on po.root = m.CODE
     left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
     left join prod.PACKAGE p1 on qc.packageId = p1.ID
     left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
     left join prod.PO po1 on po1.code = p2.PO
     left join base.MARKET m1 on po1.root = m1.CODE
     where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
     GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
     
     left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
     --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
     where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102353  
     and i.ID not in (127279,127273,127270,127287,127288,127289,127284,127261,127367,127262,127264,127263,127265,127267
        ,127319,127345,127347,127322,127344,127329,127342,127346,127321,127336,127343,127325,127320,127326,127333,127330,126958 )  and i.TYPE_ID != 100011
  
    and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
      union all
      select i1.NAME paren,TY.NAME chungloai,CASE when i.TYPE_ID = 100011 then isnull(H.quantity*i.VOLUMN,0)*isnull(HS.HE_SO,1)
       else isnull(H.quantity*i.VOLUMN,0) end as loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, 
       CASE when i.TYPE_ID = 100011 then iip.QUANTITY*i.VOLUMN*isnull(HS.HE_SO,1) else iip.QUANTITY*i.VOLUMN end AS volumn, 
       'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102855 departmentId, N'2 LỰA PHÔI' groupName, 
       N'Lựa phôi' groupDepartment,  N'2.Tổ Lựa phôi X3' departmentName, N'[YS1-LPX3] 2.Tổ Lựa phôi X3' departmentName2,
      (
      select  SUM(iip2.QUANTITY*i2.VOLUMN)   from prod.PACKAGE p2 
      inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
      left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p2.CREATE_DATE)  AND HS.FACTORY_ID = 102340 and HS.YEAR = DATEPART(YEAR, p2.CREATE_DATE)
      inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
      inner join prod.PO po2 on p2.PO = po2.code
      inner join base.MARKET m2 on po2.root = m2.CODE
      where p2.SOURCE_ID =  p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
       and p2.CREATE_DATE between '${start}' and '${end}' and p2.TYPE_ID = 100026 and i2.TYPE_ID != 100011
       and po2.number not like '%CLAIM%'
      ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
       gtl.itemId = i.ID and  gtl.stepId =102855   and gtl.ngayapdung <  p.CREATE_DATE
       order by gtl.createdAt desc) dongia
      from prod.PACKAGE p
      left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
       left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
      inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
       left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p.CREATE_DATE)  AND HS.FACTORY_ID = 102340 and HS.YEAR = DATEPART(YEAR, p.CREATE_DATE)
      inner join base.ITEM i on iip.ITEM_ID = i.ID
      left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
      inner join prod.PO on p.PO = po.code
      inner join base.MARKET m on po.root = m.CODE
      left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
      left join prod.PACKAGE p1 on qc.packageId = p1.ID
      left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
      left join prod.PO po1 on po1.code = p2.PO
      left join base.MARKET m1 on po1.root = m1.CODE
      where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
      GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
      
      left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
      --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
      where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102353  
     and i.ID  in  (127279,127273,127270,127287,127288,127289,127284,127261,127367,127262,127264,127263,127265,127267
        ,127319,127345,127347,127322,127344,127329,127342,127346,127321,127336,127343,127325,127320,127326,127333,127330,126958 ) and i.TYPE_ID != 100011
    and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
    union all
    select i1.NAME paren,TY.NAME chungloai,CASE when i.ID in (127319,127320,127321,127322,127333,127323,127324,127325,127329,127336,127334,127335)
     then  isnull(H.quantity*i.VOLUMN,0)
     else isnull(H.quantity*i.VOLUMN,0)*isnull(HS.HE_SO,1) end as loi,i.CODE,i.LENGTH,i.WIDTH,i.HEIGHT, i.ID ,i.NAME, 
     CASE when i.ID in (127319,127320,127321,127322,127333,127323,127324,127325,127329,127336,127334,127335)
     then iip.QUANTITY*i.VOLUMN  else iip.QUANTITY*i.VOLUMN*isnull(HS.HE_SO,1) end AS volumn, 
     'week'+CONVERT(varchar,CASE when DATEPART(year, p.CREATE_DATE) <2023 then DATEPART(week, p.CREATE_DATE)-1 else DATEPART(week, p.CREATE_DATE) end) [week], 102855 departmentId, N'2 LỰA PHÔI' groupName, 
     N'Lựa phôi' groupDepartment,  N'2.Tổ Lựa phôi X3' departmentName, N'[YS1-LPX3] 2.Tổ Lựa phôi X3' departmentName2,
    (
    select CASE WHEN i2.ID in (127319,127320,127321,127322,127333,127323,127324,127325,127329,127336,127334,127335)
    then SUM(iip2.QUANTITY*i2.VOLUMN) else SUM(iip2.QUANTITY*i2.VOLUMN*isnull(HS.HE_SO,1)) END  from prod.PACKAGE p2 
    inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
    left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p2.CREATE_DATE) AND HS.YEAR = DATEPART(YEAR, p2.CREATE_DATE) AND HS.FACTORY_ID = 102340 and HS.YEAR = DATEPART(YEAR, p2.CREATE_DATE)
    inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
    inner join prod.PO po2 on p2.PO = po2.code
    inner join base.MARKET m2 on po2.root = m2.CODE
    where p2.SOURCE_ID =  p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
     and p2.CREATE_DATE between '${start}' and '${end}' and p2.TYPE_ID = 100026 and i2.TYPE_ID = 100011 and po2.number not like '%CLAIM%'
    GROUP BY i2.ID
    ) as total, (select TOP 1 gtl.dongia from [prod].[GIA_TINH_LUONG] gtl where 
     gtl.itemId = i.ID and  gtl.stepId =102855   and gtl.ngayapdung <  p.CREATE_DATE
     order by gtl.createdAt desc) dongia
    from prod.PACKAGE p
    left join base.DEPARTMENT d on p.SOURCE_ID = d.ID
     left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
     left join [prod].[HSLP] HS ON HS.MONTH = DATEPART(MONTH, p.CREATE_DATE) AND HS.FACTORY_ID = 102340 and HS.YEAR = DATEPART(YEAR, p.CREATE_DATE)
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    left  join base.ITEM_TYPE TY on i.TYPE_ID = TY.ID
    inner join prod.PO on p.PO = po.code
    inner join base.MARKET m on po.root = m.CODE
    left join (select qc.itemId,qc.stepId,SUM(qc.quantity) quantity,m1.PRODUCT_ID from prod.HandleQc qc
    left join prod.PACKAGE p1 on qc.packageId = p1.ID
    left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
    left join prod.PO po1 on po1.code = p2.PO
    left join base.MARKET m1 on po1.root = m1.CODE
    where qc.createdAt between '${start}' and '${end}' and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where CREATE_DATE between '${start}' and '${end}' and TYPE_ID <>100026 )
    GROUP BY qc.itemId,qc.stepId,m1.PRODUCT_ID) H on H.itemId = iip.ITEM_ID and p.SOURCE_ID = H.stepId and m.PRODUCT_ID = H.PRODUCT_ID
    
    left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
    --left join prod.GIA_TINH_LUONG gtl on i.ID = gtl.itemId and p.SOURCE_ID = gtl.stepId and m.PRODUCT_ID = gtl.parentId
    where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID = 102353  
   and i.ID  in  (127279,127273,127270,127287,127288,127289,127284,127261,127367,127262,127264,127263,127265,127267
    ,127319,127345,127347,127322,127344,127329,127342,127346,127321,127336,127343,127325,127320,127326,127333,127330,126958 ) and i.TYPE_ID = 100011
  and d.factoryId = ${factoryId} and po.number not like '%CLAIM%'
    ) AS BangNguon 
    PIVOT
    (
    SUM(volumn)
    FOR [week] IN (${strWeek})
    ) AS BangChuyen;
    `)

    res.status(200).send(data.recordset)
})
router.get("/tong-so-luong-loi", async (req, res) => {
    const { start, end, year } = req.query;
    let data = await new mssql.Request().query(`
    select *, soluong*VOLUMN tongKL from (
        select chitiet, departmentName, departmentName2, groupName, groupDepartment,
        LENGTH,WIDTH,HEIGHT,VOLUMN,sum(soluong) soluong,paren
        from [dbo].[View_so_luong_loi_cong_doan_2]
            where chitiet is not null and DATEPART(YEAR, createdAt) = ${year} and DATEPART(WEEK, createdAt) - 1 BETWEEN ${start} and ${end}
            group by chitiet,departmentName, departmentName2, groupName, groupDepartment,
            LENGTH,WIDTH,HEIGHT,VOLUMN,paren
            ) t
    `)

    res.status(200).send(data.recordset)
})

router.post("/chart-so-luong-loi", async (req, res) => {
    const { fromWeek, toWeek, year, arrDepartment  } = req.body;
    let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += "N'" + el + "', ";
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
    let data = await new mssql.Request().query(`
    select * from (
        select  code, 
        case when DATEPART(WEEK, createdAt) <11 then  N'Tuần 0'+ CONVERT(varchar, DATEPART(WEEK, createdAt)-1)  
        else N'Tuần '+ CONVERT(varchar, DATEPART(WEEK, createdAt) -1) end donvi, VOLUMN*soluong  VOLUMN
    from [dbo].[View_so_luong_loi_cong_doan_2]
        where chitiet is not null and DATEPART(YEAR, createdAt) = ${year} and DATEPART(WEEK, createdAt) - 1 BETWEEN ${fromWeek} and ${toWeek} and departmentName in (${strDepartment})
        ) AS BangNguon
        PIVOT
(
SUM(VOLUMN)
FOR code IN ([sayPhoi], [luaPhoi], [soChe], [tinhChe], [hoanThienMoc], [hoanThien], [dongGoi])
) AS BangChuyen
order by donvi;
    `)

    res.status(200).send(data.recordset)
})
router.get("/tong-khoi-luong-lo-say", async (req, res) => {
    const { start, end, strWeek } = req.query;
    let data = await new mssql.Request().query(`
    SELECT * FROM (
        SELECT 
            null toncong,CASE when KB.TYPE in (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') then 'SL' 
            when KB.TYPE = 'INDOOR' then 'ID'
            else 'OD' END as MD, K.FACTORY_ID,
            K.NAME N'Lò',K.ID,
            IIP.ITEM_ID N'Mã',
            CONCAT(CAST(I.LENGTH AS FLOAT),'x', CAST(I.HEIGHT AS FLOAT),'x',CAST(I.WIDTH AS FLOAT)) N'Quy cách', 
            I.LENGTH length, I.HEIGHT height, I.WIDTH width, KB.CREATE_DATE CREATE_DATE, KB.EXPORT_DATE,
            CASE when K.FACTORY_ID = 100000 and I.HEIGHT = 14 then 106000
            when K.FACTORY_ID = 100000 and I.HEIGHT != 14 then 108000
            when  K.FACTORY_ID != 100000 and I.HEIGHT = 14 then 84800
            else 86400 end as dongia,
            CASE when K.FACTORY_ID = 100000 and I.HEIGHT = 14 then ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)*106000
            When K.FACTORY_ID = 100000 and I.HEIGHT != 14 then ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)*108000
            when K.FACTORY_ID != 100000 and I.HEIGHT = 14 then ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)*84800
            else ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)*86400 end as thanhtien,
            CASE 
            WHEN KB.TYPE IN (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') AND K.FACTORY_ID != 100000 THEN DATEADD(DAY, 3, KB.CREATE_DATE)
            ELSE DATEADD(DAY, KB.TIME_OUT_TARGET, KB.CREATE_DATE)
            END AS 'du_kien_ra_lo',
            I.[NAME] N'Chi tiết/cụm',
            I.VOLUMN N'Khối lượng',
            I.CODE,
            SUM(IIP.QUANTITY) N'Số lượng',
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
            WHERE KB.STATUS = 'finish' 
            
            GROUP BY KB.ID,
            K.NAME,
            I.LENGTH,
            I.WIDTH,
            I.HEIGHT,
            IIP.ITEM_ID,
            I.CODE,
            KB.NUMBER,
            KB.WEEK,
            KB.[YEAR],
            I.[NAME],
            I.VOLUMN,
            KB.STATUS,
            KB.CREATE_DATE,
            KB.EXPORT_DATE,
            KB.TYPE,
            K.ID,
            K.FACTORY_ID,
            TIME_OUT_TARGET
        ) TEMP
        WHERE EXPORT_DATE BETWEEN '${start}' and '${end}'
    `)

    res.status(200).send(data.recordset)
})
router.post("/khoi-luong-lo-say-ngay", async (req, res) => {
    let query = "";
    if(req.body.departmentId == 102299){
        query = `
        SELECT CONVERT(nvarchar, GD.[ORDER]) + ' '+ UPPER(GD.NAME) groupName,
        GD.NAME groupDepartment,
        S.DESTINATION_ID departmentId,
        D.NAME departmentName,
        D.CODE + ' '+ D.NAME departmentName2,
        CONCAT(CAST(I.LENGTH AS FLOAT),'x', CAST(I.HEIGHT AS FLOAT),'x',CAST(I.WIDTH AS FLOAT)) quycach,
        I.LENGTH length, I.HEIGHT height, I.WIDTH width,
        S.EXPORT_DATE, I.[NAME] chitiet,
        I.VOLUMN kl,
        I.CODE, S.sl , S.tongkl
        FROM [View_san_luong_say] S
        INNER JOIN base.DEPARTMENT D ON S.DESTINATION_ID = D.ID
        INNER JOIN prod.GROUP_DEPARTMENT GD ON D.ID = GD.DEPARTMENT_ID
        INNER JOIN base.ITEM I ON S.ITEM_ID = I.ID
        WHERE S.EXPORT_DATE BETWEEN '${req.body.fromDate}' AND '${req.body.toDate}'
        `
    }else{
        let strDepartment = "";
        req.body.arrDepartment.forEach(el => {
            strDepartment += el + ", ";
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
        SELECT CONVERT(nvarchar, GD.[ORDER]) + ' '+ UPPER(GD.NAME) groupName,
        GD.NAME groupDepartment,
        S.DESTINATION_ID departmentId,
        D.NAME departmentName,
        D.CODE + ' '+ D.NAME departmentName2,
        CONCAT(CAST(I.LENGTH AS FLOAT),'x', CAST(I.HEIGHT AS FLOAT),'x',CAST(I.WIDTH AS FLOAT)) quycach,
        I.LENGTH length, I.HEIGHT height, I.WIDTH width,
        S.EXPORT_DATE, I.[NAME] chitiet,
        I.VOLUMN kl,
        I.CODE, S.sl , S.tongkl
        FROM [View_san_luong_say] S
        INNER JOIN base.DEPARTMENT D ON S.DESTINATION_ID = D.ID
        INNER JOIN prod.GROUP_DEPARTMENT GD ON D.ID = GD.DEPARTMENT_ID
        INNER JOIN base.ITEM I ON S.ITEM_ID = I.ID
        WHERE S.EXPORT_DATE BETWEEN '${req.body.fromDate}' AND '${req.body.toDate}'
        AND S.DESTINATION_ID IN (${strDepartment});
        `
    }
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.get("/khoi-luong-lo-say", async (req, res) => {
    const { start, end, strWeek } = req.query;
    let data = await new mssql.Request().query(`
    SELECT * FROM (
        SELECT 
            null toncong,
            K.NAME N'Lò',K.ID,
            IIP.ITEM_ID N'Mã',
            CONCAT(CAST(I.LENGTH AS FLOAT),'x', CAST(I.HEIGHT AS FLOAT),'x',CAST(I.WIDTH AS FLOAT)) N'Quy cách', 
            I.LENGTH length, I.HEIGHT height, I.WIDTH width, KB.CREATE_DATE CREATE_DATE, KB.EXPORT_DATE,
            CASE when K.FACTORY_ID = 100000 and I.HEIGHT = 14 then 106000
            when K.FACTORY_ID = 100000 and I.HEIGHT != 14 then 108000
            when  K.FACTORY_ID != 100000 and I.HEIGHT = 14 then 84800
            else 86400 end as dongia,
            CASE when K.FACTORY_ID = 100000 and I.HEIGHT = 14 then ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)*106000
            When K.FACTORY_ID = 100000 and I.HEIGHT != 14 then ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)*108000
            when K.FACTORY_ID != 100000 and I.HEIGHT = 14 then ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)*84800
            else ROUND(SUM(IIP.QUANTITY) * I.VOLUMN,4)*86400 end as thanhtien,
            CASE 
            WHEN KB.TYPE IN (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') AND K.FACTORY_ID != 100000 THEN DATEADD(DAY, 3, KB.CREATE_DATE)
            ELSE DATEADD(DAY, KB.TIME_OUT_TARGET, KB.CREATE_DATE)
            END AS 'du_kien_ra_lo',
            I.[NAME] N'Chi tiết/cụm',
            I.VOLUMN N'Khối lượng',
            I.CODE,
            SUM(IIP.QUANTITY) N'Số lượng',
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
            WHERE KB.STATUS = 'finish' and KB.TYPE not IN (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR')
           and PL.MODIFY_BY is not null and PL.MODIFY_DATE BETWEEN '${start}' and '${end}'
            GROUP BY KB.ID,
            K.NAME,
            I.LENGTH,
            I.WIDTH,
            I.HEIGHT,
            IIP.ITEM_ID,
            I.CODE,
            KB.NUMBER,
            KB.WEEK,
            KB.[YEAR],
            I.[NAME],
            I.VOLUMN,
            KB.STATUS,
            KB.CREATE_DATE,
            KB.EXPORT_DATE,
            KB.TYPE,
            K.ID,
            K.FACTORY_ID,
            TIME_OUT_TARGET
        ) TEMP
       -- WHERE EXPORT_DATE BETWEEN '${start}' and '${end}'
    `)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-theo-ngay-loi", async (req, res) => {
    let query = "";

        let strDepartment = "";
        req.body.arrDepartment.forEach(el => {
            strDepartment += el + ", "
        });
        strDepartment = strDepartment.substring(0, strDepartment.length-2);
        query = ` select H.*,isnull(loi,0) loi from
        (select S.itemId, S.itemName, S.departmentId, S.departmentName, S.departmentName2, S.groupName, S.groupDepartment, 
        S.LENGTH length, S.HEIGHT height, S.WIDTH width, S.VOLUMN,I.NAME sanPham, SUM(QUANTITY)  QUANTITY
        from View_SanLuong_tuan_thang S
        left join base.ITEM I on S.ID_SP = I.ID
        where 
        S.createDate between '${req.body.fromDate}' AND '${req.body.toDate}' 
        and departmentId in (${strDepartment}) and S.VERIFY_BY is not null
        GROUP BY S.itemId, S.itemName, S.departmentId, departmentName, departmentName2, groupName, groupDepartment, 
        S.LENGTH, S.HEIGHT, S.WIDTH, S.VOLUMN, I.NAME
		union all
		select itemId, itemName, departmentId, departmentName, departmentName2, groupName, groupDepartment, LENGTH, HEIGHT, WIDTH, VOLUMN, 
        null sanPham, sum(QUANTITY) QUANTITY
		from View_SanLuong_LuaPhoi
		where 
        createDate between '${req.body.fromDate}' AND '${req.body.toDate}' 
        and departmentId in (${strDepartment})
        GROUP BY itemId, itemName, departmentId, departmentName, departmentName2, groupName, groupDepartment, 
        LENGTH, HEIGHT, WIDTH, VOLUMN) H
        left join (select sum(quantity) loi,itemId,stepId from [prod].[HandleQc]
        where 
        createdAt between '${req.body.fromDate}' AND '${req.body.toDate}' 
        GROUP BY itemId,stepId) K on K.itemId = H.itemId and K.stepId = H.departmentId
        `
    

    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-theo-ngay", async (req, res) => {
    let query = "";
    if(req.body.departmentId == 102299){
        let strDepartment = "";
        req.body.arrDepartment.forEach(el => {
            strDepartment += "N'" +el + "', "
        });
        strDepartment = strDepartment.substring(0, strDepartment.length-2);
        query = `
        select itemId, itemName, departmentId, departmentName, departmentName2, groupName, groupDepartment, 
        LENGTH length, HEIGHT height, WIDTH width, VOLUMN, sanPham, SUM(QUANTITY) QUANTITY,ACCOUNTING_CODE
        from View_SanLuong_tuan_thang 
        where 
        createDate between '${req.body.fromDate}' AND '${req.body.toDate}' and groupDepartment in (${strDepartment}) and VERIFY_BY is not null
        GROUP BY itemId, itemName, departmentId, departmentName, departmentName2, groupName, groupDepartment, 
        LENGTH, HEIGHT, WIDTH, VOLUMN, sanPham,ACCOUNTING_CODE
		union all
		select itemId, itemName, departmentId, departmentName, departmentName2, groupName, groupDepartment, LENGTH, HEIGHT, WIDTH, VOLUMN, null sanPham, QUANTITY
        ,null ACCOUNTING_CODE
		from View_SanLuong_LuaPhoi
		where 
        createDate between '${req.body.fromDate}' AND '${req.body.toDate}' and groupDepartment in (${strDepartment})
        `;
    }else{
        let strDepartment = "";
        req.body.arrDepartment.forEach(el => {
            strDepartment += el + ", "
        });
        strDepartment = strDepartment.substring(0, strDepartment.length-2);
        query = `
        select itemId, itemName, departmentId, departmentName, departmentName2, groupName, groupDepartment, 
        LENGTH length, HEIGHT height, WIDTH width, VOLUMN, sanPham, SUM(QUANTITY)  QUANTITY,ACCOUNTING_CODE
        from View_SanLuong_tuan_thang 
        where 
        createDate between '${req.body.fromDate}' AND '${req.body.toDate}' 
        and departmentId in (${strDepartment}) and VERIFY_BY is not null
        GROUP BY itemId, itemName, departmentId, departmentName, departmentName2, groupName, groupDepartment, 
        LENGTH, HEIGHT, WIDTH, VOLUMN, sanPham,ACCOUNTING_CODE
		union all
		select itemId, itemName, departmentId, departmentName, departmentName2, groupName, groupDepartment, LENGTH, HEIGHT, WIDTH, VOLUMN, 
        null sanPham, QUANTITY,null ACCOUNTING_CODE
		from View_SanLuong_LuaPhoi
		where 
        createDate between '${req.body.fromDate}' AND '${req.body.toDate}' 
        and departmentId in (${strDepartment})
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/chart-san-luong-theo-ngay", async (req, res) => {
    let query = "";
    if(req.body.departmentId == 102299){
        let strDepartment = "";
        req.body.arrDepartment.forEach(el => {
            strDepartment += "N'" +el + "', "
        });
        strDepartment = strDepartment.substring(0, strDepartment.length-2);
        query = `
        select *, null congSuatNgay from (
            select CONVERT(varchar, createDate, 103) ngay, CONVERT(varchar, createDate, 102) ngay2, code, tongKL
                    from View_SanLuong_tuan_thang 
                    where 
                    createDate between '${req.body.fromDate}' AND '${req.body.toDate}' and groupDepartment in (${strDepartment}) and VERIFY_BY is not null
                    union all
                    select CONVERT(varchar, createDate, 103) ngay, CONVERT(varchar, createDate, 102) ngay2, code, QUANTITY*VOLUMN tongKL
                    from View_SanLuong_LuaPhoi
                    where 
                    createDate between '${req.body.fromDate}' AND '${req.body.toDate}' and groupDepartment in (${strDepartment})
                    )AS BangNguon
                    PIVOT
            (
            SUM(tongKL)
            FOR code IN ([sayPhoi], [luaPhoi], [soChe], [tinhChe], [hoanThienMoc], [hoanThien], [dongGoi])
            ) AS BangChuyen
            order by ngay2;
        `;
    }else{
        let strDepartment = "";
        req.body.arrDepartment.forEach(el => {
            strDepartment += el + ", "
        });
        strDepartment = strDepartment.substring(0, strDepartment.length-2);
        if(req.body.arrDepartment.length == 1){
            query = `
            select * from (
               select N.ngay,N.ngay2,code,tongKL, congSuatNgay from
               (select CONCAT(DATEPART(day,[DATE]),'/',DATEPART(month,[DATE])) ngay,
                CONVERT(varchar, [DATE], 103) ngay1,CONVERT(varchar, [DATE], 102) ngay2 from [base].[GLOBAL_DATE]
             where  [DATE]  between '${req.body.fromDate}' AND '${req.body.toDate}' ) N
             left join
                (select CONVERT(varchar, createDate, 103) ngay, CONVERT(varchar, createDate, 102) ngay2, code, tongKL, congSuatNgay
                        from View_SanLuong_tuan_thang 
                        where 
                        createDate between '${req.body.fromDate}' AND '${req.body.toDate}' 
                        and departmentId in (${strDepartment}) and VERIFY_BY is not null) B on N.ngay1 = B.ngay
                        
                        union all 
                        select N.ngay,N.ngay2,code,tongKL, congSuatNgay from
                        (select CONCAT(DATEPART(day,[DATE]),'/',DATEPART(month,[DATE])) ngay,
                        CONVERT(varchar, [DATE], 103) ngay1,CONVERT(varchar, [DATE], 102) ngay2 from [base].[GLOBAL_DATE]
                     where  [DATE]  between '${req.body.fromDate}' AND '${req.body.toDate}' ) N
                     left join
                        (select CONVERT(varchar, createDate, 103) ngay, CONVERT(varchar, createDate, 102) ngay2, code, QUANTITY*VOLUMN tongKL, congSuatNgay
                        from View_SanLuong_LuaPhoi
                        where 
                        createDate between '${req.body.fromDate}' AND '${req.body.toDate}' 
                        and departmentId in (${strDepartment}) ) H on N.ngay1= H.ngay
                        )AS BangNguon
                        PIVOT
                (
                SUM(tongKL)
                FOR code IN ([sayPhoi], [luaPhoi], [soChe], [tinhChe], [hoanThienMoc], [hoanThien], [dongGoi])
                ) AS BangChuyen
                order by ngay2;
        `
        }else{
            query = `
        select *, null congSuatNgay from (
            select N.ngay,N.ngay2,code,tongKL from
            (select CONCAT(DATEPART(day,[DATE]),'/',DATEPART(month,[DATE])) ngay,
                CONVERT(varchar, [DATE], 103) ngay1,CONVERT(varchar, [DATE], 102) ngay2 from [base].[GLOBAL_DATE]
          where  [DATE]  between '${req.body.fromDate}' AND '${req.body.toDate}' ) N
          left join
            (select CONVERT(varchar, createDate, 103) ngay, CONVERT(varchar, createDate, 102) ngay2, code, tongKL
                    from View_SanLuong_tuan_thang 
                    where 
                    createDate between '${req.body.fromDate}' AND '${req.body.toDate}' 
                    and departmentId in (${strDepartment}) and VERIFY_BY is not null) B on N.ngay1 = B.ngay
                    union all
                    select N.ngay,N.ngay2,code,tongKL from
                    (select CONCAT(DATEPART(day,[DATE]),'/',DATEPART(month,[DATE])) ngay,
                        CONVERT(varchar, [DATE], 103) ngay1,CONVERT(varchar, [DATE], 102) ngay2 from [base].[GLOBAL_DATE]
                  where  [DATE]  between '${req.body.fromDate}' AND '${req.body.toDate}' ) N
                  left join
                    (select CONVERT(varchar, createDate, 103) ngay, CONVERT(varchar, createDate, 102) ngay2, code, QUANTITY*VOLUMN tongKL
                    from View_SanLuong_LuaPhoi
                    where 
                    createDate between '${req.body.fromDate}' AND '${req.body.toDate}' 
                    and departmentId in (${strDepartment})) H on N.ngay1 = H.ngay
                    )AS BangNguon
                    PIVOT
            (
            SUM(tongKL)
            FOR code IN ([sayPhoi], [luaPhoi], [soChe], [tinhChe], [hoanThienMoc], [hoanThien], [dongGoi])
            ) AS BangChuyen
            order by ngay2;
        `
        }
        
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/delete-phoi-in-package", async (req, res) => {
    if (req.body.bang == 1) {
    const { recordset } = await new mssql.Request()
        .input("id", req.body.packageId)
        .query(`
        DELETE FROM prod.PACKAGE WHERE ID = @id
    `)
    
    res.api.sendData(recordset)
    }
    if (req.body.bang == 2) {
        const { recordset } = await new mssql.Request()
            .input("id", req.body.packageId)
            .query(`
            DELETE FROM prod.XUAT_GO_BAO WHERE ID = @id
        `)
        
        res.api.sendData(recordset)
        }
});
router.post("/san-luong-theo-tuan-sl", async (req, res) => {
    const { strWeek , year, arrDepartment, departmentId } = req.body;
    let query = "";
    if(departmentId == 102299){
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
		(
		select SUM(QUANTITY) from View_SanLuong_tuan_thang v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and VOLUMN != 1
		) total
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR,v1. createDate) = ${year}
		union all
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
		(
		select SUM(QUANTITY) from View_SanLuong_LuaPhoi v2 where v2.itemId = v1.itemId and v2.sanPham = v1.sanPham
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and VOLUMN != 1
		) total
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR,v1. createDate) = ${year}
		union all
		select null sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
        (select SUM(QUANTITY) from View_SanLuong_All v2
        where DATEPART(YEAR, createDate) = ${year}
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        ) total
        from View_SanLuong_All v1
        where DATEPART(YEAR, createDate) = ${year}
        ) AS BangNguon
        PIVOT
        (
        SUM(QUANTITY)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    }else{
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += el + ', ';
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `

        select *
        from
        (
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY,
        case when DATEPART(YEAR,createDate) <2023 then
        case when DATEPART(WEEKDAY,createDate) = 1
        then 'week'+CONVERT(varchar, DATEPART(week, createDate)-2) else 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) end 
        else case when DATEPART(WEEKDAY,createDate) = 1
        then 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) else 'week'+CONVERT(varchar, DATEPART(week, createDate)) end end
        as [week],
		(
		select SUM(QUANTITY) from View_SanLuong_tuan_thang v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and v2.sanPham = v1.sanPham
        and v2.departmentId in (${strDepartment}) and VOLUMN != 1
		) total
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
		union all
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
		(
		select SUM(QUANTITY) from View_SanLuong_LuaPhoi v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment}) and VOLUMN != 1
		) total
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
		union all
		select null sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
        (select SUM(QUANTITY) from View_SanLuong_All v2
        where DATEPART(YEAR, createDate) = ${year}
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment})
        ) total
        from View_SanLuong_All v1
        where DATEPART(YEAR, createDate) = ${year} and departmentId in (${strDepartment})

        ) AS BangNguon
        PIVOT
        (
        SUM(QUANTITY)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-theo-thang-m3-qui-doi", async (req, res) => {
    const { strWeek , year, arrDepartment, departmentId } = req.body;
    let condition = ` AND  factoryIdcd =${departmentId}`
if (departmentId == 102299) condition = ``
else condition = ` AND  factoryIdcd =${departmentId}`
        query = `
        select *
        from
        (
            select sanPham,kl,ROUND(volumn,2)*(case when ID_SP in (129576,129236) and groupDepartment = N'Hoàn thiện' and factoryIdcd = 102340 then 100 
            when ID_SP in (129576) and groupDepartment = N'Tinh chế' and factoryIdcd = 102340 then 100 
            when ID_SP in (118535) and groupDepartment = N'Tinh chế' and factoryIdcd = 102366 then 18.53
            when ID_SP in (118535) and groupDepartment = N'Tinh chế' and factoryIdcd = 100000 then 7.94
            when ID_SP in (118567) and groupDepartment = N'Tinh chế' and factoryIdcd = 102366 then 18.53
            when ID_SP in (118567) and groupDepartment = N'Tinh chế' and factoryIdcd = 100000 then 7.94
            when ID_SP in (118595) and groupDepartment = N'Tinh chế' and factoryIdcd = 102366 then 7.94
            when ID_SP in (118595) and groupDepartment = N'Tinh chế' and factoryIdcd = 100000 then 18.53
             else isnull(TYLE,0) END)*isnull(PUA,0)*tigia/(kl*100)  as volumn,[thang],groupDepartment,groupName,ID_SP,factoryIdcd from (
                select I.NAME sanPham,CASE WHEN ID_SP in (128390,125774,126737) then 0.00324 when ID_SP in (118556) then 0.005497
                when ID_SP in (118563) then 0.00661752
            else    I.VOLUMN end as kl, K.code,groupName, groupDepartment, [thang],sum(K.volumn) volumn,
             TYLE, PUA,
            TY_GIA_USD  tigia,ID_SP,factoryIdcd from (
                        select code,CASE WHEN itemId in (129233,129235,129688) and factoryIdcd = 100000 then itemId else 
                        ID_SP end as ID_SP, itemId, itemName, LENGTH, WIDTH, HEIGHT, PUA,TYLE,TY_GIA_USD,
                        groupName, groupDepartment, 
                        (QUANTITY-loi)*VOLUMN volumn, 'thang'+CONVERT(varchar,thang) [thang],thang month,
                        factoryIdcd
                        from View_slqd_thang v1
                        where nam = ${year} ${condition} and v1.departmentId not in (102632,102529,102787,102788)  
                     --   and   itemId not in (129233,129688,129235,129601,129600,129235,129236,129576)
                      --  and ID_SP not in (129233,129688,129235,129601,129600,129235,129236,129576)
                        union all
                        select code,CASE WHEN itemId in (129233,129235,129688) then itemId else 
                        ID_SP end as ID_SP, itemId, itemName, LENGTH, WIDTH, HEIGHT, PUA,TYLE,TY_GIA_USD,
                        groupName, groupDepartment, 
                        (QUANTITY-loi)*VOLUMN volumn, 'thang'+CONVERT(varchar, thang) [thang],thang month,
                      factoryIdcd
                        from View_slqd_luaphoi v1
                        where nam = ${year} ${condition} 
                        --and itemId not in (129233,129688,129235,129601,129600,129235,129236,129576)
                       --and ID_SP not in (129233,129688,129235,129601,129600,129235,129236,129576)
                      ) K
                      
                        left join base.ITEM I on I.ID = K.ID_SP
                       where I.NAME is not null
                        GROUP BY TYLE, PUA,TY_GIA_USD,I.NAME,I.VOLUMN, K.code,groupName, groupDepartment, [thang],month,ID_SP,factoryIdcd) K1
                        union all
                        select sanPham,1 kl, SUM(volumn*dongia)  as volumn,[thang],groupDepartment,groupName,ID_SP,factoryIdcd from (
                           
                                    select 'QC' sanPham,null code,null ID_SP, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
                                    departmentId, departmentName, departmentName2, groupName, groupDepartment,
                                    tongkl volumn, 'thang'+CONVERT(varchar, DATEPART(month, createDate)) [thang],factoryIdcd,
                                    CASE when factoryIdcd = 100000 then
                                    isnull((select TOP 1 dongia from [prod].[GIA_TINH_LUONG] G
                                        where G.stepId = 1 and G.factoryId = 100000 and  G.ngayapdung <= createDate
                                        order by G.createdAt desc ),0) 
                                        else isnull((select TOP 1 dongia from [prod].[GIA_TINH_LUONG] G
                                            where G.stepId = 1 and G.factoryId = 102340 and  G.ngayapdung <= createDate
                                            order by G.createdAt desc ),0)  end as dongia,
                                    (select SUM(tongkl) from View_SanLuong_All v2
                                    where DATEPART(YEAR, createDate) = ${year}
                                    and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
                                    and v2.departmentId = v1.departmentId ${condition}
                                    ) total
                                    from View_SanLuong_All v1
                                    where DATEPART(YEAR, createDate) =  ${year} ${condition}
                                  ) K
                                
                           
                                    GROUP BY sanPham,[thang],groupDepartment,groupName,factoryIdcd,ID_SP
        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR thang IN ([thang1],[thang2],[thang3],[thang4],[thang5],[thang6],[thang7],[thang8],[thang9],[thang10],[thang11],[thang12])
        ) AS BangChuyen;
        `
    
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-theo-tuan-m3-qui-doi", async (req, res) => {
    const { strWeek , year, arrDepartment, departmentId } = req.body;
    let condition = ` AND  factoryIdcd =${departmentId}`
if (departmentId == 102299) condition = ``
else condition = ` AND  factoryIdcd =${departmentId}`
        query = `
        select *
        from
        (
            select sanPham,kl,volumn*(case when ID_SP in (129576,129236) and groupDepartment = N'Hoàn thiện' and factoryIdcd = 102340 then 100 
            when ID_SP in (129576) and groupDepartment = N'Tinh chế' and factoryIdcd = 102340 then 100 
            when ID_SP in (118535) and groupDepartment = N'Tinh chế' and factoryIdcd = 102366 then 18.53
            when ID_SP in (118535) and groupDepartment = N'Tinh chế' and factoryIdcd = 100000 then 7.94
            when ID_SP in (118567) and groupDepartment = N'Tinh chế' and factoryIdcd = 102366 then 18.53
            when ID_SP in (118567) and groupDepartment = N'Tinh chế' and factoryIdcd = 100000 then 7.94
            when ID_SP in (118595) and groupDepartment = N'Tinh chế' and factoryIdcd = 102366 then 7.94
            when ID_SP in (118595) and groupDepartment = N'Tinh chế' and factoryIdcd = 100000 then 18.53
             else isnull(TYLE,0) END)*isnull(PUA,0)*tigia/(kl*100)  as volumn,[week],groupDepartment,groupName,ID_SP,factoryIdcd from (
                select I.NAME sanPham,CASE WHEN  ID_SP in (128390,125774) then 0.00324 when ID_SP in (118556) then 0.005497
                when ID_SP in (118563) then 0.00661752
            else    I.VOLUMN end as kl, K.code,groupName, groupDepartment, [week],sum(K.volumn) volumn,
             TYLE,PUA,
          TY_GIA_USD tigia,ID_SP,factoryIdcd from (
                        select factoryIdcd,code,CASE WHEN itemId in (129233,129235,129688) and factoryIdcd = 100000  then itemId else 
                        ID_SP end as ID_SP, itemId, itemName, LENGTH, WIDTH, HEIGHT,  TYLE,PUA,TY_GIA_USD,
                        departmentId, departmentName, departmentName2, groupName, groupDepartment, 
                        (QUANTITY-loi)*VOLUMN volumn, 'week'+CONVERT(varchar, tuan-1) [week],tuan,
                        (
                        select SUM((QUANTITY-loi)*VOLUMN) from View_slqd_tuan v2 where v2.itemId = v1.itemId 
                        and  nam = ${year} and v2.departmentId = v1.departmentId ${condition}
                        ) total
                        from View_slqd_tuan v1
                        where nam = ${year} and v1.departmentId not in (102632,102529,102787,102788) ${condition} 
                       -- and itemId not in (129233,129688,129235,129601,129600,129235,129236,129576) 
                      --  and ID_SP not in (129233,129688,129235,129601,129600,129235,129236,129576)
                        union all
                        select factoryIdcd,code,CASE WHEN itemId in (129233,129235,129688) then itemId else 
                        ID_SP end as ID_SP, itemId, itemName, LENGTH, WIDTH, HEIGHT,  TYLE,PUA,TY_GIA_USD,
                        departmentId, departmentName, departmentName2, groupName, groupDepartment, 
                        (QUANTITY-loi)*VOLUMN volumn, 'week'+CONVERT(varchar,tuan-1) [week],tuan,
                        (
                        select SUM(QUANTITY*VOLUMN) from View_slqd_luaphoi_tuan v2 where v2.itemId = v1.itemId 
                        and  nam = ${year} and v2.departmentId = v1.departmentId ${condition}
                        ) total
                        from View_slqd_luaphoi_tuan v1
                        where nam = ${year} ${condition}
                        -- and itemId not in (129233,129688,129235,129601,129600,129235,129236,129576)
                        -- and ID_SP not in (129233,129688,129235,129601,129600,129235,129236,129576)
                      ) K
                        
                        left join base.ITEM I on I.ID = K.ID_SP
                        where I.NAME is not null
                        GROUP BY TYLE,PUA,TY_GIA_USD,I.NAME,I.VOLUMN, K.code,groupName, groupDepartment, [week],tuan,ID_SP,factoryIdcd) K1
                        union all
                        select sanPham,1 kl,SUM(volumn*dongia) as volumn,[week],groupDepartment,groupName,ID_SP,factoryIdcd from (
                           
                                    select 'QC' sanPham,null code,null ID_SP, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
                                    departmentId, departmentName, departmentName2, groupName, groupDepartment,
                                    tongkl volumn, 'week'+CONVERT(varchar,CASE when DATEPART(year, createDate) <2023
                                    then DATEPART(week, createDate)-1 else DATEPART(week, createDate) end)   [week],factoryIdcd,
                                    CASE when factoryIdcd = 100000 then
                                    isnull((select TOP 1 dongia from [prod].[GIA_TINH_LUONG] G
                                        where G.stepId = 1 and G.factoryId = 100000 and  G.ngayapdung <= createDate
                                        order by G.createdAt desc ),0) 
                                        else isnull((select TOP 1 dongia from [prod].[GIA_TINH_LUONG] G
                                            where G.stepId = 1 and G.factoryId = 102340 and  G.ngayapdung <= createDate
                                            order by G.createdAt desc ),0)  end as dongia,
                                    (select SUM(tongkl) from View_SanLuong_All v2
                                    where DATEPART(YEAR, createDate) = ${year}
                                    and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
                                    and v2.departmentId = v1.departmentId ${condition}
                                    ) total
                                    from View_SanLuong_All v1
                                    where DATEPART(YEAR, createDate) =  ${year} ${condition}
                                  ) K
                                
                           
                                    GROUP BY sanPham,[week],groupDepartment,groupName,factoryIdcd,ID_SP
                        
                       


        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-quy-doi-tung-nha-may", async (req, res) => {
    const { strWeek , year, } = req.body;
        query = `
        select *
        from
        (
            select volumn*TYLE*PUA*tigia/(kl*100) volumn,[week],
			case when factoryIdcd = 100000 then N'Thuận Hưng' when factoryIdcd = 102340 then N'Yên Sơn 1' when factoryIdcd = 102366 then N'Thái Bình'  end factory from (
                select I.NAME sanPham,CASE WHEN ID_SP in (119952,119953) then 0.1310 when ID_SP in (128390,125774) then 0.00324 when ID_SP in (118556) then 0.005497
                when ID_SP in (118563) then 0.00661752
                when ID_SP in (119954,119955) then 0.0741 when ID_SP in (122631,122632) then 0.1065 when ID_SP in (122644,122645) then 0.0603
            else    I.VOLUMN end as kl, K.code,groupName, groupDepartment, [week],sum(K.volumn) volumn,TYLE,PUA,(select TOP 1 TY_GIA_USD from prod.TY_GIA_USD order by CREATED_AT desc) tigia, factoryIdcd from (
                        select sanPham,code,CASE WHEN itemId IN (129233, 129235, 129688) THEN itemId ELSE ID_SP END ID_SP, itemId, itemName, LENGTH, WIDTH, HEIGHT, 
                        departmentId, departmentName, departmentName2, groupName, groupDepartment, 
                        ISNULL((SELECT  TOP (1) TYLE   FROM prod.TYLE_SL_QUIDOI AS SL
                        WHERE (SL.CODE = N'dongGoi') AND (ITEM_ID = (CASE WHEN itemId IN (129233, 129235, 129688) THEN itemId ELSE ID_SP END)) AND (NgayapdungTLCD <= v1.createDate) 
                        AND (TYLE IS NOT NULL)
                        ORDER BY CREATE_DATE DESC), 0)  AS TYLE,
                        ISNULL((SELECT  TOP (1) PUA   FROM prod.TYLE_SL_QUIDOI AS SL
                        WHERE (SL.CODE = N'dongGoi') AND (ITEM_ID = (CASE WHEN itemId IN (129233, 129235, 129688) THEN itemId ELSE ID_SP END)) AND (NgayapdungPUA  <= v1.createDate) 
                        AND (PUA IS NOT NULL)
                        ORDER BY CREATE_DATE DESC), 0)  AS PUA,
                        QUANTITY*VOLUMN volumn, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
                       v1.factoryIdcd
                        from View_SanLuong_tuan_thang v1
                        where DATEPART(YEAR,v1. createDate) = ${year} and v1.factoryIdcd != 102427 and code = N'dongGoi'
               
                      ) K
                     
                        left join base.ITEM I on I.ID = K.ID_SP
                        where sanPham is not null
                        GROUP BY I.NAME,I.VOLUMN,ID_SP, K.code,groupName, groupDepartment, [week],TYLE,PUA, factoryIdcd) H

        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})

router.post("/bieu-do-san-luong-quy-doi-tung-nha-may", async (req, res) => {
    const { strWeek , year } = req.body;
        query = `
        select *
        from
        (
            select DISTINCT null volumn,case when WEEK < 10
    then 'w0' + WEEK
    else  'w' + WEEK  end [week], null factoryId  from [base].[GLOBAL_DATE] where YEAR = ${year}
		union all
            select volumn*TYLE*PUA*tigia/(kl*1000000000) volumn,[week],
			factoryId from (
                select I.NAME sanPham,I.VOLUMN kl, K.code,groupName, groupDepartment, [week],sum(K.volumn) volumn,SL.TYLE,SL.PUA,(select TOP 1 TY_GIA_USD from prod.TY_GIA_USD order by CREATED_AT desc) tigia, factoryId from (
                        select sanPham,code,ID_SP, itemId, itemName, LENGTH, WIDTH, HEIGHT, 
                        departmentId, departmentName, departmentName2, groupName, groupDepartment, 
                        QUANTITY*VOLUMN volumn, case when CONVERT(varchar, DATEPART(week, createDate)-1) < 10 then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1) else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1) end  [week],
                        (
                        select SUM(QUANTITY*VOLUMN) from View_SanLuong_tuan_thang v2 where v2.itemId = v1.itemId 
                        and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId 
                        ) total, v1.factoryId
                        from View_SanLuong_tuan_thang v1
                        where DATEPART(YEAR,v1. createDate) = ${year} and groupDepartment = N'Đóng gói'
                        union all
                        select sanPham,code,ID_SP, itemId, itemName, LENGTH, WIDTH, HEIGHT, 
                        departmentId, departmentName, departmentName2, groupName, groupDepartment, 
                        QUANTITY*VOLUMN volumn, case when CONVERT(varchar, DATEPART(week, createDate)-1) < 10 then 'w0'+CONVERT(varchar, DATEPART(week, createDate)-1) else 'w'+CONVERT(varchar, DATEPART(week, createDate)-1) end  [week],
                        (
                        select SUM(QUANTITY*VOLUMN) from View_SanLuong_LuaPhoi v2 where v2.itemId = v1.itemId 
                        and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId 
                        ) total, v1.factoryId
                        from View_SanLuong_LuaPhoi v1
                        where DATEPART(YEAR,v1. createDate) = ${year} and groupDepartment = N'Đóng gói'
                      ) K
                        inner join [prod].[TYLE_SL_QUIDOI] SL on K.code = SL.CODE and SL.ITEM_ID = K.ID_SP
                        left join base.ITEM I on I.ID = K.ID_SP
                        where sanPham is not null
                        GROUP BY I.NAME,I.VOLUMN, K.code,groupName, groupDepartment, [week],SL.TYLE,SL.PUA, factoryId) H

        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR factoryId IN ([100000], [100004], [100005])
        ) AS BangChuyen;
        `
    
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-theo-tuan-m3", async (req, res) => {
    const { strWeek , year, arrDepartment, departmentId } = req.body;
    let query = "";
    if(departmentId == 102299){
        let strDepartment = "";
        req.body.arrDepartment.forEach(el => {
            strDepartment += "N'" +el + "', "
        });
        strDepartment = strDepartment.substring(0, strDepartment.length-2);
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn,CASE when DATEPART(YEAR,createDate) <2023 then case when DATEPART(WEEKDAY,createDate) = 1
        then 'week'+CONVERT(varchar, DATEPART(week, createDate)-2) else 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) end 
        else case when DATEPART(WEEKDAY,createDate) = 1
        then 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) else 'week'+CONVERT(varchar, DATEPART(week, createDate)) end end
        as [week],
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong_tuan_thang v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and v2.sanPham = v1.sanPham
		) total
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR,v1. createDate) = ${year} and groupDepartment in (${strDepartment})
		union all
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong_LuaPhoi v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and v2.sanPham = v1.sanPham
		) total
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR,v1. createDate) = ${year} and groupDepartment in (${strDepartment})
		union all
		select null sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY*volumn volumn, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
        (select SUM(QUANTITY*volumn) from View_SanLuong_All v2
        where DATEPART(YEAR, createDate) = ${year}
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        ) total
        from View_SanLuong_All v1
        where DATEPART(YEAR, createDate) = ${year} and groupDepartment in (${strDepartment})

        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    }else{
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += el + ', ';
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn,CASE when DATEPART(YEAR,createDate) <2023 then case when DATEPART(WEEKDAY,createDate) = 1
        then 'week'+CONVERT(varchar, DATEPART(week, createDate)-2) else 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) end 
        else case when DATEPART(WEEKDAY,createDate) = 1
        then 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) else 'week'+CONVERT(varchar, DATEPART(week, createDate)) end end
        as [week],
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong_tuan_thang v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and v2.sanPham = v1.sanPham
        and v2.departmentId in (${strDepartment})
		) total
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
		union all
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong_LuaPhoi v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and v2.sanPham = v1.sanPham
        and v2.departmentId in (${strDepartment})
		) total
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
		union all
		select null sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY*VOLUMN volumn, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
        (select SUM(QUANTITY*VOLUMN) from View_SanLuong_All v2
        where DATEPART(YEAR, createDate) = ${year}
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment})
        ) total
        from View_SanLuong_All v1
        where DATEPART(YEAR, createDate) = ${year} and departmentId in (${strDepartment})

        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    }
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.get("/san-luong-theo-thang-sl", async (req, res) => {
    const { start, end, strWeek } = req.query;
    let data = await new mssql.Request().query(`
    SELECT *
    FROM
    (
    select i1.NAME paren , i.ID ,i.NAME, i.HEIGHT, i.WIDTH, i.LENGTH, i.ACCOUNTING_CODE, case when i.VOLUMN = 1 then 0 else iip.QUANTITY end QUANTITY, gd.[ORDER], convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,  'week'+CONVERT(varchar, DATEPART(week, p.CREATE_DATE)-1) [week], p.SOURCE_ID departmentId,
	(
	select SUM(iip2.QUANTITY) from prod.PACKAGE p2 
	inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
    inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
	inner join prod.PO po2 on p2.PO = po2.code
	inner join base.MARKET m2 on po2.root = m2.CODE
	where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
    and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and i2.VOLUMN != 1
	) as total
    from prod.PACKAGE p
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    inner join prod.PO on p.PO = po.code
	inner join base.MARKET m on po.root = m.CODE
	left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
	inner join base.DEPARTMENT d on d.ID = p.SOURCE_ID
	inner join prod.GROUP_DEPARTMENT gd on gd.DEPARTMENT_ID = p.SOURCE_ID
    where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID not in (102794,102795,102780)

    union all
    select i1.NAME paren , i.ID ,i.NAME, i.HEIGHT, i.WIDTH, i.LENGTH, i.ACCOUNTING_CODE, case when i.VOLUMN = 1 then 0 else iip.QUANTITY end QUANTITY, gd.[ORDER], convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2,  'week'+CONVERT(varchar, DATEPART(week, p.CREATE_DATE)-1) [week], p.SOURCE_ID departmentId,
	(
	select SUM(iip2.QUANTITY) from prod.PACKAGE p2 
	inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
    inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
	left join prod.PO po2 on p2.PO = po2.code
	left join base.MARKET m2 on po2.root = m2.CODE
	where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID 
    and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and i2.VOLUMN != 1 and p2.VERIFY_BY is not null
	) as total
    from prod.PACKAGE p
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    left join prod.PO on p.PO = po.code
	left join base.MARKET m on po.root = m.CODE
	left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
	inner join base.DEPARTMENT d on d.ID = p.SOURCE_ID
	inner join prod.GROUP_DEPARTMENT gd on gd.DEPARTMENT_ID = p.SOURCE_ID
    where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID in (102794,102795,102780) and p.VERIFY_BY is not null

    union all
	select null paren, null ID, CONVERT(nvarchar,T.DAY) + '*' + CONVERT(nvarchar, T.RONG) + '*' + CONVERT(nvarchar, T.DAI) NAME,
	T.DAY, T.RONG, T.DAI, NULL ACCOUNTING_CODE, T.QUANTITY, NULL [ORDER], N'2 LỰA PHÔI' groupName, N'Lựa phôi' groupDepartment, t.departmentName, t.departmentName2, 'week'+ CONVERT(nvarchar, DATEPART(WEEK, T.createdAt)-1) [week], t.departmentId, t.totalSL from (
	select xgb.SOURCE_ID departmentId, d.NAME departmentName, '[' + d.CODE + '] ' + d.NAME departmentName2,DAY, RONG, DAI, 'week'+CONVERT(varchar, DATEPART(week, xgb.createdAt)-1) [week], xgb.createdAt, SL_TH QUANTITY,KLC_TH/SL_TH volumn, bg.PRICE,
			(
			select sum(xgb3.KLC_TH) from prod.XUAT_GO_BAO xgb3 where XUATNHAP = 'xuatluaphoi' and createdAt between  '${start}' and '${end}' and createdAt < '20220301'
			and xgb3.DAI = xgb.DAI and xgb3.RONG = xgb.RONG and xgb3.DAY = xgb.DAY and xgb3.PRICE_CODE is not null  and xgb3.SOURCE_ID = xgb.SOURCE_ID
			) total,
			(
			select sum(xgb3.SL_TH) from prod.XUAT_GO_BAO xgb3 where XUATNHAP = 'xuatluaphoi' and createdAt between  '${start}' and '${end}' and createdAt < '20220301'
			and xgb3.DAI = xgb.DAI and xgb3.RONG = xgb.RONG and xgb3.DAY = xgb.DAY and xgb3.PRICE_CODE is not null  and xgb3.SOURCE_ID = xgb.SOURCE_ID
			) totalSL
			from prod.XUAT_GO_BAO xgb 
			inner join base.DEPARTMENT d on xgb.SOURCE_ID = d.id
			inner join prod.BANG_GIA_BAO_CAT bg on xgb.PRICE_CODE = bg.MASP and xgb.createdAt between bg.START_DATE and isnull(bg.END_DATE, GETDATE())
			where xgb.XUATNHAP = 'xuatluaphoi' and xgb.createdAt between  '${start}' and '${end}' and createdAt < '20220301'
            union all
            select xgb.SOURCE_ID departmentId, d.NAME departmentName, '[' + d.CODE + '] ' + d.NAME departmentName2,I.HEIGHT DAY,I.WIDTH RONG,I.LENGTH DAI, 'week'+CONVERT(varchar, DATEPART(week, xgb.createdAt)-1) [week],xgb.createdAt, QUANTITY, I.VOLUMN volumn, bg.PRICE,
			(
			select sum(QUANTITY) from (select  DISTINCT XUATNHAP,createdAt,QC1.ITEM_ID,SOURCE_ID
                ,xgb1.PRICE_CODE,QC1.QUANTITY from prod.QC_LUA_DAT QC1 
			left join prod.XUAT_GO_BAO xgb1 on xgb1.ID = QC1.BAO_ID) h
			
			where XUATNHAP = 'xuatluaphoi' and createdAt between '${start}' and '${end}'
			and ITEM_ID = QC.ITEM_ID and PRICE_CODE is not null  and SOURCE_ID = xgb.SOURCE_ID
			)*I.VOLUMN total,
			(
			select sum(QUANTITY) from (select  DISTINCT XUATNHAP,createdAt,QC1.ITEM_ID,SOURCE_ID
                ,xgb1.PRICE_CODE,QC1.QUANTITY  from prod.QC_LUA_DAT QC1 
			left join prod.XUAT_GO_BAO xgb1 on xgb1.ID = QC1.BAO_ID) k
			
			where XUATNHAP = 'xuatluaphoi' and createdAt between  '${start}' and '${end}'
			and ITEM_ID = QC.ITEM_ID and PRICE_CODE is not null  and SOURCE_ID = xgb.SOURCE_ID
			) totalSL
			from prod.QC_LUA_DAT QC
			left join prod.XUAT_GO_BAO xgb on xgb.ID = QC.BAO_ID
			inner join base.DEPARTMENT d on xgb.SOURCE_ID = d.id
			left join base.ITEM I on I.ID = QC.ITEM_ID
			inner join prod.BANG_GIA_BAO_CAT bg on xgb.PRICE_CODE = bg.MASP and xgb.createdAt between bg.START_DATE and isnull(bg.END_DATE, GETDATE())
			where xgb.XUATNHAP = 'xuatluaphoi' and xgb.createdAt between  '${start}' and '${end}'
			union
			select xgb2.SOURCE_ID , d.NAME departmentName, '[' + d.CODE + '] ' + d.NAME departmentName2,i.HEIGHT, i.WIDTH, i.LENGTH, 'week'+CONVERT(varchar, DATEPART(week, xgb2.createdAt)-1) [week],xgb2.createdAt, SL_HC QUANTITY, abs(xgb2.DAI*xgb2.RONG*xgb2.DAY/1000000000) volumn, bg2.PRICE,
			(
			select sum(abs(xgb4.SL_HC*xgb4.DAI*xgb4.RONG*xgb4.DAY/1000000000)) from prod.XUAT_GO_BAO xgb4 where XUATNHAP = 'xuat-cat-ha-cap' and createdAt between  '${start}' and '${end}'
			and xgb4.DAI = xgb2.DAI and xgb4.RONG = xgb2.RONG and xgb4.DAY = xgb2.DAY and xgb4.PRICE_CODE is not null
			) total,
			(
			select sum(abs(xgb4.SL_HC)) from prod.XUAT_GO_BAO xgb4 where XUATNHAP = 'xuat-cat-ha-cap' and createdAt between  '${start}' and '${end}'
			and xgb4.DAI = xgb2.DAI and xgb4.RONG = xgb2.RONG and xgb4.DAY = xgb2.DAY and xgb4.PRICE_CODE is not null
			) totalSL
			from prod.XUAT_GO_BAO xgb2
			inner join base.ITEM i on xgb2.itemId = i.ID
			left join base.DEPARTMENT d on xgb2.SOURCE_ID = d.ID
			inner join prod.BANG_GIA_BAO_CAT bg2 on xgb2.PRICE_CODE = bg2.MASP and xgb2.createdAt between bg2.START_DATE and isnull(bg2.END_DATE, GETDATE())
			where xgb2.XUATNHAP = 'xuat-cat-ha-cap' and xgb2.createdAt between '${start}' and '${end}'
			) T
    ) AS BangNguon
    PIVOT
    (
    SUM(QUANTITY)
    FOR [week] IN (${strWeek})
    ) AS BangChuyen;
    `)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-theo-thang-sl-2", async (req, res) => {
    const { fromDate, toDate, strWeek, departmentId, arrDepartment } = req.body;
    let query = "";
    if(departmentId == 102299){
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
		(
		select SUM(QUANTITY) from View_SanLuong v2 where v2.itemId = v1.itemId 
		and  v2.createDate between '${fromDate}' and '${toDate}' and v2.departmentId = v1.departmentId and VOLUMN != 1
		) total
		from View_SanLuong v1
		where v1.createDate between '${fromDate}' and '${toDate}'
		union all
		select null sanPham, itemId, itemName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
        (select SUM(QUANTITY) from View_SanLuong_All v2
        where createDate between '${fromDate}' and '${toDate}'
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        ) total
        from View_SanLuong_All v1
        where createDate between '${fromDate}' and '${toDate}'

        ) AS BangNguon
        PIVOT
        (
        SUM(QUANTITY)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    }else{
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += el + ', ';
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
		(
		select SUM(QUANTITY) from View_SanLuong v2 where v2.itemId = v1.itemId 
		and  v2.createDate between '${fromDate}' and '${toDate}' and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment}) and VOLUMN != 1
		) total
		from View_SanLuong v1
		where v1.createDate between '${fromDate}' and '${toDate}' and departmentId in (${strDepartment})
		union all
		select null sanPham, itemId, itemName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
        (select SUM(QUANTITY) from View_SanLuong_All v2
        where createDate between '${fromDate}' and '${toDate}'
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment})
        ) total
        from View_SanLuong_All v1
        where createDate between '${fromDate}' and '${toDate}' and departmentId in (${strDepartment})

        ) AS BangNguon
        PIVOT
        (
        SUM(QUANTITY)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-theo-thang-m3-2", async (req, res) => {
    const { fromDate, toDate, strWeek, departmentId, arrDepartment } = req.body;
    let query = "";
    if(departmentId == 102299){
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong v2 where v2.itemId = v1.itemId 
		and  v2.createDate between '${fromDate}' and '${toDate}' and v2.departmentId = v1.departmentId
		) total
		from View_SanLuong v1
		where v1.createDate between '${fromDate}' and '${toDate}'
		union all
		select null sanPham, itemId, itemName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY*volumn volumn, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
        (select SUM(QUANTITY*volumn) from View_SanLuong_All v2
        where createDate between '${fromDate}' and '${toDate}'
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        ) total
        from View_SanLuong_All v1
        where createDate between '${fromDate}' and '${toDate}'

        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    }else{
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += el + ', ';
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong v2 where v2.itemId = v1.itemId 
		and  v2.createDate between '${fromDate}' and '${toDate}' and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment})
		) total
		from View_SanLuong v1
		where v1.createDate between '${fromDate}' and '${toDate}' and departmentId in (${strDepartment})
		union all
		select null sanPham, itemId, itemName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY*volumn volumn, 'week'+CONVERT(varchar, DATEPART(week, createDate)-1) [week],
        (select SUM(QUANTITY*volumn) from View_SanLuong_All v2
        where createDate between '${fromDate}' and '${toDate}'
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment})
        ) total
        from View_SanLuong_All v1
        where createDate between '${fromDate}' and '${toDate}' and departmentId in (${strDepartment})

        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR week IN (${strWeek})
        ) AS BangChuyen;
        `
    }
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})

router.get("/san-luong-theo-thang-m3", async (req, res) => {
    const { start, end, strWeek } = req.query;
    let data = await new mssql.Request().query(`
    SELECT *
    FROM
    (
    select i1.NAME paren , i.ID ,i.NAME, i.HEIGHT, i.WIDTH, i.LENGTH, i.ACCOUNTING_CODE, iip.QUANTITY*i.VOLUMN volumn, gd.[ORDER], convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2, 'week'+CONVERT(varchar, DATEPART(week, p.CREATE_DATE)-1) [week], p.SOURCE_ID departmentId,
	(
	select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
	inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
	inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
	inner join prod.PO po2 on p2.PO = po2.code
	inner join base.MARKET m2 on po2.root = m2.CODE
	where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID and m2.PRODUCT_ID = m.PRODUCT_ID
    and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026
	) as total
    from prod.PACKAGE p
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    inner join prod.PO on p.PO = po.code
	inner join base.MARKET m on po.root = m.CODE
	left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
	inner join base.DEPARTMENT d on d.ID = p.SOURCE_ID
	inner join prod.GROUP_DEPARTMENT gd on gd.DEPARTMENT_ID = p.SOURCE_ID
    where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID not in (102794,102795,102780)
    union all
    select i1.NAME paren , i.ID ,i.NAME, i.HEIGHT, i.WIDTH, i.LENGTH, i.ACCOUNTING_CODE, iip.QUANTITY*i.VOLUMN volumn, gd.[ORDER], convert(nvarchar, gd.[ORDER]) + ' ' + upper(gd.NAME) groupName, gd.NAME groupDepartment, d.NAME departmentName, '['+d.CODE+'] '+ d.NAME departmentName2, 'week'+CONVERT(varchar, DATEPART(week, p.CREATE_DATE)-1) [week], p.SOURCE_ID departmentId,
	(
	select SUM(iip2.QUANTITY*i2.VOLUMN) from prod.PACKAGE p2 
	inner join prod.ITEM_IN_PACKAGE iip2 on p2.ID = iip2.PACKAGE_ID
	inner join base.ITEM i2 on iip2.ITEM_ID = i2.ID
	left join prod.PO po2 on p2.PO = po2.code
	left join base.MARKET m2 on po2.root = m2.CODE
	where p2.SOURCE_ID = p.SOURCE_ID and iip2.ITEM_ID = iip.ITEM_ID 
    and p2.CREATE_DATE between '${start}' and '${end}' and P2.TYPE_ID = 100026 and p2.VERIFY_BY is not null
	) as total
    from prod.PACKAGE p
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
    inner join base.ITEM i on iip.ITEM_ID = i.ID
    left join prod.PO on p.PO = po.code
	left join base.MARKET m on po.root = m.CODE
	left join base.ITEM i1 on m.PRODUCT_ID = i1.ID
	inner join base.DEPARTMENT d on d.ID = p.SOURCE_ID
	inner join prod.GROUP_DEPARTMENT gd on gd.DEPARTMENT_ID = p.SOURCE_ID
    where p.CREATE_DATE between '${start}' and '${end}' and P.TYPE_ID = 100026 and p.SOURCE_ID in (102794,102795,102780) and p.VERIFY_BY is not null
    union all
	select null paren, null ID, CONVERT(nvarchar,T.DAY) + '*' + CONVERT(nvarchar, T.RONG) + '*' + CONVERT(nvarchar, T.DAI) NAME,
	T.DAY, T.RONG, T.DAI, NULL ACCOUNTING_CODE, T.QUANTITY*T.volumn volumn, NULL [ORDER], N'2 LỰA PHÔI' groupName, N'Lựa phôi' groupDepartment, t.departmentName, t.departmentName2, 'week'+ CONVERT(nvarchar, DATEPART(WEEK, T.createdAt)-1) [week], t.departmentId, t.total from (
	select xgb.SOURCE_ID departmentId, d.NAME departmentName,'[' + d.CODE + '] ' + d.NAME departmentName2,DAY, RONG, DAI, 'week'+CONVERT(varchar, DATEPART(week, xgb.createdAt)-1) [week], xgb.createdAt, SL_TH QUANTITY,KLC_TH/SL_TH volumn, bg.PRICE,
			(
			select sum(xgb3.KLC_TH) from prod.XUAT_GO_BAO xgb3 where XUATNHAP = 'xuatluaphoi' and createdAt between  '${start}' and '${end}' and createdAt < '20220301'
			and xgb3.DAI = xgb.DAI and xgb3.RONG = xgb.RONG and xgb3.DAY = xgb.DAY and xgb3.PRICE_CODE is not null  and xgb3.SOURCE_ID = xgb.SOURCE_ID
			) total,
			(
			select sum(xgb3.SL_TH) from prod.XUAT_GO_BAO xgb3 where XUATNHAP = 'xuatluaphoi' and createdAt between  '${start}' and '${end}' and createdAt < '20220301'
			and xgb3.DAI = xgb.DAI and xgb3.RONG = xgb.RONG and xgb3.DAY = xgb.DAY and xgb3.PRICE_CODE is not null  and xgb3.SOURCE_ID = xgb.SOURCE_ID
			) totalSL
			from prod.XUAT_GO_BAO xgb 
			inner join base.DEPARTMENT d on xgb.SOURCE_ID = d.id
			inner join prod.BANG_GIA_BAO_CAT bg on xgb.PRICE_CODE = bg.MASP and xgb.createdAt between bg.START_DATE and isnull(bg.END_DATE, GETDATE())
			where xgb.XUATNHAP = 'xuatluaphoi' and xgb.createdAt between  '${start}' and '${end}' and createdAt < '20220301'
            union all
            select xgb.SOURCE_ID departmentId, d.NAME departmentName,'[' + d.CODE + '] ' + d.NAME departmentName2, I.HEIGHT DAY,I.WIDTH RONG,I.LENGTH DAI, 'week'+CONVERT(varchar, DATEPART(week, xgb.createdAt)-1) [week],xgb.createdAt, QUANTITY, I.VOLUMN volumn, bg.PRICE,
			(
			select sum(QUANTITY) from (select  DISTINCT XUATNHAP,createdAt,QC1.ITEM_ID,SOURCE_ID
                ,xgb1.PRICE_CODE,QC1.QUANTITY from prod.QC_LUA_DAT QC1 
			left join prod.XUAT_GO_BAO xgb1 on xgb1.ID = QC1.BAO_ID) h
			
			where XUATNHAP = 'xuatluaphoi' and createdAt between '${start}' and '${end}'
			and ITEM_ID = QC.ITEM_ID and PRICE_CODE is not null  and SOURCE_ID = xgb.SOURCE_ID
			)*I.VOLUMN total,
			(
			select sum(QUANTITY) from (select  DISTINCT XUATNHAP,createdAt,QC1.ITEM_ID,SOURCE_ID
                ,xgb1.PRICE_CODE,QC1.QUANTITY from prod.QC_LUA_DAT QC1 
			left join prod.XUAT_GO_BAO xgb1 on xgb1.ID = QC1.BAO_ID) k
			
			where XUATNHAP = 'xuatluaphoi' and createdAt between  '${start}' and '${end}'
			and ITEM_ID = QC.ITEM_ID and PRICE_CODE is not null  and SOURCE_ID = xgb.SOURCE_ID
			) totalSL
			from prod.QC_LUA_DAT QC
			left join prod.XUAT_GO_BAO xgb on xgb.ID = QC.BAO_ID
			inner join base.DEPARTMENT d on xgb.SOURCE_ID = d.id
			left join base.ITEM I on I.ID = QC.ITEM_ID
			inner join prod.BANG_GIA_BAO_CAT bg on xgb.PRICE_CODE = bg.MASP and xgb.createdAt between bg.START_DATE and isnull(bg.END_DATE, GETDATE())
			where xgb.XUATNHAP = 'xuatluaphoi' and xgb.createdAt between  '${start}' and '${end}'
			union
			select xgb2.SOURCE_ID , d.NAME departmentName,'[' + d.CODE + '] ' + d.NAME departmentName2, i.HEIGHT, i.WIDTH, i.LENGTH, 'week'+CONVERT(varchar, DATEPART(week, xgb2.createdAt)-1) [week],xgb2.createdAt, SL_HC QUANTITY, abs(xgb2.DAI*xgb2.RONG*xgb2.DAY/1000000000) volumn, bg2.PRICE,
			(
			select sum(abs(xgb4.SL_HC*xgb4.DAI*xgb4.RONG*xgb4.DAY/1000000000)) from prod.XUAT_GO_BAO xgb4 where XUATNHAP = 'xuat-cat-ha-cap' and createdAt between  '${start}' and '${end}'
			and xgb4.DAI = xgb2.DAI and xgb4.RONG = xgb2.RONG and xgb4.DAY = xgb2.DAY and xgb4.PRICE_CODE is not null
			) total,
			(
			select sum(abs(xgb4.SL_HC)) from prod.XUAT_GO_BAO xgb4 where XUATNHAP = 'xuat-cat-ha-cap' and createdAt between  '${start}' and '${end}'
			and xgb4.DAI = xgb2.DAI and xgb4.RONG = xgb2.RONG and xgb4.DAY = xgb2.DAY and xgb4.PRICE_CODE is not null
			) totalSL
			from prod.XUAT_GO_BAO xgb2
			inner join base.ITEM i on xgb2.itemId = i.ID
			left join base.DEPARTMENT d on xgb2.SOURCE_ID = d.ID
			inner join prod.BANG_GIA_BAO_CAT bg2 on xgb2.PRICE_CODE = bg2.MASP and xgb2.createdAt between bg2.START_DATE and isnull(bg2.END_DATE, GETDATE())
			where xgb2.XUATNHAP = 'xuat-cat-ha-cap' and xgb2.createdAt between '${start}' and '${end}'
			) T
    ) AS BangNguon
    PIVOT
    (
    SUM(volumn)
    FOR [week] IN (${strWeek})
    ) AS BangChuyen;
    `)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-cong-doan-thang", async (req, res) => {
    const { factoryId, year, month, yearBefore, monthBefore } = req.body;
    let query = `
    select * from (
		select d.NAME, t.volumn, t.thang from base.DEPARTMENT d left join
		(
        select p.SOURCE_ID, iip.QUANTITY*i.VOLUMN volumn, DATEPART(MONTH, p.CREATE_DATE) thang from prod.PACKAGE p
            inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
            inner join base.ITEM i on iip.ITEM_ID = i.ID
            where DATEPART(MONTH, p.CREATE_DATE) = ${month} and DATEPART(YEAR, p.CREATE_DATE) = ${year} and P.TYPE_ID = 100026
		) as t on d.ID = t.SOURCE_ID
		where d.factoryId = ${factoryId} and d.ID not in (102787, 100271, 100072, 102794, 102798, 102440, 102454, 102777,102377,102373,
            100073, 102788, 102799, 102800, 102791, 102792, 102796, 102797, 100013, 102342, 102368) and TYPE2 = 'to'
			UNION ALL
			SELECT N'1.Tổ Sấy Phôi' NAME , iip.QUANTITY*i.VOLUMN volumn, DATEPART(MONTH, KB.EXPORT_DATE) thang
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish' and DATEPART(MONTH, KB.EXPORT_DATE) = ${month}  and DATEPART(YEAR, KB.EXPORT_DATE) = ${year} AND K.FACTORY_ID = ${factoryId}
							AND kb.TYPE in (N'OUTDOOR', N'INDOOR', N'SẤY UỐN')
        union all
        select d.NAME, t.volumn, t.thang from base.DEPARTMENT d left join
		(
        select p.SOURCE_ID, iip.QUANTITY*i.VOLUMN volumn, DATEPART(MONTH, p.CREATE_DATE) thang from prod.PACKAGE p
            inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
            inner join base.ITEM i on iip.ITEM_ID = i.ID
            where DATEPART(MONTH, p.CREATE_DATE) = ${monthBefore} and DATEPART(YEAR, p.CREATE_DATE) = ${yearBefore} and P.TYPE_ID = 100026
		) as t on d.ID = t.SOURCE_ID
		where d.factoryId = ${factoryId} and d.ID not in (102787, 100271, 100072, 102794, 102798, 102440, 102454, 102777,102377,102373,
            100073, 102788, 102799, 102800, 102791, 102792, 102796, 102797, 100013, 102342, 102368) and TYPE2 = 'to'
			UNION ALL
			SELECT N'1.Tổ Sấy Phôi' NAME , iip.QUANTITY*i.VOLUMN volumn, DATEPART(MONTH, KB.EXPORT_DATE) thang
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish' and DATEPART(MONTH, KB.EXPORT_DATE) = ${monthBefore}  and DATEPART(YEAR, KB.EXPORT_DATE) = ${yearBefore} AND K.FACTORY_ID = ${factoryId}
							AND kb.TYPE in (N'OUTDOOR', N'INDOOR', N'SẤY UỐN')
            ) BangNguon
            pivot
            (
            sum(volumn)
            for thang in ([${monthBefore}], [${month}])
            ) AS BangChuyen
            order by NAME
            ;
    `
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-cong-doan-quy", async (req, res) => {
    const { factoryId, year, quy, yearBefore, quyBefore } = req.body;
    let query = `
    select * from (
		select d.NAME, t.volumn, t.quy from base.DEPARTMENT d left join
		(
        select p.SOURCE_ID, iip.QUANTITY*i.VOLUMN volumn, DATEPART(QUARTER, p.CREATE_DATE) quy from prod.PACKAGE p
            inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
            inner join base.ITEM i on iip.ITEM_ID = i.ID
            where DATEPART(QUARTER, p.CREATE_DATE) = ${quy} and DATEPART(YEAR, p.CREATE_DATE) = ${year} and P.TYPE_ID = 100026
		) as t on d.ID = t.SOURCE_ID
		where d.factoryId = ${factoryId} and d.ID not in (102787, 100271, 100072, 102794, 102798, 102440, 102454, 102777,102377,102373,
            100073, 102788, 102799, 102800, 102791, 102792, 102796, 102797, 100013, 102342, 102368) and TYPE2 = 'to'
			UNION ALL
			SELECT N'1.Tổ Sấy Phôi' NAME , iip.QUANTITY*i.VOLUMN volumn, DATEPART(QUARTER, KB.EXPORT_DATE) quy
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish' and DATEPART(QUARTER, KB.EXPORT_DATE) = ${quy}  and DATEPART(YEAR, KB.EXPORT_DATE) = ${year} AND K.FACTORY_ID = ${factoryId}
							AND kb.TYPE in (N'OUTDOOR', N'INDOOR', N'SẤY UỐN')
        union all
        select d.NAME, t.volumn, t.quy from base.DEPARTMENT d left join
		(
        select p.SOURCE_ID, iip.QUANTITY*i.VOLUMN volumn, DATEPART(QUARTER, p.CREATE_DATE) quy from prod.PACKAGE p
            inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
            inner join base.ITEM i on iip.ITEM_ID = i.ID
            where DATEPART(QUARTER, p.CREATE_DATE) = ${quyBefore} and DATEPART(YEAR, p.CREATE_DATE) = ${yearBefore} and P.TYPE_ID = 100026
		) as t on d.ID = t.SOURCE_ID
		where d.factoryId = ${factoryId} and d.ID not in (102787, 100271, 100072, 102794, 102798, 102440, 102454, 102777,102377,102373,
            100073, 102788, 102799, 102800, 102791, 102792, 102796, 102797, 100013, 102342, 102368) and TYPE2 = 'to'
			UNION ALL
			SELECT N'1.Tổ Sấy Phôi' NAME , iip.QUANTITY*i.VOLUMN volumn, DATEPART(QUARTER, KB.EXPORT_DATE) quy
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish' and DATEPART(QUARTER, KB.EXPORT_DATE) = ${quyBefore}  and DATEPART(YEAR, KB.EXPORT_DATE) = ${yearBefore} AND K.FACTORY_ID = ${factoryId}
							AND kb.TYPE in (N'OUTDOOR', N'INDOOR', N'SẤY UỐN')
            ) BangNguon
            pivot
            (
            sum(volumn)
            for quy in ([${quy}], [${quyBefore}])
            ) AS BangChuyen
            order by NAME
            ;
    `
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-cong-doan-nam", async (req, res) => {
    const { factoryId, year, yearBefore } = req.body;
    let query = `
    select * from (
		select d.NAME, t.volumn, t.nam from base.DEPARTMENT d left join
		(
        select p.SOURCE_ID, iip.QUANTITY*i.VOLUMN volumn, DATEPART(YEAR, p.CREATE_DATE) nam from prod.PACKAGE p
            inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
            inner join base.ITEM i on iip.ITEM_ID = i.ID
            where  DATEPART(YEAR, p.CREATE_DATE) = ${year} and P.TYPE_ID = 100026
		) as t on d.ID = t.SOURCE_ID
		where d.factoryId = ${factoryId} and d.ID not in (102787, 100271, 100072, 102794, 102798, 102440, 102454, 102777,102377,102373,
            100073, 102788, 102799, 102800, 102791, 102792, 102796, 102797, 100013, 102342, 102368) and TYPE2 = 'to'
			UNION ALL
			SELECT N'1.Tổ Sấy Phôi' NAME , iip.QUANTITY*i.VOLUMN volumn, DATEPART(YEAR, KB.EXPORT_DATE) nam
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish'  and DATEPART(YEAR, KB.EXPORT_DATE) = ${year} AND K.FACTORY_ID = ${factoryId}
							AND kb.TYPE in (N'OUTDOOR', N'INDOOR', N'SẤY UỐN')
        union all
        select d.NAME, t.volumn, t.nam from base.DEPARTMENT d left join
		(
        select p.SOURCE_ID, iip.QUANTITY*i.VOLUMN volumn, DATEPART(YEAR, p.CREATE_DATE) nam from prod.PACKAGE p
            inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
            inner join base.ITEM i on iip.ITEM_ID = i.ID
            where  DATEPART(YEAR, p.CREATE_DATE) = ${yearBefore} and P.TYPE_ID = 100026
		) as t on d.ID = t.SOURCE_ID
		where d.factoryId = ${factoryId} and d.ID not in (102787, 100271, 100072, 102794, 102798, 102440, 102454, 102777,102377,102373,
            100073, 102788, 102799, 102800, 102791, 102792, 102796, 102797, 100013, 102342, 102368) and TYPE2 = 'to'
			UNION ALL
			SELECT N'1.Tổ Sấy Phôi' NAME , iip.QUANTITY*i.VOLUMN volumn, DATEPART(YEAR, KB.EXPORT_DATE) nam
                FROM prod.KILN_BATCH KB
                            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
                            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
                            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
                            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
                            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
                            INNER JOIN base.DEPARTMENT D ON D.factoryId = K.FACTORY_ID AND D.TYPE2 = 'nhaMay'
                            WHERE KB.STATUS = 'finish'  and DATEPART(YEAR, KB.EXPORT_DATE) = ${yearBefore} AND K.FACTORY_ID = ${factoryId}
							AND kb.TYPE in (N'OUTDOOR', N'INDOOR', N'SẤY UỐN')
            ) BangNguon
            pivot
            (
            sum(volumn)
            for nam in ([${year}], [${yearBefore}])
            ) AS BangChuyen
            order by NAME
            ;
    `
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.post("/san-luong-theo-nam-m3", async (req, res) => {
    const { year, arrDepartment, departmentId } = req.body;
    let query = "";
    if(departmentId == 102299){
        let strDepartment = "";
        req.body.arrDepartment.forEach(el => {
            strDepartment += "N'" +el + "', "
        });
        strDepartment = strDepartment.substring(0, strDepartment.length-2);
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName, typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong_tuan_thang v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and VOLUMN != 1 and v2.sanPham = v1.sanPham
		) total
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR,v1. createDate) = ${year} and groupDepartment in (${strDepartment})
		union all
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong_LuaPhoi v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and VOLUMN != 1 and v2.sanPham = v1.sanPham
		) total
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR,v1. createDate) = ${year} and groupDepartment in (${strDepartment})
		union all
		select null sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY*VOLUMN volumn, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
        (select SUM(QUANTITY*VOLUMN) from View_SanLuong_All v2
        where DATEPART(YEAR, createDate) = ${year}
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        ) total
        from View_SanLuong_All v1
        where DATEPART(YEAR, createDate) = ${year} and groupDepartment in (${strDepartment})
        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR thang IN ([thang1],[thang2],[thang3],[thang4],[thang5],[thang6],[thang7],[thang8],[thang9],[thang10],[thang11],[thang12])
        ) AS BangChuyen;
        `
    }else{
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += el + ', ';
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong_tuan_thang v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and v2.sanPham = v1.sanPham
        and v2.departmentId in (${strDepartment})
		) total
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
		union all
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		QUANTITY*VOLUMN volumn, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
		(
		select SUM(QUANTITY*VOLUMN) from View_SanLuong_LuaPhoi v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and v2.sanPham = v1.sanPham
        and v2.departmentId in (${strDepartment})
		) total
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
		union all
		select null sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY*VOLUMN volumn, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
        (select SUM(QUANTITY*VOLUMN) from View_SanLuong_All v2
        where DATEPART(YEAR, createDate) = ${year}
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment})
        ) total
        from View_SanLuong_All v1
        where DATEPART(YEAR, createDate) = ${year} and departmentId in (${strDepartment})

        ) AS BangNguon
        PIVOT
        (
        SUM(volumn)
        FOR thang IN ([thang1],[thang2],[thang3],[thang4],[thang5],[thang6],[thang7],[thang8],[thang9],[thang10],[thang11],[thang12])
        ) AS BangChuyen;
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})

router.post("/san-luong-theo-nam-sl", async (req, res) => {
    const { year, arrDepartment, departmentId } = req.body;
    let query = "";
    if(departmentId == 102299){
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
		(
		select SUM(QUANTITY) from View_SanLuong_tuan_thang v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and VOLUMN != 1
		) total
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR,v1. createDate) = ${year}
		union all
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
		(
		select SUM(QUANTITY) from View_SanLuong_LuaPhoi v2 where v2.itemId = v1.itemId and v2.sanPham = v1.sanPham
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and VOLUMN != 1
		) total
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR,v1. createDate) = ${year}
		union all
		select null sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
        (select SUM(QUANTITY) from View_SanLuong_All v2
        where DATEPART(YEAR, createDate) = ${year}
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        ) total
        from View_SanLuong_All v1
        where DATEPART(YEAR, createDate) = ${year}
        ) AS BangNguon
        PIVOT
        (
        SUM(QUANTITY)
        FOR thang IN ([thang1],[thang2],[thang3],[thang4],[thang5],[thang6],[thang7],[thang8],[thang9],[thang10],[thang11],[thang12])
        ) AS BangChuyen;
        `
    }else{
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += el + ', ';
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
        select *
        from
        (
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
		(
		select SUM(QUANTITY) from View_SanLuong_tuan_thang v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId and v2.sanPham = v1.sanPham
        and v2.departmentId in (${strDepartment}) and VOLUMN != 1
		) total
		from View_SanLuong_tuan_thang v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
		union all
        select sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT, 
		departmentId, departmentName, departmentName2, groupName, groupDepartment, 
		case when VOLUMN = 1 then 0 else QUANTITY end QUANTITY, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
		(
		select SUM(QUANTITY) from View_SanLuong_LuaPhoi v2 where v2.itemId = v1.itemId 
		and  DATEPART(YEAR, v2.createDate) = ${year} and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment}) and VOLUMN != 1
		) total
		from View_SanLuong_LuaPhoi v1
		where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
		union all
		select null sanPham, itemId, itemName,typeName, LENGTH, WIDTH, HEIGHT,
        departmentId, departmentName, departmentName2, groupName, groupDepartment,
        QUANTITY, 'thang'+ CONVERT(varchar, DATEPART(MONTH, createDate))  thang,
        (select SUM(QUANTITY) from View_SanLuong_All v2
        where DATEPART(YEAR, createDate) = ${year}
        and v2.LENGTH = v1.LENGTH and v2.WIDTH = v1.WIDTH and v2.HEIGHT = v1.HEIGHT 
        and v2.departmentId = v1.departmentId
        and v2.departmentId in (${strDepartment})
        ) total
        from View_SanLuong_All v1
        where DATEPART(YEAR, createDate) = ${year} and departmentId in (${strDepartment})

        ) AS BangNguon
        PIVOT
        (
        SUM(QUANTITY)
        FOR thang IN ([thang1],[thang2],[thang3],[thang4],[thang5],[thang6],[thang7],[thang8],[thang9],[thang10],[thang11],[thang12])
        ) AS BangChuyen;
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})

router.get("/san-luong-khoi-cbg", async (req, res) => {
    const { year } = req.query;
    let data = await new mssql.Request().query(`
    SELECT *
    FROM
    (
    select iip.QUANTITY*i.VOLUMN volumn , 'thang'+ CONVERT(varchar, DATEPART(MONTH, p.CREATE_DATE))  thang, gd.NAME groupName, gd.[ORDER]
    from prod.PACKAGE p
    inner join prod.ITEM_IN_PACKAGE iip on p.id = iip.PACKAGE_ID
	inner join base.ITEM i on iip.ITEM_ID = i.ID
	inner join prod.GROUP_DEPARTMENT gd on gd.DEPARTMENT_ID = p.SOURCE_ID
    where DATEPART(YEAR, p.CREATE_DATE) = ${year} and P.TYPE_ID = 100026 and SOURCE_ID not in (100013, 102342, 102368)
	union
	select sum(IIP.QUANTITY*I.VOLUMN) volumn, 'thang'+ CONVERT(varchar, DATEPART(MONTH, KB.EXPORT_DATE))  thang, N'Sấy' groupName, 1 [ORDER]
            FROM prod.KILN_BATCH KB
            LEFT JOIN prod.KILN K ON K.ID = KB.KILN_ID
            LEFT JOIN prod.STEP_OF_PALLET SOP ON SOP.KILN_BATCH_ID = KB.ID
            LEFT JOIN prod.PALLET PL ON PL.ID = SOP.PALLET_ID
            LEFT JOIN prod.ITEM_IN_PALLET IIP ON IIP.PALLET_ID = PL.ID
            LEFT JOIN base.ITEM I ON I.ID = IIP.ITEM_ID
            WHERE KB.STATUS = 'finish' and KB.TYPE not IN (N'SẤY LẠI INDOOR', N'SẤY LẠI OUTDOOR') and DATEPART(YEAR, KB.EXPORT_DATE) = ${year}
			group by DATEPART(MONTH, kb.EXPORT_DATE)
    ) AS BangNguon
    PIVOT
    (
    SUM(volumn)
    FOR thang IN ([thang1], [thang2], [thang3], [thang4], [thang5], [thang6], [thang7], [thang8], [thang9], [thang10], [thang11], [thang12])
    ) AS BangChuyen
	order by [ORDER]
    `)

    res.status(200).send(data.recordset)
})

router.get("/group-department", async (req, res) => {
    let data = await new mssql.Request().query(`
    select gd.NAME groupName, d.ID, d.NAME departmentName, d.factoryId, gd.[ORDER] groupOrder from prod.GROUP_DEPARTMENT gd 
    inner join base.DEPARTMENT d on gd.DEPARTMENT_ID = d.ID order by d.NAME desc
    `)

    res.status(200).send(data.recordset)
})
router.post("/group-department", async (req, res) => {
    let query = `
    DELETE FROM prod.GROUP_DEPARTMENT WHERE DEPARTMENT_ID = ${req.body.departmentId}
    INSERT INTO prod.GROUP_DEPARTMENT ([ORDER], NAME, DEPARTMENT_ID, code)
    VALUES (${req.body.order},N'${req.body.name}',${req.body.departmentId}, '${req.body.code}')
    `;
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})
router.delete("/group-department/:departmentId", async (req, res) => {
    let data = await new mssql.Request().query(`
    DELETE FROM prod.GROUP_DEPARTMENT WHERE DEPARTMENT_ID = ${req.params.departmentId}
    `)

    res.status(200).send(data.recordset)
})
router.get("/list-group-department", async (req, res) => {
    let data = await new mssql.Request().query(`
    select distinct [ORDER], NAME from prod.GROUP_DEPARTMENT
    `)

    res.status(200).send(data.recordset)
})
router.get("/khach-hang", async (req, res) => {
    let data = await new mssql.Request().query(`
   select [ma_kh],[ten_kh] from [dbo].[view_khach_hang_fast]
    `)

    res.status(200).send(data.recordset)
})
router.get("/tong-cong-with-department", async (req, res) => {
    const { thang, nam, factoryId } = req.query;
    let data = await new mssql.Request().query(`
    select d2.NAME xuongName, gd.NAME groupName , gd.[ORDER],d.ID, d.NAME,t.HS1 HS1, t.HS1 HS1A,t.HS15 HS15,t.HS15 HS15A,t.HS2 HS2,t.HS2 HS2A,t.HS3 HS3,
    t.HS3 HS3A, t.NT03, t.NT03 NT03A,t.NN07, t.NN07 NN07A,t.NL09, t.NL09 NL09A,
    t.TONG_CONG,t.TONG_CONG TONG_CONG1 , T.TONG_DIEM, T.TONG_DIEM TONG_DIEM1
    from base.DEPARTMENT d
    left join prod.TINH_SO_CONG t on d.id = t.DEPARTMENT_ID and t.TUAN =  ${thang}  and t.NAM = ${nam}
	left join base.DEPARTMENT d2 on d.PARENT_ID = d2.ID
	left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
    where d.TYPE2 = 'to' and d.factoryId = ${factoryId} and 
	d.ID Not in(100276, 102776,102628,102629,100071,100072,102454, 102796, 102797, 100271,
    102787, 102788,100073, 102799, 102800, 102791, 102792,102798, 102440, 102794, 102340, 
    102352,102373, 102377,102795,102780,102777, 102632, 102529, 102360, 102358, 100275, 102381, 100268)
    order by d2.NAME, gd.[ORDER], d.NAME
    `)

    res.status(200).send(data.recordset)
})
router.get("/bao-cao-tong-cong-with-department", async (req, res) => {
    const {  nam, factoryId } = req.query;
    let data = await new mssql.Request().query(`
    select H.[ORDER],NAME,sum(T1) T1,sum(T2) T2,sum(T3) T3,sum(T4) T4,sum(T5) T5,sum(T6) T6,sum(T7) T7,sum(T8) T8,sum(T9) T9,sum(T10) T10
    ,sum(T11) T11,sum(T12) T12,isnull(sum(T1),0)+isnull(sum(T2),0)+isnull(sum(T3),0)+isnull(sum(T4),0)+isnull(sum(T5),0)+isnull(sum(T6),0)+
    isnull(sum(T7),0)+isnull(sum(T8),0)+isnull(sum(T9),0)+isnull(sum(T10),0)+isnull(sum(T11),0)+isnull(sum(T12),0) as TONG from 
    (select [ORDER],NAME,NAM, CASE WHEN TUAN = 1 then TONG_CONG end as 'T1'
    ,CASE WHEN TUAN = 2 then TONG_CONG end as T2
    ,CASE WHEN TUAN = 3 then TONG_CONG end as T3
    ,CASE WHEN TUAN = 4 then TONG_CONG end as T4
    ,CASE WHEN TUAN = 5 then TONG_CONG end as T5
    ,CASE WHEN TUAN = 6 then TONG_CONG end as T6
    ,CASE WHEN TUAN = 7 then TONG_CONG end as T7
    ,CASE WHEN TUAN = 8 then TONG_CONG end as T8
    ,CASE WHEN TUAN = 9 then TONG_CONG end as T9
    ,CASE WHEN TUAN = 10 then TONG_CONG end as T10
    ,CASE WHEN TUAN = 11 then TONG_CONG end as T11
    ,CASE WHEN TUAN = 12 then TONG_CONG end as T12 from 
    (select G.[ORDER], G.NAME,SUM(T.TONG_CONG) TONG_CONG,T.TUAN,T.NAM,D.factoryId from [prod].GROUP_DEPARTMENT G
    left join base.DEPARTMENT D on D.ID = G.DEPARTMENT_ID
    left join (select * from prod.TINH_SO_CONG where NAM = ${nam}) T on G.DEPARTMENT_ID = T.DEPARTMENT_ID
    where D.factoryId = ${factoryId}
    GROUP BY G.NAME,G.[ORDER],T.THANG,T.NAM,D.factoryId
    ) K) H
    
    GROUP BY NAME,H.[ORDER]
    order by H.[ORDER]
    `)

    res.status(200).send(data.recordset)
})

router.post("/chart-san-luong-theo-nam-sl", async (req, res) => {
    const {year, dateNew, dateOld, arrDepartment, departmentId } = req.body;
    let query = "";
    if(departmentId == 102299){
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += "N'" + el + "', ";
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
        select * from (
            select code, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  CONVERT(varchar, DATEPART(YEAR, createDate)) + '/'+ N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate))
                        else N''+ CONVERT(varchar, DATEPART(YEAR, createDate)) +'/'+ CONVERT(varchar, DATEPART(MONTH, createDate)) end donvi2, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate)) + '/'+ CONVERT(varchar, DATEPART(YEAR, createDate))
                        else CONVERT(varchar, DATEPART(MONTH, createDate)) +'/'+ CONVERT(varchar, DATEPART(YEAR, createDate))   end donvi, 
                        VOLUMN*QUANTITY  VOLUMN
                    from View_SanLuong_tuan_thang v1
                    where DATEPART(YEAR, createDate) = ${year}
                    and groupDepartment in (${strDepartment})
                    union all
                    select code, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  CONVERT(varchar, DATEPART(YEAR, createDate)) + '/'+ N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate))
                        else N''+ CONVERT(varchar, DATEPART(YEAR, createDate)) +'/'+ CONVERT(varchar, DATEPART(MONTH, createDate)) end donvi2, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate)) + '/'+ CONVERT(varchar, DATEPART(YEAR, createDate))
                        else CONVERT(varchar, DATEPART(MONTH, createDate)) +'/'+ CONVERT(varchar, DATEPART(YEAR, createDate))   end donvi, 
                        VOLUMN*QUANTITY  VOLUMN
                    from View_SanLuong_LuaPhoi v1
                    where DATEPART(YEAR, createDate) = ${year}
                    and groupDepartment in (${strDepartment})
            union all
			select code, 
            case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
            then  CONVERT(varchar, DATEPART(YEAR, createDate)) + '/'+ N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate))
            else CONVERT(varchar, DATEPART(YEAR, createDate)) +'/'+ CONVERT(varchar, DATEPART(MONTH, createDate)) end donvi, 
            case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
            then  N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate)) + '/'+ CONVERT(varchar, DATEPART(YEAR, createDate))
            else CONVERT(varchar, DATEPART(MONTH, createDate)) +'/'+ CONVERT(varchar, DATEPART(YEAR, createDate))   end donvi2, 
            VOLUMN*QUANTITY  VOLUMN from View_SanLuong_All
			where DATEPART(YEAR, createDate) = ${year} and groupDepartment in (${strDepartment})
            ) AS BangNguon
            PIVOT
    (
    SUM(VOLUMN)
    FOR code IN ([sayPhoi], [luaPhoi], [soChe], [tinhChe], [hoanThienMoc], [hoanThien], [dongGoi])
    ) AS BangChuyen
    order by donvi2;
        `
    }else{
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += el + ", ";
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
        select * from (

            select code, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  CONVERT(varchar, DATEPART(YEAR, createDate)) + '/'+ N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate))
                        else N''+ CONVERT(varchar, DATEPART(YEAR, createDate)) +'/'+ CONVERT(varchar, DATEPART(MONTH, createDate)) end donvi2, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate)) + '/'+ CONVERT(varchar, DATEPART(YEAR, createDate))
                        else CONVERT(varchar, DATEPART(MONTH, createDate)) +'/'+ CONVERT(varchar, DATEPART(YEAR, createDate))   end donvi, 
                        VOLUMN*QUANTITY  VOLUMN
                    from View_SanLuong_tuan_thang v1
                    where DATEPART(YEAR, createDate) = ${year}
                    and departmentId in (${strDepartment})
                    union all
                    select code, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  CONVERT(varchar, DATEPART(YEAR, createDate)) + '/'+ N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate))
                        else N''+ CONVERT(varchar, DATEPART(YEAR, createDate)) +'/'+ CONVERT(varchar, DATEPART(MONTH, createDate)) end donvi2, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate)) + '/'+ CONVERT(varchar, DATEPART(YEAR, createDate))
                        else CONVERT(varchar, DATEPART(MONTH, createDate)) +'/'+ CONVERT(varchar, DATEPART(YEAR, createDate))   end donvi, 
                        VOLUMN*QUANTITY  VOLUMN
                    from View_SanLuong_LuaPhoi v1
                    where DATEPART(YEAR, createDate) = ${year}
                    and departmentId in (${strDepartment})
                    union all
                    select code, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  CONVERT(varchar, DATEPART(YEAR, createDate)) + '/'+ N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate))
                        else N''+ CONVERT(varchar, DATEPART(YEAR, createDate)) +'/'+ CONVERT(varchar, DATEPART(MONTH, createDate)) end donvi2, 
                        case when CONVERT(varchar, DATEPART(MONTH, createDate)) <10 
                        then  N'0'+ CONVERT(varchar, DATEPART(MONTH, createDate)) + '/'+ CONVERT(varchar, DATEPART(YEAR, createDate))
                        else CONVERT(varchar, DATEPART(MONTH, createDate)) +'/'+ CONVERT(varchar, DATEPART(YEAR, createDate))   end donvi, 
                        VOLUMN*QUANTITY  VOLUMN
                    from View_SanLuong_All v1
                    where DATEPART(YEAR, createDate) = ${year}
                    and departmentId in (${strDepartment})
                        ) AS BangNguon
                        PIVOT
                (
                SUM(VOLUMN)
                FOR code IN ([sayPhoi], [luaPhoi], [soChe], [tinhChe], [hoanThienMoc], [hoanThien], [dongGoi])
                ) AS BangChuyen
                order by donvi2;
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})

router.post("/chart-san-luong-theo-week", async (req, res) => {
    const { year, arrDepartment, departmentId } = req.body;
    let query = "";
    if(departmentId == 102299){
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment += "N'" + el + "', ";
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
        select * from (
            select code, 
                    case when CONVERT(varchar, DATEPART(WEEK, createDate)) <11 then  N'0'+ CONVERT(varchar, DATEPART(WEEK, createDate)-1)  
                    else N''+ CONVERT(varchar, DATEPART(WEEK, createDate) -1) end donvi, 
                    VOLUMN*QUANTITY  VOLUMN
                from View_SanLuong_tuan_thang v1
                where DATEPART(YEAR, v1.createDate) = ${year} and groupDepartment in (${strDepartment})
                union all
                select code, 
                    case when CONVERT(varchar, DATEPART(WEEK, createDate)) <11 then  N'0'+ CONVERT(varchar, DATEPART(WEEK, createDate)-1)  
                    else N''+ CONVERT(varchar, DATEPART(WEEK, createDate) -1) end donvi, 
                    VOLUMN*QUANTITY  VOLUMN
                from View_SanLuong_LuaPhoi v1
                where DATEPART(YEAR, v1.createDate) = ${year} and groupDepartment in (${strDepartment})
                union all
                select code, 
                    case when CONVERT(varchar, DATEPART(WEEK, createDate)) <11 then  N'0'+ CONVERT(varchar, DATEPART(WEEK, createDate)-1)  
                    else N''+ CONVERT(varchar, DATEPART(WEEK, createDate) -1) end donvi, 
                    VOLUMN*QUANTITY  VOLUMN
                from View_SanLuong_All v1
                where DATEPART(YEAR, createDate) = ${year} and groupDepartment in (${strDepartment})
			union all
			select DISTINCT  null,case when WEEK < 10
    then N'0' + WEEK
    else  N'' + WEEK  end tuan, null  from [base].[GLOBAL_DATE] where YEAR = ${year}
     group by WEEK
            ) AS BangNguon
            PIVOT
    (
    SUM(VOLUMN)
    FOR code IN ([sayPhoi], [luaPhoi], [soChe], [tinhChe], [hoanThienMoc], [hoanThien], [dongGoi])
    ) AS BangChuyen
    order by donvi;
        `
    }else{
        let strDepartment = "";
        arrDepartment.forEach(el => {
            strDepartment +=  el + ", ";
        });
        strDepartment = strDepartment.substring(0, strDepartment.length - 2);
        query = `
    select * from (
        select code, 
                    case when CONVERT(varchar, DATEPART(WEEK, createDate)) <11 then  N'0'+ 
                    CONVERT(varchar,CASE WHEN DATEPART(YEAR, createDate)<2023 then DATEPART(WEEK, createDate) -1
                    else DATEPART(WEEK, createDate) END)  
                    else N''+ CONVERT(varchar,CASE WHEN DATEPART(YEAR, createDate)<2023 then DATEPART(WEEK, createDate) -1
                    else DATEPART(WEEK, createDate) END ) end donvi, 
                    VOLUMN*QUANTITY  VOLUMN
                from View_SanLuong_tuan_thang v1
                where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
                union all
                select code, 
                    case when CONVERT(varchar, DATEPART(WEEK, createDate)) <11 then 
                     N'0'+ CONVERT(varchar, CASE WHEN DATEPART(YEAR, createDate)<2023 then DATEPART(WEEK, createDate) -1
                     else DATEPART(WEEK, createDate) END)  
                    else N''+ CONVERT(varchar, CASE WHEN DATEPART(YEAR, createDate)<2023 then DATEPART(WEEK, createDate) -1
                    else DATEPART(WEEK, createDate) END) end donvi, 
                    VOLUMN*QUANTITY  VOLUMN
                from View_SanLuong_LuaPhoi v1
                where DATEPART(YEAR, v1.createDate) = ${year} and departmentId in (${strDepartment})
                union all
                select code, 
                    case when CONVERT(varchar, DATEPART(WEEK, createDate)) <11 then 
                     N'0'+ CONVERT(varchar,CASE WHEN DATEPART(YEAR, createDate)<2023 then DATEPART(WEEK, createDate) -1
                     else DATEPART(WEEK, createDate) END)  
                    else N''+ CONVERT(varchar,CASE WHEN DATEPART(YEAR, createDate)<2023 then DATEPART(WEEK, createDate) -1
                    else DATEPART(WEEK, createDate) END) end donvi, 
                    VOLUMN*QUANTITY  VOLUMN
                from View_SanLuong_All v1
                where DATEPART(YEAR, createDate) = ${year} and departmentId in (${strDepartment})
                    union all
                    select DISTINCT  null,case when WEEK < 10
                    then N'0' + WEEK
                    else  N'' + WEEK  end tuan, null  from [base].[GLOBAL_DATE] where YEAR = ${year}
                    group by WEEK
                    ) AS BangNguon
                    PIVOT
            (
            SUM(VOLUMN)
            FOR code IN ([sayPhoi], [luaPhoi], [soChe], [tinhChe], [hoanThienMoc], [hoanThien], [dongGoi])
            ) AS BangChuyen
            order by donvi;
        `
    }
    console.log("query", query);
    let data = await new mssql.Request().query(query)

    res.status(200).send(data.recordset)
})

router.get("/bao-cao-nang-suat-lao-dong", async (req, res) => {
    const { from,to,factoryId, nam, departmentId } = req.query;
    let data = await new mssql.Request().query(`
    select d2.NAME xuongName, gd.NAME groupName , gd.[ORDER],d.ID, d.NAME,SL.tinhluong,
    t.TONG_CONG , T.TONG_DIEM,T.TONG_DIEM/t.TONG_CONG tyle,t.DM_NCLD,SL.tinhluong/T.TONG_DIEM NSLD
    ,SL.tinhluong - (T.TONG_DIEM*T.DM_NCLD) candoiquyluong,SL.tinhluong/(T.TONG_DIEM*T.DM_NCLD) hssdld
    from base.DEPARTMENT d
    left join (select DEPARTMENT_ID,DM_NCLD,SUM(TONG_CONG) TONG_CONG,SUM(TONG_DIEM) TONG_DIEM,NAM from prod.TINH_SO_CONG where TUAN >${from}-1  and TUAN <=${to}-1 
	GROUP BY DEPARTMENT_ID,NAM,DM_NCLD ) t on d.id = t.DEPARTMENT_ID  and t.NAM = ${nam} 
	left join (select sum(tinhluong) tinhluong,departmentId from (select sum((volumn - isnull(Ha.quantity,0))*T.dongia) tinhluong,
    CASE when departmentId = 102632 then 100013 when departmentId = 102787 then 100265 when departmentId = 102788 then 100278 
when departmentId = 102529 then 102342 else departmentId end as departmentId,ID from
    (select SUM(volumn) volumn,ID,paren,dongia,departmentId,departmentIdloi from View_SanLuong_Tinhluong
	    where DATEPART(week,CREATE_DATE) >${from} and DATEPART(week,CREATE_DATE) <=${to} 
 and DATEPART(YEAR,CREATE_DATE) =${nam} 
    GROUP BY ID,paren,dongia,departmentId,departmentIdloi) T
    left join (select qc.itemId,qc.stepId,
    CASE WHEN I.TYPE_ID = 100011 then SUM(qc.quantity* isnull(HS.HE_SO, 1)*I.VOLUMN)
    else SUM(qc.quantity*I.VOLUMN) end as quantity,i1.NAME PRODUCT_ID from prod.HandleQc qc
    left join prod.PACKAGE p1 on qc.packageId = p1.ID
    left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
    left join prod.PO po1 on po1.code = p2.PO
    left join base.MARKET m1 on po1.root = m1.CODE
    left join base.ITEM i1 on m1.PRODUCT_ID = i1.ID
    left join base.ITEM I on I.ID = qc.itemId
    left join       (SELECT        HE_SO, MONTH AS thang, YEAR AS nam, FACTORY_ID
        FROM            prod.HSLP) AS HS ON HS.FACTORY_ID = (CASE WHEN qc.factoryId = 100004 THEN 102340 WHEN qc.factoryId = 100005 THEN 102366 ELSE 100000 END) AND HS.thang = DATEPART(MONTH, 
  qc.createdAt) AND HS.nam = DATEPART(year, qc.createdAt)
	where DATEPART(week,qc.createdAt)>${from}  and DATEPART(week,qc.createdAt) <= ${to} and DATEPART(year,qc.createdAt) =${nam}
    and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where DATEPART(week,CREATE_DATE) >${from}
	and DATEPART(week,CREATE_DATE) <=${to} and DATEPART(YEAR,CREATE_DATE) =${nam} and TYPE_ID <>100026 )
	GROUP BY qc.itemId,qc.stepId,i1.NAME,I.VOLUMN,I.TYPE_ID) Ha on Ha.itemId = T.ID and Ha.stepId = T.departmentIdloi and Ha.PRODUCT_ID = T.paren

	GROUP BY departmentId,ID) h1
	GROUP BY departmentId) SL on SL.departmentId = t.DEPARTMENT_ID
	left join base.DEPARTMENT d2 on d.PARENT_ID = d2.ID
	left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
    where d.TYPE2 = 'to' and d.factoryId = ${factoryId} and 
	d.ID Not in(100276, 102776,102628,102629,100071,100072,102454, 102796, 102797, 100271,
    102787, 102788,100073, 102799, 102800, 102791, 102792,102798, 102440, 102794, 102340, 102352,102373, 
    102377,102795,102780,102777, 102632, 102529, 100268, 100275, 102360, 102381)
    order by d2.NAME,d.NAME
    `)

    res.status(200).send(data.recordset)
})

router.get("/bao-cao-nang-suat-lao-dong-theo-thang", async (req, res) => {
    const { month,factoryId, year } = req.query;
    let data = await new mssql.Request().query(`
    select d2.NAME xuongName, gd.NAME groupName , gd.[ORDER],d.ID, d.NAME,SL.tinhluong,
    t.TONG_CONG , T.TONG_DIEM,T.TONG_DIEM/t.TONG_CONG tyle,t.DM_NCLD,SL.tinhluong/T.TONG_DIEM NSLD
    ,SL.tinhluong - (T.TONG_DIEM*T.DM_NCLD) candoiquyluong,SL.tinhluong/(T.TONG_DIEM*T.DM_NCLD) hssdld
    from base.DEPARTMENT d
    left join (select DEPARTMENT_ID,DM_NCLD,SUM(TONG_CONG) TONG_CONG,SUM(TONG_DIEM) TONG_DIEM,NAM from prod.TINH_SO_CONG where TUAN >= (CASE when ${month} <10 then DATEPART(WEEK, '2022-0${month}-01')-1
    else DATEPART(WEEK, '2022-${month}-01')-1 END)  and TUAN <= (CASE WHEN ${month} <10 then DATEPART(WEEK, EOMONTH('2022-0${month}-15'))-1 else DATEPART(WEEK, EOMONTH('2022-${month}-15'))-1 End)
	GROUP BY DEPARTMENT_ID,NAM,DM_NCLD ) t on d.id = t.DEPARTMENT_ID  and t.NAM = ${year}
    left join (select sum(tinhluong) tinhluong,departmentId from (select sum((volumn - (CASE when departmentId  in (102789,102855,102809,102370) and Ha.TYPE_ID = 100011 then isnull(Ha.quantity*heso,0)
    else isnull(Ha.quantity,0) end) )*T.dongia) tinhluong,
    CASE when departmentId = 102632 then 100013 when departmentId = 102787 then 100265 when departmentId = 102788 then 100278 
when departmentId = 102529 then 102342 else departmentId end as departmentId,ID from
    (select SUM(volumn) volumn,ID,paren,dongia,departmentId,departmentIdloi from View_SanLuong_Tinhluong
	    where DATEPART(month,CREATE_DATE) = ${month}
 and DATEPART(YEAR,CREATE_DATE) =${year}
    GROUP BY ID,paren,dongia,departmentId,departmentIdloi) T
    left join (select qc.itemId,qc.stepId,isnull(HS.HE_SO, 1) heso,I.TYPE_ID ,
 SUM(qc.quantity*I.VOLUMN)  as quantity,i1.NAME PRODUCT_ID from prod.HandleQc qc
    left join prod.PACKAGE p1 on qc.packageId = p1.ID
    left join prod.PACKAGE p2 on p2.ID = p1.ID_QC
    left join prod.PO po1 on po1.code = p2.PO
    left join base.MARKET m1 on po1.root = m1.CODE
	 left join base.ITEM i1 on m1.PRODUCT_ID = i1.ID
    left join base.ITEM I on I.ID = qc.itemId
    left join       (SELECT        HE_SO, MONTH AS thang, YEAR AS nam, FACTORY_ID
        FROM            prod.HSLP) AS HS ON HS.FACTORY_ID = (CASE WHEN qc.factoryId = 100004 THEN 102340 WHEN qc.factoryId = 100005 THEN 102366 ELSE 100000 END) AND HS.thang = DATEPART(MONTH, 
  qc.createdAt) AND HS.nam = DATEPART(year, qc.createdAt)
	where DATEPART(month,qc.createdAt) = ${month} and DATEPART(year,qc.createdAt) =${year}
    and qc.createdAt > '20220301' and packageId in (select ID from [prod].[PACKAGE] where DATEPART(month,CREATE_DATE) = ${month}
	and  DATEPART(YEAR,CREATE_DATE) =${year} and TYPE_ID <>100026 )
	GROUP BY qc.itemId,qc.stepId,i1.NAME,I.VOLUMN,I.TYPE_ID,HS.HE_SO) Ha on Ha.itemId = T.ID and Ha.stepId = T.departmentIdloi and Ha.PRODUCT_ID = T.paren

	GROUP BY departmentId,ID,heso) h1
	GROUP BY departmentId) SL on SL.departmentId = t.DEPARTMENT_ID
	left join base.DEPARTMENT d2 on d.PARENT_ID = d2.ID
	left join prod.GROUP_DEPARTMENT gd on d.ID = gd.DEPARTMENT_ID
    where d.TYPE2 = 'to' and d.factoryId = ${factoryId} and 
	d.ID Not in(100276, 102776,102628,102629,100071,100072,102454, 102796, 102797, 100271,
    102787, 102788,100073, 102799, 102800, 102791, 102792,102798, 102440, 102794, 102340, 102352,102373, 
    102377,102795,102780,102777, 102632, 102529, 100268, 100275, 102360, 102381)
    order by d2.NAME,d.NAME
    `)

    res.status(200).send(data.recordset)
})
router.get("/tong-cong-by-department", async (req, res) => {
    const { thang, nam, departmentId } = req.query;
    let data = await new mssql.Request().query(`
    select  ID, DEPARTMENT_ID from prod.TINH_SO_CONG 
    where DEPARTMENT_ID = ${departmentId} and TUAN = ${thang} and NAM = ${nam}
    `)

    res.status(200).send(data.recordset)
})
router.post("/xoa-he-so-qui-doi", async (req, res) => {
    const data = req.body;
    const { recordset } = await new mssql.Request()
       .input("nam", data.nam)
        .query(`
        delete from prod.TYLE_SL_QUIDOI
        where 
         YEAR = @nam 
       
        `, async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});

router.post("/he-so-qui-doi", async (req, res,next) => {
    const hesoquidoi = req.body.hesoquidoi

    hesoquidoi.forEach(element => {
        const query = ` INSERT INTO prod.TYLE_SL_QUIDOI (ITEM_ID,CODE,STEP_NAME,TYLE,PUA,CREATE_BY,CREATE_DATE,YEAR,NgayapdungTLCD,NgayapdungPUA)
        VALUES (${element.ITEM_ID}, N'${element.code}', N'${element.STEP_NAME}', ${element.TYLE}, ${element.PUA}, ${req.body.createdBy}, GETDATE(),${req.body.nam}
        ,'${req.body.ngayapdung}','${req.body.ngayapdung}')`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.post("/he-so-qui-doi-tl", async (req, res,next) => {
    const hesoquidoi = req.body.hesoquidoi
if (req.body.tyle == 'CD')
    hesoquidoi.forEach(element => {
        const query = ` INSERT INTO prod.TYLE_SL_QUIDOI (ITEM_ID,CODE,STEP_NAME,TYLE,CREATE_BY,CREATE_DATE,YEAR,NgayapdungTLCD)
        VALUES (${element.ITEM_ID}, N'${element.CODE}', N'${element.STEP_NAME}', ${element.CNTYLE}, 
         ${req.body.createdBy}, GETDATE(),${req.body.nam}
        ,'${req.body.ngayapdung}')`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
else 
hesoquidoi.forEach(element => {
    const query = ` INSERT INTO prod.TYLE_SL_QUIDOI (ITEM_ID,CODE,STEP_NAME,PUA,CREATE_BY,CREATE_DATE,YEAR,NgayapdungPUA)
    VALUES (${element.ITEM_ID}, N'${element.CODE}', N'${element.STEP_NAME}',  ${element.CNPUA},
     ${req.body.createdBy}, GETDATE(),${req.body.nam}
    ,'${req.body.ngayapdung}')`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        next()
    })
});
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.get("/ty-le-san-luong-qui-doi", async (req, res) => {
    const {  nam } = req.query;
    let data = await new mssql.Request().query(`
    select SL.ITEM_ID,SL.CODE,SL.STEP_NAME,I.NAME sanpham,
    (select TOP 1 TYLE from prod.TYLE_SL_QUIDOI SL1 where SL1.ITEM_ID = SL.ITEM_ID and SL1.CODE = SL.CODE and SL1.STEP_NAME = SL.STEP_NAME and SL1.YEAR = SL.YEAR
        and SL1.TYLE is not null
        order by SL1.CREATE_DATE desc) TYLE,
    (select TOP 1 NgayapdungTLCD from prod.TYLE_SL_QUIDOI SL1 where SL1.ITEM_ID = SL.ITEM_ID and SL1.CODE = SL.CODE and SL1.STEP_NAME = SL.STEP_NAME and SL1.YEAR = SL.YEAR
        and SL1.TYLE is not null
        order by SL1.CREATE_DATE desc) NgayapdungTLCD,
    (select TOP 1 NgayapdungPUA from prod.TYLE_SL_QUIDOI SL2 where SL2.ITEM_ID = SL.ITEM_ID and SL2.CODE = SL.CODE and SL2.STEP_NAME = SL.STEP_NAME and SL2.YEAR = SL.YEAR
        and SL2.PUA is not null
        order by SL2.CREATE_DATE desc) NgayapdungPUA,
    (select TOP 1 PUA from prod.TYLE_SL_QUIDOI SL2 where SL2.ITEM_ID = SL.ITEM_ID and SL2.CODE = SL.CODE and SL2.STEP_NAME = SL.STEP_NAME and SL2.YEAR = SL.YEAR
        and SL2.PUA is not null
        order by SL2.CREATE_DATE desc) PUA   from 
    (select DISTINCT ITEM_ID,CODE,STEP_NAME,YEAR from prod.TYLE_SL_QUIDOI) SL
    left join base.ITEM I on I.ID = SL.ITEM_ID
    
    where  SL.YEAR = ${nam}
    `)

    res.status(200).send(data.recordset)
})
router.post("/tong-cong", async (req, res,next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = ` INSERT INTO prod.TINH_SO_CONG (DEPARTMENT_ID, FACTORY_ID, TUAN, NAM,HS1,HS15,HS2,HS3,NT03,NN07,NL09, TONG_CONG, TONG_DIEM, CREATED_BY, CREATED_AT,DM_NCLD)
        VALUES (${element.ID}, ${req.body.factoryId}, ${req.body.thang}, ${req.body.nam},${element.HS1},${element.HS15},${element.HS2},${element.HS3},${element.NT03},${element.NN07},${element.NL09},${element.TONG_CONG}, ${element.TONG_DIEM}, ${req.body.createdBy}, GETDATE(),${req.body.DM_NCLD})`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

router.put("/tong-cong", async (req, res,next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `
        UPDATE prod.TINH_SO_CONG
        SET 
        HS1 = ${element.HS1}, 
        HS15 = ${element.HS15}, 
        HS2 = ${element.HS2}, 
        HS3 = ${element.HS3}, 
        NT03 = ${element.NT03}, 
        NN07 = ${element.NN07}, 
        NL09 = ${element.NL09}, 
        TONG_CONG = ${element.TONG_CONG}, 
        TONG_DIEM = ${element.TONG_DIEM}, 
        CREATED_BY = ${req.body.createdBy}
        WHERE DEPARTMENT_ID = ${element.ID}
        `;
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

router.post("/xoa-tong-cong", async (req, res) => {
    const data = req.body;
    const { recordset } = await new mssql.Request()
        .input("factoryId", data.factoryId)
        .input("thang", data.thang)
        .input("nam", data.nam)
        .query(`
        delete from prod.TINH_SO_CONG
        where 
        TUAN =  @thang
        and NAM = @nam 
        and FACTORY_ID = @factoryId
        `, async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});

router.get("/lsx-lua-phoi", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("factoryId", req.query.factoryId)
        .input("year", req.query.year)
        .input("week", req.query.week)
        .input("departmentId", req.query.departmentId)
        .query(`
        select distinct number label, number value 
        from prod.PO where 
        factoryId = @factoryId and year = @year 
        and week = @week and stepId = @departmentId
        `)
    res.api.sendData(recordset)
});
router.get("/quy-cach-tinh", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .input("number", req.query.number)
        .input("departmentId", req.query.departmentId)
        .query(`
        select i.NAME, i.HEIGHT, i.WIDTH, i.LENGTH, po.code from prod.PO 
        inner join base.ITEM i on PO.itemId = i.ID
        where number = @number and stepId = @departmentId
        `)
    res.api.sendData(recordset)
});
router.get("/quy-cach-tinh-2", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        select ID, NAME, HEIGHT, WIDTH, LENGTH from  base.ITEM
        where TYPE_ID in (100002, 100011, 100012)
        `)
    res.api.sendData(recordset)
});
router.get("/go-nguyen-lieu", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        select ID, NAME, HEIGHT, WIDTH, LENGTH,TYPE_ID from base.ITEM where TYPE_ID in (100001,100002,100003,100011,100012)
        `)
    res.api.sendData(recordset)
});
router.get("/item-bb-kn", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        select I.ID,I.LENGTH,I.WIDTH,I.HEIGHT,I.CODE,I.NAME,R.STEP_ID,U.NAME unit from
        ( select DISTINCT ITEM_ID,STEP_ID,[ORDER] from [prod].[ROUTING]) R
         left join base.ITEM I on I.ID = R.ITEM_ID
         left join base.UNIT U on U.ID = I.UNIT_ID
         where R.STEP_ID = ${req.query.stepId} and R.[ORDER] <>1
        `)
    res.api.sendData(recordset)
});
router.post("/ghi-nhan-loi-lua-phoi", async (req, res) => {
    const data = req.body;
    const { recordset } = await new mssql.Request()
        .input("sourceId", data.sourceId)
        .input("destinationId", data.destinationId)
        .input("description", data.description)
        .input("typeId", data.typeId)
        .input("accountId", data.accountId)
        .input("po", data.po)
        .input("factoryId", data.factoryId)
        .input("itemId", data.itemId)
        .input("quantity", data.quantity)
        .output("ERROR")
        .execute("Proc_createPackageLuaPhoi", async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});
//get all items
router.get('/get-all-items', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT [ID]
      ,[GUID]
      ,[CODE]
      ,[NAME]
      ,[LENGTH]
      ,[WIDTH]
      ,[HEIGHT]
      ,[TYPE_ID]
      ,[UNIT_ID]
      ,[IMAGE_URL]
      ,[CREATE_DATE]
      ,[ACTIVE]
      ,[GROUP_ITEM]
      ,[MODULE_ID]
      ,[VOLUMN]
      ,[WOOD_TYPE_ID]
      ,[FACTORY_ID]
      ,[heSo]
      ,[MaterialType]
      ,[NEXT_ITEM_ID]
      ,[NEXT_STEP_ID]
      ,[GOODS_TYPE]
      ,[GRAFT]
      ,[ACCOUNTING_CODE]
      ,[GHICHU]
      ,[STATUS]
      ,[NHOMSP_TTD]
      ,[TON]
  FROM [base].[ITEM]
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
//get all department
router.get('/get-all-department', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT [ID]
        ,[GUID]
        ,[TYPE]
        ,[PARENT_ID]
        ,[CODE]
        ,[NAME]
        ,[TYPE2]
        ,[ERROR]
        ,[PACKAGE_TYPE_GROUP_ID]
        ,[MODULE_ID]
        ,[ORDER]
        ,[caLamViec]
        ,[accountId]
        ,[accountId1]
        ,[accountId2]
        ,[factoryId]
        ,[GROUP_ID]
        ,[CONG_SUAT_TUAN]
        ,[GHI_CHU]
    FROM [base].[DEPARTMENT]
    ORDER BY CODE desc
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get("/get-routing-by-itemid", async (req, res) => {
    console.log("itemID")
    const itemID = req.query.itemID

    try {
        const data = await new mssql.Request().query(`
        SELECT
        r.[ID] as rID 
      ,[ITEM_ID]
      ,[STEP_ID]
      ,r.[ORDER]
      ,[CREATE_BY]
      ,[CREATE_DATE]
      ,[MODIFY_BY]
      ,[MODIFY_DATE]
      ,[thoiGianThucHien]
      ,[soNguoiThucHien]
      ,r.[factoryId]
      ,[donGia]
      ,[xacnhanqc]
	  ,d.[ID]
      ,d.[CODE]
	  ,d.[NAME]
  FROM [prod].[ROUTING] r
  inner join base.DEPARTMENT d on r.STEP_ID = d.ID
where r.ITEM_ID = ${itemID}
ORDER BY r.[ORDER] asc
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get("/get-bom", async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT b.MATERIALS_ID as MATERIALS_ID
	,i.[CODE] as MATERIALS_CODE
	,i.[NAME] as MATERIALS_NAME
	,b.[RATE]
	,b.ITEM_ID
FROM PROD.BOM b
INNER JOIN base.ITEM i on b.MATERIALS_ID = i.ID
union
select distinct 
ITEM_ID MATERIALS_ID, 
i.CODE as MATERIALS_CODE, 
i.NAME as MATERIALS_NAME,
null as [RATE], 0 ITEM_ID  
from prod.bom b
inner join base.ITEM i on b.ITEM_ID = i.ID
where ITEM_ID not in (select MATERIALS_ID from prod.BOM)
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
//-------------------------------------------------------
router.post("/insert-bom", async (req, res, next) => {
    const payload = req.body;
    await new mssql.Request().query(`
        delete prod.bom where ITEM_ID = ${payload[0].idSanPham}
        `)
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[BOM]
            (
            [GUID]
            ,[ITEM_ID]
            ,[MATERIALS_ID]
            ,[RATE]
            ,[CREATE_BY]
            ,[CREATE_DATE]
            ,[createdAt]
            )
      VALUES
            (
            NEWID()
            ,${e.idSanPham}
            ,${e.idCauThanh}
            ,${e.heso}
            ,${e.createBy}
            ,getdate()
            ,getdate()
            )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});

router.delete("/remove-bom", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        delete prod.BOM where ITEM_ID = ${req.query.itemID} and MATERIALS_ID =  ${req.query.materialsID}
        `, async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});

router.put("/update-bom", async(req, res, next) => {
    const { recordset } = await new mssql.Request()
    .query(`
    UPDATE prod.BOM
    SET RATE = ${req.body.RATE}
    WHERE ITEM_ID = ${req.body.itemID} and MATERIALS_ID = ${req.body.materialsID}
`)
res.api.sendData(recordset)
});

router.post("/insert-routing", async (req, res, next) => {
    const payload = req.body;
    await new mssql.Request().query(`
    delete prod.ROUTING where ITEM_ID = ${payload[0].itemID}
        `)
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[ROUTING]
        (
            [GUID]
        ,[ITEM_ID]
        ,[STEP_ID]
        ,[ORDER]
        ,[CREATE_BY]
        ,[CREATE_DATE]
        )
  VALUES
        (
            NEWID()
        ,${e.itemID}
        ,${e.stepID}
        ,${e.order}
        ,${e.createBy}
        ,getdate()
        )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});
router.delete("/remove-rou", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        delete prod.ROUTING where ITEM_ID = ${req.query.itemID} and STEP_ID =  ${req.query.stepID}
        `, async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});
router.get("/get-bom-byItemID", async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT i.[ID]
        ,i.[GUID]
        ,[CODE]
        ,[NAME]
        ,[LENGTH]
        ,[WIDTH]
        ,[HEIGHT]
        ,[TYPE_ID]
        ,[UNIT_ID]
        ,[IMAGE_URL]
        ,i.[CREATE_DATE]
        ,[ACTIVE]
        ,[GROUP_ITEM]
        ,[MODULE_ID]
        ,[VOLUMN]
        ,[WOOD_TYPE_ID]
        ,[FACTORY_ID]
        ,[heSo]
        ,[MaterialType]
        ,[NEXT_ITEM_ID]
        ,[NEXT_STEP_ID]
        ,[GOODS_TYPE]
        ,[GRAFT]
        ,[ACCOUNTING_CODE]
        ,[GHICHU]
        ,[STATUS]
        ,[NHOMSP_TTD]
        ,[TON]
    FROM [base].[ITEM] i
      where ID in (select MATERIALS_ID from prod.BOM where ITEM_ID = ${req.query.itemID})
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get("/get-all-bom", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT b.[ID]
        ,b.[GUID]
        ,[ITEM_ID]
        ,[MATERIALS_ID]
		,i.NAME as ITEM_NAME
		,i1.NAME as MATERIALS_NAME
        ,[RATE]
        ,b.[CREATE_BY]
        ,b.[CREATE_DATE]
        ,[MODIFY_BY]
        ,[MODIFY_DATE]
        ,b.[createdAt]
        ,b.[updatedAt]
        ,b.[factoryId]
        ,[donGia]
    FROM [prod].[BOM] b
    INNER JOIN base.ITEM i on i.ID = b.ITEM_ID
	INNER JOIN base.ITEM i1 on i1.ID = b.MATERIALS_ID
        `)
    res.api.sendData(recordset)
});
router.get("/get-item-in-bom", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        Select * from base.ITEM where ID 
in 
(SELECT distinct ITEM_ID from prod.BOM)
        `)
    res.api.sendData(recordset)
});
router.get("/get-name-material", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        select distinct b.MATERIALS_ID as MATERIALS_ID,i.NAME as NAME
        from prod.bom b
        inner join 
        base.ITEM i on b.MATERIALS_ID = i.ID
        `)
    res.api.sendData(recordset)
});
router.post("/g-insert-bom-temp", async (req, res, next) => {
        const payload = req.body;
        payload.forEach(e => {
            const query = `
            INSERT INTO [prod].[BOM_TEMP]
            (
            [ITEM_ID]
            ,[MATERIALS_ID]
            ,[RATE]
            ,[CREATED_BY]
            ,[CREATED_AT]
            ,IS_SEND
            ,STATUS
            )
      VALUES
            (
            ${e.idSanPham}
            ,${e.idCauThanh}
            ,${e.heso}
            ,${e.createBy}
            ,getdate()
            ,1
            ,'insert'
            )
            `
            new mssql.Request().query(query, (err, record) => {
                if (err)
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                next()
            })
        });
    }, (req, res) => {
        return res.api.sendData({ ok: 'ok' })
    });

router.put("/update-rate-bom-temp", async (req, res,next) => {
        const payload = req.body;
        console.log('bien:',payload)
        payload.forEach(e => {
            const query = `
            UPDATE [prod].[BOM]
            SET 
               [RATE] = ${e.rate}
          WHERE id = ${e.id}
            `
            new mssql.Request().query(query, (err, record) => {
                if (err)
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                next();
            })
        });
    }, (req, res) => {
        return res.api.sendData({ ok: 'ok' })
    });
router.delete("/gdeleteBom", async (req, res) => {
        console.log("payload")

        console.log(req.query)
        const { recordset } = await new mssql.Request()
            .query(`
            delete prod.BOM where id = ${req.query.idbom}
            `, async (err, record) => {
                if (err) {
                    console.log("err", err);
                    return res.api.sendFail(err);
                }
                res.api.sendData(record.recordset);
            })
    });
router.post("/g_insertRou", async (req, res, next) => {
        const payload = req.body;
        payload.forEach(e => {
            const query = `
            INSERT INTO [prod].[ROUTING_TEMPLATE]
            (
            [ITEM_ID]
            ,[STEP_ID]
            ,[ORDER]
            ,[CREATE_BY]
            ,[CREATE_DATE]
            )
      VALUES
            (
             ${e.idsp}
            ,${e.idDinhTuyen}
            ,${e.thutu}
            ,${e.createBy}
            ,getdate()
            )
            `
            new mssql.Request().query(query, (err, record) => {
                if (err)
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                next()
            })
        });
    }, (req, res) => {
        return res.api.sendData({ ok: 'ok' })
    });
    router.put("/update-order-routing", async (req, res,next) => {
        const payload = req.body;
        console.log('bien:',payload)
        payload.forEach(e => {
            const query = `
            UPDATE [prod].[ROUTING]
   SET 
      [ORDER] = ${e.order}
      ,[MODIFY_BY] = ${e.createBy}
      ,[MODIFY_DATE] = getdate()
 WHERE id = ${e.id}
            `
            new mssql.Request().query(query, (err, record) => {
                if (err)
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                next();
            })
        });
    }, (req, res) => {
        return res.api.sendData({ ok: 'ok' })
    });
router.delete("/gdeleteRou", async (req, res) => {
    console.log("payload")

    console.log(req.query)
    const { recordset } = await new mssql.Request()
        .query(`
        DELETE FROM [prod].[ROUTING]
      WHERE id = ${req.query.idrou}
        `, async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});

router.get("/get-routingtemplate", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT distinct
        r.[RoutingID]
        ,r.[ITEM_ID]
        ,i.CODE
        ,i.NAME
        ,a.LAST_NAME
    FROM [prod].[ROUTING_TEMPLATE] r
  inner join base.ITEM i on r.[ITEM_ID] = i.ID
  inner join base.ACCOUNT a on r.CREATE_BY = a.ID
        `)
    res.api.sendData(recordset)
});

router.get("/get-all-routing", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT 
		r.ID
        ,[ITEM_ID]
        ,[STEP_ID]
		,d.[CODE] StepCode
		,d.[NAME] StepName
        ,r.[ORDER]
        ,[CREATE_BY]
        ,[CREATE_DATE]
        ,[MODIFY_BY]
        ,[MODIFY_DATE]
        ,[thoiGianThucHien]
        ,[soNguoiThucHien]
        ,r.[factoryId]
        ,[donGia]
        ,[xacnhanqc]
    FROM [prod].[ROUTING] r
	inner join base.DEPARTMENT d on r.[STEP_ID] = d.id
        `)
    res.api.sendData(recordset)
});

router.get("/get-all-temprouting", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT tr.[ID]
        ,tr.[RoutingID]
        ,tr.[ITEM_ID]
        ,tr.[STEP_ID]
		,d.CODE
		,d.NAME
        ,tr.[ORDER]
        ,tr.[CREATE_BY]
        ,tr.[CREATE_DATE]
        ,tr.[MODIFY_BY]
        ,tr.[MODIFY_DATE]
        ,tr.[factoryId]
    FROM [prod].[ROUTING_TEMPLATE] tr
	inner join base.DEPARTMENT d on tr.[STEP_ID] = d.id
        `)
    res.api.sendData(recordset)
});

router.post("/phe-duyet-dinh-tuyen", async (req, res, next) => {
    const payload = req.body;
    console.log("payload")
    console.log(payload)
    new mssql.Request().query(
        `
        delete prod.ROUTING where ITEM_ID = ${payload[0].idsp}
        delete prod.ROUTING_TEMPLATE where ITEM_ID = ${payload[0].idsp}
        `
    )
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[ROUTING]
           (
           [ITEM_ID]
           ,[STEP_ID]
           ,[ORDER]
           ,[CREATE_BY]
           ,[CREATE_DATE]
           ,[thoiGianThucHien]
           ,[soNguoiThucHien]
           ,[donGia]
           )
     VALUES
           (
            ${e.idsp}
           ,${e.idstep}
           ,${e.order}
           ,${e.createdBy}
           ,getdate()
           ,0
           ,0
           ,0
           )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});

router.post("/tu-choi-phe-duyet-dinh-tuyen", async (req, res, next) => {
    const payload = req.body;
    console.log("payload")
    console.log(payload)
   const query = 
        `
        delete prod.ROUTING_TEMPLATE where ITEM_ID = ${payload[0].idsp}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});
//get all items
router.get('/get-all-items', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT [ID]
      ,[GUID]
      ,[CODE]
      ,[NAME]
      ,[LENGTH]
      ,[WIDTH]
      ,[HEIGHT]
      ,[TYPE_ID]
      ,[UNIT_ID]
      ,[IMAGE_URL]
      ,[CREATE_DATE]
      ,[ACTIVE]
      ,[GROUP_ITEM]
      ,[MODULE_ID]
      ,[VOLUMN]
      ,[WOOD_TYPE_ID]
      ,[FACTORY_ID]
      ,[heSo]
      ,[MaterialType]
      ,[NEXT_ITEM_ID]
      ,[NEXT_STEP_ID]
      ,[GOODS_TYPE]
      ,[GRAFT]
      ,[ACCOUNTING_CODE]
      ,[GHICHU]
      ,[STATUS]
      ,[NHOMSP_TTD]
      ,[TON]
  FROM [base].[ITEM]
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
//get all department
router.get('/get-all-department', async(req, res, next) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT [ID]
        ,[GUID]
        ,[TYPE]
        ,[PARENT_ID]
        ,[CODE]
        ,[NAME]
        ,[TYPE2]
        ,[ERROR]
        ,[PACKAGE_TYPE_GROUP_ID]
        ,[MODULE_ID]
        ,[ORDER]
        ,[caLamViec]
        ,[accountId]
        ,[accountId1]
        ,[accountId2]
        ,[factoryId]
        ,[GROUP_ID]
        ,[CONG_SUAT_TUAN]
        ,[GHI_CHU]
    FROM [base].[DEPARTMENT]
    ORDER BY CODE desc
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get("/get-routing-by-itemid", async (req, res) => {
    console.log("itemID")
    const itemID = req.query.itemID

    try {
        const data = await new mssql.Request().query(`
        SELECT
        r.[ID] as rID 
      ,[ITEM_ID]
      ,[STEP_ID]
      ,r.[ORDER]
      ,[CREATE_BY]
      ,[CREATE_DATE]
      ,[MODIFY_BY]
      ,[MODIFY_DATE]
      ,[thoiGianThucHien]
      ,[soNguoiThucHien]
      ,r.[factoryId]
      ,[donGia]
      ,[xacnhanqc]
	  ,d.[ID]
      ,d.[CODE]
	  ,d.[NAME]
  FROM [prod].[ROUTING] r
  inner join base.DEPARTMENT d on r.STEP_ID = d.ID
where r.ITEM_ID = ${itemID}
ORDER BY r.[ORDER] asc
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get("/get-bom", async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT b.MATERIALS_ID as MATERIALS_ID
	,i.[CODE] as MATERIALS_CODE
	,i.[NAME] as MATERIALS_NAME
	,b.[RATE]
	,b.ITEM_ID
FROM PROD.BOM b
INNER JOIN base.ITEM i on b.MATERIALS_ID = i.ID
union
select distinct 
ITEM_ID MATERIALS_ID, 
i.CODE as MATERIALS_CODE, 
i.NAME as MATERIALS_NAME,
null as [RATE], 0 ITEM_ID  
from prod.bom b
inner join base.ITEM i on b.ITEM_ID = i.ID
where ITEM_ID not in (select MATERIALS_ID from prod.BOM)
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
//-------------------------------------------------------
router.post("/insert-bom", async (req, res, next) => {
    const payload = req.body;
    await new mssql.Request().query(`
        delete prod.bom where ITEM_ID = ${payload[0].idSanPham}
        `)
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[BOM]
            (
            [GUID]
            ,[ITEM_ID]
            ,[MATERIALS_ID]
            ,[RATE]
            ,[CREATE_BY]
            ,[CREATE_DATE]
            ,[createdAt]
            )
      VALUES
            (
            NEWID()
            ,${e.idSanPham}
            ,${e.idCauThanh}
            ,${e.heso}
            ,${e.createBy}
            ,getdate()
            ,getdate()
            )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});

router.delete("/remove-bom", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        delete prod.BOM where ITEM_ID = ${req.query.itemID} and MATERIALS_ID =  ${req.query.materialsID}
        `, async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});

router.put("/update-bom", async(req, res, next) => {
    const { recordset } = await new mssql.Request()
    .query(`
    UPDATE prod.BOM
    SET RATE = ${req.body.RATE}
    WHERE ITEM_ID = ${req.body.itemID} and MATERIALS_ID = ${req.body.materialsID}
`)
res.api.sendData(recordset)
});

router.post("/insert-routing", async (req, res, next) => {
    const payload = req.body;
    await new mssql.Request().query(`
    delete prod.ROUTING where ITEM_ID = ${payload[0].itemID}
        `)
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[ROUTING]
        (
            [GUID]
        ,[ITEM_ID]
        ,[STEP_ID]
        ,[ORDER]
        ,[CREATE_BY]
        ,[CREATE_DATE]
        )
  VALUES
        (
            NEWID()
        ,${e.itemID}
        ,${e.stepID}
        ,${e.order}
        ,${e.createBy}
        ,getdate()
        )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});
router.delete("/remove-rou", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        delete prod.ROUTING where ITEM_ID = ${req.query.itemID} and STEP_ID =  ${req.query.stepID}
        `, async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});
router.get("/get-bom-byItemID", async (req, res) => {
    try {
        const data = await new mssql.Request().query(`
        SELECT i.[ID]
        ,i.[GUID]
        ,[CODE]
        ,[NAME]
        ,[LENGTH]
        ,[WIDTH]
        ,[HEIGHT]
        ,[TYPE_ID]
        ,[UNIT_ID]
        ,[IMAGE_URL]
        ,i.[CREATE_DATE]
        ,[ACTIVE]
        ,[GROUP_ITEM]
        ,[MODULE_ID]
        ,[VOLUMN]
        ,[WOOD_TYPE_ID]
        ,[FACTORY_ID]
        ,[heSo]
        ,[MaterialType]
        ,[NEXT_ITEM_ID]
        ,[NEXT_STEP_ID]
        ,[GOODS_TYPE]
        ,[GRAFT]
        ,[ACCOUNTING_CODE]
        ,[GHICHU]
        ,[STATUS]
        ,[NHOMSP_TTD]
        ,[TON]
    FROM [base].[ITEM] i
      where ID in (select MATERIALS_ID from prod.BOM where ITEM_ID = ${req.query.itemID})
        `)
        res.status(200).send(data.recordset)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get("/get-all-bom", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT b.[ID]
        ,b.[GUID]
        ,[ITEM_ID]
        ,[MATERIALS_ID]
		,i.NAME as ITEM_NAME
		,i1.NAME as MATERIALS_NAME
        ,[RATE]
        ,b.[CREATE_BY]
        ,b.[CREATE_DATE]
        ,[MODIFY_BY]
        ,[MODIFY_DATE]
        ,b.[createdAt]
        ,b.[updatedAt]
        ,b.[factoryId]
        ,[donGia]
    FROM [prod].[BOM] b
    INNER JOIN base.ITEM i on i.ID = b.ITEM_ID
	INNER JOIN base.ITEM i1 on i1.ID = b.MATERIALS_ID
        `)
    res.api.sendData(recordset)
});
router.get("/get-item-in-bom", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        Select * from base.ITEM where ID 
in 
(SELECT distinct ITEM_ID from prod.BOM)
        `)
    res.api.sendData(recordset)
});
router.get("/get-name-material", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        select distinct b.MATERIALS_ID as MATERIALS_ID,i.NAME as NAME
        from prod.bom b
        inner join 
        base.ITEM i on b.MATERIALS_ID = i.ID
        `)
    res.api.sendData(recordset)
});
router.post("/g-insert-bom-temp", async (req, res, next) => {
        const payload = req.body;
        payload.forEach(e => {
            const query = `
            INSERT INTO [prod].[BOM_TEMP]
            (
            [ITEM_ID]
            ,[MATERIALS_ID]
            ,[RATE]
            ,[CREATED_BY]
            ,[CREATED_AT]
            ,IS_SEND
            ,STATUS
            )
      VALUES
            (
            ${e.idSanPham}
            ,${e.idCauThanh}
            ,${e.heso}
            ,${e.createBy}
            ,getdate()
            ,1
            ,'insert'
            )
            `
            new mssql.Request().query(query, (err, record) => {
                if (err)
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                next()
            })
        });
    }, (req, res) => {
        return res.api.sendData({ ok: 'ok' })
    });

router.put("/update-rate-bom-temp", async (req, res,next) => {
        const payload = req.body;
        console.log('bien:',payload)
        payload.forEach(e => {
            const query = `
            UPDATE [prod].[BOM]
            SET 
               [RATE] = ${e.rate}
          WHERE id = ${e.id}
            `
            new mssql.Request().query(query, (err, record) => {
                if (err)
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                next();
            })
        });
    }, (req, res) => {
        return res.api.sendData({ ok: 'ok' })
    });
router.delete("/gdeleteBom", async (req, res) => {
        console.log("payload")

        console.log(req.query)
        const { recordset } = await new mssql.Request()
            .query(`
            delete prod.BOM where id = ${req.query.idbom}
            `, async (err, record) => {
                if (err) {
                    console.log("err", err);
                    return res.api.sendFail(err);
                }
                res.api.sendData(record.recordset);
            })
    });
router.post("/g_insertRou", async (req, res, next) => {
        const payload = req.body;
        payload.forEach(e => {
            const query = `
            INSERT INTO [prod].[ROUTING_TEMPLATE]
            (
            [ITEM_ID]
            ,[STEP_ID]
            ,[ORDER]
            ,[CREATE_BY]
            ,[CREATE_DATE]
            )
      VALUES
            (
             ${e.idsp}
            ,${e.idDinhTuyen}
            ,${e.thutu}
            ,${e.createBy}
            ,getdate()
            )
            `
            new mssql.Request().query(query, (err, record) => {
                if (err)
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                next()
            })
        });
    }, (req, res) => {
        return res.api.sendData({ ok: 'ok' })
    });
    router.put("/update-order-routing", async (req, res,next) => {
        const payload = req.body;
        console.log('bien:',payload)
        payload.forEach(e => {
            const query = `
            UPDATE [prod].[ROUTING]
   SET 
      [ORDER] = ${e.order}
      ,[MODIFY_BY] = ${e.createBy}
      ,[MODIFY_DATE] = getdate()
 WHERE id = ${e.id}
            `
            new mssql.Request().query(query, (err, record) => {
                if (err)
                    return res.api.sendFail({
                        number: 4907,
                        message: err
                    })
                next();
            })
        });
    }, (req, res) => {
        return res.api.sendData({ ok: 'ok' })
    });
router.delete("/gdeleteRou", async (req, res) => {
    console.log("payload")

    console.log(req.query)
    const { recordset } = await new mssql.Request()
        .query(`
        DELETE FROM [prod].[ROUTING]
      WHERE id = ${req.query.idrou}
        `, async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});

router.get("/get-routingtemplate", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT distinct
        r.[RoutingID]
        ,r.[ITEM_ID]
        ,i.CODE
        ,i.NAME
        ,a.LAST_NAME
    FROM [prod].[ROUTING_TEMPLATE] r
  inner join base.ITEM i on r.[ITEM_ID] = i.ID
  inner join base.ACCOUNT a on r.CREATE_BY = a.ID
        `)
    res.api.sendData(recordset)
});

router.get("/get-all-routing", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT 
		r.ID
        ,[ITEM_ID]
        ,[STEP_ID]
		,d.[CODE] StepCode
		,d.[NAME] StepName
        ,r.[ORDER]
        ,[CREATE_BY]
        ,[CREATE_DATE]
        ,[MODIFY_BY]
        ,[MODIFY_DATE]
        ,[thoiGianThucHien]
        ,[soNguoiThucHien]
        ,r.[factoryId]
        ,[donGia]
        ,[xacnhanqc]
    FROM [prod].[ROUTING] r
	inner join base.DEPARTMENT d on r.[STEP_ID] = d.id
        `)
    res.api.sendData(recordset)
});

router.get("/get-all-temprouting", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT tr.[ID]
        ,tr.[RoutingID]
        ,tr.[ITEM_ID]
        ,tr.[STEP_ID]
		,d.CODE
		,d.NAME
        ,tr.[ORDER]
        ,tr.[CREATE_BY]
        ,tr.[CREATE_DATE]
        ,tr.[MODIFY_BY]
        ,tr.[MODIFY_DATE]
        ,tr.[factoryId]
    FROM [prod].[ROUTING_TEMPLATE] tr
	inner join base.DEPARTMENT d on tr.[STEP_ID] = d.id
        `)
    res.api.sendData(recordset)
});

router.post("/phe-duyet-dinh-tuyen", async (req, res, next) => {
    const payload = req.body;
    console.log("payload")
    console.log(payload)
    new mssql.Request().query(
        `
        delete prod.ROUTING where ITEM_ID = ${payload[0].idsp}
        delete prod.ROUTING_TEMPLATE where ITEM_ID = ${payload[0].idsp}
        `
    )
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[ROUTING]
           (
           [ITEM_ID]
           ,[STEP_ID]
           ,[ORDER]
           ,[CREATE_BY]
           ,[CREATE_DATE]
           ,[thoiGianThucHien]
           ,[soNguoiThucHien]
           ,[donGia]
           )
     VALUES
           (
            ${e.idsp}
           ,${e.idstep}
           ,${e.order}
           ,${e.createdBy}
           ,getdate()
           ,0
           ,0
           ,0
           )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});

router.post("/tu-choi-phe-duyet-dinh-tuyen", async (req, res, next) => {
    const payload = req.body;
    console.log("payload")
    console.log(payload)
   const query = 
        `
        delete prod.ROUTING_TEMPLATE where ITEM_ID = ${payload[0].idsp}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});

router.post("/insert-into-bomtemp", async (req, res, next) => {
    const payload = req.body;
    console.log("payload")
    console.log(payload)
    payload.forEach(e => {
        const query = `
        INSERT INTO prod.bom_template
        (
            [ITEMID]
        ,[CODE]
        ,[NAME]
        ,[LENGTH]
        ,[WIDTH]
        ,[HEIGHT]
        ,[TYPE_ID]
        ,[UNIT_ID]
        ,[CREATE_DATE]
        ,[CREATE_BY]
        ,[VOLUMN]
        ,[GOODS_TYPE]
        ,[STATUS]
        )
     VALUES
           (
            N'${e.itemID}'
           ,N'${e.maso}'
           ,N'${e.name}'
           ,${e.dai}
           ,${e.rong}
           ,${e.day}
           ,${e.chungloai}
           ,${e.donvi}
           ,getdate()
           ,${e.create_by}
           ,${e.heso}
           ,N'${e.dongsanpham}'
           ,N'create'
           )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});

router.get("/get-all-bom-temp", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT [ID]
      ,[ITEMID]
      ,[CODE]
      ,[NAME]
      ,[LENGTH]
      ,[WIDTH]
      ,[HEIGHT]
      ,[TYPE_ID]
      ,[UNIT_ID]
      ,[CREATE_DATE]
      ,[CREATE_BY]
      ,[approvedByAccount]
      ,[approvedAt]
      ,[VOLUMN]
      ,[FACTORY_ID]
      ,[GOODS_TYPE]
      ,[GHICHU]
      ,[approvedAtGD]
      ,[approvedByAccountGD]
      ,[STATUS]
  FROM [prod].[BOM_TEMPLATE]
        `)
    res.api.sendData(recordset)
});

router.post("/insert-san-pham", async (req, res, next) => {
    const payload = req.body;
    console.log('payload')
    console.log(payload)

    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[SanPham]
           (
            [MASP]
           ,[MACUMCHITIET]
           ,[MACHITIET]
           ,[NAME]
           ,[DAI]
           ,[RONG]
           ,[DAY]
           ,[DONGSANPHAM]
           ,[CHUNGLOAI]
           ,[DONVI]
           ,[TRANGTHAI]
           ,[KHACHHANG]
           ,[ANHSANPHAM]
           ,[TENNOIBO]
           ,[CREATE_BY]
           ,[TYPE]
           ,[TYPE_EDIT]
           )
     VALUES
           (
            N'${e.masanpham}'
           ,''
           ,''
           ,N'${e.tensp}'
           ,0
           ,0
           ,0
           ,N'${e.dongsanpham}'
           ,''
           ,''
           ,N'${e.trangthai}'
           ,N'${e.khachhang}'
           ,N'${e.anhsanpham}'
           ,N'${e.tennoibo}'
           ,${e.create_by}
           ,N'${e.type}'
           ,N'${e.type_edit}'
           )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});
router.post("/insert-cum", async (req, res, next) => {
    const payload = req.body;
    console.log('payload')
    console.log(payload)
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[SanPham]
           (
            [MASP]
           ,[MACUMCHITIET]
           ,[MACHITIET]
           ,[NAME]
           ,[DAI]
           ,[RONG]
           ,[DAY]
           ,[DONGSANPHAM]
           ,[CHUNGLOAI]
           ,[DONVI]
           ,[TRANGTHAI]
           ,[KHACHHANG]
           ,[ANHSANPHAM]
           ,[TENNOIBO]
           ,[CREATE_BY]
           ,[TYPE]
           ,[HESO]
           ,[TYPE_EDIT]
           )
     VALUES
           (
            N'${e.masosp}'
           ,N'${e.masocumchitiet}'
           ,''
           ,N'${e.name}'
           ,${e.dai}
           ,${e.rong}
           ,${e.day}
           ,N'${e.dongsanphamham}'
           ,N'${e.chungloai}'
           ,${e.donvi}
           ,N'${e.trangthai}'
           ,''
           ,''
           ,''
           ,${e.create_by}
           ,N'${e.type}'
           ,${e.heso}
           ,N'${e.type_edit}'
           )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});

router.post("/insert-chi-tiet", async (req, res, next) => {
    const payload = req.body;
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[SanPham]
           (
            [MASP]
           ,[MACUMCHITIET]
           ,[MACHITIET]
           ,[NAME]
           ,[DAI]
           ,[RONG]
           ,[DAY]
           ,[SOLUONG]
           ,[DONGSANPHAM]
           ,[CHUNGLOAI]
           ,[DONVI]
           ,[TRANGTHAI]
           ,[KHACHHANG]
           ,[ANHSANPHAM]
           ,[TENNOIBO]
           ,[CREATE_BY]
           ,[TYPE]
           ,[HESO]
           ,[TYPE_EDIT]
           )
     VALUES
           (
            N'${e.masosp}'
           ,N'${e.masocumchitiet}'
           ,N'${e.masochitiet}'
           ,N'${e.name}'
           ,${e.dai}
           ,${e.rong}
           ,${e.day}
           ,${e.soluong}
           ,N'${e.dongsanphamham}'
           ,N'${e.chungloai}'
           ,${e.donvi}
           ,N'${e.trangthai}'
           ,''
           ,''
           ,''
           ,${e.create_by}
           ,N'${e.type}'
           ,${e.heso}
           ,N'${e.type_edit}'
           )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});

router.get("/get-all-department-have-code", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT d.[ID]
        ,[GUID]
        ,[TYPE]
        ,[PARENT_ID]
        ,d.[CODE]
        ,d.[NAME]
        ,g.code
        ,[TYPE2]
        ,[ERROR]
        ,[PACKAGE_TYPE_GROUP_ID]
        ,[MODULE_ID]
        ,d.[ORDER]
        ,[caLamViec]
        ,[accountId]
        ,[accountId1]
        ,[accountId2]
        ,d.[factoryId]
        ,[GROUP_ID]
        ,[CONG_SUAT_TUAN]
        ,[GHI_CHU]
		,g.[ORDER] as [GORDER]
        ,g.[CONGSUAT] as [CONGSUAT]
        ,g.[CONGSUAT_APPROVED] as [CONGSUAT_APPROVED]
    FROM [base].[DEPARTMENT] d
    inner join [prod].[NhomCONGDOAN] g on d.ID = g.DEPARTMENT_ID
        `)
    res.api.sendData(recordset)
});
router.get("/get-all-san-pham", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT s.[ID]
        ,[MASP]
        ,[MACUMCHITIET]
        ,[MACHITIET]
        ,s.[NAME]
        ,[DAI]
        ,[RONG]
        ,[DAY]
        ,[SOLUONG]
        ,[DONGSANPHAM]
        ,[CHUNGLOAI]
		,t.[NAME] as [CHUNGLOAI_NAME]
        ,[DONVI]
		,u.[NAME] as [DONVI_NAME]
        ,[TRANGTHAI]
        ,[KHACHHANG]
        ,[ANHSANPHAM]
        ,[TENNOIBO]
        ,s.[CREATE_BY]
        ,a.LAST_NAME as CREATE_BY_NAME
        , TYPE
        ,[HESO]
        ,[TYPE_EDIT]
        ,COLOR
    FROM [prod].[SanPham] s
    INNER JOIN base.ACCOUNT a on s.[CREATE_BY] = a.ID
	LEFT JOIN base.ITEM_TYPE t on s.CHUNGLOAI = t.ID
	LEFT JOIN base.UNIT u on s.[DONVI] = u.ID
        `)
    res.api.sendData(recordset)
});
router.get("/get-ma-mau", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
   select * from [prod].[Ma_Mau]
        `)
    res.api.sendData(recordset)
});
router.get("/get-all-san-pham-duyet", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT s.[ID]
        ,[MASP]
        ,[MACUMCHITIET]
        ,[MACHITIET]
        ,s.[NAME]
        ,[DAI]
        ,[RONG]
        ,[DAY]
        ,[SOLUONG]
        ,[DONGSANPHAM]
        ,[CHUNGLOAI]
		,t.[NAME] as [CHUNGLOAI_NAME]
        ,[DONVI]
		,u.[NAME] as [DONVI_NAME]
        ,[TRANGTHAI]
        ,[KHACHHANG]
        ,[ANHSANPHAM]
        ,[TENNOIBO]
        ,s.[CREATE_BY]
        ,a.LAST_NAME as CREATE_BY_NAME
        ,CASE WHEN [TYPE] = 'chiTiet' and MACUMCHITIET = '' then 'cumChiTiet' 
        else [TYPE] end as TYPE
        ,[HESO]
        ,[TYPE_EDIT]
    FROM [prod].[SanPham] s
    INNER JOIN base.ACCOUNT a on s.[CREATE_BY] = a.ID
	LEFT JOIN base.ITEM_TYPE t on s.CHUNGLOAI = t.ID
	LEFT JOIN base.UNIT u on s.[DONVI] = u.ID
        `)
    res.api.sendData(recordset)
});
router.get("/lay-mau-san-pham", async (req, res) => {
    const { recordset } = await new mssql.Request()
    .input("masp", req.query.masp)
        .query(`
        select * from [prod].[Mau_SanPham]
        where MASP = @masp
        `)
    res.api.sendData(recordset)
});
router.put("/update-chi-tiet", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE [prod].[SanPham]
   SET 
      [MACUMCHITIET] = N'${element.macumchitiet}'
 WHERE ID = ${element.id}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.put("/update-chi-tiet-mau", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE [prod].[SanPham]
   SET 
      [COLOR] = N'${element.color}'
 WHERE ID = ${element.id}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.put("/insert-sp-mau", async (req, res,next) => {
    const payload = req.body
    const query = `
    delete from [prod].[Mau_SanPham] where [MASP] = '${payload[0].masp}'
      `
      new mssql.Request().query(query, (err, record) => {
          if (err)
              return res.api.sendFail({
                  number: 4907,
                  message: err
              })
              next()
      })
    payload.forEach(element => {
        const query = `
      insert into [prod].[Mau_SanPham] ([MASP],[COLOR])
      VALUES ('${element.masp}','${element.color}')
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.post("/insert-dinh-tuyen-templadte", async (req, res, next) => {
    const payload = req.body;
    new mssql.Request().query(`
    delete from prod.ROUTING_TEMPLATE where ITEM_ID = ${payload[0].idsp} and factoryId = ${payload[0].factoryId}
    `)
    if(payload[0].checknull){
        console.log("false")
        next()
    }else{
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[ROUTING_TEMPLATE]
           (
            [ITEM_ID]
           ,[STEP_ID]
           ,[ORDER]
           ,[CREATE_BY]
           ,[CREATE_DATE]
           ,[factoryId]
           ,[TrangThai]
           ,[SoLuongM]
           ,[SoLuongM3]
           ,[MongAm]
           ,[MongDuong]
           ,[Khoan]
           )
     VALUES
           (
            ${e.idsp}
           ,${e.iddepartment}
           ,${e.thutu}
           ,${e.created_by}
           ,getdate()
           ,${e.factoryId}
           ,N'chuaduyet'
           ,${e.soluongm}
           ,${e.soluongm3}
           ,${e.mongam}
           ,${e.mongduong}
           ,${e.khoan}
           )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});
router.get("/get-all-routing-temp", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT rt.[ID]
        ,[ITEM_ID]
        ,[STEP_ID]
        ,rt.[ORDER]
		,d.[NAME] as STEP_NAME
		,d.CODE as STEP_CODE
        ,[CREATE_BY]
        ,[CREATE_DATE]
        ,[MODIFY_BY]
        ,[MODIFY_DATE]
        ,rt.[factoryId]
        ,[TrangThai]
		,[SoLuongM]
        ,[SoLuongM3]
        ,[MongAm]
        ,[MongDuong]
        ,[Khoan]
    FROM [prod].[ROUTING_TEMPLATE] rt
	INNER JOIN  [BASE].[DEPARTMENT] d on  d.ID = rt.STEP_ID
        `)
    res.api.sendData(recordset)
});
router.put("/update-trang-thai-sp", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE [prod].[SanPham]
        SET 
      [TRANGTHAI] = N'chopheduyet'
     WHERE ID = ${element.idsp}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

router.put("/update-trang-thai-edit", async (req, res,next) => {
    const payload = req.body
    console.log('payload')
    console.log(payload)

    payload.forEach(element => {
        const query = `
        UPDATE [prod].[SanPham]
        SET 
       [TYPE_EDIT] = N'${element.type_edit}'
     WHERE ID = ${element.idsp}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.put("/tuchoi-SP-TEMP", async (req, res) => {
    const payload = req.body
    const id = payload[0].id
    const { recordset } = await new mssql.Request()
        .query(`
        UPDATE [prod].[SanPham]
   SET 
      [TRANGTHAI] = N'tuchoi' where ID = ${id}
        `)
    res.api.sendData(recordset)
});

router.put("/delete-routing-TEMP", async (req, res) => {
    const payload = req.body
    const id = payload[0].id
    const { recordset } = await new mssql.Request()
        .query(`
        delete from prod.ROUTING_TEMPLATE where ITEM_ID = ${id}
        `)
    res.api.sendData(recordset)
});

router.put("/duyet-SP-TEMP", async (req, res) => {
    const payload = req.body
    const id = payload[0].id
    const { recordset } = await new mssql.Request()
        .query(`
        UPDATE [prod].[SanPham]
   SET 
      [TRANGTHAI] = N'pheduyet' where ID = ${id}
        `)
    res.api.sendData(recordset)
});
router.delete("/reject-San-Pham", async (req, res) => {
    console.log('payload')
    console.log(req.query.payload)

    const { recordset } = new mssql.Request()
        .query(`
        DELETE PROD.SanPham WHERE ID = ${req.query.payload}
        DELETE FROM [prod].[ROUTING_TEMPLATE]
        WHERE ITEM_ID = ${req.query.payload}
        `, async (err, record) => {
            if (err) {
                console.log("err", err);
                return res.api.sendFail(err);
            }
            res.api.sendData(record.recordset);
        })
});

router.put("/approve-trang-thai-sp", async (req, res,next) => {
    const payload = req.body
    payload.forEach(element => {
        const query = `
        UPDATE [prod].[SanPham] SET [TRANGTHAI] = 'approve',[TYPE_EDIT] = '' WHERE ID = ${element.ID}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

router.post("/insert-sua-sp", async (req, res, next) => {
    const payload = req.body;
    payload.forEach(e => {
        const query = `
        INSERT INTO [prod].[SanPham]
           (
            [MASP]
           ,[MACUMCHITIET]
           ,[MACHITIET]
           ,[NAME]
           ,[DAI]
           ,[RONG]
           ,[DAY]
           ,[SOLUONG]
           ,[DONGSANPHAM]
           ,[CHUNGLOAI]
           ,[DONVI]
           ,[TRANGTHAI]
           ,[KHACHHANG]
           ,[ANHSANPHAM]
           ,[TENNOIBO]
           ,[CREATE_BY]
           ,[TYPE]
           ,[HESO]
           )
     VALUES
           (
            N'${e.masosp}'
           ,N'${e.masocumchitiet}'
           ,N'${e.masochitiet}'
           ,N'${e.name}'
           ,${e.dai}
           ,${e.rong}
           ,${e.day}
           ,${e.soluong}
           ,N'${e.dongsanphamham}'
           ,N'${e.chungloai}'
           ,${e.donvi}
           ,'chuaduyet'
           ,''
           ,''
           ,''
           ,${e.create_by}
           ,N'${e.type}'
           ,${e.heso}
           )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
});
router.put("/delete-sanpham", (req, res, next) => {
    payload = req.body
    payload.forEach(element => {
        let query = `
        delete from prod.SanPham where id = ${element.idxoa}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.put("/update-type-eidt", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE [prod].[SanPham]
        SET 
      [TYPE_EDIT] = N'${element.type}'
     WHERE ID = ${element.idxoa}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.put("/update-soluong-cum", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE [prod].[SanPham]
        SET 
      [SOLUONG] = ${element.soluong}
     WHERE MACUMCHITIET = N'${element.macum}' and TYPE = 'cumChiTiet'
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

router.put("/update-edit-sp", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE [prod].[SanPham]
   SET 
      [NAME] = N'${element.name}'
      ,[DAI] = ${element.dai}
      ,[RONG] = ${element.rong}
      ,[DAY] = ${element.day}
      ,[SOLUONG] = ${element.soluong}
      ,[DONGSANPHAM] = N'${element.dongsanpham}'
      ,[CHUNGLOAI] = ${element.chungloai}
      ,[DONVI] = ${element.donvi}
      ,[KHACHHANG] = N'${element.khachhang}'
      ,[TENNOIBO] = N'${element.tennoibo}'
      ,[HESO] = ${element.heso}
    WHERE MASP =  N'${element.masp}' and [MACUMCHITIET] = N'${element.macumchitiet}' and [MACHITIET] = N'${element.machitiet}'
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.put("/update-edit-cum-of-chitiet", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE [prod].[SanPham]
   SET 
        [MACUMCHITIET] = ''
    WHERE ID =  ${element.ID}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

router.put("/update-cong-suat-may", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE prod.NhomCONGDOAN
   SET 
      [CONGSUAT_APPROVED] = ${element.CONGSUAT}
      ,[TRANGTHAI] = N'${element.TRANGTHAI}'
        WHERE [DEPARTMENT_ID] = ${element.ID}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

router.put("/phe-duyet-cong-suat-may", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE prod.NhomCONGDOAN
   SET 
      [CONGSUAT] = ${element.CONGSUAT_APPROVED}
      ,[CONGSUAT_APPROVED] = ${element.CONGSUAT_APPROVED}
        WHERE [DEPARTMENT_ID] = ${element.ID}
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
router.post("/import_kehoachxuathang", (req, res, next) => {
    let payload = req.body;
    console.log('payload',payload)
    payload.forEach(element => {
        const query = `
        INSERT INTO [prod].[KHXH]
        ([consigment]
        ,[kho_IKEA]
        ,[mahang]
        ,[tenhang]
        ,[sl]
        ,[diadiem]
        ,[status]
        ,[ngaytao]
        ,[nguoitao]
        )
  VALUES
        (
        N'${element.Consigment}'
        ,N'${element.Kho_IKEA}'
        ,N'${element.mahang}'
        ,N'${element.tenhang}'
        ,${element.SL}
        ,N'${element.diadiem}'
        ,N'Chưa xuất'
        ,N'${element.ngaytao}'
        ,${element.nguoitao}
        )
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

router.get("/get_kehoachxuathang", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT [ID]
        ,k.[consigment]
        ,k.[kho_IKEA]
        ,[mahang]
        ,[tenhang]
        ,[sl]
        ,k.[diadiem]
		,IDMAX
		,rowspan
		,[status]
		,k.[ngayxuat]
        ,k.[nguoixuat]
        ,k.nguoitao,Ghepcong
        ,CONVERT (varchar(10), k.[ngaytao], 103)  as [ngaytao]
    FROM [prod].[KHXH] k
	INNER JOIN 
	(
	SELECT DISTINCT [consigment],max(ID) IDMAX,count([consigment]) rowspan
    FROM [prod].[KHXH]
    WHERE ngaytao = '${req.query.ngay}'
	GROUP BY [consigment]
	) T on T.consigment = k.consigment
    WHERE ngaytao = '${req.query.ngay}'
	order by consigment,ID desc
    `)
    res.api.sendData(recordset)
});
router.get("/get_Consigments", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT DISTINCT
        [consigment],
	 count([consigment]) as rowspan
    FROM [prod].[KHXH]
    WHERE ngaytao = '${req.query.ngay}'
	GROUP BY [consigment]
    `)
    res.api.sendData(recordset)
});
router.put("/update-consigments", async (req, res,next) => {
    const payload = req.body

    payload.forEach(element => {
        const query = `
        UPDATE [prod].[KHXH]
        SET [status] = N'Đã xuất'
            ,[ngayxuat] = getdate()
            ,[nguoixuat] = ${element.nguoixuat}
        WHERE consigment = N'${element.consigment}'
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})

router.get("/bien-ban-giao-nhan-hang-hoa", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        select M.CODE masp,I.NAME tensp, sum(IT.QUANTITY) sl,U.NAME DVT from prod.PACKAGE P
  left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
  left join prod.PO po on po.code = P.PO
  left join base.MARKET M on M.CODE = po.[root]
  left join base.ITEM I on I.ID = IT.ITEM_ID
  left join base.UNIT U on I.UNIT_ID = U.ID
  where DESTINATION_ID = 100071  and P.CREATE_DATE between N'${req.query.daungay}' and N'${req.query.cuoingay}'
  GROUP BY M.CODE ,I.NAME , U.NAME
        `)
    res.api.sendData(recordset)
});

router.get("/bc-nhap-xuat-ton-thanh-pham", async (req, res) => {
    const { recordset } = await new mssql.Request()
        .query(`
        SELECT J.masp,J.tensp,J.slnhap,J.slxuat,
case WHEN J.tondauky is null then 0
		else J.tondauky END as tondauky,
	case WHEN J.tondauky is null then (J.slnhap-J.slxuat)
		else (J.tondauky+J.slnhap-J.slxuat) END as toncuoiky,
	J.donvitinh
	 FROM
(
--lấy ra số lượng nhập - xuất trong khoảng thời gian
SELECT F.masp,F.tensp,F.slnhap,F.slxuat,S.tondauky,F.donvitinh
from
	(
	select masp,tensp,T.sl as slnhap,[NAME],
	case WHEN k.sl is null then 0
		else k.sl END as slxuat ,
	T.NAME as donvitinh
	from (
	select M.CODE masp,I.NAME tensp, sum(IT.QUANTITY) sl,U.NAME
	from prod.PACKAGE P
	  left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
	  left join prod.PO po on po.code = P.PO
	  left join base.MARKET M on M.CODE = po.[root]
	  left join base.ITEM I on I.ID = IT.ITEM_ID
	  left join base.UNIT U on I.UNIT_ID = U.ID
	  where DESTINATION_ID = 100071  and P.CREATE_DATE between N'${req.query.tuNgay}' and N'${req.query.denNgay}'
	  GROUP BY M.CODE ,I.NAME , U.NAME
	  )  T
	  left join prod.[KHXH] k on T.masp = k.mahang and k.status = N'Đã xuất' and k.ngayxuat between N'${req.query.tuNgay}' and N'${req.query.denNgay}'
	) F
LEFT JOIN
--tính tồn đầu kỳ
	(
	select masp,tensp,T.sl as slnhap,[NAME],
	case when k.sl is Null then 0
		else k.sl END as slxuat,
	case when k.sl is Null then T.sl
		else (T.sl-k.sl) END as tondauky
	from (
	select M.CODE masp,I.NAME tensp, sum(IT.QUANTITY) sl,U.NAME from prod.PACKAGE P
	  left join prod.ITEM_IN_PACKAGE IT on IT.PACKAGE_ID = P.ID
	  left join prod.PO po on po.code = P.PO
	  left join base.MARKET M on M.CODE = po.[root]
	  left join base.ITEM I on I.ID = IT.ITEM_ID
	  left join base.UNIT U on I.UNIT_ID = U.ID
	  where DESTINATION_ID = 100071  and P.CREATE_DATE < N'${req.query.tuNgay}'
	  GROUP BY M.CODE ,I.NAME , U.NAME
	  )  T
	  left join prod.[KHXH] k on T.masp = k.mahang and k.status = N'Đã xuất' and k.ngayxuat < N'${req.query.tuNgay}'
	) S
on F.masp = S.masp
) J
where J.masp NOT LIKE '%VA%'
        `)
    res.api.sendData(recordset)
});

router.put("/update-row-importKHXH", (req, res, next) => {
        let query = `
        UPDATE [prod].[KHXH]
        SET [consigment] = N'${req.body.consigment}'
           ,[kho_IKEA] = N'${req.body.kho_IKEA}'
           ,[mahang] = N'${req.body.mahang}'
           ,[tenhang] = N'${req.body.tenhang}'
           ,[sl] = ${req.body.sl}
    
          
           ,Ghepcong = '${req.body.Ghepcong}'
      WHERE ID = ${req.body.ID}
        `;
        new mssql.Request()
            .query(query, (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
            );
    });
 
router.put("/delete-row-importKHXH", (req, res, next) => {
        let query = `
        DELETE FROM [prod].[KHXH]
      WHERE ID = ${req.body.ID}
        `;
        new mssql.Request()
            .query(query, (err, record) => {
                if (err) return res.api.sendFail(query);
                res.api.sendData(record.recordset);
            }
            );
    });
    router.put("/update-he-so-lua-phoi", (req, res, next) => {
        new mssql.Request()
            .input("heso", req.body.HE_SO)
            .input("id", req.body.ID)
            .query(
                `
                UPDATE [prod].[HSLP]
                SET 
                [HE_SO] = @heso
                WHERE ID = @id
                `,
                (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907));
                    res.api.sendData(record.recordset);
                }
        );
});
module.exports = router;