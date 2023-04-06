export const eOfficeRoutes = [{
        path: "/de-xuat",
        name: "dexuat",
        component: () =>
            import ("pages/E-Offices/PageRequest.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/phong-ban",
        name: "phongban",
        component: () =>
            import ("pages/E-Offices/Departments.vue"),
        meta: {
            requiresAuth: true
        }
    },
    // {
    //   path: "/tao-de-xuat",
    //   name: "taodexuat",
    //   component: () => import("pages/E-Offices/CreateRequest.vue")
    // },
    {
        path: "/bieu-mau",
        name: "bieumau",
        component: () =>
            import ("pages/E-Offices/PageBieuMau.vue"),
        meta: {
            requiresAuth: true
        }
    },
    // {
    //     path: "/print",
    //     name: "PrintOrder",
    //     component: () =>
    //         import ("pages/E-Offices/PrintOrder.vue"),
    //     meta: {
    //         requiresAuth: true
    //     }
    // },
    // {
    //     path: "/danh-sach-xe",
    //     name: "cars",
    //     component: () =>
    //         import ("pages/E-Offices/PageCars.vue"),
    //     meta: {
    //         requiresAuth: true
    //     }
    // }
];