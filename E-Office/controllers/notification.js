const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const db = {};
const moment = require("moment");
const { sequelize } = require("../config/config");
const nodemailer = require("nodemailer");
const { query } = require("express");
module.exports = {
  //xóa toàn bộ theo orderId
  insert: async (req, res) => {
    let result = {};
    let status = 200;
    let dataBody = req.body;
    try {
      let dataSel = await sequelize.query(
        `
            select * from eof.Notification where accountId = ${dataBody.accountId}
            `,
        { type: QueryTypes.SELECT }
      );
      console.log("dataSel", dataSel);
      let countTokenFCM = 0;
      let dataIns = null;
      dataSel.forEach(async e => {
        if (e.tokenFCM == dataBody.tokenFCM) {
          countTokenFCM++;
        }
      });
      if (countTokenFCM > 0) {
      } else {
        dataIns = await sequelize.query(
          `
            insert into eof.Notification ([accountId],[tokenFCM]) values(${dataBody.accountId},N'${dataBody.tokenFCM}')
            `,
          { type: QueryTypes.INSERT }
        );
      }
      result.data = dataIns;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }

    return res.status(status).send(result);
  },

  get: async (req, res) => {
    let result = {};
    let status = 200;
    let dataBody = req.query;
    try {
      let dataSel = await sequelize.query(
        `
            select * from eof.Notification where accountId = ${dataBody.accountId}
            `,
        { type: QueryTypes.SELECT }
      );
      result.data = dataSel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  },

  put: async (req, res) => {
    let result = {};
    let status = 200;
    let dataBody = req.body;
    try {
      let dataDel = await sequelize.query(
        `
            delete eof.Notification where accountId = ${dataBody.accountId} and tokenFCM = N'${dataBody.tokenFCM}'
            `,
        { type: QueryTypes.DELETE }
      );
      result.data = dataDel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  },

  activeNotificationMail: async (req, res) => {
    let result = {};
    let status = 200;
    let data = req.body;
    try {
      let dataDel = await sequelize.query(
        `
            update base.ACCOUNT set notificationMail= 1 , EMAIL = N'${data.email}' where ACCOUNT = N'${data.ACCOUNT}' 
            `,
        { type: QueryTypes.UPDATE }
      );
      result.data = dataDel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  },

  unActiveNotificationMail: async (req, res) => {
    let result = {};
    let status = 200;
    let data = req.body;
    try {
      let dataDel = await sequelize.query(
        `
            update base.ACCOUNT set notificationMail= 0 , EMAIL = N'${data.email}' where ACCOUNT = N'${data.ACCOUNT}' 
            `,
        { type: QueryTypes.UPDATE }
      );
      result.data = dataDel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  },

  getNotificationDetail: async (req, res) => {
    let result = {};
    let status = 200;
    let accountId = req.query.accountId;
    try {
      let dataSel = await sequelize.query(
        `
                SELECT a.LAST_NAME,a.ACCOUNT,
                nd.[accountId]
                ,[to_accountId]
                ,[dataSend]
                ,[url]
                ,[active_seen]
            FROM [Woodsland-HIEU].[eof].[NotificationDetail] nd
            inner join base.ACCOUNT  a on a.id = nd.to_accountId
            where nd.email is null and to_accountId = ${accountId} and url is not null and url != 'undefined' and tokenFCM is not null group by nd.[accountId]
                ,[to_accountId]
                ,[dataSend]
                ,[url]
                ,[active_seen] ,
                a.LAST_NAME,
                a.ACCOUNT
            `,
        { type: QueryTypes.SELECT }
      );
      result.data = dataSel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  },

  checkMailOTP: async (req, res) => {
    let result = {};
    let status = 200;
    let { email, userName, OTP } = req.body;
    try {
      let dataSel = await sequelize.query(
        `
                SELECT  *
            FROM base.ACCOUNT where ACCOUNT = N'${userName}' and EMAIL = N'${email}' and OTP_MAIL = ${OTP}
            `,
        { type: QueryTypes.SELECT }
      );
      result.data = dataSel;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  },

  // sendErrorTimeMail: async (req, res) => {
  //   let result = {};
  //   let status = 200;
  //   let { email, userName, url } = req.body;
  //   try {
  //     var transporter = nodemailer.createTransport({
  //       // config mail server
  //       host: "smtp.gmail.com",
  //       port: 465,
  //       auth: {
  //         user: "eof.wms@gmail.com", //Tài khoản gmail vừa tạo
  //         pass: "vxigbzhunteognuq" //Mật khẩu tài khoản gmail vừa tạo
  //       }
  //     });
  //     var content = "";
  //     let dataBody =
  //       "Bạn có phiếu lỗi chấm công cần xác nhận , click vào đây để đi tới xem phiếu";
  //     content += `
  //                 <div style="padding: 10px; background-color: #003375">
  //                     <div style="padding: 10px; background-color: white;">
  //                         <div>
  //                           <a href="${url}">${dataBody}</a>
  //                       </div>
  //                     </div>
  //                 </div>
  //             `;
  //     let info = await transporter.sendMail({
  //       from: "Phê duyệt Online<eof.wms@gmail.com>", // sender address
  //       to: `${email}`, // list of receivers
  //       subject: `Có phiếu lỗi chấm công cần xác nhận`, // Subject line
  //       text: "Hello world?", // plain text body
  //       html: content // html body
  //     });
  //     let dataResult = {
  //       userName: userName,
  //       email: email
  //     };
  //     await sequelize.query(
  //       `
  //         insert into eof.NotificationDetail ([accountId],[email],[dataSend]) values(N'${userName}',N'${email}',N'${dataBody}')
  //         `,
  //       { type: QueryTypes.INSERT }
  //     );

  //     result.data = dataResult;
  //   } catch (error) {
  //     status = 500;
  //     console.log(error);
  //     result.error = error;
  //   }
  //   return res.status(status).send(result);
  // },
  // sendPaySlipMail: async (req, res) => {
  //   let result = {};
  //   let status = 200;
  //   let { email, userName, url } = req.body;
  //   try {
  //     var transporter = nodemailer.createTransport({
  //       // config mail server
  //       host: "smtp.gmail.com",
  //       port: 465,
  //       auth: {
  //         user: "eof.wms@gmail.com", //Tài khoản gmail vừa tạo
  //         pass: "vxigbzhunteognuq" //Mật khẩu tài khoản gmail vừa tạo
  //       }
  //     });
  //     var content = "";
  //     let dataBody =
  //       "Bạn có phiếu lương của phòng Nhân sự gửi tới, click vào đây để đi tới xem phiếu";
  //     content += `
  //                 <div style="padding: 10px; background-color: #003375">
  //                     <div style="padding: 10px; background-color: white;">
  //                         <div>
  //                           <a href="${url}">${dataBody}</a>
  //                       </div>
  //                     </div>
  //                 </div>
  //             `;
  //     let info = await transporter.sendMail({
  //       from: "Phê duyệt Online<eof.wms@gmail.com>", // sender address
  //       to: `${email}`, // list of receivers
  //       subject: `Phiếu lương tháng ${moment().month()}/${moment().year()}`, // Subject line
  //       text: "Hello world?", // plain text body
  //       html: content // html body
  //     });
  //     let dataResult = {
  //       userName: userName,
  //       email: email
  //     };
  //     await sequelize.query(
  //       `
  //         insert into eof.NotificationDetail ([accountId],[email],[dataSend]) values(N'${userName}',N'${email}',N'${dataBody}')
  //         `,
  //       { type: QueryTypes.INSERT }
  //     );

  //     result.data = dataResult;
  //   } catch (error) {
  //     status = 500;
  //     console.log(error);
  //     result.error = error;
  //   }
  //   return res.status(status).send(result);
  // },
  sendOTPMail: async (req, res) => {
    let result = {};
    let status = 200;
    let { email, userName, OTP } = req.body;
    try {
      var transporter = nodemailer.createTransport({
        // config mail server
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: "eof.wms@gmail.com", //Tài khoản gmail vừa tạo
          pass:"dpyfjzkbashnoyzf"
		  //pass: "vxigbzhunteognuq" //Mật khẩu tài khoản gmail vừa tạo
        }
      });
      var content = "";
      let dataBody = "Mã xác nhận OTP :" + OTP;
      content += `
                  <div style="padding: 10px; background-color: #003375">
                      <div style="padding: 10px; background-color: white;">
                          <span style="color: black">${dataBody} </span>
                      </div>
                  </div>
              `;
      let info = await transporter.sendMail({
        from: "Phê duyệt Online<eof.wms@gmail.com>", // sender address
        to: `${email}`, // list of receivers
        subject: `Có mã OTP gửi tới`, // Subject line
        text: "Hello world?", // plain text body
        html: content // html body
      });
      let dataResult = {
        userName: userName,
        email: email,
        OTP: OTP
      };
      await sequelize.query(
        `
          insert into eof.NotificationDetail ([userName],[email],[OTP],[dataSend]) values(N'${userName}',N'${email}',${OTP},N'${dataBody}')
          `,
        { type: QueryTypes.INSERT }
      );
      await sequelize.query(
        `
          update  base.ACCOUNT set OTP_MAIL = ${OTP} where ACCOUNT = N'${userName}' 
          `,
        { type: QueryTypes.INSERT }
      );
      result.data = dataResult;
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  },

  sendMail: async (req, res) => {
    let result = {};
    let status = 200;
    let {
      baseUrl,
      dataBody,
      email,
      subject,
      title,
      accountId,
      toAccountId,
      messageId,
      tokenFCM
    } = req.body;
    try {
      if (email != "null") {
        // let testAccount = await nodemailer.createTestAccount();
        //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
        var transporter = nodemailer.createTransport({
          // config mail server
          host: "smtp.gmail.com",
          port: 465,
          auth: {
            user: "wl20-no-reply@woodsland.com.vn", //Tài khoản gmail vừa tạo
            pass:"dpyfjzkbashnoyzf"
			//pass: "ubqyoklxytbmdgye" //Mật khẩu tài khoản gmail vừa tạo
          }
        });
        var content = "";
        content += `
                <div style="padding: 10px; background-color: #003375">
                    <div style="padding: 10px; background-color: white;">
                        <span style="color: black">${dataBody}</span>
                        <div>
                            <a href="${baseUrl}">${title}</a>
                        </div>
                    </div>
                </div>
            `;
        let info = await transporter.sendMail({
          from: "Woodsland 20 <wl20-no-reply@woodsland.com.vn>", // sender address
          to: `${email}`, // list of receivers
          subject: `${subject}`, // Subject line
          text: "Hello world?", // plain text body
          html: content // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", info.envelope);

        const dataResult = {
          info: info,
          dataSend: dataBody
        };
        await sequelize.query(
          `
            insert into eof.NotificationDetail ([accountId],[to_accountId],[messageId],[dataSend],[email],[url]) values(${accountId},${toAccountId},N'${dataResult.info.messageId}',N'${dataResult.dataSend}',N'${email}',N'${baseUrl}')
            `,
          { type: QueryTypes.INSERT }
        );
        result.data = dataResult;
      } else {
        let dataResult = await sequelize.query(
          `
            insert into eof.NotificationDetail ([accountId],[to_accountId],[messageId],[dataSend],[tokenFCM],[url]) values(${accountId},${toAccountId},N'${messageId}',N'${dataBody}',N'${tokenFCM}',N'${baseUrl}')
            `,
          { type: QueryTypes.INSERT }
        );
        result.data = dataResult;
      }
    } catch (error) {
      status = 500;
      console.log(error);
      result.error = error;
    }
    return res.status(status).send(result);
  }
};
