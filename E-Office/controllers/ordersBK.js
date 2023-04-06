const {
    Order,
    OrderMeta,
    Request,
    Message,
    ProposalForm,
    Department,
    Account,
    data
} = require("../models");
const { Op } = require("sequelize");
const Joi = require("@hapi/joi");
const { v4: uuidv4 } = require("uuid");
const { QueryTypes } = require("sequelize");
const moment = require("moment");
const db = {};
const { sequelize } = require("../config/config");
// const { sequelize2 } = require("../config/config2");

function validateUser(order) {
    const schema = Joi.object({
        id: Joi.string().required(),
        accountId: Joi.number().required(),
        departmentId: Joi.number().required(),
        proposalFormId: Joi.number().required(),
        title: Joi.string().required(),
        status: Joi.string(),
        completed: Joi.boolean(),
        factoryId: Joi.number(),
        slug: Joi.string(),
        priorityLevel: Joi.any().empty(),
        computerEquipment: Joi.any().empty(),
        intendedUse: Joi.any().empty(),
        activeSeen: Joi.any().empty(),
        timeSeen: Joi.any().empty(),
        timeSuccess: Joi.any().empty(),
        activeSuccess: Joi.any().empty()
    });
    return schema.validate(order);
}

module.exports = {
    delete: async(req, res) => {
        let result = {};
        let status = 200;

        try {
            let order = await Order.findByPk(req.params.id);
            if (order === null) {
                status = 400;
            } else {
                let affectedRows = await order.destroy();
                result.data = affectedRows;
            }
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }

        return res.status(status).send(result);
    },

    // getMaVT: async(req, res) => {
    //     let result = {};
    //     let status = 200;
    //     console.log('getmaVT')
    //     let { ma_vt } = req.query;
    //     try {
    //         let requests = await sequelize2.query(
    //             `
    //             select ma_vt,ten_vt,dvt,ma_vt2 from dbo.dmvt where ma_vt='${ma_vt}'`, { type: QueryTypes.SELECT }
    //         );
    //         result.data = requests;
    //     } catch (error) {
    //         status = 500;
    //         console.log(error);
    //         result.error = error;
    //     }

    //     return res.status(status).send(result);
    // },
    add: async(req, res) => {
        let result = {};
        let status = 201;

        let { error, value } = validateUser(req.body);

        if (error) {
            status = 500;
            result.status = status;
            result.error = error;
            return res.status(status).send(result);
        }

        try {
            let order = await Order.create({
                ...value,
                OrderMeta: [{
                    id: uuidv4(),
                    metaKey: "order",
                    metaValue: JSON.stringify([])
                }]
            }, {
                include: [OrderMeta, Account]
            });
            console.log("order", Account);
            result.data = order;
        } catch (error) {
            status = 500;
            console.log(error);
            result.error = error;
        }

        return res.status(status).send(result);
    },

    show: async(req, res) => {
        let { id } = req.params;
        let result = {};
        let status = 200;

        try {
            let order = await Order.findOne({
                where: {
                    id
                },
                include: [
                    OrderMeta,
                    Request,
                    Message,
                    ProposalForm,
                    Department,
                    Account
                ]
            });
            if (order == null) {
                status = 400;
            } else {
                result.data = order;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }

        return res.status(status).send(result);
    },

    searchOrderRangeTime: async(req, res, next) => {
        let result = {};
        let status = 200;
        let { dateStart, dateEnd } = req.query;
        try {
            let orders = await Order.findAll({
                include: [
                    OrderMeta,
                    Request,
                    Message,
                    ProposalForm,
                    Department,
                    Account
                ],
                order: [
                    ["updatedAt", "DESC"]
                ],
                where: {
                    createdAt: {
                        [Op.between]: [dateStart, dateEnd]
                    }
                }
            });
            console.log(orders);
            if (!orders) {
                status = 400;
            } else {
                result.data = orders;
            }
        } catch (error) {
            console.log(error);
            error = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    confirmPriorityLevel: async(req, res, next) => {
        let result = {};
        let status = 200;
        let { priorityLevel, id } = req.query;
        try {
            let dataOrder = await sequelize.query(
                `update eof.Orders set priorityLevel = ${priorityLevel}
                where id='${id}'`, { type: QueryTypes.update }
            );
            console.log(dataOrder);
            if (!dataOrder) {
                status = 400;
            } else {
                result.data = dataOrder;
            }
        } catch (error) {
            console.log(error);
            error = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    confirmComputerEquipment: async(req, res, next) => {
        let result = {};
        let status = 200;
        let { computerEquipment, id } = req.query;
        try {
            let dataOrder = await sequelize.query(
                `update eof.Orders set computerEquipment = ${computerEquipment}
                where id='${id}'`, { type: QueryTypes.update }
            );
            console.log(dataOrder);
            if (!dataOrder) {
                status = 400;
            } else {
                result.data = dataOrder;
            }
        } catch (error) {
            console.log(error);
            error = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    update: async(req, res) => {
        let result = {};
        let status = 201;

        let { error, value } = validateUser(req.body);
        if (error) {
            status = 500;
            console.log(error);
            result.error = error;
            return res.status(status).send(result);
        }

        try {
            let order = await Order.findByPk(req.params.id);

            if (order == null) {
                status = 400;
            } else {
                order.userId = value.userId;
                order.costcenterId = value.costcenterId;
                order.companyId = value.companyId;
                result.data = await order.save();
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    resetOrder: async(req, res) => {
        let result = {};
        let status = 201;
        let { orderId } = req.query;
        try {
            let data = await Order.update({
                completed: false,
                status: "Mới",
                edit: false
            }, {
                where: {
                    id: orderId
                }
            });
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    updateOrder: async(req, res) => {
        let result = {};
        let status = 201;
        let { intendedUse } = req.body;
        try {
            let data = await Order.update({
                intendedUse: intendedUse
            }, {
                where: {
                    id: req.params.id
                }
            });
            result.data = data;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    updateSuccessOrder: async(req, res) => {
        let result = {};
        let status = 201;
        let { activeSuccess, nameSuccess } = req.query;
        try {
            let dataCheck = await Order.findByPk(req.params.id);
            console.log("dataCheck", dataCheck);
            if (dataCheck.dataValues.activeSuccess == 0) {
                let data = await Order.update({
                    activeSuccess: activeSuccess,
                    timeSuccess: moment().format(),
                    nameSuccess: nameSuccess
                }, {
                    where: {
                        id: req.params.id
                    }
                });
                result.data = data;
            } else {
                let data = "Đã hoàn thành";
                result.data = data;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    updateSeenOrder: async(req, res) => {
        let result = {};
        let status = 201;
        let { activeSeen } = req.query;
        try {
            let dataCheck = await Order.findByPk(req.params.id);
            console.log("dataCheck", dataCheck);
            if (dataCheck.dataValues.activeSeen == 0) {
                let data = await Order.update({
                    activeSeen: activeSeen,
                    timeSeen: moment().format()
                }, {
                    where: {
                        id: req.params.id
                    }
                });
                result.data = data;
            } else {
                let data = "Đã xem";
                result.data = data;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getAllOrders: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let orders = await Order.findAll({
                include: [
                    OrderMeta,
                    Request,
                    Message,
                    ProposalForm,
                    Department,
                    Account
                ],
                order: [
                    ["updatedAt", "DESC"]
                ],
                // where: {
                //     createdAt: {
                //         [Op.between]: ["2020/12/01", "2020/12/31"]
                //     }
                // }
            });
            result.data = orders;
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
        let { accountId } = req.query;
        try {
            let orders = await Order.findAll({
                where: {
                    accountId: accountId
                },
                include: [
                    OrderMeta,
                    Request,
                    Message,
                    ProposalForm,
                    Department,
                    Account
                ],
                order: [
                    ["updatedAt", "DESC"]
                ]
            });
            result.data = orders;
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
            let orders = await Order.bulkCreate(req.body);
            result.data = orders;
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
        result.data = await data.orders;
        return res.status(status).send(result);
    }
};