const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");

const db = {};
const { sequelize } = require("../config/config");

module.exports = {
  getBophanLamViec: async (req, res) => {
    let result = {};
    let status = 200;
    try {
      let role = await sequelize.query(
        `
            select 
            D.ID departmentId,
            D.PARENT_ID parentId,
            D.TYPE type,
            D.TYPE2 type2,
            D.CODE code,
            D.NAME name,
            rd.ID,
            CASE
	            WHEN rd.ID IS NULL THEN 0
	        ELSE 1
            END AS 'state'
            from base.DEPARTMENT d 
            left join 
            ( 
                select * from 
                base.ROLE_DEPARTMENT 
                where ACCOUNT_ID = ${req.query.accountId}
            ) rd on d.ID = rd.DEPARTMENT_ID
                `,
        { type: QueryTypes.SELECT }
      );
      result.data = role;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  getAccountByDepartmentId: async (req, res) => {
    let result = {};
    let status = 200;
    try {
      let role = await sequelize.query(
        `
        SELECT RD.ID, A.ACCOUNT, ACCOUNT_ID, POSITION_ID, RD.DESK_MANAGER, rd.[ORDER] , case when rd.[ORDER] is not null then rd.[ORDER] else 9999 end order2
        FROM base.ROLE_DEPARTMENT RD 
        INNER JOIN base.ACCOUNT A ON RD.ACCOUNT_ID = A.ID 
        WHERE DEPARTMENT_ID = ${req.query.departmentId} and A.unActive = 1 and A.ID not in (100400, 102089) order by order2
                `,
        { type: QueryTypes.SELECT }
      );
      result.data = role;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  getPosition: async (req, res) => {
    let result = {};
    let status = 200;
    try {
      let role = await sequelize.query(
        `
                select ID, CODE, NAME from base.POSITION
                `,
        { type: QueryTypes.SELECT }
      );
      result.data = role;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  getUser: async (req, res) => {
    let result = {};
    let status = 200;
    try {
      let role = await sequelize.query(
        `
        SELECT ID, LAST_NAME AS NAME, ACCOUNT FROM base.ACCOUNT WHERE unActive = 1
                `,
        { type: QueryTypes.SELECT }
      );
      result.data = role;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  insertRoleDepartment: async (req, res) => {
    let result = {};
    let status = 200;
    if(req.body.order == 0){
      req.body.order = null
    }
    if(req.body.deskManager == 0){
      req.body.deskManager = null
    }
    if(req.body.positionId == 0){
      req.body.positionId = null
    }
    try {
      let role = await sequelize.query(
        `
                DELETE FROM base.ROLE_DEPARTMENT WHERE ACCOUNT_ID = ${req.body.accountId} AND DEPARTMENT_ID = ${req.body.departmentId}
                INSERT INTO base.ROLE_DEPARTMENT(ACCOUNT_ID, DEPARTMENT_ID, POSITION_ID, DESK_MANAGER, [ORDER], CREATED_BY, CREATED_AT)
                VALUES (${req.body.accountId},${req.body.departmentId},${req.body.positionId},${req.body.deskManager}, ${req.body.order},${req.body.createdBy},GETDATE())
                `,
        { type: QueryTypes.INSERT }
      );
      result.data = role;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  updateRoleDepartment: async (req, res) => {
    let result = {};
    let status = 200;
    if(req.body.order == 0){
      req.body.order = null;
    }
    if(req.body.deskManager == 0){
      req.body.deskManager = null;
    }
    try {
      let role = await sequelize.query(
        `
        UPDATE base.ROLE_DEPARTMENT 
        SET ACCOUNT_ID = ${req.body.accountId}, 
        POSITION_ID = ${req.body.positionId}, 
        DESK_MANAGER = ${req.body.deskManager}, 
        [ORDER] = ${req.body.order} 
        WHERE ID = ${req.body.id}
                `,
        { type: QueryTypes.UPDATE }
      );
      result.data = role;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  updateDeskManager: async (req, res) => {
    let result = {};
    let status = 200;
    if(req.body.deskManager == 0){
      req.body.deskManager = null;
    }
    if(req.body.positionId == 0){
      req.body.positionId = null;
    }
    try {
      let role = await sequelize.query(
        `
        UPDATE base.ROLE_DEPARTMENT 
        SET
        DESK_MANAGER = ${req.body.deskManager},
        POSITION_ID = ${req.body.positionId}
        WHERE ACCOUNT_ID = ${req.body.accountId} and DEPARTMENT_ID = ${req.body.departmentId}
                `,
        { type: QueryTypes.UPDATE }
      );
      result.data = role;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  deleteRoleDepartment: async (req, res) => {
    let result = {};
    let status = 200;
    try {
      let role = await sequelize.query(
        `
                DELETE FROM base.ROLE_DEPARTMENT WHERE ID = ${req.params.id}
                `,
        { type: QueryTypes.DELETE }
      );
      result.data = role;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  deleteByDepartment: async (req, res) => {
    let result = {};
    let status = 200;
    try {
      let role = await sequelize.query(
        `
        delete from base.ROLE_DEPARTMENT
        where ACCOUNT_ID = ${req.body.accountId} and DEPARTMENT_ID = ${req.body.departmentId}
                `,
        { type: QueryTypes.DELETE }
      );
      result.data = role;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
};
