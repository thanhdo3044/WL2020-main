const { OrderMeta, data, Order } = require("../models");
const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");

const db = {};
const { sequelize } = require("../config/config");

function validateOrderMeta(value) {
  const schema = Joi.object({
    id: Joi.string().required(),
    orderId: Joi.string(),
    metaKey: Joi.string(),
    metaValue: Joi.string().required(),
    dateStart: Joi.string().empty(),
    dateEnd: Joi.string().empty(),
    carId: Joi.string(),
    toLocation: Joi.string(),
    fromLocation: Joi.string(),
    selection: Joi.string().empty(),
    fullName: Joi.string().empty(),
    STT: Joi.any().empty(),
    tenThietBiVP: Joi.string().empty(),
    donViTinh: Joi.string().empty(),
    soLuongDeXuat: Joi.any().empty(),
    soLuongCap: Joi.any().empty(),
    number: Joi.any().empty(),
    description: Joi.string(),
    position: Joi.string().empty(),
    luongHienTai: Joi.string().empty(),
    luongDeXuat: Joi.any().empty(),
    thoiGianTangLuongGanNhat: Joi.any().empty(),
    maNV: Joi.string().empty(),
    fullName2: Joi.string().empty(),
    position2: Joi.string().empty(),
    maVT: Joi.string().empty(),
    tenVT: Joi.string().empty(),
    yeuCauKyThuat: Joi.string().empty(),
    mucDichSuDung: Joi.string().empty(),
    phoneNumber: Joi.string().empty(),
    locationWork: Joi.string().empty(),
    timeRecruit: Joi.string().empty(),
    kinhGui: Joi.string().empty(),
    department: Joi.string().empty(),
    department2: Joi.string().empty(),
    stepDepartment: Joi.string().empty(),
    lyDo: Joi.string().empty(),
    thoiGianMangThai: Joi.string(),
    xinRaCong: Joi.string(),
    quyCach: Joi.string().empty(),
    Tenbaoho: Joi.string().empty(),
    work: Joi.string().empty(),
    date: Joi.string().empty(),
    total: Joi.any().empty(),
    hoursIn: Joi.any().empty(),
    hoursOut: Joi.any().empty(),
    statusRequests: Joi.any().empty(),
    __KEY__: Joi.any().empty()
  });
  return schema.validate(value);
}

module.exports = {
  delete: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let orderMeta = await OrderMeta.findByPk(req.params.id);

      if (orderMeta === null) {
        status = 400;
      } else {
        const orderId = orderMeta.orderId;
        let ordersMetas = await sequelize.query(
          `
            select * from eof.OrderMeta where orderId = '${orderId}'`,
          { type: QueryTypes.SELECT }
        );
        // const orderId = orderMeta.orderId;
        // let ordersMetas = await OrderMeta.findAll({
        //     where: {
        //         orderId: orderId
        //     }
        // });
        let affectedRows = null;
        console.log("ordersMetas", ordersMetas.length);
        if (ordersMetas.length > 1) affectedRows = await orderMeta.destroy();
        else affectedRows = 3;
        result.data = affectedRows;
      }
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  deleteDetail: async (req, res) => {
    let result = {};
    let status = 200;
    let { orderId } = req.query;
    try {
      let dataDel = await sequelize.query(
        `
            delete  eof.OrderMeta where orderId = '${orderId}'`,
        { type: QueryTypes.DELETE }
      );
      if (dataDel) {
        result.data = dataDel;
      } else result.status = 400;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  searchForm: async (req, res) => {
    let result = {};
    let status = 200;
    let { slug } = req.query;
    try {
      let dataDel = await sequelize.query(
        `
            select * from eof.Orders o
            left join eof.OrderMeta om on o.id  = om.orderId
            left join eof.Requests r on r.orderId = o.id
            where o.slug =N'${slug}'
            order by om.orderId , o.number`,
        { type: QueryTypes.SELECT }
      );
      if (dataDel) {
        result.data = dataDel;
      } else result.status = 400;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  add: async (req, res, next) => {
    let result = {};
    let status = 201;

    let { error, value } = validateOrderMeta(req.body);

    if (error) {
      status = 500;
      result.status = status;
      result.error = error;
      return res.status(status).send(result);
    }

    try {
      console.log("add ordermeta");
      let orderMeta = await OrderMeta.create(value);
      result.data = orderMeta;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  addMulRow: async (req, res) => {
    let result = null;
    let status = 200;
    try {
      let dataAddRow = await OrderMeta.bulkCreate(req.body);
      if (dataAddRow) {
        result.data = dataAddRow;
      } else {
        status = 400;
      }
    } catch (error) {
      console.log(error);
      result.error = error;
      status = 500;
    }
    return res.status(status).send(result);
  },

  show: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let orderMeta = await OrderMeta.findByPk(req.params.id);
      if (orderMeta == null) {
        status = 400;
      } else {
        result.data = orderMeta;
      }
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }

    return res.status(status).send(result);
  },

  update: async (req, res) => {
    let result = {};
    let status = 201;

    let { error, value } = validateOrderMeta(req.body);
    if (error) {
      status = 500;
      console.log(error);
      result.error = error;
      return res.status(status).send(result);
    }

    try {
      console.log("update");
      let orderMeta = await OrderMeta.findByPk(req.params.id);
      orderMeta.metaValue = value.metaValue;
      orderMeta.dateStart = value.dateStart;
      orderMeta.dateEnd = value.dateEnd;
      orderMeta.carId = value.carId;
      orderMeta.toLocation = value.toLocation;
      orderMeta.fromLocation = value.fromLocation;
      orderMeta.selection = value.selection;
      orderMeta.fullName = value.fullName;
      orderMeta.position = value.position;
      orderMeta.STT = value.STT;
      orderMeta.tenThietBiVP = value.tenThietBiVP;
      orderMeta.donViTinh = value.donViTinh;
      orderMeta.number = value.number;
      orderMeta.soLuongDeXuat = value.soLuongDeXuat;
      orderMeta.soLuongCap = value.soLuongCap;
      orderMeta.description = value.description;
      orderMeta.maNV = value.maNV;
      orderMeta.luongHienTai = value.luongHienTai;
      orderMeta.luongDeXuat = value.luongDeXuat;
      orderMeta.thoiGianTangLuongGanNhat = value.thoiGianTangLuongGanNhat;
      orderMeta.fullName2 = value.fullName2;
      orderMeta.position2 = value.position2;
      orderMeta.maVT = value.maVT;
      orderMeta.tenVT = value.tenVT;
      orderMeta.yeuCauKyThuat = value.yeuCauKyThuat;
      orderMeta.mucDichSuDung = value.mucDichSuDung;
      orderMeta.phoneNumber = value.phoneNumber;
      orderMeta.locationWork = value.locationWork;
      orderMeta.timeRecruit = value.timeRecruit;
      orderMeta.kinhGui = value.kinhGui;
      orderMeta.department = value.department;
      orderMeta.department2 = value.department2;
      orderMeta.stepDepartment = value.stepDepartment;
      orderMeta.thoiGianMangThai = value.thoiGianMangThai;
      orderMeta.xinRaCong = value.xinRaCong;
      orderMeta.quyCach = value.quyCach;
      orderMeta.Tenbaoho = value.Tenbaoho;
      orderMeta.date = value.date;
      orderMeta.work = value.work;
      orderMeta.total = value.total;
      orderMeta.hoursIn = value.hoursIn;
      orderMeta.hoursOut = value.hoursOut;
      let affectedRows = await orderMeta.save();
      result.data = affectedRows;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  updateOT: async (req, res) => {
    try {
      const dataUpdate = req.body;
      const data = await OrderMeta.update(dataUpdate, { where: { id: req.params.id } })
      return res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  getAll: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let orderMetas = await Order.findAll({
        include: [
          // Notice `include` takes an ARRAY
          OrderMeta
        ],
        where: {
          proposalFormId: 5
        }
      });
      result.data = orderMetas;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  import: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let orderMetas = await OrderMeta.bulkCreate(req.body);
      result.data = orderMetas;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  backup: async (req, res) => {
    let result = {};
    let status = 200;
    result.data = await data.OrderMetas;
    return res.status(status).send(result);
  }
};
