import { eOfficeRoutes } from "components/eofs/e-ofice.routes";
import { eof } from "components/eof/e-ofice.routes.js";
import { prodRoutes } from "components/prod/prod.routes.js";
import {vcnRoutes } from "components/VCN/vcn.routes";
import {machineRoutes } from "components/machine/machine.routes";


const routes = [{
    path: "/",
    component: () =>
        import ("layouts/MyLayout.vue"),
    children: [{
            path: "/auth",
            component: () =>
                import ("pages/Auth.vue")
        },
        {
            path: "/access-denied",
            component: () =>
                import ("pages/AccessDenied.vue")
        },
        {
            path: "/profile",
            component: () =>
                import ("pages/base/Profile.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/logout",
            component: () =>
                import ("pages/base/Logout.vue"),
            meta: {
                requiresAuth: true
            }
        },
        // {
        //     path: "/xuat-ton",
        //     component: () =>
        //         import ("pages/XuatPhoiTon.vue"),
        //     meta: {
        //         requiresAuth: true
        //     }
        // },
        {
            path: "/all-lich-su-cap-phoi",
            component: () =>
                import ("pages/lichsucapphoi.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/",
            component: () =>
                import ("pages/base/Menu.vue"),
            meta: {
                requiresAuth: true
            }
        },
        ...prodRoutes,
        ...eof,
        ...eOfficeRoutes,
        ...vcnRoutes,
        ...machineRoutes,

        {
            path: "/funiture-dashboard",
            component: () =>
                import ("pages/funiture/Dashboard.vue"),
            meta: {
                requiresFuniture: true
            }
        },
        {
            path: "/funiture-create-pallet",
            component: () =>
                import ("pages/funiture/CreatePallet.vue"),
            meta: {
                requiresFuniture: true
            }
        },
        {
            path: "/funiture-select-project",
            component: () =>
                import ("pages/funiture/SelectProject.vue"),
            meta: {
                requiresFuniture: true
            }
        },
        {
            path: "/funiture-stockout-pallet",
            component: () =>
                import ("pages/funiture/StockOutPallet.vue"),
            meta: {
                requiresFuniture: true
            }
        },
        {
            path: "/funiture-accepts",
            component: () =>
                import ("pages/funiture/AcceptsList.vue"),
            meta: {
                requiresFuniture: true
            }
        },
        {
            path: "/funiture-detail-accept/:id",
            name: "detail-accept",
            component: () =>
                import ("pages/funiture/DetailAccept.vue"),
            meta: {
                requiresFuniture: true
            }
        },
        {
            path: "/funiture-packing",
            component: () =>
                import ("pages/funiture/Packing.vue"),
            meta: {
                requiresFuniture: true
            }
        },
        {
            path: "/funiture-create-good-issue",
            component: () =>
                import ("pages/funiture/CreateGoodIssue.vue"),
            meta: {
                requiresFuniture: true
            }
        },
        {
            path: "/funiture-detail-good-issue/:id",
            name: "detail-good-issue",
            component: () =>
                import ("pages/funiture/DetailGoodIssue.vue"),
            meta: {
                requiresFuniture: true
            }
        },

        // phân hệ ván, và nguyên liệu gỗ
        {
            path: "/wood-list-receipt",
            component: () =>
                import ("pages/wood/ListReceipt.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-add-receipt",
            component: () =>
                import ("pages/wood/AddReceipt.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-list-pay",
            component: () =>
                import ("pages/wood/ListPayment.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-warehouse/:id",
            name: "wood-detail",
            component: () =>
                import ("pages/wood/ViewWHDetail.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/add-wood-warehouse-dlt/:id",
            name: "add-wh-detail",
            component: () =>
                import ("pages/wood/FormAddWHDetail.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/edit-wood-warehouse-dlt/:id",
            name: "edit-wh-detail",
            component: () =>
                import ("pages/wood/EditReceiptDetail.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-inspection/:id",
            name: "wood-inspection",
            component: () =>
                import ("pages/wood/InspectionDetail.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/add-wood-inspection/:id",
            name: "add-inspection",
            component: () =>
                import ("pages/wood/AddInspection.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/edit-wood-inspection/:id",
            name: "edit-inspection",
            component: () =>
                import ("pages/wood/EditInspection.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-view-inspection/:id",
            name: "view-inspection",
            component: () =>
                import ("pages/wood/ViewInspection.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-view-payment/:id",
            name: "view-payment",
            component: () =>
                import ("pages/wood/ViewPay.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-view-payment-completed/:id",
            name: "view-payment-completed",
            component: () =>
                import ("pages/wood/PrintPayInfo.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-pay-manual/:id",
            name: "pay-manual",
            component: () =>
                import ("pages/wood/PayManual.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-price-list",
            component: () =>
                import ("pages/wood/PriceList.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-price-update",
            component: () =>
                import ("pages/wood/PriceUpdate.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-price-approval",
            component: () =>
                import ("pages/wood/PriceApproval.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-view-req-price/:id",
            name: "view-req-price",
            component: () =>
                import ("pages/wood/ViewReqPrice.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-setting-home",
            component: () =>
                import ("pages/wood/setting/Index.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-setting-supplier",
            component: () =>
                import ("pages/wood/setting/Supplier.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-setting-item",
            component: () =>
                import ("pages/wood/setting/QuiCach.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-create-pallet",
            component: () =>
                import ("pages/wood/CreatePallet.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-create-pallet2",
            component: () =>
                import ("pages/wood/CreatePalletSay.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/van-xuat-kho-sau-say",
            component: () =>
                import ("pages/wood/XuatKhoSauSay.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-out-stock-location",
            component: () =>
                import ("pages/wood/OutStockLocation.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-reports",
            component: () =>
                import ("pages/wood/reports/Index.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/van-ghi-nhan-hoan-thien",
            component: () =>
                import ("pages/wood/GhiNhanHoanThien.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/xuat-so-lo",
            component: () =>
                import ("pages/wood/XuatLo.vue"),
            meta: {
                requiresAuth: true
            }
        },

        {
            path: "/wood-warehouse-receipts",
            component: () =>
                import ("pages/wood/NLG/PhieuNhapKho.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-warehouse-receipts-dlt",
            component: () =>
                import ("pages/wood/NLG/CT_PhieuNhapKho.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/wood-add-wh-receipts-dlt",
            component: () =>
                import ("pages/wood/NLG/NhapKho.vue"),
            meta: {
                requiresAuth: true
            }
        }
    ]
}];

// Always leave this production-kho-lua-phoi as last one /production-detail-batch production-add-supplies /production-xep-say /production-items /production-pallet-inline /production-comfirm-pallet
if (process.env.MODE !== "ssr") {
    routes.push({
        path: "*",
        component: () =>
            import ("pages/Error404.vue")
    });
}

export default routes;