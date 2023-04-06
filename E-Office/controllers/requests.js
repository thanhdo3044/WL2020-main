const { Request, Account, Order, Department, data } = require("../models");
const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");
const { Op } = require("sequelize");
const db = {};
const moment = require("moment");
const { sequelize } = require("../config/config");

function validateRequest(value) {
  const schema = Joi.object({
    id: Joi.string().required(),
    parentId: Joi.string(),
    accountId: Joi.string().required(),
    fromAccountId: Joi.string().required(),
    orderId: Joi.string().required(),
    departmentId: Joi.string().required(),
    factoryId: Joi.string(),
    title: Joi.string().required(),
    status: Joi.string(),
    position: Joi.string(),
    name: Joi.string(),
    showMessages: Joi.boolean(),
    isDisable: Joi.boolean().required(),
    completed: Joi.boolean().required(),
    timeVTAccept: Joi.any(),
    timeEndAuthority: Joi.any(),
    timeStartAuthority: Joi.any(),
    idReqAuthority: Joi.any(),
    isAuthority: Joi.any(),
    accountIdAuthorised: Joi.any(),
    timeStartAuthorised: Joi.any(),
    timeEndAuthorised: Joi.any(),
    timeAuthorityActive: Joi.any(),
    edit: Joi.any(),
    timeVTAcceptEnd: Joi.any(),
    successOrder: Joi.any(),
    star: Joi.any(),
    accountId2: Joi.any(),
    accountId2Active: Joi.any()
  });
  return schema.validate(value);
}

function validateRequestUpdate(value) {
  const schema = Joi.object({
    id: Joi.string().required(),
    status: Joi.string().required(),
    completed: Joi.boolean().required(),
    accountId2Active: Joi.any()
  });
  return schema.validate(value);
}

module.exports = {
  //xóa toàn bộ theo orderId
  delete: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let requests = await sequelize.query(
        `
                delete eof.Requests where orderId = N'${req.query.orderId}'`,
        { type: QueryTypes.DELETE }
      );
      result.data = requests;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  //xóa theo id
  deleteById: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let requests = await sequelize.query(
        `
                delete eof.Requests where id = N'${req.params.id}'`,
        { type: QueryTypes.DELETE }
      );
      result.data = requests;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  deleteReqAuthority: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let requests = await sequelize.query(
        `
                delete eof.Requests where idReqAuthority = N'${req.query.idReqAuthority}'`,
        { type: QueryTypes.DELETE }
      );
      result.data = requests;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  getPermissionAuthorised: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let requests = await sequelize.query(
        `
                select * , pa.createdAt as createdAtAutho , pa.id as idAutho from eof.permissionAuthorised pa
                left join base.ProposalForm pf on pf.id = pa.idProposalform
                left join base.ACCOUNT a on a.id = pa.accountIdAuthorised
                where pa.accountId = '${req.params.id}'`,
        { type: QueryTypes.SELECT }
      );
      result.data = requests;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  delPermissionAuthorised: async (req, res) => {
    let result = {};
    let status = 200;
    let payload = req.body;
    console.log("payload", payload);
    try {
      let dataDel = await sequelize.query(
        `
                delete eof.permissionAuthorised where id='${req.query.id}'`,
        { type: QueryTypes.SELECT }
      );
      result.data = dataDel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  editPermissionAuthorised: async (req, res) => {
    let result = {};
    let status = 200;
    let payload = req.body;
    try {
      let dataEdit = await sequelize.query(
        `
                    update eof.permissionAuthorised set accountIdAuthorised=${payload.accountIdAuthorised}, timeStartAuthority='${payload.timeStartAuthority}',timeEndAuthority='${payload.timeEndAuthority}',updatedAt= getDate()
                    where id='${payload.id}'`,
        { type: QueryTypes.UPDATE }
      );
      result.data = dataEdit;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  checkPermissionAuthorised: async (req, res) => {
    let result = {};
    let status = 200;
    let payload = req.body;
    try {
      let dataCheck = await sequelize.query(
        `
                   select p.*, pro.slug as slug from eof.permissionAuthorised p left join base.ProposalForm pro on pro.id = p.idProposalForm
                   where p.accountId = ${payload.accountId} 
                   and pro.slug is not null
                   and pro.slug = N'${payload.slug}' 
                   and CONVERT(DATETIME,'${payload.timeRequest}',103) between  CONVERT(DATETIME,p.timeStartAuthority,103) and  CONVERT(DATETIME,p.timeEndAuthority,103)`,
        { type: QueryTypes.SELECT }
      );
      result.data = dataCheck;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  searchRequestSuccess: async (req, res) => {
    let result = {};
    let status = 200;
    let payload = req.body;
    try {
      let dataCheck = await sequelize.query(
        `
                   select r.*,a.ACCOUNT,a.LAST_NAME,d.NAME from eof.Requests r
  left join base.ACCOUNT a on a.ID = r.fromAccountId
  left join base.DEPARTMENT d on d.ID = r.departmentId
  where status =N'Đã ký' and r.createdAt between  '${payload.dateStart} 00:00:00' and  '${payload.dateEnd} 23:59:59' and r.accountId = ${payload.accountId}`,
        { type: QueryTypes.SELECT }
      );
      result.data = dataCheck;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  permissionAuthorised: async (req, res) => {
    let result = {};
    let status = 200;
    console.log("req", req.body);
    let data = req.body;
    try {
      let dataUpd;
      let dataIns;
      for (let p in data) {
        console.log("data", data[p].idProposalForm);
        let dataSel;
        dataSel = await sequelize.query(
          `
                DECLARE @data AS int;
                if(EXISTS(select * from eof.permissionAuthorised where accountId= ${req.params.id} and idProposalForm =${data[p].idProposalForm}))
                begin
                    set @data = 1
                end
                else
                begin
                    set @data = 0
                end
                select @data as dataSel
                `,
          { type: QueryTypes.SELECT }
        );
        console.log("dataSel", dataSel);
        if (dataSel[0].dataSel == 0) {
          dataIns = sequelize.query(
            `
                        insert into eof.permissionAuthorised (timeStartAuthority,timeEndAuthority,accountIdAuthorised,accountId,idProposalForm)
                        values('${data[p].timeStartAuthority}','${data[p].timeEndAuthority}',${data[p].accountIdAuthorised},${data[p].accountId},${data[p].idProposalForm})`,
            { type: QueryTypes.INSERT }
          );
        } else {
          dataUpd = await sequelize.query(
            `
                    update eof.permissionAuthorised set accountIdAuthorised=${data[p].accountIdAuthorised}, timeStartAuthority='${data[p].timeStartAuthority}',timeEndAuthority='${data[p].timeEndAuthority}',updatedAt= getDate()
                    where accountId= ${req.params.id} and idProposalForm =${data[p].idProposalForm}`,
            { type: QueryTypes.UPDATE }
          );
        }
      }
      let dataSuccess = {
        dataUpd: dataUpd,
        dataIns: dataIns
      };
      result.data = dataSuccess;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  add: async (req, res) => {
    let result = {};
    let status = 201;

    let { error, value } = validateRequest(req.body);

    if (error) {
      status = 500;
      result.status = status;
      result.error = error;
      return res.status(status).send(result);
    }

    try {
      let request = await Request.create(value, {
        include: []
      });
      result.data = request;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  show: async (req, res) => {
    let result = {};
    let status = 200;

    try {
      let request = await Request.findByPk(req.params.id);
      if (request == null) {
        status = 400;
      } else {
        result.data = request;
      }
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }

    return res.status(status).send(result);
  },

  //hàm sắp xếp mảng
  compareValues(key, order = "asc") {
    return function (a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // nếu không tồn tại
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return order == "desc" ? comparison * -1 : comparison;
    };
  },

  statusRequests: async (req, res) => {
    let result = {};
    let status = 200;
    let { id } = req.query;
    let { statusRequests } = req.body;
    try {
      let dataUpd = await sequelize.query(
        `
                    update eof.OrderMeta set statusRequests = N'${statusRequests}'
                    where id ='${id}'`,
        { type: QueryTypes.UPDATE }
      );
      result.data = dataUpd;
    } catch (error) {
      console.log(error);
      status = 500;
      result.status = status;
    }
    return res.status(status).send(result);
  },

  isAuthority: async (req, res) => {
    let result = {};
    let status = 200;
    let { isAuthority, id } = req.query;
    try {
      let dataUpd = await sequelize.query(
        `
                    update eof.Requests set isAuthority = N'${isAuthority}', status=N'Ủy quyền'
                    where id ='${id}'`,
        { type: QueryTypes.UPDATE }
      );
      result.data = dataUpd;
    } catch (error) {
      console.log(error);
      status = 500;
      result.status = status;
    }
    return res.status(status).send(result);
  },

  // active successOrder in request
  confirmSuccessOrder: async (req, res) => {
    let result = {};
    let status = 200;
    let { successOrder } = req.query;
    let { id } = req.params;
    try {
      let dataUpd = await sequelize.query(
        `
                    update eof.Requests set successOrder = N'${successOrder}'
                    where id ='${id}'`,
        { type: QueryTypes.UPDATE }
      );
      let request = await Request.findByPk(id);
      await Order.update(
        {
          completed: true,
          status: "Đã được duyệt",
          edit: false
        },
        {
          where: {
            id: request.orderId
          }
        }
      );
      result.data = dataUpd;
    } catch (error) {
      console.log(error);
      status = 500;
      result.status = status;
    }
    return res.status(status).send(result);
  },

  completedToRequestVT: async (req, res) => {
    let result = {};
    let status = 200;
    let { statusAccept, timeVTAccept, id, timeVTAcceptEnd } = req.body;
    try {
      let dataUpd = await sequelize.query(
        `
                    update eof.Requests set status = N'${statusAccept}',timeVTAcceptEnd ='${timeVTAcceptEnd}',timeVTAccept = '${timeVTAccept}',completed = 1 where id ='${id}'`,
        { type: QueryTypes.UPDATE }
      );

      let request = await Request.findByPk(id);
      await Order.update(
        {
          completed: true,
          status: "Đã được duyệt",
          edit: false
        },
        {
          where: {
            id: request.orderId
          }
        }
      );
      result.data = dataUpd;
    } catch (error) {
      console.log(error);
      status = 500;
      result.status = status;
    }
    return res.status(status).send(result);
  },

  update: async (req, res) => {
    let { id } = req.params;
    let result = {};
    let status = 201;

    let { error, value } = validateRequestUpdate(req.body);
    if (error) {
      status = 500;
      console.log(error);
      result.error = error;
      return res.status(status).send(result);
    }

    try {
      let request = await Request.findByPk(id);
      let request2 = await sequelize.query(
        `
                    select * from eof.Requests  where id ='${id}'`,
        { type: QueryTypes.SELECT }
      );
      let requestAll = await sequelize.query(
        `
                    select * from eof.Requests where orderId='${request2[0].orderId}'`,
        { type: QueryTypes.SELECT }
      );
      console.log("this.request", request2[0].star);
      console.log("this.request", requestAll);
      console.log("vale", value);
      let dataFillter = requestAll.filter(e => e.star > request2[0].star);
      console.log("dataFillter", dataFillter.length);
      if (value.status == "Không") {
        await Order.update(
          {
            completed: true,
            status: "Không được duyệt",
            edit: true
          },
          {
            where: {
              id: request.orderId
            }
          }
        );
      }
      if (dataFillter.length == 0 && value.status != "Không") {
        await Order.update(
          {
            completed: true,
            status: "Đã được duyệt",
            edit: false
          },
          {
            where: {
              id: request.orderId
            }
          }
        );
      }
      console.log("orderId", request);
      // gửi lên người cấp tiếp theo
      let requests = await sequelize.query(
        `
                    update eof.Requests set show = 1
            where orderId =  '${request2[0].orderId}'`,
        { type: QueryTypes.UPDATE }
      );
      const allRequest = await Request.findAll({
        where: {
          orderId: request.orderId
        }
      });
      console.log("allRequest", allRequest);
      if (request === null) {
        status = 400;
      } else {
        request.completed = value.completed;
        request.status = value.status;
        request.isDisable = true;
        request.successRequest =
          moment().format("DD-MM-YYYY") + " " + moment().format("LTS");
        request.accountId2Active = value.accountId2Active;
      }
      let affectedRows = await request.save();
      result.data = affectedRows;
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
    let timestamp = moment().format("LL");
    try {
      let requests = await sequelize.query(
        `
        update eof.Requests set show = 0 
        where slug = 'xac-nhan-cong' and show = 1 and 
        DATEDIFF(DAY, createdAt, getdate()) > 2
                     select r.*,a.ACCOUNT,a.LAST_NAME,a.departmentId as a,d.NAME as b
                     from eof.Requests r 
                   left join base.ACCOUNT a on a.ID = r.fromAccountId 
                   left join base.DEPARTMENT d on d.ID = r.departmentId 
                   left join eof.Orders o on o.id = r.orderId 
                   where o.deletedAt is null and r.slug not in ('xin-nghi-viec','xac-nhan-cong') and ((r.accountIdAuthorised = ${accountId} 
                    and r.show =1 and CONVERT(DATETIME,'${timestamp}',103) between  
                    CONVERT(DATETIME,r.timeStartAuthorised,103) and 
                     CONVERT(DATETIME,r.timeEndAuthorised,103) ) or (r.accountId = ${accountId} and r.show = 1) 
                     or (r.accountId2 = ${accountId} and r.show = 1))
                     union all
                     select r.*,a.ACCOUNT,a.LAST_NAME,a.departmentId as a,d.NAME as b
                     from eof.Requests r 
                   left join base.ACCOUNT a on a.ID = r.fromAccountId 
                   left join base.DEPARTMENT d on d.ID = r.departmentId 
                   left join eof.Orders o on o.id = r.orderId 
                   where o.deletedAt is null and r.slug in ('xin-nghi-viec','xac-nhan-cong')  
                   and r.departmentId not in (102291,102293,102304,102317,102318,102319,102320,102394,102396,102424,102426,102464,102465,102467,102468,102469,102470,102471,102472,102492,102496)
                    and ((r.accountIdAuthorised = ${accountId} 
                    and r.show =1 and CONVERT(DATETIME,'${timestamp}',103) between  
                    CONVERT(DATETIME,r.timeStartAuthorised,103) and 
                     CONVERT(DATETIME,r.timeEndAuthorised,103) ) or (r.accountId = ${accountId} and r.show = 1) 
                     or (r.accountId2 = ${accountId} and r.show = 1))
                     `,
        { type: QueryTypes.SELECT }
      );
      result.data = requests;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  getAllRequestsToday: async (req, res) => {
    let result = {};
    let status = 200;
    let timestamp = moment(new Date().toLocaleString()).format("YYYY-DD-MM");
    let { accountId } = req.query;
    try {
      let requests = await sequelize.query(
        `
        IF object_id('tempdb.dbo.#data') is not null
DROP TABLE #data;
create table #data (
dateStart datetime, orderId nvarchar(36), id nvarchar(36),LAST_NAME nvarchar(200) , ACCOUNT nvarchar(50) , NAME nvarchar(50) ,
accountId int,
accountId2 int,
accountId2Active int,
accountIdAuthorised int,
completed int,
createdAt datetime,
departmentId int,
edit int ,
factoryId int,
fromAccountId int,
idReqAuthority int,
isAuthority int,
isDisable int,
name1 nvarchar(200),
parentId nvarchar(200),
position nvarchar(200),
show int,
showMessages nvarchar(200),
slug nvarchar(200),
star int,
status nvarchar(200),
step int,
successOrder int,
successRequest int,
timeAuthorityActive nvarchar(200),
timeEndAuthorised nvarchar(200),
timeEndAuthority nvarchar(200),
timeRequest nvarchar(200),
timeStartAuthorised nvarchar(200),
timeStartAuthority nvarchar(200),
timeVTAccept nvarchar(200),
timeVTAcceptEnd nvarchar(200),
title nvarchar(200),
updatedAt datetime
);
insert into #data (dateStart , orderId , id,LAST_NAME,ACCOUNT,NAME,
accountId,
accountId2,
accountId2Active,
accountIdAuthorised,
completed,
createdAt,
departmentId,
edit,
factoryId,
fromAccountId,
idReqAuthority,
isAuthority,
isDisable,
name1,
parentId,
position,
show,
showMessages,
slug,
star,
status,
step,
successOrder,
successRequest,
timeAuthorityActive,
timeEndAuthorised,
timeEndAuthority,
timeRequest,
timeStartAuthorised,
timeStartAuthority,
timeVTAccept,
timeVTAcceptEnd,
title,
updatedAt
)
select  Convert(datetime,om.dateStart,120)  ,r.orderId , r.id , a.LAST_NAME ,a.ACCOUNT ,d.NAME,
r.accountId,
r.accountId2,
r.accountId2Active,
r.accountIdAuthorised,
r.completed,
r.createdAt,
r.departmentId,
r.edit,
r.factoryId,
r.fromAccountId,
r.idReqAuthority,
r.isAuthority,
r.isDisable,
r.name as name,
r.parentId,
r.position,
r.show,
r.showMessages,
r.slug,
r.star,
r.status,
r.step,
r.successOrder,
r.successRequest,
r.timeAuthorityActive,
r.timeEndAuthorised,
r.timeEndAuthority,
r.timeRequest,
r.timeStartAuthorised,
r.timeStartAuthority,
r.timeVTAccept,
r.timeVTAcceptEnd,
r.title,
r.updatedAt
from eof.Orders o
left join eof.OrderMeta om on om.orderId = o.id
left join eof.Requests r on r.orderId = o.id
left join base.ACCOUNT a on a.ID = o.accountId
left join base.DEPARTMENT d on d.ID = a.departmentId
where r.accountId = ${accountId} and r.completed = 0 and o.deletedAt is null and r.createdAt >= '2021-04-01' and r.show = 1 

select * from #data where dateStart >= '${timestamp}'`,
        { type: QueryTypes.SELECT }
      );
      result.data = requests;
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
      let requests = await Request.bulkCreate(req.body);
      result.data = requests;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    console.log(result);
    return res.status(status).send(result);
  },
  getDepartmentMuaHang: async (req, res) => {
    let result = {};
    let status = 200;
    try {
      let requests = await sequelize.query(
        `
        select ID, NAME , PARENT_ID
        from base.DEPARTMENT 
        where PARENT_ID in (102299, 102422, 102395, 102497)
                     `,
        { type: QueryTypes.SELECT }
      );
      result.data = requests;
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
    result.data = await data.requests;
    return res.status(status).send(result);
  }
};
