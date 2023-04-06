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
    id: Joi.any().required(),
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
    activeSuccess: Joi.any().empty(),
    lyDo: Joi.any().empty()
  });
  return schema.validate(order);
}

module.exports = {
  delete: async (req, res) => {
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
  add: async (req, res) => {
    let result = {};
    let status = 201;
    if (req.body.item) {
      let item = req.body.item;

      try {
        let order = await Order.create(
          {
            ...item,
            OrderMeta: [
              {
                id: uuidv4(),
                metaKey: "order",
                metaValue: JSON.stringify([]),
                hoursIn: req.body.orderMeta.hoursIn,
                hoursOut: req.body.orderMeta.hoursOut,
                fullName: req.body.orderMeta.fullName,
                maNV: req.body.orderMeta.maNV,
                date: req.body.orderMeta.date
              }
            ]
          },
          {
            include: [OrderMeta, Account]
          }
        );
        result.data = order;
      } catch (error) {
        status = 500;
        result.error = error;
      }

      return res.status(status).send(result);
    } else {
      let { error, value } = validateUser(req.body);
      if (error) {
        status = 500;
        result.status = status;
        result.error = error;
        return res.status(status).send(result);
      }
      try {
        let order = await Order.create(
          {
            ...value,
            OrderMeta: [
              {
                id: uuidv4(),
                metaKey: "order",
                metaValue: JSON.stringify([]),
                description: req.body.lyDo ? req.body.lyDo : null,

              }
            ]
          },
          {
            include: [OrderMeta, Account]
          }
        );
        result.data = order;
      } catch (error) {
        status = 500;
        result.error = error;
      }

      return res.status(status).send(result);
    }
  },

  show: async (req, res) => {
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
      status = 500;
      result.error = error;
    }

    return res.status(status).send(result);
  },

  searchOrderRangeTime: async (req, res, next) => {
    let result = {};
    let status = 200;
    let { dateStart, dateEnd, idDepartment, activeSuccess } = req.query;
    try {
      let idProposalForm = [];
      if (idDepartment == 102320) {
        // vật tư thuận hưng
        idProposalForm.push(3, 1028, 1029, 1031, 1037, 1038, 1039, 1040, 1041);
      }
      else if (idDepartment == 102319 || 102298) {
        // Nhân sự xin nghỉ phép
        if (activeSuccess == 2) {
          idProposalForm.push(16);
          activeSuccess = 0;
        } else if (activeSuccess == 3) {
          idProposalForm.push(12);
          activeSuccess = 0;
        } else if (activeSuccess == 4) {
          idProposalForm.push(1042);
          activeSuccess = 0;
        }
      }
      let orders = await Order.findAll({
        include: [
          OrderMeta,
          Request,
          // {
          //   model: Request,
          //   as: "Requests",
          //   where: {
          //     show: 1
          //   },
          //   order: ["successRequest", "DESC"]
          // },
          Message,
          {
            model: ProposalForm,
            as: "ProposalForm",
            where: {
              id: {
                [Op.in]: idProposalForm
              }
            } //
          },
          Department,
          Account
        ],
        order: [[Request, "star", "DESC"]],
        where: {
          createdAt: {
            [Op.between]: [dateStart, dateEnd]
          },
          activeSuccess: activeSuccess,
          status: "Đã được duyệt"
        }
      });
      if (!orders) {
        status = 400;
      } else {
        result.data = orders;
      }
    } catch (error) {
      error = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  confirmPriorityLevel: async (req, res, next) => {
    let result = {};
    let status = 200;
    let { priorityLevel, id } = req.query;
    try {
      let dataOrder = await sequelize.query(
        `update eof.Orders set priorityLevel = ${priorityLevel}
                where id='${id}'`,
        { type: QueryTypes.update }
      );
      if (!dataOrder) {
        status = 400;
      } else {
        result.data = dataOrder;
      }
    } catch (error) {
      error = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  confirmComputerEquipment: async (req, res, next) => {
    let result = {};
    let status = 200;
    let { computerEquipment, id } = req.query;
    try {
      let dataOrder = await sequelize.query(
        `update eof.Orders set computerEquipment = ${computerEquipment}
                where id='${id}'`,
        { type: QueryTypes.update }
      );
      if (!dataOrder) {
        status = 400;
      } else {
        result.data = dataOrder;
      }
    } catch (error) {
      error = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  update: async (req, res) => {
    let result = {};
    let status = 201;

    let { error, value } = validateUser(req.body);
    if (error) {
      status = 500;
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
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  resetOrder: async (req, res) => {
    let result = {};
    let status = 201;
    let { orderId } = req.query;
    try {
      let data = await Order.update(
        {
          completed: false,
          status: "Mới",
          edit: false
        },
        {
          where: {
            id: orderId
          }
        }
      );
    } catch (error) {
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  updateOrder: async (req, res) => {
    let result = {};
    let status = 201;
    let { intendedUse } = req.body;
    try {
      let data = await Order.update(
        {
          intendedUse: intendedUse
        },
        {
          where: {
            id: req.params.id
          }
        }
      );
      result.data = data;
    } catch (error) {
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  updateSuccessOrder: async (req, res) => {
    let result = {};
    let status = 201;
    let { activeSuccess, nameSuccess } = req.query;
    try {
      let dataCheck = await Order.findByPk(req.params.id);
      if (dataCheck.dataValues.activeSuccess == 0) {
        let data = await Order.update(
          {
            activeSuccess: activeSuccess,
            timeSuccess: moment().format(),
            nameSuccess: nameSuccess
          },
          {
            where: {
              id: req.params.id
            }
          }
        );
        result.data = data;
      } else {
        let data = "Đã hoàn thành";
        result.data = data;
      }
    } catch (error) {
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  updateSeenOrder: async (req, res) => {
    let result = {};
    let status = 201;
    let { activeSeen } = req.query;
    try {
      let dataCheck = await Order.findByPk(req.params.id);
      if (dataCheck.dataValues.activeSeen == 0) {
        let data = await Order.update(
          {
            activeSeen: activeSeen,
            timeSeen: moment().format()
          },
          {
            where: {
              id: req.params.id
            }
          }
        );
        result.data = data;
      } else {
        let data = "Đã xem";
        result.data = data;
      }
    } catch (error) {
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  getAllOrders: async (req, res) => {
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
        order: [["updatedAt", "DESC"]],
        where: {
            createdAt: {
                [Op.between]: [req.query.dateStart, req.query.dateEnd]
            }
        }
      });
      result.data = orders;
    } catch (error) {
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  getXNVOrders: async (req, res) => {
    let result = {};
        let status = 200;
        try {
            let order  = await sequelize.query(
                `
                select distinct o.id ,A.ACCOUNT maNV, A.LAST_NAME fullName, om.selection, om.dateStart, om.dateEnd, om.description, o.status, D.NAME department,
o.createdAt, (
select top 1 successRequest from eof.Requests r where r.orderId = o.id order by star desc
) successRequest,
(
select top 1 a.LAST_NAME from eof.Requests r inner join
base.ACCOUNT a on r.accountId = a.ID
where r.orderId = o.id order by star desc
) lastName
from eof.Orders o left join 
eof.OrderMeta om on o.id = om.orderId
left join base.ACCOUNT A on o.accountId = A.ID
left join base.DEPARTMENT D on D.ID = o.departmentId
left join [eof].[Requests] R on R.orderId = o.id
where o.slug = 'xin-nghi-viec' and R.accountId is not null
and ( TRY_CONVERT(DATETIME, dateStart, 105) between '${req.query.dateStart}' and '${req.query.dateEnd}'
or TRY_CONVERT(DATETIME, dateEnd, 105) between '${req.query.dateStart}' and '${req.query.dateEnd}')
            `);
            result.data = order;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
  },

  getLTGOrders: async (req, res) => {
    let result = {};
        let status = 200;
        try {
            let order  = await sequelize.query(
                `
                select om.maNV, fullName, om.department, om.work, om.[date], hoursIn, hoursOut, total, o.status, CONVERT(nvarchar, o.createdAt, 103) createdAt
from eof.Orders o left join 
eof.OrderMeta om on o.id = om.orderId
where o.slug = 'xac-nhan-cong'  and om.maNV is not null --and o.status = N'Đã được duyệt'
and TRY_CONVERT(DATETIME, date, 105) between '${req.query.dateStart}' and '${req.query.dateEnd}'
            `);
            result.data = order;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
  },

  getXRCOrders: async (req, res) => {
    let result = {};
        let status = 200;
        try {
            let order  = await sequelize.query(
                `
                select distinct o.id ,om.maNV, om.fullName, om.dateStart, om.dateEnd, om.description, om.department,
r.timeVTAccept, r.timeVTAcceptEnd,(
  select top 1 successRequest from eof.Requests r where r.orderId = o.id 
  and successRequest is not null
  order by star desc
  ) successRequest, o.status
from eof.Orders o left join 
eof.OrderMeta om on o.id = om.orderId left join
eof.Requests r on o.id = r.orderId and r.position = N'Phòng bảo vệ'
where o.slug = 'xin-ra-cong' --and o.status = N'Đã được duyệt'
 and r.accountId is not null
and ( TRY_CONVERT(DATETIME, dateStart, 105) between '${req.query.dateStart}' and '${req.query.dateEnd}'
or TRY_CONVERT(DATETIME, dateEnd, 105) between '${req.query.dateStart}' and '${req.query.dateEnd}')
            `);
            result.data = order;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
  },

  getAll: async (req, res) => {
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
        order: [["updatedAt", "DESC"]]
      });
      result.data = orders;
    } catch (error) {
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  getOrderByStatus: async (req, res) => {
    let result = {};
    let status = 200;
    let { accountId, trangThai } = req.query;
    try {
      let orders = await Order.findAll({
        where: {
          accountId: accountId,
          status: trangThai
        },
        include: [
          OrderMeta,
          Request,
          Message,
          ProposalForm,
          Department,
          Account
        ],
        order: [["updatedAt", "DESC"]]
      });
      result.data = orders;
    } catch (error) {
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  getOrderByStatusAndDate: async (req, res) => {
    let result = {};
    let status = 200;
    let { accountId, trangThai, from, to } = req.query;
    try {
      let orders = await Order.findAll({
        where: {
          accountId: accountId,
          status: trangThai,
          createdAt: {
            [Op.between]: [from, to]
        }
        },
        include: [
          OrderMeta,
          Request,
          Message,
          ProposalForm,
          Department,
          Account
        ],
        order: [["updatedAt", "DESC"]]
      });
      result.data = orders;
    } catch (error) {
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  import: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let orders = await Order.bulkCreate(req.body);
      result.data = orders;
    } catch (error) {
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  backup: async (req, res) => {
    let result = {};
    let status = 200;
    result.data = await data.orders;
    return res.status(status).send(result);
  }
};
