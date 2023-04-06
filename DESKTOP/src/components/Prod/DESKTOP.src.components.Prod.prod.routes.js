export const prodRoutes = [
  {
    path: "/sua-ke-hoach-san-xuat",
    component: () => import("pages/PageSuaKeHoachTheoMaThiTruong.vue")
  },
  {
    path: "/bao-cao-ton-san-xuat",
    component: () => import("pages/BCTonTrenChuyen.vue")
  },
  {
    path: "/bao-cao-thuc-hien-san-xuat",
    component: () => import("pages/PageBaoCaoThucHienSanXuat.vue")
  },
  {
    path: "/tao-ke-hoach-san-xuat",
    name: "taoKeHoach",
    component: () => import("pages/PageTaoKeHoachSanXuat.vue")
  },
  {
    path: "/bao-cao-cap-phoi-san-xuat",
    component: () => import("pages/PageBaoCaoCapPhoiSanXuat.vue")
  },
  {
    path: "/ke-hoach-nhap-ve",
    component: () => import("pages/KeHoach/PageKeHoachNhapVe.vue")
  },
  {
    path: "/phe-duyet-lenh-san-xuat",
    component: () => import("pages/PageDuyetLenhSanXuatTheoNhaMay.vue")
  },
  {
    path: "/phe-duyet-lenh-san-xuat-2",
    component: () => import("pages/PageDuyetLenhSanXuatTheoNhaMay.vue")
  },
  {
    path: "/he-so-lua-phoi",
    component: () => import("pages/KeHoach/PageHeSoCapPhoiLuaPhoi.vue")
  },
  {
    path: "/ke-hoach",
    component: () => import("pages/KeHoach/PageKeHoach.vue")
  },
  {
    path: "/report-detail-success",
    component: () => import("pages/Reports/Prod/ReportDetailPro.vue")
  },
  {
    path: "/bang-gia-tinh-luong",
    component: () => import("pages/MasterData/PageMarketPrice.vue")
  },
  {
    path: "/bang-gia-tinh-luong-vanity",
    component: () => import("pages/MasterData/PageMarketPriceVanity.vue")
  },
  {
    path: "/dinh-muc",
    component: () => import("pages/PageDinhMuc.vue")
  },
  {
    path: "/bao-cao-san-luong-tinh-luong",
    component: () => import("pages/PageGiaoNhan.vue")
  },
  {
    path: "/bao-cao-san-luong-tinh-luong-tu-vanity",
    component: () => import("pages/PageGiaoNhan2.vue")
  },
  {
    path: "/bao-cao-chi-tiet-cap-phoi",
    component: () => import("pages/PageGiaoPhoi.vue")
  },
  {
    path: "/dinh-tuyen",
    component: () => import("pages/PageDinhTuyen.vue")
  },
  // {
  //   path: "/dinh-tuyen-tq",
  //   component: () => import("pages/PageBOMTQ.vue")
  // },
  {
    path: "/report-prod-result",
    component: () => import("pages/Reports/Prod/Result.vue")
  },
  {
    path: "/report-prod-inventory",
    component: () => import("pages/Reports/Prod/Inventory2.vue")
  },
  {
    path: "/report-prod-result-date",
    component: () => import("pages/Reports/Prod/ResultDate.vue")
  },
  {
    path: "/report-prod-result-month",
    component: () => import("pages/Reports/Prod/ResultMonth.vue")
  },
  {
    path: "/report-prod-result-detail",
    component: () => import("pages/Reports/Prod/ResultDetail.vue")
  },
  {
    path: "/report-prod-defect-detail",
    component: () => import("pages/Reports/Prod/DefectDetail.vue")
  },
  {
    path: "/report-prod-qc-solution",
    component: () => import("pages/Reports/Prod/QcSolution.vue")
  },
  {
    path: "/report-prod-result-prod-order",
    component: () => import("pages/Reports/Prod/ResultLSX.vue")
  },
  {
    path: "/report-prod-qc-luaphoi",
    component: () => import("pages/Reports/Prod/QCxLuaPhoi.vue")
  },
  {
    path: "/report-prod-plan-of-kilnbatch",
    component: () => import("pages/Reports/Prod/MeSay.vue")
  },
  {
    path: "/report-prod-material-of-kilnbatch",
    component: () => import("pages/Reports/Prod/MaterialOfMeSay.vue")
  },
  {
    path: "/report-prod-result-week",
    component: () => import("pages/Reports/Prod/ResultWeek2.vue")
  },
  {
    path: "/report-prod-result-week3",
    component: () => import("pages/Reports/Prod/Week3.vue")
  },
  {
    path: "/report-prod-truy-nguyen",
    component: () => import("pages/Reports/Prod/TruyNguyen.vue")
  },

  {
    path: "/tool-prod-create-package",
    component: () => import("pages/Tools/CreatePackage.vue")
  },

  {
    path: "/bao-cao-cho-say",
    component: () => import("pages/Reports/Prod/BaoCaoChoSay.vue")
  },
  // kế hoạch sản xuất tính theo phòng kế hoạch
  {
    path: "/kh-tinh-kh",
    component: () => import("pages/KH/TinhKeHoach.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/kh-view-plan-cal",
    component: () => import("pages/KH/ViewKeHoach.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/kh-dinh-muc-ton",
    component: () => import("pages/KH/DinhMucTon.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/kh-report-kh",
    component: () => import("pages/Reports/Prod/KeHoachVaThucHien.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nhap-ton-ct",
    component: () => import("pages/Reports/Prod/NhapTonChiTiet.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dinh-muc-phoi",
    component: () => import("pages/DinhMucPhoi.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/tao-phoi",
    component: () => import("pages/TaoPhoi.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/ton-tai-to",
    component: () => import("pages/PageTonTaiTo.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bao-cao-so-lieu-san-xuat",
    component: () => import("pages/BCTonTrenChuyen.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bao-cao-thong-tin-truy-nguyen",
    component: () => import("pages/ThongTinTruyNguyen.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/in-khsx",
    component: () => import("pages/InKHSX.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/thuc-hien-khsx",
    component: () => import("pages/ThucHienKHSX.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bao-cao-san-luong-theo-ngay",
    component: () => import("pages/BCSanLuongByDay.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dinh-muc-nguyen-vat-lieu",
    component: () => import("pages/DinhMucNguyenVatLieu.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dinh-tuyen",
    component: () => import("pages/DinhTuyen.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/duyet-lenh-san-xuat",
    component: () => import("pages/PageDuyetLenhSanXuatTheoNhaMay.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
