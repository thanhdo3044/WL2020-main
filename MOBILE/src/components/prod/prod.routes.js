export const prodRoutes = [

// {
//     path: "/",
//     component: () =>
//         import ("pages/production/Index.vue"),
//     meta: {
//         requiresAuth: true
//     }
// },
// {
//     path: "/",
//     component: () =>
//         import ("pages/production/Index.vue"),
//     meta: {
//         requiresAuth: true
//     }
// },
{
    path: "/wood-quantity-input",
    component: () =>
        import("pages/production/GhiNhanSanLuongCBG.vue"),
    meta: {
        requiresAuth: true
    }
},

{
    path: "/xuat-vat-tu",
    component: () =>
        import("pages/KeHoach/xuatvattu.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/nhap-ton-son",
    component: () =>
        import("pages/KeHoach/Nhaptonson.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/lich-su-nhan-phoi",
    component: () =>
        import("pages/PageNhanPhoi.vue"),
    meta: {
        requiresAuth: true
    }
},

{
    path: "/lich-su-ghi-nhan",
    component: () =>
        import("pages/PageGhiNhan.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/lich-su-tao-pallet",
    component: () =>
        import("pages/PageGhiNhanPallet.vue"),
    meta: {
        requiresAuth: true
    }
},

{
    path: "/lich-su-ghi-nhan-loi",
    component: () =>
        import("pages/PageGhiNhanLoi.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/san-luong-giao-di",
    component: () =>
        import("pages/Pagegiaodi.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/exportBTP",
    component: () =>
        import("pages/production/ver2/ExportBTP.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/receipt-materials",
    component: () =>
        import("pages/production/ver2/Receipt.vue"),
    meta: {
        requiresAuth: true
    }
},

{
    path: "/production-packing",
    component: () =>
        import("pages/Production/Packing.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-dashboard",
    component: () =>
        import("pages/Production/Dashboard.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-stockout-pallet",
    component: () =>
        import("pages/Production/StockOutPallet.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-coc",
    component: () =>
        import("pages/production/DCoCPage.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-create-pallet",
    component: () =>
        import("pages/Production/CreatePallet.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/ghi-nhan-loi-lua-phoi",
    component: () =>
        import("pages/Production/GhiNhanLoiLuaPhoi.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-xep-say",
    component: () =>
        import("pages/Production/XepSay.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-add-plan-batch",
    component: () =>
        import("pages/Production/AddPlanBatch.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-batchs",
    component: () =>
        import("pages/Production/ListBatch.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-qc-inspection",
    component: () =>
        import("pages/Production/QCInspector.vue"),
    meta: {
        requiresAuth: true
    }
},

{
    path: "/Prod-woods-stock-input",
    component: () =>
        import("pages/production/ver2/NhapTonDauKy.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/Nhan-go-lua-phoi",
    component: () =>
        import ("pages/production/NhanGoLuaPhoi.vue"),
    meta: {
        requiresAuth: true
    }
},

{
    path: "/export",
    component: () =>
        import("pages/production/ver2/Export.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/xuatcong",
    component: () =>
        import("pages/production/ver2/xuatcong.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/xuat-ton-kho",
    component: () =>
        import("pages/production/ver2/Xuatton.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/xuat-lua-phoi",
    component: () =>
        import ("pages/production/ver2/XuatLuaPhoi.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/cat-loi-bao-2-mat",
    component: () =>
        import ("pages/production/ver2/CatLoiBao2Mat.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/lua-ha-cap",
    component: () =>
        import ("pages/production/ver2/LuaHaCap.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-handle-qc",
    component: () =>
        import("pages/Production/FormQc.vue"),
    meta: {
        requiresAuth: true
    }
},

{
    path: "/production-create-bb-check-mc/:kinlbatchid",
    name: "addbbmc",
    component: () =>
        import("pages/Production/CreateBBCheckMc.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-create-bb-kt/:kinlbatchid",
    name: "addbbkt",
    component: () =>
        import("pages/Production/QC_Create_BB_KT.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-create-bb-check/:kinlbatchid",
    name: "addbbcheck",
    component: () =>
        import("pages/Production/CoDienCreateBBKT.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-qc-history-by-step/:stepid",
    name: "qchistorybystep",
    component: () =>
        import("pages/Production/QCViewHistory.vue"),
    meta: {
        requiresAuth: true
    }
},

{
    path: "/production-view-bbmc",
    component: () =>
        import("pages/Production/ViewBBMC.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-view-bbkt",
    component: () =>
        import("pages/Production/ViewBBKT.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-view-bbcodien",
    component: () =>
        import("pages/Production/ViewBBCoDien.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-add-coc",
    component: () =>
        import("pages/production/AddDCoc.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/Managed-Po",
    component: () =>
        import("pages/production/EndProductionOrder.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-select-feature",
    component: () =>
        import("pages/base/Features.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-comfirm-pallet",
    component: () =>
        import("pages/Production/ConfirmPallet.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/production-detail-batch",
    component: () =>
        import("pages/Production/DetailBatch.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/bien-ban-phieu-cap-vat-tu",
    component: () =>
        import("pages/Production/BBPhieuCapVatTu.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/phieu-can-hang-xuat-mun",
    component: () =>
        import("pages/Production/PagePhieuCapHangXuatMun.vue"),
    meta: {
        requiresAuth: true
    }
},
{
    path: "/xac-nhan-phieu-can-hang",
    component: () =>
        import("pages/Production/PageXacNhanPhieuCapHang.vue"),
    meta: {
        requiresAuth: true
    }
},
];