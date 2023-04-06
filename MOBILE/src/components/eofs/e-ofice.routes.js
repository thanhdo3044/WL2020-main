export const eOfficeRoutes = [{
        path: "/e-office",
        name: "e-office",
        component: () =>
            import ("pages/Eofs/E-Office.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/tao-de-xuat",
        component: () =>
            import ("pages/E-Offices/CreateRequest.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/home-page-dang-ky-xe",
        component: () =>
            import ("pages/Eofs/PageHomeDangKyXe.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/page-xe-cong-tac",
        component: () =>
            import ("pages/Eofs/PageDangKyXeCongTac.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/bao-cao-dat-xe",
        component: () =>
            import ("pages/Eofs/PageReportCalendarDetail.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/de-xuat-mua-hang",
        name: "mua-hang",
        component: () =>
            import ("pages/Eofs/PageMuaHang.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/de-nghi-thanh-toan",
        name: "thanh-toan",
        component: () =>
            import ("pages/Eofs/PageThanhToan.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/de-nghi-tam-ung",
        name: "de-nghi-tam-ung",
        component: () =>
            import ("pages/Eofs/PageRequestAdvance.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/lich-lam-viec",
        name: "lich-lam-viec",
        component: () =>
            import ("pages/Eofs/RegisterCalendarWork.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/calendarWork-Detail",
        name: "calendarWork-Detail",
        component: () =>
            import ("pages/Eofs/PageDangKiLichLamViec.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/eof-approval",
        name: "approval",
        component: () =>
            import ("pages/Eof/ApprovalTodo.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/duyet-cap-xe",
        name: "duyet-cap-xe",
        component: () =>
            import ("pages/Eofs/PageDuyetCapXe.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/dang-ky-xe",
        name: "dang-ky-xe",
        component: () =>
            import ("pages/Eofs/PageDangKyXe.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/uy-quyen",
        name: "uy-quyen",
        component: () =>
            import ("pages/Eof/ApprovalTodoAuthority.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/tra-cuu-lich-xe",
        name: "tra-cuu-lich-xe",
        component: () =>
            import ("pages/Eofs/PageTraCuuLichXe.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/xem-lich-xe",
        name: "xem-lich-xe",
        component: () =>
            import ("pages/Eofs/PageXemLichXe.vue"),
        meta: {
            requiresAuth: true
        }
    }
];