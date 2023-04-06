const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");

const db = {};
const { sequelize } = require("../config/config");


module.exports = {

    add: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let form = await sequelize.query(
                `
                INSERT INTO eof.FORM_REGISTER (TITLE, [DESCRIPTION], [LOCATION], CREATED_BY, CREATED_DATE)
                VALUES (N'${req.body.title}', N'${req.body.description}', '${req.body.location}', ${req.body.accountId}, GETDATE())
                SELECT TOP 1 ID FROM eof.FORM_REGISTER ORDER BY CREATED_DATE DESC
                `, { type: QueryTypes.SELECT }
            );
            result.data = form;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    show: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `SELECT FR.ID, TITLE, [DESCRIPTION], [LOCATION], A.LAST_NAME, FR.CREATED_DATE
                FROM eof.FORM_REGISTER FR INNER JOIN base.ACCOUNT A ON FR.CREATED_BY = A.ID
                WHERE FR.CREATED_DATE BETWEEN '${req.query.from}' AND '${req.query.to}'
                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    getTitleByAccount: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `SELECT DISTINCT FR.ID, TITLE, [DESCRIPTION], [LOCATION], A.LAST_NAME, FR.CREATED_DATE, FUR.ID STATUS 
                FROM eof.FORM_REGISTER FR INNER JOIN base.ACCOUNT A ON FR.CREATED_BY = A.ID
				INNER JOIN eof.FORM_ROLE_DEPARTMENT FRD ON FR.ID = FRD.FORM_ID
				INNER JOIN base.ROLE_DEPARTMENT RD ON FRD.DEPARTMENT_ID = RD.DEPARTMENT_ID AND RD.ACCOUNT_ID = ${req.query.accountId}
				LEFT JOIN eof.FORM_USER_REGISTER FUR ON FR.ID = FUR.FORM_ID
				AND FUR.ACCOUNT_ID = ${req.query.accountId}
                WHERE FR.CREATED_DATE BETWEEN '${req.query.from} 00:00' AND '${req.query.to} 23:59' AND FRD.SEND_MANAGER = 0
                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getReportUserViewed: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `
                SELECT FR.TITLE, FR.CREATED_DATE, D.NAME,
(SELECT COUNT(*) FROM base.ROLE_DEPARTMENT RD 
INNER JOIN base.ACCOUNT A ON RD.ACCOUNT_ID = A.ID
WHERE RD.DEPARTMENT_ID = FRD.DEPARTMENT_ID AND A.unActive = 1 ) AS TOTAL,
(
SELECT COUNT(*) FROM eof.FORM_USER_REGISTER FUR
INNER JOIN base.ROLE_DEPARTMENT RD2 ON FUR.ACCOUNT_ID = RD2.ACCOUNT_ID
INNER JOIN EOF.FORM_ROLE_DEPARTMENT FRD2 ON FRD2.FORM_ID = FUR.FORM_ID AND FRD2.DEPARTMENT_ID = FRD.DEPARTMENT_ID
WHERE FUR.FORM_ID = FR.ID AND RD2.DEPARTMENT_ID = FRD.DEPARTMENT_ID
) AS VIEWED
FROM eof.FORM_REGISTER FR
INNER JOIN eof.FORM_ROLE_DEPARTMENT FRD ON FR.ID = FRD.FORM_ID
INNER JOIN base.DEPARTMENT D ON FRD.DEPARTMENT_ID = D.ID
WHERE FR.CREATED_DATE BETWEEN '${req.query.from}' AND '${req.query.to}'

                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getReportFormDetail: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `
                SELECT FR.TITLE, FR.CREATED_DATE, D.NAME DEPARTMENT_NAME, A.ACCOUNT, A.LAST_NAME, FUR.CREATED_DATE USER_VIEWED  FROM eof.FORM_REGISTER FR
INNER JOIN eof.FORM_USER_REGISTER FUR ON FR.ID = FUR.FORM_ID
INNER JOIN eof.FORM_ROLE_DEPARTMENT FRD ON FR.ID = FRD.FORM_ID
INNER JOIN base.ROLE_DEPARTMENT RD ON RD.DEPARTMENT_ID = FRD.DEPARTMENT_ID AND RD.ACCOUNT_ID = FUR.ACCOUNT_ID
INNER JOIN base.DEPARTMENT D ON FRD.DEPARTMENT_ID = D.ID
INNER JOIN base.ACCOUNT A ON FUR.ACCOUNT_ID = A.ID
WHERE FR.CREATED_DATE BETWEEN '${req.query.from}' AND '${req.query.to}'

                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getDepartmentIsManager: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `
                SELECT * FROM base.DEPARTMENT 
                WHERE 
                accountId = ${req.query.accountId} 
                or accountId1 = ${req.query.accountId} 
                or accountId2 = ${req.query.accountId}
                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getFormRegisterManager: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `
                SELECT DISTINCT FR.ID, TITLE, [DESCRIPTION], [LOCATION], A.LAST_NAME, FR.CREATED_DATE, FUR.ID STATUS 
                FROM eof.FORM_REGISTER FR INNER JOIN base.ACCOUNT A ON FR.CREATED_BY = A.ID
				INNER JOIN eof.FORM_ROLE_DEPARTMENT FRD ON FR.ID = FRD.FORM_ID
				LEFT JOIN eof.FORM_USER_REGISTER FUR ON FR.ID = FUR.FORM_ID
				AND FUR.ACCOUNT_ID = ${req.query.accountId}
                WHERE FR.CREATED_DATE BETWEEN '${req.query.from} 00:00' AND '${req.query.to} 23:59' 
				AND FRD.DEPARTMENT_ID = ${req.query.departmentId} AND FRD.SEND_MANAGER = 1
                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getFormRegisterById: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `
                SELECT FR.ID, TITLE, [DESCRIPTION], [LOCATION], A.LAST_NAME, CREATED_DATE 
                FROM eof.FORM_REGISTER FR 
                INNER JOIN base.ACCOUNT A ON FR.CREATED_BY = A.ID WHERE FR.ID = ${req.query.formId}
                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    showQuestion: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `SELECT ID, [INDEX], TITLE, [TYPE], [REQUIRED] FROM eof.FORM_QUESTION WHERE FORM_ID = ${req.query.formId} ORDER BY [INDEX]`, { type: QueryTypes.SELECT }
            );
            let data2 = await sequelize.query(
                `select QUESTION_ID, [OPTION] from eof.FORM_QUESTION_OPTION`, { type: QueryTypes.SELECT }
            );
            if (data) {
                data.forEach(el => {
                    let options = data2.filter(d => d.QUESTION_ID == el.ID);
                    el.options = options;
                });
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    showUserFormRegisterByFormId: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `
                SELECT UFR.ID userFormId, A.ID, A.LAST_NAME, A.ACCOUNT FROM eof.FORM_USER_REGISTER UFR 
                INNER JOIN base.ACCOUNT A ON UFR.ACCOUNT_ID = A.ID
                WHERE FORM_ID = ${req.query.formId}
                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    showUserAnswerByForm: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `
                SELECT FQ.TITLE, UA.ANSWER from eof.FORM_QUESTION FQ 
                INNER JOIN eof.FORM_USER_ANSWER UA ON FQ.ID = UA.QUESTION_ID
                WHERE USER_FORM_ID = ${req.query.userFormId}
                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    getUserAnswerByAccountId: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let data = await sequelize.query(
                `
                SELECT FQ.TITLE, UA.ANSWER from eof.FORM_QUESTION FQ 
                INNER JOIN eof.FORM_USER_ANSWER UA ON FQ.ID = UA.QUESTION_ID
				INNER JOIN eof.FORM_USER_REGISTER UR ON UA.USER_FORM_ID = UR.ID
                WHERE UR.ACCOUNT_ID = ${req.query.accountId} AND UR.FORM_ID = ${req.query.formId}
                `, { type: QueryTypes.SELECT }
            );
            if (data) {
                result.data = data;
            } else {
                status = 400;
            }
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    addQuestion: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let question = await sequelize.query(
                `
                INSERT INTO eof.FORM_QUESTION(FORM_ID, [INDEX], TITLE, [TYPE], [REQUIRED], CREATED_BY, CREATED_DATE)
                VALUES (${req.body.formId}, ${req.body.index}, N'${req.body.title}', '${req.body.type}', ${req.body.required}, ${req.body.accountId}, GETDATE())
                SELECT TOP 1 ID FROM eof.FORM_QUESTION ORDER BY CREATED_DATE DESC
                `, { type: QueryTypes.SELECT }
            );
            result.data = question;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

    addFormRoleDepartment: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let query = `INSERT INTO EOF.FORM_ROLE_DEPARTMENT (FORM_ID, DEPARTMENT_ID, SEND_MANAGER, CREATED_BY, CREATED_AT) VALUES`;
            const permission = req.body.permission;
            permission.forEach(el => {
                query += `(${req.body.formId}, ${el}, ${req.body.sendManager}, ${req.body.accountId}, GETDATE()),`
            });
            query = query.substring(0, query.length-1);
            let question = await sequelize.query(query, { type: QueryTypes.SELECT }
            );
            result.data = question;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    addQuestionOption: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let question = await sequelize.query(
                `
                INSERT INTO eof.FORM_QUESTION_OPTION(QUESTION_ID, [OPTION], CREATED_BY, CREATED_DATE)
                VALUES (${req.body.questionId}, N'${req.body.option}', ${req.body.accountId}, GETDATE())
                `, { type: QueryTypes.INSERT }
            );
            result.data = question;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    addUserFormRegister: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let question = await sequelize.query(
                `
                INSERT INTO eof.FORM_USER_REGISTER (FORM_ID, ACCOUNT_ID, CREATED_BY, CREATED_DATE)
                VALUES (${req.body.formId}, ${req.body.accountId}, ${req.body.accountId}, GETDATE())
                SELECT ID FROM eof.FORM_USER_REGISTER WHERE FORM_ID = ${req.body.formId} AND ACCOUNT_ID = ${req.body.accountId}
                `, { type: QueryTypes.SELECT }
            );
            result.data = question;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },
    addUserAnswer: async(req, res) => {
        let result = {};
        let status = 200;
        try {
            let question = await sequelize.query(
                `
                INSERT INTO eof.FORM_USER_ANSWER (USER_FORM_ID, QUESTION_ID, ANSWER, CREATED_BY, CREATED_DATE)
                VALUES (${req.body.userFormId},${req.body.questionId},N'${req.body.answer}', ${req.body.accountId}, GETDATE())
                `, { type: QueryTypes.INSERT }
            );
            result.data = question;
        } catch (error) {
            console.log(error);
            status = 500;
            result.error = error;
        }
        return res.status(status).send(result);
    },

};