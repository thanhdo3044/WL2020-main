export const adminRoutes = [
  {
    path: "",
    component: () => import("pages/Index.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/auth",
    component: () => import("pages/Auth.vue")
  },
  {
    path: "/access-denied",
    component: () => import("pages/AccessDenied.vue")
  },
  {
    path: "/master-data-item",
    component: () => import("pages/MasterData/Items.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/master-data-department",
    component: () => import("pages/MasterData/Departments.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/bao-cao-lich-dat-xe",
    component: () => import("pages/E-Offices/PageReportDetailCars.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/report-detail-success",
    component: () => import("pages/ReportDetailPro.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/master-data-quota",
    component: () => import("pages/MasterData/Quota.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/master-data-bom",
    component: () => import("pages/MasterData/BOM.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/master-data-routing",
    component: () => import("pages/MasterData/Routing.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/master-users",
    component: () => import("pages/Administrator/Users.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/tai-khoan",
    component: () => import("pages/Administrator/taikhoan.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/master-vendors",
    component: () => import("pages/MasterData/Vendor.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/quan-ly-menu",
    component: () => import("pages/Administrator/PageMenus.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/master-prod-oders-cbg",
    component: () => import("pages/MasterData/ProdOrder.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/master-prod-oders-van",
    component: () => import("pages/MasterData/ProdOrderVan.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/master-routing-van",
    component: () => import("pages/MasterData/RoutingVan.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
