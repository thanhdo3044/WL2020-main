import Vue from "vue";
import axios from "axios";
import moment from "moment";

moment.locale("vi");
Vue.prototype.$axios = axios;
if (process.env.PROD) {
  Vue.prototype.$axios.defaults.baseURL = "https://app.woodsland.com.vn:2002";
} else {
  Vue.prototype.$axios.defaults.baseURL = "http://localhost:2003";
}
Vue.prototype.moment = moment;

Vue.filter("upText", function(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
});

Vue.filter("ngay", function(created) {
  if (created) return moment(created.slice(0, 10)).format("L");
  return "";
});

Vue.filter("luc", function(created) {
  return moment(created).fromNow();
});

Vue.filter("lastName", function(account) {
  if (account) return account.lastName;
  return "";
});

Vue.filter("account", function(account) {
  if (account) return account.account;
  return "";
});

Vue.filter("FullName", function(account) {
  if (account) return [account.account, account.lastName].join(" - ");
  return "";
});

Vue.filter("quyCach", function(i) {
  if (i)
    return `${i.itemName} (${i.itemHeight}*${i.itemWidth}*${i.itemLength})`;
  return "Không tìm thấy quy cách";
});

Vue.filter("marketName", function(m) {
  if (m) return m.name;
  return "Không tìm thấy mã thị trường";
});

Vue.filter("thuanHung", function(task) {
  if (task)
    return parseFloat(
      (
        task.keHoach -
        task.ys1a -
        task.ys1b -
        task.tb +
        task.hanMucTon
      ).toFixed(4)
    );
  return "N/A";
});

Vue.filter("soDep", function(soKhongDep) {
  if (soKhongDep && soKhongDep > 0) return parseFloat(soKhongDep.toFixed(4));
  return 0;
});

const ChuSo = new Array(
  " không ",
  " một ",
  " hai ",
  " ba ",
  " bốn ",
  " năm ",
  " sáu ",
  " bảy ",
  " tám ",
  " chín "
);
const Tien = new Array("", " nghìn", " triệu", " tỷ", " nghìn tỷ", " triệu tỷ");

function DocSo3ChuSo(baso) {
  var tram;
  var chuc;
  var donvi;
  var KetQua = "";
  tram = parseInt(baso / 100);
  chuc = parseInt((baso % 100) / 10);
  donvi = baso % 10;
  if (tram == 0 && chuc == 0 && donvi == 0) return "";
  if (tram != 0) {
    KetQua += ChuSo[tram] + " trăm ";
    if (chuc == 0 && donvi != 0) KetQua += " linh ";
  }
  if (chuc != 0 && chuc != 1) {
    KetQua += ChuSo[chuc] + " mươi";
    if (chuc == 0 && donvi != 0) KetQua = KetQua + " linh ";
  }
  if (chuc == 1) KetQua += " mười ";
  switch (donvi) {
    case 1:
      if (chuc != 0 && chuc != 1) {
        KetQua += " mốt ";
      } else {
        KetQua += ChuSo[donvi];
      }
      break;
    case 5:
      if (chuc == 0) {
        KetQua += ChuSo[donvi];
      } else {
        KetQua += " lăm ";
      }
      break;
    default:
      if (donvi != 0) {
        KetQua += ChuSo[donvi];
      }
      break;
  }
  return KetQua;
}

function DocTienBangChu(SoTien) {
  var lan = 0;
  var i = 0;
  var so = 0;
  var KetQua = "";
  var tmp = "";
  var ViTri = new Array();
  if (SoTien < 0) return "Số tiền âm !";
  if (SoTien == 0) return "Không đồng !";
  if (SoTien > 0) {
    so = SoTien;
  } else {
    so = -SoTien;
  }
  if (SoTien > 8999999999999999) {
    //SoTien = 0;
    return "Số quá lớn!";
  }
  ViTri[5] = Math.floor(so / 1000000000000000);
  if (isNaN(ViTri[5])) ViTri[5] = "0";
  so = so - parseFloat(ViTri[5].toString()) * 1000000000000000;
  ViTri[4] = Math.floor(so / 1000000000000);
  if (isNaN(ViTri[4])) ViTri[4] = "0";
  so = so - parseFloat(ViTri[4].toString()) * 1000000000000;
  ViTri[3] = Math.floor(so / 1000000000);
  if (isNaN(ViTri[3])) ViTri[3] = "0";
  so = so - parseFloat(ViTri[3].toString()) * 1000000000;
  ViTri[2] = parseInt(so / 1000000);
  if (isNaN(ViTri[2])) ViTri[2] = "0";
  ViTri[1] = parseInt((so % 1000000) / 1000);
  if (isNaN(ViTri[1])) ViTri[1] = "0";
  ViTri[0] = parseInt(so % 1000);
  if (isNaN(ViTri[0])) ViTri[0] = "0";
  if (ViTri[5] > 0) {
    lan = 5;
  } else if (ViTri[4] > 0) {
    lan = 4;
  } else if (ViTri[3] > 0) {
    lan = 3;
  } else if (ViTri[2] > 0) {
    lan = 2;
  } else if (ViTri[1] > 0) {
    lan = 1;
  } else {
    lan = 0;
  }
  for (i = lan; i >= 0; i--) {
    tmp = DocSo3ChuSo(ViTri[i]);
    KetQua += tmp;
    if (ViTri[i] > 0) KetQua += Tien[i];
    if (i > 0 && tmp.length > 0) KetQua += ","; //&& (!string.IsNullOrEmpty(tmp))
  }
  if (KetQua.substring(KetQua.length - 1) == ",") {
    KetQua = KetQua.substring(0, KetQua.length - 1);
  }
  KetQua = KetQua.substring(1, 2).toUpperCase() + KetQua.substring(2);
  return KetQua; //.substring(0, 1);//.toUpperCase();// + KetQua.substring(1);
}

Vue.filter("bangChu", DocTienBangChu);
