const express = require('express')
const mssql = require('mssql')
const QC = express.Router()

QC.post('/', async (req, res) => {
    new mssql.Request()
        .input('fromId', req.body.itemFromId)
        .input('destinationId', req.body.destinationId)
        .input('itemId', req.body.itemId)
        .input('quantity', req.body.quantity)
        .input('packageId', req.body.packageId)
        .input('factoryId', req.body.factoryId)
        .execute('[prod].[Proc_handleQC]', (err, result) => {
            if (err) {
                console.log(error)
                return res.status(500).send(error)
            }
            res.status(200).json({ result, success: true, message: 'OK' })
        }

        )


    // @destinationId int,
    // @itemId int,
    // @quantity decimal(19, 6),
    // @packageId int,
    // @factoryId int
})
module.exports = QC
// const express = require('express')
// const mssql = require('mssql')
// const QC = express.Router()

// QC.post('/', async (req, res) => {
//     const transaction = new mssql.Transaction()
//     let data = req.body;
//     transaction.begin(async err => {
//         const progress = new mssql.Request(transaction)
//         try {
//             const data1 = await progress.input("FROM_ID", data.sourceId)
//                 .input("TO_ID", data.destinationId)
//                 .input("ITEM_FROM_ID", data.itemFromId)
//                 .input("ITEM_ID", data.itemId)
//                 .input("QUANTITY", data.quantity)
//                 // .input("TONCONLAI", data.tonconlai)
//                 .input("MATERIALS_ID", data.materialsId)
//                 .input("MATERIALS_QUANTITY", data.materialsQuantity)
//                 .input("TYPE_ID", data.typeId)
//                 .input("REMEDIES_ID", data.remediesId)
//                 .input("DESCRIPTION", data.description)
//                 .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
//                 .input("PO", req.body.po ? req.body.po.replace("PO", "") : "")
//                 .output("ERROR")
//                 .execute("Proc_createPackage")
//             const data2 = await progress.input('fromId', req.body.itemFromId)
//                 .input('destinationId', req.body.destinationId)
//                 .input('itemId', req.body.itemId)
//                 .input('quantity', req.body.quantity)
//                 .input('packageId', req.body.packageId)
//                 .input('factoryId', req.body.factoryId)
//                 .execute('[prod].[Proc_handleQC]')

//             await transaction.commit()
//             res.status(200).json({ data1, data2, success: true, message: 'OK' })
//         } catch (err) {
//             transaction.rollback();
//             console.log(err)
//             return res.status(500).send(err)
//         }



//     })

//     // @destinationId int,
//     // @itemId int,
//     // @quantity decimal(19, 6),
//     // @packageId int,
//     // @factoryId int
// })
// module.exports = QC