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
    {
        path: "/bieu-mau",
        name: "bieumau",
        component: () =>
            import ("pages/E-Offices/PageBieuMau.vue"),
        meta: {
            requiresAuth: true
        }
    },
];