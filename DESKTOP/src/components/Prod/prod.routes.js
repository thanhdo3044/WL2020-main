export const prodRoutes = [
{
    path: "/Create-Prod-Plan-by-Factories",
    name: "taoKeHoach",
    component: () =>
        import ("pages/PageTaoKeHoachSanXuat.vue")
},
{
    path: "/bao-cao-quy-luong",
    component: () =>
        import ("pages/PageBCQuyLuong2.vue")
},
{
    path: "/bao-cao-quy-luong-lo-say",
    component: () =>
        import ("pages/PageBCQuyLuonglosay.vue")
},
{
    path: "/bao-cao-khoi-luong-lo-say",
    component: () =>
        import ("pages/PageBCKhoiLuonglosay.vue")
},
{
    path: "/bao-cao-so-luong-loi",
    component: () =>
        import ("pages/BCsoluongloi.vue")
},
{
    path: "/bao-cao-san-luong-theo-thang",
    component: () =>
        import ("pages/PageBCSanLuongTheoThang2.vue")
},
{
    path: "/bao-cao-san-luong-qui-doi",
    component: () =>
        import ("pages/PageBCSanLuongquidoi.vue")
},
{
    path: "/bao-cao-san-luong-theo-nam",
    component: () =>
        import ("pages/PageBCSanLuongTheoNam.vue")
},
{
    path: "/cap-nhap-tong-cong",
    component: () =>
        import ("pages/PageUpdateTongCong.vue")
},
{
    path: "/cap-nhap-sl-quy-doi",
    component: () =>
        import ("pages/Updatesanluongquidoi.vue")
},
{
    path: "/cap-nhap-ton-cong-doan",
    component: () =>
        import ("pages/Updatetoncongdoan.vue")
},
{
    path: "/nang-xuat-lao-dong",
    component: () =>
        import ("pages/NSLDkhoiCBG.vue")
},
{
    path: "/Factories-Plan",
    component: () =>
        import ("pages/KeHoach/PageKeHoachNhapVe.vue")
},
{
    path: "/View-plan-by-Factories",
    component: () =>
        import ("pages/KeHoach/PageKeHoachNhapVepheduyet.vue")
},
{
    path: "/View-plan-edit",
    component: () =>
        import ("pages/KeHoach/Pagelichsusuakehoach.vue")
},
{
    path: "/dinh-muc-vat-tu",
    component: () =>
        import ("pages/PageDinhMucVatTu.vue")
},
// {
//     path: "/main-prices",
//     component: () =>
//         import ("pages/PageMainPrices.vue")
// },
// {
//     path: "/exchange-rate",
//     component: () =>
//         import ("pages/PageExchangeRate.vue")
// },
{
    path: "/bang-gia-tinh-luong-vanity",
    component: () =>
        import ("pages/MasterData/PageMarketPriceVanity.vue")
},
{
    path: "/Prod-Item-Rating",
    component: () =>
        import ("pages/PageDinhMuc.vue")
},
{
    path: "/Prod-Item-Rating-Approve",
    component: () =>
        import ("pages/PagePheDuyetDinhMuc.vue")
},
{
    path: "/bao-cao-san-luong-tinh-luong",
    component: () =>
        import ("src/pages/PageBangGiaCBG.vue")
},
{
    path: "/cap-nhat-xac-nhan-qc",
    component: () =>
        import ("src/pages/PagecapnhatxacnhanQC.vue")
},
{
    path: "/bang-gia-bao-cat",
    component: () =>
        import ("src/pages/PageBangGiaBaoCat.vue")
},
// {
//     path: "/cap-nhap-don-gia-tinh-luong",
//     component: () =>
//         import ("pages/PageUpdatePrice.vue")
// },
{
    path: "/bao-cao-nhan-thanh-pham",
    component: () =>
        import ("pages/Reports/Prod/BCNhanThanhPham.vue")
},
{
    path: "/bao-cao-san-luong-tinh-luong-tu-vanity",
    component: () =>
        import ("pages/PageGiaoNhan2.vue")
},

{
    path: "/prod-routing-approve",
    component: () =>
        import ("pages/PagePheDuyetDinhTuyen.vue")
},
{
    path: "/Prod-Routing",
    component: () =>
        import ("pages/PageDinhTuyen.vue")
},

{
    path: "/report-prod-result",
    component: () =>
        import ("pages/Reports/Prod/Result.vue")
},
{
    path: "/report-prod-inventory",
    component: () =>
        import ("pages/Reports/Prod/Inventory2.vue")
},
{
    path: "/nhap-san-luong-nha-may-khac",
    component: () =>
        import ("pages/Reports/Prod/BCnhapngoaiNM.vue")
},
{
    path: "/bao-cao-tien-do-bao",
    component: () =>
        import ("pages/Reports/Prod/BCTienDoBao.vue")
},
{
    path: "/bao-cao-san-luong-nhom-bao",
    component: () =>
        import ("pages/Reports/Prod/BCSLnhomBao.vue")
},
{
    path: "/report-oven",
    component: () =>
        import ("pages/Reports/Prod/BClosay.vue")
},
{
    path: "/bao-cao-nhan-sau-say",
    component: () =>
        import ("pages/Reports/Prod/BCNhanSauSay.vue")
},
{
    path: "/bao-cao-san-luong-may",
    component: () =>
        import ("src/pages/machine/BCSanLuongMay.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-hieu-suat-may",
    component: () =>
        import ("src/pages/machine/BCHieuSuatMay.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-bao-duong-cap-1",
    component: () =>
        import ("src/pages/machine/BDCAP1.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-bao-duong-cap-2",
    component: () =>
        import ("src/pages/machine/BDCAP2.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-bao-duong-cap-3",
    component: () =>
        import ("src/pages/machine/BDCAP3.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-may-gap-su-co",
    component: () =>
        import ("src/pages/machine/BCMayGapSuCo.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/khai-bao-du-lieu-may",
    component: () =>
        import ("src/pages/machine/KBDuLieuMay.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-hieu-suat-theo-ngay",
    component: () =>
        import ("src/pages/machine/BBHieuSuatByDay.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-hieu-suat-theo-thang",
    component: () =>
        import ("src/pages/machine/BBHieuSuatByMonth.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/report-prod-result-detail",
    component: () =>
        import ("pages/Reports/Prod/ResultDetail2.vue")
},
{
    path: "/report-ban-hang-go-mun",
    component: () =>
        import ("pages/Reports/Prod/ReportBHGoMun.vue")
},
{
    path: "/so-sanh-tong-san-luong",
    component: () =>
        import ("pages/Reports/Prod/SSTotalM3.vue")
},
{
    path: "/bieu-do-san-luong-say-phoi",
    component: () =>
        import ("pages/Reports/Prod/BDSanLuongSayPhoi.vue")
},
{
    path: "/bien-ban-lo-say",
    component: () =>
        import ("pages/Reports/Prod/BBLoSay.vue")
},
{
    path: "/bien-ban-kiem-tra-do-am",
    component: () =>
        import ("pages/Reports/Prod/BBKiemTraDoAm.vue")
},
{
    path: "/report-prod-defect-detail",
    component: () =>
        import ("pages/Reports/Prod/DefectDetail.vue")
},
{
    path: "/report-prod-qc-solution",
    component: () =>
        import ("pages/Reports/Prod/QcSolution.vue")
},
{
    path: "/report-prod-plan-of-kilnbatch",
    component: () =>
        import ("pages/Reports/Prod/MeSay.vue")
},
{
    path: "/report-prod-material-of-kilnbatch",
    component: () =>
        import ("pages/Reports/Prod/MaterialOfMeSay.vue")
},
{
    path: "/report-khoi-luong-ra-lo",
    component: () =>
        import ("pages/Reports/Prod/khoiluonglsay.vue")
},
{
    path: "/report-khoi-luong-ra-lo-pallet",
    component: () =>
        import ("pages/Reports/Prod/khoiluonglsaypallet.vue")
},
{
    path: "/ds-nguoi-dung",
    component: () =>
        import ("pages/Reports/Prod/bcnguoisudung.vue")
},
{
    path: "/permission-management",
    component: () =>
        import ("pages/Reports/Prod/PermissionManagement.vue")
},
{
    path: "/report-prod-result-week",
    component: () =>
        import ("pages/Reports/Prod/ResultWeek2.vue")
},
{
    path: "/report-vt-son-theo-dinh-muc",
    component: () =>
        import ("pages/Reports/Prod/ResultVTSon.vue")
},
{
    path: "/report-prod-result-week-department",
    component: () =>
        import ("pages/Reports/Prod/ResultWeekdepartment2.vue")
},

{
    path: "/bao-cao-cho-say",
    component: () =>
        import ("pages/Reports/Prod/BaoCaoChoSay2.vue")
},
{
    path: "/bien-ban-kiem-tra-lo-say",
    component: () =>
        import ("pages/Reports/Prod/BBKiemTraLoSay.vue")
},
{
    path: "/bien-ban-ra-lo-say",
    component: () =>
        import ("pages/Reports/Prod/BBRaLoSay.vue")
},

// kế hoạch sản xuất tính theo phòng kế hoạch

{
    path: "/nhap-ton-ct",
    component: () =>
        import ("pages/Reports/Prod/NhapTonChiTiet.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/nhap-xuat-ct",
    component: () =>
        import ("pages/Reports/Prod/Nhapxuatchitiet.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bc-xuat-cat-ha-cap",
    component: () =>
        import ("pages/Reports/Prod/BCXuatCatHC.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/tao-phoi",
    component: () =>
        import ("pages/TaoPhoi.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/nhap-so-dien",
    component: () => import("pages/KH/Nhapsodien.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nhap-dinh-muc-dien",
    component: () => import("pages/KH/Nhapdinhmucdien.vue"),
    meta: {
      requiresAuth: true
    }
  },
{
    path: "/report-ton-son",
    component: () =>
        import ("pages/Reports/Prod/baocaotonson.vue")
},
{
    path: "/bao-cao-so-lieu-san-xuat",
    component: () =>
        import ("pages/BCTonTrenChuyen.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-so-lieu-ton-dong-bo",
    component: () =>
        import ("pages/BCTondongbo.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-so-lieu-san-xuat-chi-tiet",
    component: () =>
        import ("pages/BCTonTrenChuyenchitiet.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-so-lieu-san-xuat-2",
    component: () =>
        import ("pages/BCTonTrenChuyen2.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-dinh-muc-tieu-thu-dien",
    component: () =>
        import ("pages/BCDMTieuThuDien.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-nhap-xuat-ton-kho",
    component: () =>
        import ("pages/BCNhapXuatTonKho.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-nhap-xuat-ton-kho-go-tho",
    component: () =>
        import ("pages/BCNhapXuatTonKhogotho.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-nhap-xuat-ton-kho-go-tuoi",
    component: () =>
        import ("pages/BCNhapXuatTonKhogotuoi.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/tao-bien-ban-kiem-phieu-xuat-kho",
    component: () =>
        import ("pages/TaoBBKiemPhieuXuatKho.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bien-ban-kiem-phieu-xuat-kho",
    component: () =>
        import ("pages/BBKiemPhieuXuatKho.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-xuat-ton-kho-chi-tiet",
    component: () =>
        import ("pages/BCXuatTonKhoDetail.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-thuc-hien-vanity-dong-goi",
    component: () =>
        import ("src/pages/BCVanityDongGoi.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-thuc-hien-vanity-tung-cong-doan",
    component: () =>
        import ("pages/BCThucHienTCD.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-xuat-nhap-ton-thanh-pham-vanity",
    component: () =>
        import ("pages/BCXNTVanity.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-xuat-nhap-ton-kho-thanh-pham",
    component: () =>
        import ("pages/BCKhoThanhPham"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-chi-tiet-xuat-nhap-ton-kho-thanh-pham",
    component: () =>
        import ("pages/BCCTKhoThanhPham"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-xuat-nhap-go-chi-tiet",
    component: () =>
        import ("pages/PageXuatGoDetail.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-xuat-nhap-go-chi-tiet-lua-phoi",
    component: () =>
        import ("pages/PageXuatGoDetailyenson.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-thong-tin-truy-nguyen",
    component: () =>
        import ("pages/ThongTinTruyNguyen.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/Prod-Plan-Printing",
    component: () =>
        import ("pages/Reports/Prod/ResultWeek5in.vue")
},
{
    path: "/Prod-Plan-ghi-nhan",
    component: () =>
        import ("pages/Reports/Prod/GhinhanSLcongdoan.vue")
},
{
    path: "/thuc-hien-khsx",
    component: () =>
        import ("pages/ThucHienKHSX2.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-san-luong-quy-doi",
    component: () =>
        import ("pages/Reports/Prod/BCSanLuongQuyDoi.vue")
},
{
    path: "/bc-trang-thai-thuc-hien-lsx",
    component: () =>
        import ("pages/baocaotrangthaiLSX.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-san-luong-theo-ngay",
    component: () =>
        import ("pages/BCSanLuongByDay2.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-ty-le-loi",
    component: () =>
        import ("pages/BCSanLuongtyleloi.vue"),
    meta: {
        requiresAuth: true
    }
},
// {
//     path: "/bao-cao-ngoai-ke-hoach",
//     component: () =>
//         import ("pages/BCngoaikehoach.vue"),
//     meta: {
//         requiresAuth: true
//     }
// },
{
    path: "/nhap-cong-suat-theo-to",
    component: () =>
        import ("pages/NhapCongSuatTheoTo.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-san-luong-say-theo-thang",
    component: () =>
        import ("pages/BCSanLuongSayByMonth2.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-san-luong-cho-nhan",
    component: () =>
        import ("pages/BCchonhanSanLuongByDay.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-san-luong-nhan-nm",
    component: () =>
        import ("pages/BCSanLuongnhanNM.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bien-ban-san-luong-nhan-nm",
    component: () =>
        import ("pages/BBSanLuongnhanNM.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-san-luong-theo-ngay-vanity",
    component: () =>
        import ("pages/BCVanityByDay.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/import-product-storage",
    component: () =>
        import ("pages/ImportStock.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/export-storage-after-drying",
    component: () =>
        import ("src/pages/ExportStockAfterDrying.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/report-exist-department",
    component: () =>
        import ("src/pages/BCtoncongdoan.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/report-storage-after-drying",
    component: () =>
        import ("src/pages/ReportStockAfterDrying.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/report-storage-after-drying-choose",
    component: () =>
        import ("src/pages/ReportStockAfterDryingchoose.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bao-cao-xu-ly-loi",
    component: () =>
        import ("pages/Reports/Prod/BCXuLyLoi.vue")
},
{
    path: "/xuat-van-birch",
    component: () =>
        import ("pages/Pagexuavanbirch.vue")
},
{
    path: "/bien-ban-xu-ly-sp",
    component: () =>
        import ("pages/Reports/Prod/BBXuLySP.vue")
},
{
    path: "/bien-ban-xu-ly-khieu-nai",
    component: () =>
        import ("pages/Reports/Prod/BBkhieunai.vue")
},
{
    path: "/tao-bien-ban-khieu-nai",
    component: () =>
        import ("pages/Reports/Prod/TaoBBkhieunai.vue")
},
{
    path: "/tao-bien-ban-xu-ly-sp",
    component: () =>
        import ("pages/Reports/Prod/TaoBBXuLySP.vue")
},
{
    path: "/import-storage-after-drying",
    component: () =>
        import ("src/pages/ImportStockAfterDrying.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/import-items",
    component: () =>
        import ("src/pages/MasterData/PageAddItems.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/update-items",
    component: () =>
        import ("src/pages/MasterData/PageupdateItems.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/import-acc",
    component: () =>
        import ("pages/Eof/PageAddAccount.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/Prod-Approved-Plan-By-Factory",
    component: () =>
        import ("pages/PageDuyetLenhSanXuatTheoNhaMay.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/view-lsx-cbg/:number",
    component: () =>
        import ("pages/ViewLSXCBG.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/dong-lsx-theo-cong-doan",
    component: () =>
        import ("pages/Reports/Prod/CloseLSXByDepartment.vue"),
    meta: {
        requiresAuth: true
    }
},
// {
//     path: "/chuyen-dinh-tuyen-lsx",
//     component: () =>
//         import ("pages/Reports/Prod/chuyendinhtuyen.vue"),
//     meta: {
//         requiresAuth: true
//     }
// },
{
    path: "/bieu-do-tong-san-luong-tuan",
    component: () =>
        import ("pages/Reports/Prod/BDTongSanLuongTuan.vue")
},
{
    path: "/bieu-do-san-luong-cong-doan-tuan",
    component: () =>
        import ("pages/Reports/Prod/BDSanLuongCongDoanTuan.vue")
},
{
    path: "/bieu-do-ton-cong-doan-tuan",
    component: () =>
        import ("pages/Reports/Prod/BDTonCongDoanTuan.vue")
},
{
    path: "/bieu-do-item-ton-cong-doan",
    component: () =>
        import ("pages/Reports/Prod/BDItemTonCongDoan.vue")
},
{
  path: "/bc-chenh-lech-ton",
  component: () => import("pages/BCLechTon.vue"),
  meta: {
    requiresAuth: true
  }
},
// {
//   path: "/cau-thanh-dinh-tuyen",
//   component: () =>
//       import ("pages/CauThanhDinhTuyen.vue")
// },
// {
//   path: "/ct-dt/",
//   name: "/ct-dt",
//   component: () =>
//       import ("pages/CT&DT.vue"),
//   meta: {
//       requiresAuth: true
//   }
// },
// {
//   path: "/ctdt/:guid",
//   name: "/ctdt",
//   component: () =>
//       import ("pages/CTDT.vue"),
//   meta: {
//       requiresAuth: true
//   }
// },
{
  path: "/phe-duyet-dt",
  component: () =>
      import ("pages/PheDuyetDT.vue")
},
{
  path: "/khai-bao-sp",
  component: () =>
      import ("pages/KhaiBaoSP.vue")
},
{
  path: "/phe-duyet-sp",
  component: () =>
      import ("pages/PheDuyetSP.vue")
},
{
  path: "/import-ke-hoach-xuat-hang",
  component: () =>
      import ("pages/import_KE_HOACH_XUAT_HANG.vue"),
  meta: {
      requiresAuth: true
  }
},
{
  path: "/view-ke-hoach-xuat-hang",
  component: () =>
      import ("pages/VIEW_KE_HOACH_XUAT_HANG.vue"),
  meta: {
      requiresAuth: true
  }
},
{
    path: "/phieu-xuat-kho-tao",
    component: () =>
        import ("pages/PHIEU_XUAT_KHO_TAO.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/phieu-xuat-kho-xem",
    component: () =>
        import ("pages/PHIEU_XUAT_KHO_XEM.vue"),
    meta: {
        requiresAuth: true
    }
},
{
  path: "/phieu-xuat-kho",
  component: () =>
      import ("pages/PHIEU_XUAT_KHO.vue"),
  meta: {
      requiresAuth: true
  }
},
{
  path: "/bien-ban-ban-giao-hang-hoa",
  component: () =>
      import ("pages/BIENBANBANGIAOHANGHOA.vue"),
  meta: {
      requiresAuth: true
  }
},
{
  path: "/bao-cao-nhap-xuat-ton-thanh-pham",
  component: () =>
      import ("pages/Bao_Cao_Nhap_Xuat_Ton_Thanh_Pham.vue"),
  meta: {
      requiresAuth: true
  }
},
];
