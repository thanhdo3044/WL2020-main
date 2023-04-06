export const vcnRoutes = [
    {
        path: "/create-PO-VCN",
        component: () =>
            import("pages/VCN/PageCreatePOVCN.vue")
    },
    {
        path: "/approved-Plan-VCN",
        component: () =>
            import("pages/VCN/ApprovePOVCN.vue")
    },
    // {
    //     path: "/xuat-nguyen-lieu-vcn",
    //     component: () =>
    //         import ("pages/XuatNguyenLieuVCN.vue")
    // },
    {
        path: "/View-PO-VCN/:number",
        component: () =>
            import("pages/VCN/ViewPOVCN.vue")
    },
    {
        path: "/Items-VCN",
        component: () =>
            import("pages/VCN/ItemsVCN.vue")
    },
    {
        path: "/update-po-VCN",
        component: () =>
            import("pages/VCN/UpdatePoVCN.vue")
    },
    {
        path: "/report-planned-output",
        component: () =>
            import("pages/VCN/Report/ReportPO.vue")
    },
    {
        path: "/routing-vcn",
        component: () =>
            import("pages/VCN/Routing.vue")
    },
    {
        path: "/bom-vcn",
        component: () =>
            import("pages/VCN/bom.vue")
    },
    {
        path: "/he-so-quy-doi-vcn",
        component: () =>
            import("pages/VCN/HeSoQuyDoiVCN.vue")
    },
    {
        path: "/doi-ten-lsx",
        component: () =>
            import("pages/VCN/DoiTenLSXVCN.vue")
    },
    {
        path: "/import-items-vcn",
        component: () =>
            import("pages/VCN/ImportItem.vue")
    },
    {
        path: "/edit-po-vcn/:number",
        component: () =>
            import("pages/VCN/EditPo.vue")
    },
    {
        path: "/bao-cao-lenh-san-xuat-vcn",
        component: () =>
            import("pages/VCN/Report/BCLenhSanXuatVCN.vue")
    },
    {
        path: "/bao-cao-cong-doan-theo-tuan",
        component: () =>
            import("pages/VCN/Report/BCStepByWeekVCN.vue")
    },
    {
        path: "/bao-cao-lsx-theo-cong-doan-vcn",
        component: () =>
            import("pages/VCN/Report/BCLSXTheoCongDoanVCN.vue")
    },
    {
        path: "/bao-cao-so-lieu-san-xuat-vcn",
        component: () =>
            import("pages/VCN/Report/BCTonTrenChuyenVCN.vue")
    },
    {
        path: "/report-prod-result-detail-vcn",
        component: () =>
            import("pages/VCN/Report/ResultDetailVCN.vue")
    },
    {
        path: "/bao-cao-gop-cong-doan-vcn",
        component: () =>
            import("pages/VCN/Report/BCGopCongDoanVCN.vue")
    },
    {
        path: "/Prod-Plan-Printing-vcn",
        component: () =>
            import("pages/VCN/Report/ResultWeekinVCN.vue")
    },
    {
        path: "/report-prod-defect-detail-vcn",
        component: () =>
            import("pages/VCN/Report/DefectDetailVCN.vue")
    },
    {
        path: "/report-ton-cong-doan-vcn",
        component: () =>
            import("pages/VCN/Report/BCTonCongDoanVCN.vue")
    },
    {
        path: "/report-prod-qc-solution-vcn",
        component: () =>
            import("pages/VCN/Report/QcSolutionVCN.vue")
    },
    {
        path: "/bao-cao-san-luong-tinh-luong-vcn",
        component: () =>
            import("pages/VCN/PageBangGiaVCN.vue")
    },
    {
        path: "/bao-cao-quy-luong-vcn",
        component: () =>
            import("pages/VCN/PageQuyLuongVCN.vue")
    },
    {
        path: "/cap-nhap-tong-cong-vcn",
        component: () =>
            import("pages/VCN/PageUpdateTongCongVCN.vue")
    },
    {
        path: "/tao-bien-ban-xu-ly-sp-vcn",
        component: () =>
            import("pages/VCN/Report/TaoBBXuLySPVCN.vue")
    },
    {
        path: "/bien-ban-xu-ly-sp-vcn",
        component: () =>
            import("pages/VCN/Report/BBXuLySPVCN.vue")
    },
    {
        path: "/bao-cao-san-luong-theo-ngay-vcn",
        component: () =>
            import("pages/VCN/Report/BCSanLuongByDayVCN.vue")
    },
    {
        path: "/bieu-do-tong-san-luong-tuan-vcn",
        component: () =>
            import("pages/VCN/Report/BDTongSanLuongTuanVCN.vue")
    },
    {
        path: "/bieu-do-san-luong-cong-doan-tuan-vcn",
        component: () =>
            import("pages/VCN/Report/BDSanLuongCongDoanTuanVCN.vue")
    },
    {
        path: "/bieu-do-ton-cong-doan-tuan-vcn",
        component: () =>
            import("pages/VCN/Report/BDTonCongDoanTuanVCN.vue")
    },
    {
      path: "/bao-cao-san-luong-vcn",
      component: () =>
          import("pages/VCN/Report/BaoCaoSanLuongVCN.vue")
  },
];