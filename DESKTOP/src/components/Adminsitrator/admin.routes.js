export const adminRoutes = [{
        path: "",
        component: () =>
            import ("pages/Index.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
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
        path: "/master-data-item",
        component: () =>
            import ("pages/MasterData/Items.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/master-data-item-add",
        component: () =>
            import ("pages/MasterData/ItemsADD.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/master-data-item-accounting-code",
        component: () =>
            import ("pages/MasterData/ItemAccountingCode.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/master-data-department",
        component: () =>
            import ("pages/MasterData/Departments.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/wms-masters-users",
        component: () =>
            import ("pages/Administrator/Users.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/account-detail",
        component: () =>
            import ("pages/Administrator/AccountDetail.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/so-do-nhan-su",
        component: () =>
            import ("pages/Administrator/SoDoNhanSu.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/quan-ly-menu-mobile",
        component: () =>
            import ("pages/Administrator/PageMenuMobile.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/wms-accounts",
        component: () =>
            import ("pages/Administrator/taikhoan.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/quan-ly-menu",
        component: () =>
            import ("pages/Administrator/PageMenus.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/master-role-department",
        component: () =>
            import ("pages/MasterData/RoleDepartment.vue"),
        meta: {
            requiresAuth: true
        }
    },
];