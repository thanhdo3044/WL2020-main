const express = require("express");
const router = express.Router();
const mssql = require("mssql");
const { Po, Op, VItemInPackage, Item } = require("../../../models");
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
router.get("/:stepId/:itemId/san-luong-nhan-2", async(req, res) => {
    const { recordset } = await new mssql.Request()
        .input("stepId", req.params.stepId)
        .input("itemId", req.params.itemId)
        .query(`
select p.ID id, iip.QUANTITY quantiy, iip.ITEM_ID itemId, iip.ID x from prod.PACKAGE p
left join prod.ITEM_IN_PACKAGE iip on p.ID = iip.PACKAGE_ID
left join prod.PO po on po.code = p.PO
where p.DESTINATION_ID = @stepId and P.VERIFY_BY iS null and iip.ITEM_ID = @itemId
and PO in (
    select code
                                          from prod.PO
                                          where deletedAt is null and endPO = 0 and approvedAt is not null
                                         
    )
    order by po.week
    `)

    res.api.sendData(recordset)
})
router.get("/ton-tai-to", async(req, res) => {
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

router.get("/khoi-luong-giao-nhan", async(req, res) => {
    const { start, end } = req.query;
    let data = await new mssql.Request().query(`
    select b.*, i.NAME as tenCT, i.CODE as maCT, i.HEIGHT as height, i.WIDTH as width, i.LENGTH as length, d.NAME as tenCongDoan, 0 as donGia, 0 as thanhTien from (
		SELECT        PO.root AS marketId, p.SOURCE_ID AS stepId, sum(iip.QUANTITY) AS xuat, sum(ROUND(iip.QUANTITY * i.VOLUMN,4)) as xuatM3
        FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                 prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
								 LEFT JOIN prod.PO on PO.code = p.PO
								 LEFT JOIN base.ITEM i on i.ID = iip.ITEM_ID
        WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL)  and (p.CREATE_DATE BETWEEN '${start}' AND '${end}') --and p.SOURCE_ID = 100274
        group by PO.root, p.SOURCE_ID
    ) as b
	left join base.MARKET m on m.CODE = b.marketId
	left join base.ITEM i on i.ID = m.PRODUCT_ID
    left join base.DEPARTMENT d on d.ID = b.stepId
    `)

    res.status(200).send(data.recordset)
})

router.get("/khoi-luong-giao-nhan-2", async(req, res) => {
    const { start, end } = req.query;
    let data = await new mssql.Request().query(`
    select b.*, CONCAT(i.NAME, ' ' , b.MaterialType) as tenCT, i.CODE as maCT, i.HEIGHT as height, i.WIDTH as width, i.LENGTH as length, d.NAME as tenCongDoan, 0 as donGia, 0 as thanhTien from (
		SELECT        PO.root AS marketId, p.SOURCE_ID AS stepId, sum(iip.QUANTITY) AS xuat, sum(ROUND(iip.QUANTITY * i.VOLUMN,4)) as xuatM3, i.MaterialType as MaterialType
        FROM            prod.ITEM_IN_PACKAGE AS iip LEFT OUTER JOIN
                                 prod.PACKAGE AS p ON p.ID = iip.PACKAGE_ID
								 LEFT JOIN prod.PO on PO.code = p.PO
								 LEFT JOIN base.ITEM i on i.ID = iip.ITEM_ID
        WHERE        (p.PO IS NOT NULL) AND (iip.ITEM_ID IS NOT NULL)  and (p.CREATE_DATE BETWEEN '${start}' AND '${end}') --and p.SOURCE_ID in (100274,100264)
        group by PO.root, p.SOURCE_ID, i.MaterialType
    ) as b
	left join base.MARKET m on m.CODE = b.marketId
	left join base.ITEM i on i.ID = m.PRODUCT_ID
    left join base.DEPARTMENT d on d.ID = b.stepId
    `)

    res.status(200).send(data.recordset)
})

router.get("/lich-su-xuat-phoi-ton", async(req, res) => {
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
router.get("/cho-xac-nhan-phuong", (req, res, next) => {
    if (req.query.stepId) {
        new mssql.Request().input("stepId", req.query.stepId).query(
            `
            select I.ID itemId,
            I.CODE itemCode,
            I.NAME itemName,
            I.LENGTH itemLength,
            I.WIDTH itemWidth,
            I.HEIGHT itemHeight,
			t.* from (
	select IIP.ITEM_ID, SUM(IIP.QUANTITY) as quantity, P.CREATE_BY from prod.PACKAGE P
	left join prod.ITEM_IN_PACKAGE IIP ON IIP.PACKAGE_ID = P.ID
	left join prod.PO PO ON P.PO = PO.code
	where P.DESTINATION_ID = @stepId and P.VERIFY_BY iS null and PO.endPO = 0
	group by IIP.ITEM_ID,P.CREATE_BY
) as t
left join base.ITEM I ON I.ID = t.ITEM_ID
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
router.get("/:stepId/xac-nhan-phoi", async(req, res, next) => {
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

router.get("/:stepId/phoi-cho-nhan", async(req, res, next) => {
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
router.get("/:stepId/ghi-nhan-phoi", async(req, res, next) => {
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
        .input("MATERIALS_ID", data.materialsId)
        .input("MATERIALS_QUANTITY", data.materialsQuantity)
        .input("TYPE_ID", data.typeId)
        .input("REMEDIES_ID", data.remediesId)
        .input("DESCRIPTION", data.description)
        .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
        .input("PO", req.body.po ? req.body.po.replace("PO", "") : "")
        .output("ERROR")
        .execute("Proc_createPackage", async(err, record) => {
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
                  where a.id = b.ITEM_ID
                )
                select distinct * from temp0
              GO;
                
                `);

                //Trừ các công đoạn ở dưới

                const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} 
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq
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
        .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
        .input("PO", req.body.po ? req.body.po.replace("PO", "") : "")
        .output("ERROR")
        .execute("Proc_createPackage_1", async(err, record) => {
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
                  where a.id = b.ITEM_ID
                )
                select distinct * from temp0
              GO;
                
                `);

                //Trừ các công đoạn ở dưới

                const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} 
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq
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


router.post("/", (req, res) => {
    console.log("package", req.body.tonconlai);
    let data = req.body;
    new mssql.Request()
        .input("FROM_ID", data.sourceId)
        .input("TO_ID", data.destinationId)
        .input("ITEM_FROM_ID", data.itemFromId)
        .input("ITEM_ID", data.itemId)
        .input("QUANTITY", data.quantity)
        // .input("TONCONLAI", data.tonconlai)
        .input("MATERIALS_ID", data.materialsId)
        .input("MATERIALS_QUANTITY", data.materialsQuantity)
        .input("TYPE_ID", data.typeId)
        .input("REMEDIES_ID", data.remediesId)
        .input("DESCRIPTION", data.description)
        .input("ACCOUNT_ID", req.headers["x-gateway-account-id"])
        .input("PO", req.body.po ? req.body.po.replace("PO", "") : "")
        .output("ERROR")
        .execute("Proc_createPackage", async(err, record) => {
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
                console.log('Ghi nhan loi so lenh APHUONG ', poCode, ' san pham Id:', req.body.itemId)
                    //kiểm tra poCode
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
                  select ITEM_ID as id, RATE as rate from prod.BOM where ITEM_ID in (${po.itemId})
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

                const congDoanDuois = await new mssql.Request().query(`
                WITH temp0(itemId, stepId, seq)
                    as(
                        select ITEM_ID as itemId, STEP_ID as stepId, [ORDER] as seq from prod.ROUTING where STEP_ID = ${po.stepId}
                        and ITEM_ID = ${po.itemId} 
                        Union All
                        select r.ITEM_ID as itemId, r.STEP_ID as stepId, r.[ORDER] as seq
                        from prod.ROUTING as r, temp0 as t
                        where t.itemId = r.ITEM_ID and r.[ORDER] < t.seq
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

module.exports = router;