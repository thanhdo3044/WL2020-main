const { AccountForm, data, Account } = require("../models");
const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");

const db = {};
const { sequelize } = require("../config/config");

function validateCaledarWork(value) {
    const schema = Joi.object({
        accountId: Joi.number().required()
    });
    return schema.validate(value);
}

module.exports = {
    delete: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let caledarWork = await CalendarWork.findByPk(req.params.id);
            if (caledarWork === null) {
                status = 400;
            } else {
                let affectedRows = await caledarWork.destroy();
                result.data = affectedRows;
            }
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }

        return res.status(status).send(result);
    },



    add: async(req, res) => {
        let result = {};
        let status = 201;

        let { error, value } = validateCaledarWork(req.body);

        if (error) {
            status = 500;
            result.status = status;
            result.error = error;
            return res.status(status).send(result);
        }

        try {
            let caledarWork = await CalendarWork.create(value, {
                include: []
            });
            result.data = caledarWork;
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }

        return res.status(status).send(result);
    },

    show: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let caledarWork = await CalendarWork.findOne({
                include: [Account],
                where: {
                    id: req.params.id
                }
            });
            if (caledarWork == null) {
                status = 400;
            } else {
                result.data = caledarWork;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }

        return res.status(status).send(result);
    },

    update: async(req, res) => {
        let result = {};
        let status = 201;

        let { error, value } = validateCaledarWork(req.body);
        if (error) {
            status = 500;
            console.log(error);
            result.error = error;
            return res.status(status).send(result);
        }

        try {
            let affectedRows = await CalendarWork.update(value, {
                where: {
                    id: req.params.id
                }
            });
            result.data = affectedRows;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getAll: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let accountForm = await sequelize.query(
                `
            select * from base.AccountForms a
            left join base.ProposalForm p on p.id = a.proposalFormId
            left join base.ACCOUNT ac on ac.ID  = a.accountId
            left join base.DEPARTMENT d on d.id = ac.departmentId
            where a.accountId = ${req.query.accountId}`, { type: QueryTypes.SELECT }
            );
            result.data = accountForm;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getAllSearch: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let caledarWork = await sequelize.query(
                `select *,  DATEDIFF(DAY,c.startDate,c.endDate) as days,DATEDIFF(MINUTE,c.startDate,c.endDate) as duration,c.title as title , c.description as details, SUBSTRING(CONVERT(VARCHAR, c.startDate ,121),0,11) date,SUBSTRING(CONVERT(VARCHAR, c.startDate ,108),0,6) as time, c.endDate from eof.CalendarWork c where c.permission = 1 and c.accountId = ${req.query.id}`, { type: QueryTypes.SELECT }
            );
            result.data = caledarWork;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getAllActive: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let caledarWork = await sequelize.query(
                `select * from eof.CalendarWork c left join base.ACCOUNT a on a.id = c.accountId where CONVERT(DATETIME, '${req.body.startDate}', 102) < c.endDate and  CONVERT(DATETIME, '${req.body.startDate}', 102) > c.startDate and c.accountId = ${req.body.id} 
                                                    `, { type: QueryTypes.SELECT }
            );
            result.data = caledarWork;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    import: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let caledarWork = await CalendarWork.bulkCreate(req.body);
            result.data = caledarWork;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    backup: async(req, res) => {
        let result = {};
        let status = 200;
        result.data = await data.caledarWork;
        return res.status(status).send(result);
    }
};