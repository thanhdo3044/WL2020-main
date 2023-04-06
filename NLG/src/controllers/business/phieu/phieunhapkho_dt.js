const express = require('express')
const mssql = require('mssql')
const { mssqlExcutedQuery, PROCEDUCES, VIEWS } = require('../../../config/database')
const khodt = express.Router()
const model = require('../../../data/model')
const uuidv4 = require('uuid/v4');


khodt.get('/', (req, res) => {

    new mssql.Request()
        .query(`SELECT 
            A.ID id,
            A.SOPHIEUNHAP sophieu,
           A.DAY DAY ,
           A.RONG RONG,
           A.CAO DAI,
          
           A.SOBO SOBO,
           A.SOTHANH_BO SOTHANHBO,
           A.ACTUALDATE ngaynhaptt
          
          

            FROM nlg.PHIEUNHAPKHO_DT A 
             where A.SOPHIEUNHAP = '${req.query.guid}'`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

})
khodt.get('/huy', (req, res) => {

    new mssql.Request()
        .query(`DELETE FROM nlg.PHIEUTRAVE WHERE SOPHIEUTRAVE ='${req.query.id}'
        UPDATE nlg.PHIEUNHAPKHO_DT SET DELAI ='Y',SOPHIEUTRAVE = null
    WHERE SOPHIEUTRAVE ='${req.query.id}'`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

})
khodt.get('/baocao-nhapkho', (req, res) => {
    new mssql.Request()
        .query(`SELECT DISTINCT PT.ID id,PT.DAY DAY, PT.RONG RONG, PT.CAO CAO, PT.SOBO SOBO,PT.PALLET,PT.NOTE,
        PT.SOPHIEUNHAP SOPHIEUNHAP, PT.SOTHANH_BO SOTHANH_BO,P.CREATED_AT CREATED_AT,
        CASE when T.HOTROKHAC > 0 then 'FSC' else 'KLS' END AS  HOTROKHAC,
        P.BIENSOXE BIENSOXE, PR.NAME MANCC, (PT.SOBO*PT.SOTHANH_BO) AS TONGTHANH,PT.OVER_PLAN,PT.khacKho,PT.vuotkho,
        CASE when (PT.DAY = 55 and PT.RONG = 55) then ROUND(((CAST(PT.DAY AS FLOAT)*PT.RONG*PT.CAO*PT.SOBO*PT.SOTHANH_BO*3.14)/4000000000),2)
        else
        ROUND(((CAST(PT.DAY AS FLOAT)*PT.RONG*PT.CAO*PT.SOBO*PT.SOTHANH_BO)/1000000000),2) END AS KHOILUONG
         from nlg.PHIEUNHAPKHO_DT PT
        JOIN nlg.PHIEUNHAPKHO P on P.SOPHIEU = PT.SOPHIEUNHAP 
        JOIN nlg.PROVIDERS PR on PR.CODE = P.MANCC
        JOIN nlg.GROUP_CODE GQC ON GQC.ID = PT.CODENHOM
        LEFT JOIN nlg.BOM QC ON QC.NHOM = GQC.ID
        left join nlg.TINHTIEN T on T.SOPHIEU = PT.SOPHIEUNHAP
        where PT.DEL_FLAG = 'N' and PT.DELAI = 'N'  and P.CREATED_AT BETWEEN '${req.query.fromDate} 00:00:00' AND '${req.query.toDate} 23:59:59' 
        ORDER BY P.CREATED_AT`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })

})
khodt.get('/ds-delai', (req, res) => {
    const makho = req.query.makho
    let condition = ` AND PN.MAKHO='${req.query.makho}'`
    if (req.query.makho == 'null') {
        condition = ``
    } else {
        condition = ` AND PN.MAKHO='${req.query.makho}'`
    }
    const query = `SELECT PT.ID ID,PT.DAY DAY,PT.RONG RONG,PT.CAO CAO,PT.SOBO SOBO,ROUND(CAST(PT.DAY AS FLOAT)*PT.RONG*PT.CAO*PT.SOTHANH_BO*PT.SOBO/1000000000,4) AS KHOILUONG
        ,PT.NOTE NOTE,PR.[NAME] AS [NAME_NCC],PT.SOTHANH_BO SOTHANHBO,
        PN.SOPHIEU SOPHIEU, PN.MANCC MA_NCC,PN.MAKHO MAKHO,PN.CREATED_AT CREATED_AT,
        PN.ACTUALDATE ACTUALDATE,PN.BIENSOXE
        FROM nlg.PHIEUNHAPKHO_DT AS PT
        JOIN nlg.PHIEUNHAPKHO AS PN ON PN.SOPHIEU = PT.SOPHIEUNHAP
        
        INNER JOIN nlg.PROVIDERS AS PR ON PR.CODE = PN.MANCC
        
        WHERE PT.DEL_FLAG='N' AND PT.DELAI='Y'  ${condition}`
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
khodt.get('/ds-delai-1P', (req, res) => {

    const query = `SELECT PT.ID ID,PT.DAY DAY,PT.RONG RONG,PT.CAO CAO,PT.SOBO SOBO,ROUND(CAST(PT.DAY AS FLOAT)*PT.RONG*PT.CAO*PT.SOTHANH_BO*PT.SOBO/1000000000,4) AS KHOILUONG
        ,PT.NOTEHACAP NOTE,PT.SOTHANH_BO SOTHANH_BO,PT.SOPHIEUNHAP
       
        
        FROM nlg.PHIEUNHAPKHO_DT AS PT
              
        WHERE PT.DEL_FLAG='N' AND PT.DELAI='Y' AND PT.SOPHIEUNHAP = '${req.query.sophieu}' AND PT.CODE = '${req.query.code}'`
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
khodt.get('/ds-trave', (req, res) => {
    const makho = req.query.makho
    let condition = ` AND PN.MAKHO='${req.query.makho}'`
    if (req.query.makho == 'null') {
        condition = ``
    } else {
        condition = ` AND PN.MAKHO='${req.query.makho}'`
    }
    const query = `SELECT P.ID ID,PT.DAY DAY,PT.RONG RONG,PT.CAO CAO,PT.SOBO SOBO,ROUND(CAST(PT.DAY AS FLOAT)*PT.RONG*PT.CAO*PT.SOTHANH_BO*PT.SOBO/1000000000,4) AS KHOILUONG
        ,PT.NOTE NOTE,PR.[NAME] AS [NAME_NCC],PT.SOTHANH_BO SOTHANHBO,
        PT.SOPHIEUTRAVE SOPHIEU, PN.MAKHO MAKHO,
        P.CREATED_AT CREATED_AT
        FROM nlg.PHIEUNHAPKHO_DT AS PT
        JOIN nlg.PHIEUNHAPKHO AS PN ON PN.SOPHIEU = PT.SOPHIEUNHAP
        JOIN nlg.PHIEUTRAVE AS P ON P.SOPHIEUTRAVE = PT.SOPHIEUTRAVE
        INNER JOIN nlg.PROVIDERS AS PR ON PR.CODE = PN.MANCC
        
        WHERE PT.DEL_FLAG='N' AND PT.DELAI='T'  ${condition} ORDER BY P.CREATED_AT DESC `
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
khodt.get('/ds-nhaplai', (req, res) => {
    // const makho = req.query.makho
    // let condition = ` AND PN.MAKHO='${req.query.makho}'`
    // if (req.query.makho == 'null') {
    //     condition = ``
    // } else {
    //     condition = ` AND PN.MAKHO='${req.query.makho}'`
    // }
    const query = `SELECT P.ID ID,PT.DAY DAY,PT.RONG RONG,PT.CAO CAO,PT.SOBO SOBO,ROUND(CAST(PT.DAY AS FLOAT)*PT.RONG*PT.CAO*PT.SOTHANH_BO*PT.SOBO/1000000000,4) AS KHOILUONG
        ,PT.NOTE NOTE,PR.[NAME] AS [NAME_NCC],PT.SOTHANH_BO SOTHANHBO,
        PT.SOPHIEUTRAVE SOPHIEU, PN.MAKHO MAKHO,PT.DONGIA_CTY dongia,
        P.CREATED_AT CREATED_AT
        FROM nlg.PHIEUNHAPKHO_DT AS PT
        JOIN nlg.PHIEUNHAPKHO AS PN ON PN.SOPHIEU = PT.SOPHIEUNHAP
        JOIN nlg.PHIEUTRAVE AS P ON P.SOPHIEUTRAVE = PT.SOPHIEUTRAVE
        INNER JOIN nlg.PROVIDERS AS PR ON PR.CODE = PN.MANCC
        
        WHERE PT.DEL_FLAG='N' AND PT.DELAI='M' and P.CREATED_AT BETWEEN '${req.query.from} 00:00:00' AND '${req.query.to} 23:59:59'  ORDER BY P.ID DESC `
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
khodt.get('/tao-phieu', (req, res) => {
    const makho = req.query.makho
    let condition = ` AND FROMSL='${req.query.makho}'`
    if (req.query.makho == 'null') {
        condition = ``
    } else {
        condition = ` AND FROMSL='${req.query.makho}'`
    }
    const query = `SELECT SOPHIEUTRAVE sophieu, CREATED_AT
        FROM nlg.PHIEUTRAVE 
        
        
        WHERE YEAR(CREATED_AT) = DATEPART(year, GETDATE()) and MONTH(CREATED_AT) = DATEPART(MONTH, GETDATE())  ${condition}`
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
khodt.get('/tao-phieu-nhap-lai', (req, res) => {
    const makho = req.query.makho
    let condition = ` AND FROMSL='${req.query.makho}'`
    if (req.query.makho == 'null') {
        condition = ``
    } else {
        condition = ` AND FROMSL='${req.query.makho}'`
    }
    const query = `SELECT SOPHIEUTRAVE sophieu, CREATED_AT
        FROM nlg.PHIEUTRAVE 
        
        
        WHERE NHAPLAI = 'Y' and YEAR(CREATED_AT) = DATEPART(year, GETDATE()) and MONTH(CREATED_AT) = DATEPART(MONTH, GETDATE())  ${condition}`
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
khodt.get('/ds-phieu-trave', (req, res) => {
    // const makho = req.query.makho
    // let condition = ` AND PN.MAKHO='${req.query.makho}'`
    // if (req.query.makho == 'null') {
    //     condition = ``
    // } else {
    //     condition = ` AND PN.MAKHO='${req.query.makho}'`
    // }
    const query = `SELECT P.ID ID,PT.DAY DAY,PT.RONG RONG,PT.CAO CAO,PT.SOBO SOBO,ROUND(CAST(PT.DAY AS FLOAT)*PT.RONG*PT.CAO*PT.SOTHANH_BO*PT.SOBO/1000000000,4) AS KHOILUONG
        ,PT.NOTE NOTE,PR.[NAME] AS [NAME_NCC],PT.SOTHANH_BO SOTHANHBO,
        PT.SOPHIEUTRAVE SOPHIEU, PN.MAKHO MAKHO, PR.ADDRESS NCC_ADDRESS,
        P.CREATED_AT CREATED_AT, PN.BIENSOXE BIENSOXE
        FROM nlg.PHIEUNHAPKHO_DT AS PT
        JOIN nlg.PHIEUNHAPKHO AS PN ON PN.SOPHIEU = PT.SOPHIEUNHAP
        JOIN nlg.PHIEUTRAVE AS P ON P.SOPHIEUTRAVE = PT.SOPHIEUTRAVE
        INNER JOIN nlg.PROVIDERS AS PR ON PR.CODE = PN.MANCC
        
        WHERE PT.DEL_FLAG='N' AND PT.DELAI='T' AND PT.SOPHIEUTRAVE = '${req.query.guid}'
        ORDER BY P.CREATED_AT DESC `
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
khodt.get('/department-th', (req, res) => {
    
    const query = 
    `
    select ID, '['+CONVERT(varchar, CODE)+ '] ' +  NAME NAME
    from base.DEPARTMENT 
    where factoryId in (100000, 102427) and TYPE2 = 'to' 
    order by NAME
    `
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
khodt.get('/ds-phieu-nhaplai', (req, res) => {
    // const makho = req.query.makho
    // let condition = ` AND PN.MAKHO='${req.query.makho}'`
    // if (req.query.makho == 'null') {
    //     condition = ``
    // } else {
    //     condition = ` AND PN.MAKHO='${req.query.makho}'`
    // }
    const query = `SELECT P.ID ID,PT.DAY DAY,PT.RONG RONG,PT.CAO CAO,PT.SOBO SOBO,ROUND(CAST(PT.DAY AS FLOAT)*PT.RONG*PT.CAO*PT.SOTHANH_BO*PT.SOBO/1000000000,4) AS KHOILUONG
        ,PT.NOTE NOTE,PR.[NAME] AS [NAME_NCC],PT.SOTHANH_BO SOTHANHBO,PT.SOPHIEUNHAP,
        PT.SOPHIEUTRAVE SOPHIEU, PN.MAKHO MAKHO, PR.ADDRESS NCC_ADDRESS,
        P.CREATED_AT CREATED_AT, PN.BIENSOXE BIENSOXE
        FROM nlg.PHIEUNHAPKHO_DT AS PT
        JOIN nlg.PHIEUNHAPKHO AS PN ON PN.SOPHIEU = PT.SOPHIEUNHAP
        JOIN nlg.PHIEUTRAVE AS P ON P.SOPHIEUTRAVE = PT.SOPHIEUTRAVE
        INNER JOIN nlg.PROVIDERS AS PR ON PR.CODE = PN.MANCC
        
        WHERE PT.DEL_FLAG='N' AND PT.DELAI='M' AND PT.SOPHIEUTRAVE = '${req.query.guid}'
        ORDER BY P.CREATED_AT DESC `
    mssqlExcutedQuery(query, (data, err) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        return res.api.sendData(data.recordset)
    })
})
khodt.post('/', (req, res, next) => {
    //req.body.createBy = req.headers['x-gateway-account-id']

    next()
}, model.khodt.insert)
khodt.put('/', (req, res, next) => {
    new mssql.Request()
        .query(`UPDATE nlg.PHIEUNHAPKHO_DT SET SAMPLEQTY=${req.body.SAMPLEQTY},MALOGONHAP = '${req.body.MALOGONHAP}' WHERE ID= ${req.body.id}`, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
khodt.post('/phe-duyeths', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[PHIEU_CHI_DINH] ([parentId],[heso],[week],[year],[keHoach],[capgo],[number],[createdAt],[createdby],[itemId],[factoryId],[GROUP_CODE],[Tonys1]
            ,[TonTH],[Tontb],GHICHU,BX,DVT,PHOI,MALOGO) 
        VALUES ('${element.paren_id}','${element.HESO}','${req.body.week}','${req.body.year}','${element.keHoach}','${element.klc}','${req.body.number}', GETDATE(),'${req.body.createBy}','${element.ITEM_ID}','${req.body.factoryId}'
        ,'${element.GROUP_CODE}','${element.YS}','${element.TH}','${element.TB}',N'${element.GHICHU}',N'${element.BX}',N'${element.DVT}',N'${element.PHOI}',N'${element.MALOGO}')`
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
khodt.post('/xac-nhan-kho-btp', (req, res, next) => {
    const datanhan = req.body.datanhan

    datanhan.forEach(element => {
        const query = `update prod.PACKAGE
        set  VERIFY_BY = '${req.body.createBy}',VERIFY_DATE = GETDATE(),
        QUANTITYNHAN = '${element.QUANTITYNHAN?element.QUANTITYNHAN:element.QUANTITY}',DESCRIPTION = N'${element.GHICHU?element.GHICHU:''}'
        where ID = '${element.ID}'
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
khodt.post('/xac-nhan-bg', (req, res, next) => {
    const datanhan = req.body.datanhan

    datanhan.forEach(element => {
        if (element.QUANTITYNHAN>0) {
        const query = `update prod.ITEM_IN_PACKAGE
        set  
        QUANTITY = '${element.QUANTITYNHAN}'
        where PACKAGE_ID = '${element.ID}'
        update prod.MATERIALS_IN_PACKAGE
        set QUANTITY = '${element.QUANTITYNHAN}' where ITEM_IN_PACKAGE_ID = (select ID from prod.ITEM_IN_PACKAGE where PACKAGE_ID = '${element.ID}')
        `
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            
            next()
        })
    }
    });

}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
khodt.post('/update-items',(req, res,next)=>{
    const datanhan = req.body
    datanhan.forEach(element => {
        const query = `  update base.ITEM
        set TYPE_ID =N'${element.typeId}',UNIT_ID =N'${element.unitId}',GOODS_TYPE =N'${element.GOODS_TYPE}', NAME = N'${element.name}',CODE = N'${element.code}',GHICHU = N'${element.GHICHU}'
        where ID = '${element.ID}'
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
khodt.post('/xac-nhan-sx', (req, res, next) => {
    const datanhan = req.body.datanhan

    datanhan.forEach(element => {
        const query = `update prod.PACKAGE
        set  SX_VERIFY_BY = '${req.body.createBy}',SX_VERIFY_DATE = GETDATE(),DESTINATION_ID = '${element.noiden}'
        where ID = '${element.ID}'
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
khodt.post('/xac-nhan-sx-mua-ngoai', (req, res, next) => {
    const datanhan = req.body.datanhan

    datanhan.forEach(element => {
        const query = `update [prod].[OPENING_STOCK]
        set  SX_VERIFY_BY = '${req.body.createBy}',SX_VERIFY_DATE = GETDATE(),DESTINATION_ID = '${element.noiden}'
        where ID = '${element.ID}'
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
khodt.post('/xuat-goTH', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[XUAT_GO] ([heso],[week],[year],[keHoach],[capgo],[number],[createdAt],[createdby],[itemId],[factoryId]
            ,KLC_TH,DAY,RONG,DAI,SOURCE_ID,DESTINATION_ID,SL_TH,luadat,GROUP_CODE,BX,XUATNHAP,PHOI,GHICHU) 
        VALUES ('${element.HESO}','${req.body.week}','${req.body.year}','${element.keHoach}','${element.capgo}','${req.body.number}', GETDATE(),'${req.body.createBy}','${element.ITEM_ID}','${req.body.factoryId}'
        ,'${element.TonTH}','${element.DAY}','${element.RONG}','${element.DAI}','${req.body.SOURCE_ID}','${element.noiden}','${element.THANH}','${element.luadat}','${element.tenqc}','${element.BX}','${req.body.XUATNHAP}','${element.PHOI}',N'${element.GHICHU}')`
        new mssql.Request().query(query, (err, record) => {
            if (err)
                return res.api.sendFail({
                    number: 4907,
                    message: err
                })
            next()
        })
    });
}, (req, res, next) => {
    //rollback
    const query = `UPDATE [prod].[XUAT_GO]
    set SOURCE_ID = 102495 WHERE luadat = 'daluadat' and createdby = 102047 and SOURCE_ID = 102494 `
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail(getErrorMessage(4907))
        next()
    })

}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
khodt.post('/xuat-goTHNM', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[XUAT_GO] ([week],[year],[number],[createdAt],[createdby],[factoryId]
            ,KLC_TH,DAY,RONG,DAI,SOURCE_ID,DESTINATION_ID,SL_TH,luadat,BX,XUATNHAP,GHICHU) 
        VALUES ('${req.body.week}','${req.body.year}','${req.body.number}', '${req.body.createdAt}','${req.body.createBy}','${req.body.factoryId}'
        ,'${element.TonTH}','${element.DAY}','${element.RONG}','${element.DAI}','${req.body.SOURCE_ID}','${element.noiden}','${element.THANH}','${element.luadat}','','${req.body.XUATNHAP}','${element.GHICHU}')`
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
khodt.post('/xuat-go-luan-chuyen', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[XUAT_GO_BAO] ([week],[year],[number],[createdAt],[createdby],[factoryId]
            ,KLC_TH,DAY,RONG,DAI,SOURCE_ID,DESTINATION_ID,SL_TH,XUATNHAP,GHICHU,BSX) 
        VALUES ('${req.body.week}','${req.body.year}','${req.body.number}', '${req.body.createdAt}','${req.body.createBy}','${req.body.factoryId}'
        ,'${element.TonTH}','${element.DAY}','${element.RONG}','${element.DAI}','${req.body.SOURCE_ID}','${element.noiden}','${element.THANH}','${req.body.XUATNHAP}','${element.GHICHU}','${req.body.BSX}')`
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
khodt.post('/xuat-go-2M', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[XUAT_GO_BAO] ([week],[year],[number],[createdAt],[createdby],[factoryId]
            ,KLC_TH,DAY,RONG,DAI,SL_TH,XUATNHAP) 
        VALUES ('${req.body.week}','${req.body.year}','${req.body.number}', '${req.body.createdAt}','${req.body.createBy}','${req.body.factoryId}'
        ,'${element.TonTH}','${element.DAY}','${element.RONG}','${element.DAI}','${element.THANH}','${req.body.XUATNHAP}')`
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
khodt.post('/nhap-dongia', (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `INSERT INTO   [prod].[GIA_TINH_LUONG] ([dongia],[createdAt],[createdby],[factoryId]
          ,stepId,parentId,itemId  ) 
        VALUES ('${element.donGia}', GETDATE(),'${req.body.createBy}','${req.body.factoryId}'
        ,'${element.stepId}','${element.paren_id}','${element.ITEM_ID}')`
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
khodt.post('/phe-duyethscd', (req, res, next) => {

    let condition = `and DVT = '${req.body.DVT}'`
if (req.body.DVT == "")  condition = ``
    const query = `update [prod].[PHIEU_CHI_DINH] set approvedByAccount = '${req.body.createBy}',approvedAt =GETDATE() where number = '${req.body.number}' and approvedAt is null  ${condition}`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        next()
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
khodt.post('/xoa-phe-duyethscd', (req, res, next) => {



    const query = `delete from [prod].[PHIEU_CHI_DINH] where number = '${req.body.number}' and approvedAt is null`
    new mssql.Request().query(query, (err, record) => {
        if (err)
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        next()
    });
}, (req, res) => {
    return res.api.sendData({ ok: 'ok' })
})
khodt.put('/:id', model.khodt.updateById)
    //khodt.delete('/:id', model.khodt.deleteById)
    // khodt.put('/', (req, res, next) => {
    //     new mssql.Request()
    //     .query(`UPDATE nlg.PHIEUNHAPKHO_DT SET SOBO=${req.body.soboconlai} WHERE ID= ${req.body.id}`, (err, record) => {
    //         if (err)
    //             return res.api.sendFail(getErrorMessage(4907))
    //         res.api.sendData(record.recordset)
    //     })
    //     })
    // kho_dt.put('/:id', (req, res) => {
    //     const uid = req.headers['x-gateway-account-id']
    //     const detailId = req.params.id
    //     const quicachId = req.body.quicachId
    //     const sobo = req.body.sobo ? req.body.sobo : 0
    //     const sothanhbo = req.body.sothanhbo ? req.body.sothanhbo : 0
    //     const note = req.body.note
    //     const delai = req.body.delai ? req.body.delai : 'N'
    //     const del_flag = req.body.delFlag ? req.body.delFlag : 'N'
    //     const slmau = req.body.slmau ? req.body.slmau : 0
    //     new mssql.Request()
    //         .input('DETAIL_ID', mssql.Int, detailId)
    //         .input('SOTHANH', mssql.Int, sobo)
    //         .input('SOTHANH_BO', mssql.Int, sothanhbo)
    //         .input('QC_ID', mssql.Int, quicachId)
    //         .input('NOTE', mssql.NVarChar(300), note)
    //         .input('DELAI', mssql.VarChar(30), delai)
    //         .input('DEL_FLAG', mssql.VarChar(20), del_flag)
    //         .input('SLMAU', mssql.Int, slmau)
    //         .execute(PROCEDUCES.EDIT_NHAP_KHO, (err, data) => {
    //             if (err) {
    //                 return res.api.sendFail({
    //                     number: 4907,
    //                     message: err
    //                 })
    //             }
    //             return res.api.sendData(data.recordset)
    //         })
    // })
    // khodt.post('/de-lai-1-phan', (req, res, next) => {
    //     const id = req.body.id
    //     const soboConLai = req.body.soboConLai
    //     const query = `UPDATE nlg.PHIEUNHAPKHO_DT SET SOBO=${req.body.soboConLai} WHERE ID= ${id}`
    //     new mssql.Request().query(query, (err, record) => {
    //         if (err)
    //             return res.api.sendFail({
    //                     number: 4907,
    //                     message: err
    //                 })
    //                 //return res.api.sendData(data.recordset)
    //         next()
    //     })
    // }, (req, res) => {
    //     // thêm 1 mã mới và để lại
    //     new mssql.Request()
    //         .input('ID_OLD', mssql.Int, req.body.id)
    //         .input('SOBO_DELAI', req.body.soboDelai)
    //         .input('NOTE', req.body.note || '')
    //         .execute(PROCEDUCES.PROC_DELAI_1PHAN, (err, data) => {
    //             if (err) {
    //                 return res.api.sendFail({
    //                     number: 4907,
    //                     message: err
    //                 })
    //             }
    //             return res.api.sendData(data.recordset)
    //         })
    // })
khodt.post('/tra-ve', (req, res, next) => {
    const makho = req.body.makho
    const mancc = req.body.mancc
        // const note = req.body.note
        // const randomId = Math.floor(Math.random() * 1000)
    const sophieutrave = req.body.sophieutrave
        //req.sophieutrave = sophieutrave
        //req.guid = uuidv4()
        //TAOJ 
    const query = `INSERT INTO nlg.PHIEUTRAVE([SOPHIEUTRAVE],[MANCC],[CREATED_AT],[CREATE_BY],[FROMSL]) 
        VALUES('${req.body.sophieutrave}','${req.body.mancc.toString().trim()}',getdate(),'${req.body.CREATE_BY}','${req.body.makho.toString().trim()}')`
    new mssql.Request().query(query, (err, data) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        // return res.api.sendData(data.recordset)
        next()
    })

}, (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `UPDATE NLG.PHIEUNHAPKHO_DT SET DELAI='T',SOPHIEUTRAVE='${req.body.sophieutrave}' WHERE ID = ${element.ID}`
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
khodt.post('/mua-lai', (req, res, next) => {
    const makho = req.body.makho
    const mancc = req.body.mancc
        // const note = req.body.note
        // const randomId = Math.floor(Math.random() * 1000)
    const sophieutrave = req.body.sophieutrave
        //req.sophieutrave = sophieutrave
        //req.guid = uuidv4()
        //TAOJ 
    const query = `INSERT INTO nlg.PHIEUTRAVE([SOPHIEUTRAVE],[MANCC],[CREATED_AT],[CREATE_BY],[FROMSL],[NHAPLAI],[ALLOWTINHTIEN]) 
        VALUES('${req.body.sophieutrave}','${req.body.mancc.toString().trim()}',getdate(),'${req.body.CREATE_BY}','${req.body.makho.toString().trim()}','Y','Y')`
    new mssql.Request().query(query, (err, data) => {
        if (err) {
            return res.api.sendFail({
                number: 4907,
                message: err
            })
        }
        // return res.api.sendData(data.recordset)
        next()
    })

}, (req, res, next) => {
    const dataDelai = req.body.dataDelai

    dataDelai.forEach(element => {
        const query = `UPDATE NLG.PHIEUNHAPKHO_DT SET DELAI='M',SOPHIEUTRAVE='${req.body.sophieutrave}' WHERE ID = ${element.ID}`
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

module.exports = khodt