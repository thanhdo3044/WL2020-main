export const prodRoutes = [
  {
    path: "/sua-ke-hoach-san-xuat-> Edit-Prod-Plan",
    component: () => import("pages/PageSuaKeHoachTheoMaThiTruong.vue")
  },
  {
    path: "/bao-cao-ton-san-xuat -> Inventory-Line-Report",
    component: () => import("pages/BCTonTrenChuyen.vue")
  },
  {
    path: "/bao-cao-thuc-hien-san-xuat -> Prod-Plan-Report",
    component: () => import("pages/PageBaoCaoThucHienSanXuat.vue")
  },
  {
    path: "/tao-ke-hoach-san-xuat -> Create-Prod-Plan",
    name: "taoKeHoach",
    component: () => import("pages/PageTaoKeHoachSanXuat.vue")
  },
  {
    path: "/bao-cao-cap-phoi-san-xuat -> Material-Delivery-Report",
    component: () => import("pages/PageBaoCaoCapPhoiSanXuat.vue")
  },
  {
    path: "/ke-hoach-nhap-ve -> Factories-Plan",
    component: () => import("pages/KeHoach/PageKeHoachNhapVe.vue")
  },
  {
    path: "/phe-duyet-lenh-san-xuat -> Approved-Prod-Plan",
    component: () => import("pages/PageDuyetLenhSanXuatTheoNhaMay.vue")
  },
  {
    path: "/phe-duyet-lenh-san-xuat-2 -> Approved-Prod-Plan-2",
    component: () => import("pages/PageDuyetLenhSanXuatTheoNhaMay.vue")
  },
  {
    path: "/he-so-lua-phoi -> Factor-material",
    component: () => import("pages/KeHoach/PageHeSoCapPhoiLuaPhoi.vue")
  },
  {
    path: "/ke-hoach -> Prod-Plan",
    component: () => import("pages/KeHoach/PageKeHoach.vue")
  },
  {
    path: "/report-detail-success",
    component: () => import("pages/Reports/Prod/ReportDetailPro.vue")
  },
  {
    path: "/bang-gia-tinh-luong -> Salary-Calculation-Ikea",
    component: () => import("pages/MasterData/PageMarketPrice.vue")
  },
  {
    path: "/bang-gia-tinh-luong-vanity -> Salary-calculation-Vanity",
    component: () => import("pages/MasterData/PageMarketPriceVanity.vue")
  },
  {
    path: "/dinh-muc -> Prod-Item-Rating",
    component: () => import("pages/PageDinhMuc.vue")
  },
  {
    path: "/bao-cao-san-luong-tinh-luong -> Salary-Calculation-Ikea-Report",
    component: () => import("pages/PageGiaoNhan.vue")
  },
  {
    path: "/bao-cao-san-luong-tinh-luong-tu-vanity -> Salary-calculation-Vanity-Report",
    component: () => import("pages/PageGiaoNhan2.vue")
  },
  {
    path: "/bao-cao-chi-tiet-cap-phoi -> Material-Delivery-Report",
    component: () => import("pages/PageGiaoPhoi.vue")
  },
  {
    path: "/dinh-tuyen -> Prod-Routing",
    component: () => import("pages/PageDinhTuyen.vue")
  },
  // {
  //   path: "/dinh-tuyen-tq",
  //   component: () => import("pages/PageBOMTQ.vue")
  // },
  {
    path: "/report-prod-result -> Prod-Result-Report",
    component: () => import("pages/Reports/Prod/Result.vue")
  },
  {
    path: "/report-prod-inventory -> Prod-Inventory-Report",
    component: () => import("pages/Reports/Prod/Inventory2.vue")
  },
  {
    path: "/report-prod-result-date -> Prod-Result-Date-Report",
    component: () => import("pages/Reports/Prod/ResultDate.vue")
  },
  {
    path: "/report-prod-result-month -> Prod-Result-Month-Report",
    component: () => import("pages/Reports/Prod/ResultMonth.vue")
  },
  {
    path: "/report-prod-result-detail -> Prod-Result-Detail-Report",
    component: () => import("pages/Reports/Prod/ResultDetail.vue")
  },
  {
    path: "/report-prod-defect-detail -> Prod-Defect-Detail-Report",
    component: () => import("pages/Reports/Prod/DefectDetail.vue")
  },
  {
    path: "/report-prod-qc-solution -> Prod-QC-Solution-Report",
    component: () => import("pages/Reports/Prod/QcSolution.vue")
  },
  {
    path: "/report-prod-result-prod-order -> Prod-Result-Order-Report",
    component: () => import("pages/Reports/Prod/ResultLSX.vue")
  },
  {
    path: "/report-prod-qc-luaphoi -> Prod-QC-LP-Report",
    component: () => import("pages/Reports/Prod/QCxLuaPhoi.vue")
  },
  {
    path: "/report-prod-plan-of-kilnbatch -> Prod-Plan-Drying-Report",
    component: () => import("pages/Reports/Prod/MeSay.vue")
  },
  {
    path: "/report-prod-material-of-kilnbatch -> Prod-Material-Drying-Report",
    component: () => import("pages/Reports/Prod/MaterialOfMeSay.vue")
  },
  {
    path: "/report-prod-result-week -> Prod-Result-Week-Report",
    component: () => import("pages/Reports/Prod/ResultWeek2.vue")
  },
  {
    path: "/report-prod-result-week3 -> Prod-Result-Week2-Report",
    component: () => import("pages/Reports/Prod/Week3.vue")
  },
  {
    path: "/report-prod-truy-nguyen -> Prod-TTTN-Report",
    component: () => import("pages/Reports/Prod/TruyNguyen.vue")
  },

  {
    path: "/tool-prod-create-package -> Prod-Create-Package",
    component: () => import("pages/Tools/CreatePackage.vue")
  },

  {
    path: "/bao-cao-cho-say -> Prod-Drying-Report",
    component: () => import("pages/Reports/Prod/BaoCaoChoSay.vue")
  },
  // kế hoạch sản xuất tính theo phòng kế hoạch
  {
    path: "/kh-tinh-kh -> Prod-Create-Plan",
    component: () => import("pages/KH/TinhKeHoach.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/kh-view-plan-cal -> Prod-View-Plan",
    component: () => import("pages/KH/ViewKeHoach.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/kh-dinh-muc-ton -> Prod-Plan-Inventory-Rating",
    component: () => import("pages/KH/DinhMucTon.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/kh-report-kh -> Prod-Result-Plan-Report",
    component: () => import("pages/Reports/Prod/KeHoachVaThucHien.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nhap-ton-ct -> Prod-input-Stock-Detail-Report",
    component: () => import("pages/Reports/Prod/NhapTonChiTiet.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dinh-muc-phoi -> Rating-Materials",
    component: () => import("pages/DinhMucPhoi.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/tao-phoi -> Create-Materials",
    component: () => import("pages/TaoPhoi.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/ton-tai-to -> Stocked-At",
    component: () => import("pages/PageTonTaiTo.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bao-cao-so-lieu-san-xuat -> Prod-Stocked-At-Report",
    component: () => import("pages/BCTonTrenChuyen.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bao-cao-thong-tin-truy-nguyen -> Prod-TTTN2-Report",
    component: () => import("pages/ThongTinTruyNguyen.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/in-khsx -> Prod-Plan-Printing",
    component: () => import("pages/InKHSX.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/thuc-hien-khsx -> Prod-Plan-Quantity-Report",
    component: () => import("pages/ThucHienKHSX.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bao-cao-san-luong-theo-ngay -> Prod-Quantity-Daily-Report",
    component: () => import("pages/BCSanLuongByDay.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dinh-muc-nguyen-vat-lieu -> Prod-Rating-Material",
    component: () => import("pages/DinhMucNguyenVatLieu.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dinh-tuyen -> Prod-Materials-Routing",
    component: () => import("pages/DinhTuyen.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/duyet-lenh-san-xuat -> Prod-Approved-Plan-By-Factory",
    component: () => import("pages/PageDuyetLenhSanXuatTheoNhaMay.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
