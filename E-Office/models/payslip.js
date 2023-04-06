"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payslip extends Model { }
  Payslip.init(
    {
      ID: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      mnv: {
        allowNull: false,
        type: DataTypes.STRING
      },
      ten: {
        type: DataTypes.STRING
      },
      chucVu: {
        type: DataTypes.STRING
      },
      boPhan: {
        allowNull: false,
        type: DataTypes.STRING
      },
      tongTN: {
        allowNull: true,
        type: DataTypes.STRING
      },
      bhxh: {
        allowNull: true,
        type: DataTypes.STRING
      },
      thueTNCN: {
        allowNull: true,
        type: DataTypes.STRING
      },
      truKhac: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tienAn: {
        allowNull: true,
        type: DataTypes.STRING
      },
      ungLuong: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tongTru: {
        allowNull: true,
        type: DataTypes.STRING
      },
      thucTra: {
        allowNull: true,
        type: DataTypes.STRING
      },
      congChinh: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tienCongChinh: {
        allowNull: true,
        type: DataTypes.STRING
      },
      lt15: {
        allowNull: true,
        type: DataTypes.STRING
      },
      lt20: {
        allowNull: true,
        type: DataTypes.STRING
      },
      le: {
        allowNull: true,
        type: DataTypes.STRING
      },
      ot1: {
        allowNull: true,
        type: DataTypes.STRING
      },
      ot2: {
        allowNull: true,
        type: DataTypes.STRING
      },
      ot3: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tienLamThem: {
        allowNull: false,
        type: DataTypes.STRING
      },
      nt: {
        allowNull: true,
        type: DataTypes.STRING
      },
      nn: {
        allowNull: true,
        type: DataTypes.STRING
      },
      nl: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tiencaDem: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tcLam: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tongDiem: {
        allowNull: true,
        type: DataTypes.STRING
      },
      xepABC: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tienThuongABC: {
        allowNull: true,
        type: DataTypes.STRING
      },
      chiSoKPI: {
        allowNull: true,
        type: DataTypes.STRING
      },

      HTCV: {
        allowNull: true,
        type: DataTypes.STRING
      },

      phep: {
        allowNull: true,
        type: DataTypes.STRING
      },
      luongPhep: {
        allowNull: true,
        type: DataTypes.STRING
      },
      thamNien: {
        allowNull: true,
        type: DataTypes.STRING
      },
      congHien: {
        allowNull: true,
        type: DataTypes.STRING
      },
      pc: {
        allowNull: true,
        type: DataTypes.STRING
      },
      dienThoai: {
        allowNull: true,
        type: DataTypes.STRING
      },
      HTCV2: {
        allowNull: true,
        type: DataTypes.STRING
      },
      diLai: {
        allowNull: true,
        type: DataTypes.STRING
      },
      htBoSung: {
        allowNull: true,
        type: DataTypes.STRING
      },
      tienDenDo: {
        allowNull: true,
        type: DataTypes.STRING
      },
      kinhDoanh: {
        allowNull: true,
        type: DataTypes.STRING
      },
      nangSuat: {
        allowNull: true,
        type: DataTypes.STRING
      },
      thamNienNangSuat: { // dùng cho SXHN
        allowNull: true,
        type: DataTypes.STRING
      },
      ctp: {
        allowNull: true,
        type: DataTypes.STRING
      },
      kiemNhiem: {
        allowNull: true,
        type: DataTypes.STRING
      },
      chuyenCan: {
        allowNull: true,
        type: DataTypes.STRING
      },
      hoTroKhac: {
        allowNull: true,
        type: DataTypes.STRING
      },
      nghiLe: {
        allowNull: true,
        type: DataTypes.STRING
      },
      luongLe: {
        allowNull: true,
        type: DataTypes.STRING
      },
      boiDuong: {
        allowNull: true,
        type: DataTypes.STRING
      },
      bh: {
        allowNull: true,
        type: DataTypes.STRING
      },

      boSung: {
        allowNull: true,
        type: DataTypes.STRING
      },
      khoiLuong: {
        allowNull: true,
        type: DataTypes.STRING
      },
     
      ghiChu: {
        allowNull: true,
        type: DataTypes.STRING
      },
      phepTon: {
        allowNull: true,
        type: DataTypes.STRING
      },
      nam: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      thang: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      accountId: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      khoi: {
        allowNull: true,
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: "Payslip",
      schema: "eof"
    }
  );
  // (async () => {
  //   await OrderMeta.sync({
  //     force: true
  //   });
  // })();

  return Payslip;
};
