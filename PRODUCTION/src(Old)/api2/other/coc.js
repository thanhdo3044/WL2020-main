const express = require("express");
const coc = express.Router();
const {
    sequelize,
    Coc,
    CocInfo,
    Item
} = require("../../../models");
const {
    Op
} = require("sequelize");
const {
    errorMessage,
    getErrorMessage
} = require("./../../core/config");
const mssql = require("mssql");
const guidv4 = require("uuid").v4;

coc.get(
    "/",
    async (req, res, next) => {
        let {
            from,
            to,
            factoryId
        } = req.query

        console.log(from,to,factoryId)

        try {
            let records = await Coc.findAll({
                include: {
                    model: CocInfo
                },
                where: {
                    [Op.and]: [{
                            factoryId: factoryId
                        },
                        {
                            date: {
                                [Op.between]: [from,to]
                            }
                        }
                    ]
                },
            });

        } catch (err) {
            status = 500;
            result.status = status;
            result.error = err;
            return res.status(status).send(result);
        }
        let getCOC = `SELECT C.ID id,C.FACTORY_ID factoryId,C.DATE date, C.ITEM_ID itemId,I.NAME itemName ,C.[ORDER] 'order', C.QUANTITY quantity
                        FROM prod.COC C
                        LEFT JOIN base.ITEM I ON I.ID = C.ITEM_ID
                        WHERE C.FACTORY_ID = @FACTORY_ID
                        AND C.DATE BETWEEN @FROM AND @TO
                        `;
        new mssql.Request()
            .input("FACTORY_ID", req.query.factoryId)
            .input("FROM", req.query.from)
            .input("TO", req.query.to)
            .query(getCOC, (err, record) => {
                if (err) return res.api.sendFail(getErrorMessage(4907));
                req.coc = [];
                record.recordset.forEach((e) => {
                    req.coc.push({
                        ...e,
                        info: [],
                    });
                });
                next();
            });
        },
        (req, res, next) => {
            let getCOCINFO = `SELECT CI.ID id,CI.COC_ID cocId, CI.[NAME] name, CI.[VENDOR] vendor, CI.[PARCEL] parcel
                        FROM prod.COC_INFO CI
                        LEFT JOIN prod.COC C ON C.ID = CI.COC_ID
                        WHERE C.FACTORY_ID = @FACTORY_ID
                        AND C.DATE BETWEEN @FROM AND @TO
                        `;
            new mssql.Request()
                .input("FACTORY_ID", req.query.factoryId)
                .input("FROM", req.query.from)
                .input("TO", req.query.to)
                .query(getCOCINFO, (err, record) => {
                    if (err) return res.api.sendFail(getErrorMessage(4907));
                    record.recordset.forEach((e) => {
                        let coc = req.coc.find((i) => i.id == e.cocId);
                        if (coc != undefined) {
                            coc.info.push(e);
                        }
                    });
                    res.api.sendData(req.coc);
                });
    }
);

coc.post("/", (req, res, next) => {
    let guid = guidv4();
    let insertCOC = `INSERT INTO prod.COC(GUID,DATE,ITEM_ID,[ORDER],QUANTITY,FACTORY_ID)
                    VALUES (@GUID,@DATE ,@ITEM_ID, @ORDER, @QUANTITY, @FACTORY_ID)`;
    new mssql.Request()
        .input("GUID", guid)
        .input("ITEM_ID", req.body.itemId)
        .input("DATE", req.body.date)
        .input("ORDER", req.body.order)
        .input("QUANTITY", req.body.quantity)
        .input("FACTORY_ID", req.body.factoryId)
        .query(insertCOC, (err, record) => {
            if (err) return res.api.sendFail(getErrorMessage(4907));
            req.body.info.forEach((e) => {
                let insertCOCINFO = `INSERT INTO prod.COC_INFO(COC_ID,NAME,VENDOR,PARCEL)
                                    SELECT ID,@NAME,@VENDOR,@PARCEL
                                    FROM prod.COC
                                    WHERE GUID = @GUID`;
                new mssql.Request()
                    .input("GUID", guid)
                    .input("NAME", e.name)
                    .input("VENDOR", e.vendor)
                    .input("PARCEL", e.parcel)
                    .query(insertCOCINFO, (err, record) => {
                        if (err) return res.api.sendFail(getErrorMessage(4907));
                    });
            });
            res.api.sendData([]);
        });
});

// coc.put('/:id', (req, res, next) => {
//     client.updateOne({
//         _id: ObjectId(req.params.id)
//     }, {
//         $set: req.body
//     }, (err, {
//         result
//     }) => {
//         if (err)
//             return res.api.sendData(getErrorMessage(4907))
//         res.api.sendData(result)
//     })
// })

// coc.delete('/:id', (req, res, next) => {
//     client.deleteOne({
//         _id: ObjectId(req.params.id)
//     }, (err, {
//         result
//     }) => {
//         if (err)
//             return res.api.sendFail(getErrorMessage(4907))
//         res.api.sendData(result)
//     })
// })

module.exports = coc;