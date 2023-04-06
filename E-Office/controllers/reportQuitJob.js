const { Request, Account, Order, Department, data } = require("../models");
const Joi = require("@hapi/joi");
const { QueryTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const db = {};
const moment = require("moment");
const { sequelize } = require("../config/config");
module.exports = {
  //xóa toàn bộ theo orderId
  delete: async (req, res) => {
    let result = {};
    let status = 200;
    try {
      let dataFilter = await sequelize.query(
        `
               select distinct om.selection,o.* , a.ACCOUNT , a.LAST_NAME ,a.POSITION ,d.NAME , om.dateStart , om.dateEnd ,om.description from  eof.Orders o
left join eof.OrderMeta om on om.orderId = o.id
left join base.ACCOUNT a on a.ID = o.accountId
left join base.DEPARTMENT d on d.ID = a.departmentId
where o.deletedAt is  null and slug = N'xin-nghi-viec' and status =N'Đã được duyệt' and (SUBSTRING(om.dateStart,4,2) = '02' or SUBSTRING(om.dateEnd,4,2) = '02')`,
        { type: QueryTypes.SELECT }
      );
      let dataDel = await sequelize.query(
        `
               delete eof.ReportQuitJob`,
        { type: QueryTypes.DELETE }
      );
      console.log("dataFilter", dataFilter);
      for (let i = 0; i < dataFilter.length; i++) {
        if (
          dataFilter[i].dateStart.slice(3, 5) <
          dataFilter[i].dateEnd.slice(3, 5)
        ) {
        }
        let dataSel = await sequelize.query(
          `
                select * from eof.ReportQuitJob where employeeCode = N'${
                  dataFilter[i].ACCOUNT
                }' and monthsReport ='${dataFilter[i].dateStart.slice(
            3,
            5
          )}' and yearsReport ='${dataFilter[i].dateStart.slice(6, 10)}'  `,
          { type: QueryTypes.SELECT }
        );
        console.log(
          "dataFilter[i].dateStart.slice(0,4)",
          dataFilter[i].dateStart.slice(0, 2)
        );
        console.log(
          "dataFilter[i].dateStart.slice(0,4)",
          dataFilter[i].dateStart.slice(3, 5)
        );
        console.log(
          "dataFilter[i].dateStart.slice(6, 9)",
          dataFilter[i].dateStart.slice(6, 10)
        );
        console.log(
          "dataFilter[i].dateStart.slice(6, 9)",
          dataFilter[i].dateStart.slice(11, 16)
        );
        let dateStart =
          dataFilter[i].dateStart.slice(6, 10) +
          dataFilter[i].dateStart.slice(3, 5) +
          dataFilter[i].dateStart.slice(0, 2);
        let dateEnd =
          dataFilter[i].dateEnd.slice(6, 10) +
          dataFilter[i].dateEnd.slice(3, 5) +
          dataFilter[i].dateEnd.slice(0, 2);
        let selection = "";
        if (dataFilter[i].selection == "Nghỉ ốm") {
          selection = "O";
        } else if (dataFilter[i].selection == "Nghỉ phép") {
          selection = "P";
        } else if (
          dataFilter[i].selection == "Nghỉ việc riêng có hưởng lương"
        ) {
          selection = "HH";
        } else if (dataFilter[i].selection == "Xin nghỉ không lương") {
          selection = "KL";
        } else if (dataFilter[i].selection == "Xin nghỉ thai sản") {
          selection = "TS";
        } else if (
          dataFilter[i].selection == "Xin nghỉ việc(kết thúc hợp đồng lao động)"
        ) {
          selection = "KTHĐLĐ";
        }
        let dateBetween = await sequelize.query(
          `
                DECLARE @start_dt AS DATE='${dateStart}';
DECLARE @end_dt AS DATE='${dateEnd}';
DECLARE @lyDo AS nvarchar(200)='${dataFilter[i].description}';
DECLARE @dateStart AS nvarchar(200)='${dataFilter[i].dateStart}';
DECLARE @dateEnd AS nvarchar(200)='${dataFilter[i].dateEnd}';
DECLARE @selection AS nvarchar(200)='${selection}';
DECLARE @monthsReport AS nvarchar(200)='${dataFilter[i].dateStart.slice(3, 5)}';
DECLARE @yearsReport AS nvarchar(200)='${dataFilter[i].dateStart.slice(6, 10)}';
DECLARE @dates AS TABLE(date_id DATE PRIMARY KEY,
date_year SMALLINT,
date_month TINYINT,
date_day TINYINT,
weekday_id TINYINT,
weekday_nm VARCHAR(10),
month_nm VARCHAR(10),
day_of_year SMALLINT,
quarter_id TINYINT,
first_day_of_month DATE,
last_day_of_month DATE,
start_dts DATETIME,
end_dts DATETIME,
lyDo nvarchar(200),
dateStart nvarchar(200),
dateEnd nvarchar(200),
selection nvarchar(200),
monthsReport nvarchar(200),
yearsReport nvarchar(200));
WHILE @start_dt<=@end_dt BEGIN
    INSERT INTO @dates(date_id, date_year, date_month, date_day, weekday_id, weekday_nm, month_nm, day_of_year, quarter_id, first_day_of_month, last_day_of_month, start_dts, end_dts,lyDo,dateStart,dateEnd,selection,monthsReport,yearsReport)
    VALUES(@start_dt, YEAR(@start_dt), MONTH(@start_dt), DAY(@start_dt), DATEPART(WEEKDAY, @start_dt), DATENAME(WEEKDAY, @start_dt), DATENAME(MONTH, @start_dt), DATEPART(DAYOFYEAR, @start_dt), DATEPART(QUARTER, @start_dt), DATEADD(DAY, -(DAY(@start_dt)-1), @start_dt), DATEADD(DAY, -(DAY(DATEADD(MONTH, 1, @start_dt))), DATEADD(MONTH, 1, @start_dt)), CAST(@start_dt AS DATETIME), DATEADD(SECOND, -1, CAST(DATEADD(DAY, 1, @start_dt) AS DATETIME)),@lyDo,@dateStart,@dateEnd,@selection,@monthsReport,@yearsReport);
    SET @start_dt=DATEADD(DAY, 1, @start_dt);
END;
SELECT date_id AS [Ngày], date_year AS [Năm], date_month AS [Tháng], date_day AS [Ngày trong tháng], weekday_id AS [ID thứ], weekday_nm AS [Thứ], month_nm AS [Tháng], day_of_year AS [Ngày trong năm], quarter_id AS [Quý], first_day_of_month AS [Ngày đầu tiên của tháng], last_day_of_month AS [Ngày cuối cùng của tháng], start_dts, end_dts,lyDo,dateStart,dateEnd,selection,monthsReport,yearsReport
FROM @dates`,
          { type: QueryTypes.SELECT }
        );
        let dataUpload = [
          {
            ngay01: "",
            ngay02: "",
            ngay03: "",
            ngay04: "",
            ngay05: "",
            ngay06: "",
            ngay07: "",
            ngay08: "",
            ngay09: "",
            ngay10: "",
            ngay11: "",
            ngay12: "",
            ngay13: "",
            ngay14: "",
            ngay15: "",
            ngay16: "",
            ngay17: "",
            ngay18: "",
            ngay19: "",
            ngay20: "",
            ngay21: "",
            ngay22: "",
            ngay23: "",
            ngay24: "",
            ngay25: "",
            ngay26: "",
            ngay27: "",
            ngay28: "",
            ngay29: "",
            ngay30: "",
            ngay31: ""
          }
        ];

        console.log("dateBetween", dateBetween);
        console.log("dataSel", dataSel);
        console.log("dataUpload truoc upd", dataUpload);
        dataUpload.forEach(async e => {
          for (const key in e) {
            dataSel.forEach(element => {
              for (const id in element) {
                if (id == key) {
                  console.log("e[key]", e[key]);
                  console.log("element[id]", element[id]);
                  return (e[key] = element[id]);
                }
              }
            });
          }
        });

        console.log("dataUpload sau upd", dataUpload);
        dataUpload.forEach(async e => {
          for (const key in e) {
            // console.log(key.slice(4, 7))
            // if (e.Ngày.slice(8, 10) == key.slice(5, 7)) {
            dateBetween.forEach(data => {
              if (data.Ngày.slice(8, 10) == key.slice(4, 7)) {
                console.log("data search", data);
                console.log("key", key);
                return (e[key] = data.selection);
              }
            });
            // }
          }
        });

        console.log("dataUpload", dataUpload);
        console.log("dataSel lần 1", dataSel);
        //insert dữ liệu vào bảng báo cáo
        if (dataSel.length === 0) {
          dataUpload.forEach(async element => {
            for (const key in element) {
              console.log("element", element);
              console.log("key", key);
              console.log("element[key]", element[key]);
              let dataSel2 = await sequelize.query(
                `
                select * from eof.ReportQuitJob where employeeCode = N'${
                  dataFilter[i].ACCOUNT
                }' and monthsReport ='${dataFilter[i].dateStart.slice(
                  3,
                  5
                )}' and yearsReport ='${dataFilter[i].dateStart.slice(
                  6,
                  10
                )}' `,
                { type: QueryTypes.SELECT }
              );
              console.log("dataSel2", dataSel2);
              if (dataSel2.length > 0) {
                // nếu đã có bản ghi từ đầu sẽ update theo mã nhân viên và tháng - năm
                let dataUpd = await sequelize.query(
                  `
                            update  eof.ReportQuitJob set ${key} = '${
                    element[key]
                  }' where employeeCode = N'${
                    dataFilter[i].ACCOUNT
                  }'  and monthsReport ='${dataFilter[i].dateStart.slice(
                    3,
                    5
                  )}' and yearsReport ='${dataFilter[i].dateStart.slice(
                    6,
                    10
                  )}'`,
                  { type: QueryTypes.UPDATE }
                );
              } else {
                // nếu chưa có bản ghi từ đầu sẽ insert bản  theo mã nhân viên và tháng - năm
                let insert = await sequelize.query(
                  `
                            insert into eof.ReportQuitJob ([employeeCode],[employeeName],[employeeDepartment],[monthsReport],[yearsReport],[${key}]) 
                            VALUES (N'${dataFilter[i].ACCOUNT}',N'${
                    dataFilter[i].LAST_NAME
                  }',N'${dataFilter[i].NAME}',N'${dataFilter[i].dateStart.slice(
                    3,
                    5
                  )}',N'${dataFilter[i].dateStart.slice(6, 10)}',N'${
                    element[key]
                  }');`,
                  { type: QueryTypes.INSERT }
                );
              }
            }
          });
          //     dataUpload.forEach(async element => {
          //         for (const key in element) {
          //             console.log("element", element);
          //             console.log("key", key);
          //             console.log("element[key]", element[key]);
          //             let dataSel2 = await sequelize.query(
          //                 `
          // select * from eof.ReportQuitJob where employeeCode = N'${dataFilter[i].ACCOUNT}'`, { type: QueryTypes.SELECT }
          //             );
          //             console.log("dataSel2", dataSel2);
          //             if (dataSel2.length > 0) {
          //                 let dataUpd = await sequelize.query(
          //                     `
          //             update  eof.ReportQuitJob set ${key} = '${element[key]}' where employeeCode = N'${dataFilter[i].ACCOUNT}'`, { type: QueryTypes.UPDATE }
          //                 );
          //             }
          //         }
          //     });
        } else {
          dataUpload.forEach(async element => {
            for (const key in element) {
              console.log("key else", key);
              console.log("element[key] else", element[key]);
              await sequelize.query(
                `
                            update  eof.ReportQuitJob set ${key} = '${
                  element[key]
                }' where employeeCode = N'${
                  dataFilter[i].ACCOUNT
                }'  and monthsReport ='${dataFilter[i].dateStart.slice(
                  3,
                  5
                )}' and yearsReport ='${dataFilter[i].dateStart.slice(6, 10)}'`,
                { type: QueryTypes.UPDATE }
              );
            }
          });
        }
      }
      // result.data = dataSel;
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
    let { option, day, departmentId } = req.body;
    try {
      let dataSel = await sequelize.query(
        `
        if (${option} = 0 )
	begin
		
		select * from (
          select   count(*) as total ,  case 
              when slug ='mua-hang' and o.proposalFormId = 1028 then N'Phiếu mua hàng/cấp vật tư sửa chữa tiêu hao'
              when slug ='mua-hang' and o.proposalFormId = 1029 then N'Phiếu mua hàng/cấp vật tư chế tạo'
              when slug ='mua-hang' and o.proposalFormId = 1026 then N'Phiếu mua hàng/cấp vật tư khối dự án'
              when slug ='mua-hang' and o.proposalFormId = 1031 then N'Phiếu mua hàng/cấp vật tư khối ván công nghiệp'
              when slug ='mua-hang' and o.proposalFormId = 3 then N'Phiếu mua hàng/cấp vật tư NM Thuận Hưng'
              when slug ='xac-nhan-cong' then N'Phiếu làm thêm giờ'
              when slug ='xin-ra-cong' and o.proposalFormId = 15 then N'Phiếu xin ra cổng Cũ'
              when slug ='xin-ra-cong' and o.proposalFormId = 1032 then N'Phiếu xin ra cổng NM CGB TH'
              when slug ='xin-ra-cong' and o.proposalFormId = 1033 then N'Phiếu xin ra cổng NM CGB NH'
              when slug ='xin-ra-cong' and o.proposalFormId = 1034 then N'Phiếu xin ra cổng NM CGB QM'
              when slug ='xin-ra-cong' and o.proposalFormId = 1035 then N'Phiếu xin ra cổng NM CGB YS1A-1B-2'
              when slug ='xin-ra-cong' and o.proposalFormId = 1036 then N'Phiếu xin ra cổng NM CGB TB'
              when slug ='di-cong-tac' then N'Phiếu đề nghị đi công tác'
              end as [order] from eof.Orders o
              where o.createdAt between GETDATE() - ${day} and GETDATE() and deletedAt is null   group by slug , proposalFormId
          union all
          select   count(*) as total ,  
          case 
              when o.slug ='xin-nghi-viec' and om.selection = N'Nghỉ phép' then  N'Phiếu xin nghỉ phép'
          when o.slug ='xin-nghi-viec' and om.selection = N'Nghỉ ốm' then  N'Phiếu xin nghỉ ốm'
          when o.slug ='xin-nghi-viec' and om.selection = N'Xin nghỉ Thai sản' then  N'Phiếu Xin nghỉ Thai sản'
          when o.slug ='xin-nghi-viec' and om.selection = N'Xin nghỉ không lương' then  N'Phiếu Xin nghỉ không lương'
          when o.slug ='xin-nghi-viec' and om.selection = N'Nghỉ việc riêng có hưởng lương' then  N'Phiếu Nghỉ việc riêng có hưởng lương'
              end as [order] from eof.Orders o
          left join eof.OrderMeta om on om.orderId = o.id
              where o.createdAt between GETDATE() - ${day} and GETDATE() and deletedAt is null  and o.proposalFormId =16  group by slug , proposalFormId , om.selection
		)as X where X.[order] is not null
	end
	else if (${option} = 1)
	begin
		select * from (
          select   count(*) as total ,  case 
              when slug ='mua-hang' and o.proposalFormId = 1028 then N'Phiếu mua hàng/cấp vật tư sửa chữa tiêu hao'
              when slug ='mua-hang' and o.proposalFormId = 1029 then N'Phiếu mua hàng/cấp vật tư chế tạo'
              when slug ='mua-hang' and o.proposalFormId = 1026 then N'Phiếu mua hàng/cấp vật tư khối dự án'
              when slug ='mua-hang' and o.proposalFormId = 1031 then N'Phiếu mua hàng/cấp vật tư khối ván công nghiệp'
              when slug ='mua-hang' and o.proposalFormId = 3 then N'Phiếu mua hàng/cấp vật tư NM Thuận Hưng'
              when slug ='xac-nhan-cong' then N'Phiếu làm thêm giờ'
              when slug ='xin-ra-cong' then N'Phiếu xin ra cổng'
              when slug ='di-cong-tac' then N'Phiếu đề nghị đi công tác'
              end as [order] from eof.Orders o
              where o.createdAt between GETDATE() - ${day} and GETDATE() and deletedAt is null and o.departmentId = ${departmentId} and o.completed =1   group by slug , proposalFormId
          union all
          select   count(*) as total ,  
          case 
              when o.slug ='xin-nghi-viec' and om.selection = N'Nghỉ phép' then  N'Phiếu xin nghỉ phép'
          when o.slug ='xin-nghi-viec' and om.selection = N'Nghỉ ốm' then  N'Phiếu xin nghỉ ốm'
          when o.slug ='xin-nghi-viec' and om.selection = N'Xin nghỉ Thai sản' then  N'Phiếu Xin nghỉ Thai sản'
          when o.slug ='xin-nghi-viec' and om.selection = N'Xin nghỉ không lương' then  N'Phiếu Xin nghỉ không lương'
          when o.slug ='xin-nghi-viec' and om.selection = N'Nghỉ việc riêng có hưởng lương' then  N'Phiếu Nghỉ việc riêng có hưởng lương'
              end as [order] from eof.Orders o
          left join eof.OrderMeta om on om.orderId = o.id
              where o.createdAt between GETDATE() - ${day} and GETDATE() and deletedAt is null  and o.proposalFormId =16 and o.departmentId = ${departmentId} and o.completed =1  group by slug , proposalFormId , om.selection
		)as X where X.[order] is not null
	end
	else if(${option} = 2)
	begin
		select COUNT(*) as total , 'Mail' as [option] 
		from eof.NotificationDetail 
		where email is not null and createdAt between GETDATE() - ${day} and GETDATE()
		union all
		select COUNT(*) as total , N'Ứng dụng Eoffice' as [option] 
		from eof.NotificationDetail  
		where email is  null and createdAt between GETDATE() - ${day} and GETDATE()
	end
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
  }
};
