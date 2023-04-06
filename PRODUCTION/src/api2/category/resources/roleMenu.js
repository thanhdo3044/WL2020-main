const express = require('express')
const roleMenu = express.Router()
const mssql = require('mssql')
const {
    getErrorMessage
} = require('./../../../core/config')
const m2 = require('./../../../core/m2')




roleMenu.get('/', (req, res, next) => {
    new mssql.Request()
        .query(`
        SELECT M.NAME MENU_NAME, A.LAST_NAME ACCOUNT_NAME FROM base.ROLE_MENU RM
        INNER JOIN base.ROLE_VALUE RV ON RM.ROLE_VALUE_ID = RV.ID
        INNER JOIN base.ACCOUNT A ON RV.ROLE_ID = A.ID
        INNER JOIN base.MENU M ON RV.VALUE = CONVERT(VARCHAR, M.ID)
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})


roleMenu.post('/', (req, res, next) => {
    let query = "INSERT INTO base.ROLE_MENU (ROLE_VALUE_ID, PERMISSION_ID, CREATED_BY, CREATED_AT) VALUES"
      let permissions = req.body.permissionIds;
      permissions.forEach(el => {
        query += `(${req.body.roleValueId}, ${el}, ${req.body.accountId}, GETDATE()),`
      });
      query = query.substring(0, query.length-1);
      new mssql.Request()
      .query(query, (err, record) => {
          if (err)
              return res.api.sendFail(getErrorMessage(4907))
          res.api.sendData(record.recordset)
      })
})


roleMenu.put('/:id', (req, res, next) => {
    new mssql.Request()
        .query(`
        UPDATE base.ROLE_MENU
        SET
        ROLE_VALUE_ID = ${req.body.roleValueId},
        PERMISSION_ID = ${req.body.permissionId}
        WHERE ID = ${req.params.id}
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})



roleMenu.delete('/:id', (req, res, next) => {
    new mssql.Request()
        .query(`
        DELETE FROM base.ROLE_MENU WHERE ROLE_VALUE_ID = ${req.params.id}
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.get('/:id', (req, res, next) => {
    new mssql.Request()
        .query(`
        SELECT PERMISSION_ID FROM base.ROLE_MENU WHERE ROLE_VALUE_ID = ${req.params.id}
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.get('/permission/menu-of-account', (req, res, next) => {
    new mssql.Request()
        .query(`
        SELECT DISTINCT RV.ID, M.NAME, M.PATH, M.ID menuId
        FROM base.ROLE_VALUE RV INNER JOIN 
        base.MENU M ON RV.VALUE = CONVERT(VARCHAR, M.ID)
        WHERE RV.ROLE_ID = ${req.query.accountId} AND RV.ROLE_TYPE_ID in (100006, 100009) and M.permission = 1
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.get('/permission/get-account-permission', (req, res, next) => {
    new mssql.Request()
        .query(`
        select ID, CODE, NAME from base.ACCOUNT_PERMISSION
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.post('/permission/insert-account-permission', (req, res, next) => {
    new mssql.Request()
        .query(`
        INSERT INTO base.ACCOUNT_PERMISSION (CODE, NAME)
        VALUES ('${req.body.code}', N'${req.body.name}')
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.post('/permission/update-account-permission', (req, res, next) => {
    new mssql.Request()
        .query(`
        UPDATE base.ACCOUNT_PERMISSION 
        SET 
        CODE = '${req.body.code}', 
        NAME = N'${req.body.name}' 
        WHERE ID = ${req.body.id}
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.post('/permission/delete-account-permission', (req, res, next) => {
    new mssql.Request()
        .query(`
        DELETE FROM base.ACCOUNT_PERMISSION 
        WHERE ID = ${req.body.id}
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.get('/permission/permission-all', (req, res, next) => {
    new mssql.Request()
        .query(`
        SELECT ID, CODE, NAME FROM base.ACCOUNT_PERMISSION
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})
roleMenu.get('/permission/menu-permission', (req, res, next) => {
    new mssql.Request()
        .query(`
        SELECT AP.ID, AP.CODE, AP.NAME
FROM base.MENU_PERMISSION MP 
INNER JOIN base.ACCOUNT_PERMISSION AP ON MP.PERMISSTION_ID = AP.ID
WHERE MP.MENU_ID = ${req.query.menuId}
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.get('/menu-permission/get-by-menuId', (req, res, next) => {
    new mssql.Request()
        .query(`
        select PERMISSTION_ID 
from base.MENU_PERMISSION 
where MENU_ID = ${req.query.menuId}
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.post('/permission/menu-permission', (req, res, next) => {
    const datanhan = req.body.permissions
    datanhan.forEach(element => {
        const query = `INSERT INTO base.MENU_PERMISSION (MENU_ID, PERMISSTION_ID, CREATED_BY, CREATED_AT)
        VALUES(${req.body.id}, ${element}, ${req.body.createdBy}, GETDATE())`
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

roleMenu.delete('/permission/menu-permission/:id', (req, res, next) => {
    new mssql.Request()
        .query(`
        DELETE FROM base.MENU_PERMISSION WHERE MENU_ID = ${req.params.id}
        `, (err, record) => {
            if (err)
                return res.api.sendFail(getErrorMessage(4907))
            res.api.sendData(record.recordset)
        })
})

roleMenu.get('/permission/in/screen', (req, res, next) => {
    const query = `
    SELECT AP.CODE FROM base.MENU M INNER JOIN
        base.ROLE_VALUE RV ON CONVERT(VARCHAR, M.ID) = RV.VALUE INNER JOIN
        base.ROLE_MENU RM ON RV.ID = RM.ROLE_VALUE_ID INNER JOIN
        base.ACCOUNT_PERMISSION AP ON RM.PERMISSION_ID = AP.ID
        WHERE PATH like '${req.query.path}%' AND RV.ROLE_ID = ${req.query.accountId}
    `
    new mssql.Request()
        .query(query, (err, record) => {
            if (err)
                return res.api.sendFail(query)
            res.api.sendData(record.recordset)
        })
})

roleMenu.post('/permission/in/post-screen', (req, res, next) => {
    const query = `
    SELECT AP.CODE FROM base.MENU M INNER JOIN
        base.ROLE_VALUE RV ON CONVERT(VARCHAR, M.ID) = RV.VALUE INNER JOIN
        base.ROLE_MENU RM ON RV.ID = RM.ROLE_VALUE_ID INNER JOIN
        base.ACCOUNT_PERMISSION AP ON RM.PERMISSION_ID = AP.ID
        WHERE PATH like '${req.body.path}%' AND RV.ROLE_ID = ${req.body.accountId}
    `
    new mssql.Request()
        .query(query, (err, record) => {
            if (err)
                return res.api.sendFail(query)
            res.api.sendData(record.recordset)
        })
})


module.exports = roleMenu;