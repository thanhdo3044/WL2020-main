const crypto = require("crypto-js");
const { Payslip } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  import: async (req, res) => {
    let result = {};
    let status = 200;
    const payload = req.body;
    try {
      payload.forEach(async e => {
        const ele = await Payslip.findOne({
          where: {
            [Op.and]: [{ mnv: e.mnv }, { thang: e.thang }, { nam: e.nam }]
          }
        });
        console.log("req.body.item", ele);
        for (const key in e) {
          var value = e[key] ? e[key].toString() : "-";
          console.log(value);
          if (
            key != "accountId" &&
            key != "nam" &&
            key != "thang" &&
            key != "mnv" &&
            key != "ten" &&
            key != "khoi"
          )
            e[key] = crypto.AES.encrypt(value, "ma bi mat").toString();
        }
        if (ele) {
          await Payslip.update(e, {
            where: {
              [Op.and]: [{ mnv: e.mnv }, { thang: e.thang }, { nam: e.nam }]
            }
          });
        } else {
          console.log(e);
          await Payslip.create(e);
        }
      });
      result.data = payload;
      return res.status(status).send({ result, success: true });
    } catch (error) {
      console.log("eeeeeeeeeeeeeeeeeeeeee", error);
      return res.status(400).json({ success: false, error });
    }

    // const data = await Payslip.bulkCreate(req.body);
    // for (const data in req.body) {
    //   console.log("data", data);
    //   document = await DOCUMENT.bulkCreate(data);
    // }
  },
  getAll: async (req, res) => {
    let result = {};
    const mnv = req.params.accountId;
    const nam = req.params.year;
    let status = 200;
    try {
      const data = await Payslip.findAll({
        where: { mnv, nam },
        order: [["createdAt", "DESC"]]
      });
      result.data = data;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },
  getByCondition: async (req, res) => {
    let result = {};
    const { month: thang, year: nam, khoi } = req.params;
    let status = 200;
    try {
      const data = await Payslip.findAll({
        where: { nam, thang, khoi },
        order: [["createdAt", "DESC"]]
      });
      result.data = data;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  },

  // getById: async (req, res) => {
  //   const { id } = req.params;
  //   let result = {};
  //   let status = 200;
  //   try {
  //       await new mssql.ConnectionPool(test)
  //     const data = await new mssql.query(`
  //       SELECT *
  //       FROM
  //          (SELECT
  //       ID,[mnv] [Mã nhân viên]
  //             ,[ten] [Họ tên]
  //             ,[chucVu] [Chức vụ]
  //             ,[boPhan] [Bộ phận]
  //             ,[congChinh] [Công chính]
  //             ,[tienCongChinh] [Tiền công chính]
  //             ,[lt15] [LT 1.5]
  //             ,[lt20] [LT 2.0]
  //             ,[le] [Lễ]
  //             ,[tienLamThem] [Tiền làm thêm]
  //             ,[nt] [NT (0.3)]
  //             ,[nn] [NN (0.7)]
  //             ,[nl] [NL (0.9)]
  //             ,[tiencaDem] [Tiền làm ca đêm]
  //             ,[xepABC] [Xếp ABC]
  //             ,[tienThuongABC] [Tiền thưởng ABC ]
  //             ,[chiSoKPI] [Chỉ số KPI]
  //             ,[HTCV] [Tiền thưởng HTCV]
  //             ,[phep] [Phép]
  //             ,[luongPhep] [Lương phép]
  //             ,[tongDiem] [Tổng điểm]
  //             ,[tcLam] [TC Làm]
  //             ,[thamNien] [Hệ số thâm niên]
  //             ,[hoTroKhac] [Hỗ trợ khác]
  //             ,[pc] [PC TN/ATV/SCC/PCCC]
  //             ,[dienThoai] [Điện thoại]
  //             ,[HTCV2] [Thưởng HTCV2]
  //             ,[diLai] [Đi lại]
  //             ,[kinhDoanh] [Thưởng kinh doanh]
  //             ,[nangSuat] [Thưởng năng suất]
  //             ,[ctp] [Khoản công tác phí]
  //             ,[kiemNhiem] [Thưởng kiêm nhiệm]
  //             ,[chuyenCan] [Thưởng chuyên cần]
  //             ,[luongLe] [Tiền lương lễ]
  //             ,[boiDuong] [Chế độ bồi dưỡng bằng hiện vật theo ngày công]
  //             ,[bh] [Tính trả 21.5% BH]
  //             ,[boSung] [Khoản tính bổ sung]
  //             ,[khoiLuong] [Thưởng khối lượng]
  //             ,[tongTN] [Tổng trách nhiệm tính trả]
  //             ,[bhxh] [Tiền BHXH 10.5%]
  //             ,[thueTNCN] [Trừ thuế TNCN]
  //             ,[truKhac] [Trừ khác]
  //             ,[tienAn] [CĐ hiện vật theo nhà bếp]
  //             ,[ungLuong] [Tạm ứng lương]
  //             ,[tongTru] [Tổng trừ]
  //             ,[thucTra] [Tổng TN trả]
  //             ,[ghiChu] [Ghi chú]

  //          FROM eof.Payslips) p
  //       UNPIVOT (Orders FOR valus IN (
  //              [Mã nhân viên]
  //             ,[Họ tên]
  //             ,[Chức vụ]
  //             ,[Bộ phận]
  //             ,[Công chính]
  //             ,[Tiền công chính]
  //             ,[LT 1.5]
  //             ,[LT 2.0]
  //             ,[Lễ]
  //             ,[Tiền làm thêm]
  //             ,[NT (0.3)]
  //             ,[NN (0.7)]
  //             ,[NL (0.9)]
  //             ,[Tiền làm ca đêm]
  //             ,[Xếp ABC]
  //             ,[Tiền thưởng ABC ]
  //             ,[Chỉ số KPI]
  //             ,[Tiền thưởng HTCV]
  //             ,[Phép]
  //             ,[Lương phép]
  //             ,[Tổng điểm]
  //             ,[TC Làm]
  //             ,[Hệ số thâm niên]
  //             ,[Hỗ trợ khác]
  //             ,[PC TN/ATV/SCC/PCCC]
  //             ,[Điện thoại]
  //             ,[Thưởng HTCV2]
  //             ,[Đi lại]
  //             ,[Thưởng kinh doanh]
  //             ,[Thưởng năng suất]
  //             ,[Khoản công tác phí]
  //             ,[Thưởng kiêm nhiệm]
  //             ,[Thưởng chuyên cần]
  //             ,[Tiền lương lễ]
  //             ,[Chế độ bồi dưỡng bằng hiện vật theo ngày công]
  //             ,[Tính trả 21.5% BH]
  //             ,[Khoản tính bổ sung]
  //             ,[Thưởng khối lượng]
  //             ,[Tổng trách nhiệm tính trả]
  //             ,[Tiền BHXH 10.5%]
  //             ,[Trừ thuế TNCN]
  //             ,[Trừ khác]
  //             ,[CĐ hiện vật theo nhà bếp]
  //             ,[Tạm ứng lương]
  //             ,[Tổng trừ]
  //             ,[Tổng TN trả]
  //             ,[Ghi chú]))
  //           AS unpvt;
  //     `);
  //     result.data = data;
  //   } catch (error) {
  //     console.log(error);
  //     status = 500;
  //     result.error = error;
  //   }
  //   return res.status(status).send(result);
  // }
  getById: async (req, res) => {
    const cloneAndRename = (obj, renames) => {
      let clone = {};
      Object.keys(obj).forEach(function (key) {
        if (renames[key] !== undefined) {
          clone[renames[key]] = obj[key];
        } else {
          clone[key] = obj[key];
        }
      });
      return clone;
    };
    const { id } = req.params;
    let result = {};
    let status = 200;
    try {
      const data = await Payslip.findAll({
        where: { id },
        attributes: {
          exclude: [
            "nam",
            "thang",
            "accountId",
            "createdAt",
            "updatedAt",
            "boPhan"
          ]
        },
        order: [["id", "DESC"]]
      });
      console.log("haha", data);
      if (data[0].dataValues.khoi === "SXHN") {
        console.log("a");
        delete data[0].dataValues.kinhDoanh;
        delete data[0].dataValues.ctp;
        delete data[0].dataValues.kiemNhiem;
        delete data[0].dataValues.congHien;
        delete data[0].dataValues.ot1;
        delete data[0].dataValues.ot2;
        delete data[0].dataValues.ot3;
        delete data[0].dataValues.nangSuat;
      }
      if (data[0].dataValues.khoi === "VPHN") {
        console.log("a2");

        delete data[0].dataValues.xepABC;
        delete data[0].dataValues.tienThuongABC;
        delete data[0].dataValues.hoTroKhac;
        delete data[0].dataValues.HTCV2;
        delete data[0].dataValues.nangSuat;
        delete data[0].dataValues.congHien;
        delete data[0].dataValues.khoiLuong;
        delete data[0].dataValues.ot1;
        delete data[0].dataValues.ot2;
        delete data[0].dataValues.ot3;
        delete data[0].dataValues.thamNienNangSuat;

      }
      if (
        data[0].dataValues.khoi === "SXTQ" ||
        data[0].dataValues.khoi === "SXVCN"
      ) {
        console.log("a3");

        delete data[0].dataValues.kinhDoanh;
        delete data[0].dataValues.ctp;
        delete data[0].dataValues.kiemNhiem;
        delete data[0].dataValues.ot1;
        delete data[0].dataValues.ot2;
        delete data[0].dataValues.ot3;
        delete data[0].dataValues.thamNienNangSuat;

      }
      if (
        data[0].dataValues.khoi == "VPTQ" ||
        data[0].dataValues.khoi === "VPVCN"
      ) {
        console.log("4");

        delete data[0].dataValues.xepABC;
        delete data[0].dataValues.tienThuongABC;
        delete data[0].dataValues.hoTroKhac;
        delete data[0].dataValues.HTCV2;
        delete data[0].dataValues.nangSuat;
        delete data[0].dataValues.khoiLuong;
        delete data[0].dataValues.ot1;
        delete data[0].dataValues.ot2;
        delete data[0].dataValues.ot3;
        delete data[0].dataValues.thamNienNangSuat;


      }
      let dataMap = [];
      let data1 = data[0].dataValues;
      console.log("dsadsa", data1);

      for (let key in data1) {
        console.log("dsadsa", data1[key]);
        if (key != 'khoi')
          data1[key] = await crypto.AES.decrypt(
            `${data1[key]}`,
            "ma bi mat"
          ).toString(crypto.enc.Utf8);
      }
      console.log("dsadsasadsadsadsadadsad", data1.khoi);
      if (data1.khoi == 'VPTQ' || data1.khoi == 'VPVCN')
        data1 = await cloneAndRename(data1, {
          ten: "Họ và tên",
          chucVu: "Chức vụ",
          boPhan: "Bộ phận",
          congChinh: "Công chính",
          tienCongChinh: "Tiền công chính",
          lt15: "LT Ngày thường",
          lt20: "LT Ngày nghỉ",
          le: "LT Ngày lễ",
          ot1: "Ca 3 NT (0.3)",
          ot2: "Ca 3 NN (0.7)",
          ot3: "Ca 3 NL (0.9)",
          tienLamThem: "Tiền Làm thêm",
          nt: "NT (0.3)",
          nn: "NN (0.7)",
          nl: "NL (0.9)",
          tiencaDem: "Tiền ca đêm",
          xepABC: "Xếp ABC",
          tienThuongABC: "Tiền thưởng ABC",
          chiSoKPI: "Chỉ số KPI",
          HTCV: "Tiền thưởng HTCV",
          phep: "Số ngày nghỉ phép",
          luongPhep: "Lương phép",
          tongDiem: "Tổng điểm",
          tcLam: "Tổng công",
          thamNien: "Hệ số cống hiến",
          hoTroKhac: "Hỗ trợ khác/Thưởng kiêm nhiệm",
          pc: "PC TN/ATV/SCC/PCCC",
          dienThoai: "Điện thoại",
          HTCV2: "Thưởng HTCV2/Khoán CTP",
          diLai: "Hỗ trợ(Đi lại & Nhà ở)",
          kinhDoanh: "Thưởng KD",
          nangSuat: "Thưởng năng suất", //dùng trong phiếu lương khác trừ SXHN
          thamNienNangSuat: "Thưởng NS/Thưởng cống hiến", // dùng trong phiếu lương SXHN
          ctp: "Khoán công tác phí",
          kiemNhiem: "Thưởng kiêm nhiệm/Hỗ trợ khác",
          chuyenCan: "Thưởng chuyên cần",
          nghiLe: "Số ngày nghỉ Lễ",
          luongLe: "Tiền lương lễ",
          boiDuong: "Bồi dưỡng bằng HV theo ngày công",
          bh: "Tình trả 21.5% BH",
          boSung: "Khoản tính bổ sung",
          congHien: "Thưởng cống hiến",
          khoiLuong: "Thưởng bổ sung",
          tongTN: "Tổng TN tính trả",
          bhxh: "Tiền BHXH 10.5%",
          thueTNCN: "Trừ thuế TNCN",
          truKhac: "Trừ khác",
          tienAn: "CĐ hiện vật theo nhà bếp",
          ungLuong: "Tạm ứng lương",
          tongTru: "Tổng trừ",
          thucTra: "Tổng TN thực trả",
          ghiChu: "Ghi chú",
          phepTon:'Số phép còn tồn'
        });
      if (data1.khoi == 'SXTQ' || data1.khoi == 'SXVCN')
        data1 = await cloneAndRename(data1, {
          ten: "Họ và tên",
          chucVu: "Chức vụ",
          boPhan: "Bộ phận",
          congChinh: "Công chính",
          tienCongChinh: "Tiền công chính",
          lt15: "LT Ngày thường",
          lt20: "LT Ngày nghỉ",
          le: "LT Ngày lễ",
          ot1: "Ca 3 NT (0.3)",
          ot2: "Ca 3 NN (0.7)",
          ot3: "Ca 3 NL (0.9)",
          tienLamThem: "Tiền Làm thêm",
          nt: "NT (0.3)",
          nn: "NN (0.7)",
          nl: "NL (0.9)",
          tiencaDem: "Tiền ca đêm",
          xepABC: "Xếp ABC",
          tienThuongABC: "Tiền thưởng ABC",
          chiSoKPI: "Chỉ số KPI",
          HTCV: "Tiền thưởng HTCV",
          phep: "Số ngày nghỉ phép",
          luongPhep: "Lương phép",
          tongDiem: "Tổng điểm",
          tcLam: "Tổng công",
          thamNien: "Hệ số cống hiến",
          hoTroKhac: "Hỗ trợ khác/Thưởng kiêm nhiệm",
          pc: "PC TN/ATV/SCC/PCCC",
          dienThoai: "Điện thoại",
          HTCV2: "Thưởng HTCV2/Khoán CTP",
          diLai: "Hỗ trợ(Đi lại & Nhà ở)",
          kinhDoanh: "Thưởng KD",
          nangSuat: "Thưởng năng suất", //dùng trong phiếu lương khác trừ SXHN
          thamNienNangSuat: "Thưởng NS/Thưởng cống hiến", // dùng trong phiếu lương SXHN
          ctp: "Khoán công tác phí",
          kiemNhiem: "Thưởng kiêm nhiệm/Hỗ trợ khác",
          chuyenCan: "Thưởng chuyên cần",
          nghiLe: "Số ngày nghỉ Lễ",
          luongLe: "Tiền lương lễ",
          boiDuong: "Bồi dưỡng bằng HV theo ngày công",
          bh: "Tình trả 21.5% BH",
          boSung: "Khoản tính bổ sung",
          congHien: "Thưởng cống hiến",
          khoiLuong: "Thưởng bổ sung",
          tongTN: "Tổng TN tính trả",
          bhxh: "Tiền BHXH 10.5%",
          thueTNCN: "Trừ thuế TNCN",
          truKhac: "Trừ khác",
          tienAn: "CĐ hiện vật theo nhà bếp",
          ungLuong: "Tạm ứng lương",
          tongTru: "Tổng trừ",
          thucTra: "Tổng TN thực trả",
          ghiChu: "Ghi chú",
          phepTon:'Số phép còn tồn'

        });
      if (data1.khoi == 'VPHN')
        data1 = await cloneAndRename(data1, {
          ten: "Họ và tên",
          chucVu: "Chức vụ",
          boPhan: "Bộ phận",
          congChinh: "Công chính",
          tienCongChinh: "Tiền công chính",
          lt15: "LT Ngày thường",
          lt20: "LT Ngày nghỉ",
          le: "LT Ngày lễ",
          ot1: "Ca 3 NT (0.3)",
          ot2: "Ca 3 NN (0.7)",
          ot3: "Ca 3 NL (0.9)",
          tienLamThem: "Tiền Làm thêm",
          nt: "NT (0.3)",
          nn: "NN (0.7)",
          nl: "NL (0.9)",
          tiencaDem: "Tiền ca đêm",
          xepABC: "Xếp ABC",
          tienThuongABC: "Tiền thưởng ABC",
          chiSoKPI: "Chỉ số KPI",
          HTCV: "Tiền thưởng HTCV",
          phep: "Số ngày nghỉ phép",
          luongPhep: "Lương phép",
          tongDiem: "Tổng điểm",
          tcLam: "Tổng công",
          thamNien: "Hệ số cống hiến",
          hoTroKhac: "Hỗ trợ khác/Thưởng kiêm nhiệm",
          pc: "PC TN/ATV/SCC/PCCC",
          dienThoai: "Điện thoại",
          HTCV2: "Thưởng HTCV2/Khoán CTP",
          diLai: "Hỗ trợ(Đi lại & Nhà ở)",
          kinhDoanh: "Thưởng KD",
          nangSuat: "Thưởng năng suất", //dùng trong phiếu lương khác trừ SXHN
          thamNienNangSuat: "Thưởng NS/Thưởng cống hiến", // dùng trong phiếu lương SXHN
          ctp: "Khoán công tác phí",
          kiemNhiem: "Thưởng kiêm nhiệm/Hỗ trợ khác",
          chuyenCan: "Thưởng chuyên cần",
          nghiLe: "Số ngày nghỉ Lễ",

          luongLe: "Tiền lương lễ",
          boiDuong: "Bồi dưỡng bằng HV theo ngày công",
          bh: "Tình trả 21.5% BH",
          boSung: "Khoản tính bổ sung",
          congHien: "Thưởng cống hiến",
          khoiLuong: "Thưởng bổ sung",
          NgungViec: "Lương ngừng việc",
          tongTN: "Tổng TN tính trả",
          bhxh: "Tiền BHXH 10.5%",
          thueTNCN: "Trừ thuế TNCN",
          truKhac: "Trừ khác",
          tienAn: "CĐ hiện vật theo nhà bếp",
          ungLuong: "Tạm ứng lương",
          tongTru: "Tổng trừ",
          thucTra: "Tổng TN thực trả",
          ghiChu: "Ghi chú",
          phepTon:'Số phép còn tồn'

        });
      if (data1.khoi == 'SXHN') {
        data1 = await cloneAndRename(data1, {
          ten: "Họ và tên",
          chucVu: "Chức vụ",
          boPhan: "Bộ phận",
          congChinh: "Công chính",
          tienCongChinh: "Tiền công chính",
          lt15: "LT Ngày thường",
          lt20: "LT Ngày nghỉ",
          le: "LT Ngày lễ",
          ot1: "Ca 3 NT (0.3)",
          ot2: "Ca 3 NN (0.7)",
          ot3: "Ca 3 NL (0.9)",
          tienLamThem: "Tiền Làm thêm",
          nt: "NT (0.3)",
          nn: "NN (0.7)",
          nl: "NL (0.9)",
          tiencaDem: "Tiền ca đêm",
          xepABC: "Xếp ABC",
          tienThuongABC: "Tiền thưởng ABC",
          chiSoKPI: "Chỉ số KPI",
          HTCV: "Tiền thưởng HTCV",
          phep: "Số ngày nghỉ phép",
          luongPhep: "Lương phép",
          tongDiem: "Tổng điểm",
          tcLam: "Tổng công",
          thamNien: "Hệ số cống hiến",
          hoTroKhac: "Hỗ trợ khác/Thưởng kiêm nhiệm",
          pc: "PC TN/ATV/SCC/PCCC",
          dienThoai: "Điện thoại",
          HTCV2: "Thưởng HTCV2/khoán CTP",
          diLai: "Hỗ trợ(Đi lại & Nhà ở)",
          kinhDoanh: "Thưởng KD/Thưởng cống hiến",
          nangSuat: "Thưởng năng suất", //dùng trong phiếu lương khác trừ SXHN
          thamNienNangSuat: "Thưởng NS/Thưởng cống hiến", // dùng trong phiếu lương SXHN
          ctp: "Khoán công tác phí",
          kiemNhiem: "Thưởng kiêm nhiệm",
          chuyenCan: "Thưởng chuyên cần",
          nghiLe: "Số ngày nghỉ Lễ",
          luongLe: "Tiền lương lễ",
          boiDuong: "Bồi dưỡng bằng HV theo ngày công",
          bh: "Tình trả 21.5% BH",
          boSung: "Khoản tính bổ sung",
          NgungViec: "Lương ngừng việc",
          congHien: "Thưởng cống hiến",
          khoiLuong: "Thưởng bổ sung khác",
          tongTN: "Tổng TN tính trả",
          bhxh: "Tiền BHXH 10.5%",
          thueTNCN: "Trừ thuế TNCN",
          truKhac: "Trừ khác",
          tienAn: "CĐ hiện vật theo nhà bếp",
          ungLuong: "Tạm ứng lương",
          tongTru: "Tổng trừ",
          thucTra: "Tổng TN thực trả",
          ghiChu: "Ghi chú",
          phepTon:'Số phép còn tồn'

        });
      }
      // for (const key in data1) {
      //   dataMap.push({ khoan: key, tien: data1[key] });
      //   // console.log(`${key}: ${data[key]}`)
      // }
      console.log("dad", data[0].dataValues);
      result.data = data[0].dataValues;
    } catch (error) {
      console.log(error);
      status = 500;
      result.error = error;
    }
    return res.status(status).send(result);
  }
};
