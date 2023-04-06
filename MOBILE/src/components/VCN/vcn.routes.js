export const vcnRoutes = [
    {
        path: "/wood-quantity-input-VCN",
        component: () =>
            import ("pages/vcn/GhiNhanSanLuongVCN.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/lich-su-nhan-phoi-vcn",
        component: () =>
            import ("pages/vcn/PageNhanPhoiVCN.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/lich-su-ghi-nhan-vcn",
        component: () =>
            import ("pages/vcn/PageGhiNhanVCN.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/receipt-materials-vcn",
        component: () =>
            import ("pages/vcn/ReceiptVCN.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/Prod-woods-stock-input-vcn",
        component: () =>
            import ("pages/vcn/NhapTonDauKyVCN.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/production-qc-inspection-VCN",
        component: () =>
            import ("pages/vcn/QCInspectorVCN.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/production-handle-qc-vcn",
        component: () =>
            import ("pages/vcn/FormQcVCN.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/production-qc-history-by-step-vcn/:stepid",
        name: "qchistorybystepvcn",
        component: () =>
            import ("pages/vcn/QCViewHistoryVCN.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/management-po-vcn",
        component: () =>
            import("pages/vcn/ManagementPO.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/san-luong-giao-di-vcn",
        component: () =>
            import("pages/vcn/PagegiaodiVCN.vue"),
        meta: {
            requiresAuth: true
        }
    },
];