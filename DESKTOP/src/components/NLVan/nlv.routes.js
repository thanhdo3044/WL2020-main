export const eOfficeRoutes = [
  {
    path: "/nl-list-payment",
    component: () => import("pages/NLVan/ListPay.vue")
  },
  {
    path: "/nl-view-payment-completed/:id",
    name: "view-payment-completed",
    component: () => import("pages/NLVan/PrintPayInfo.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nl-view-payment/:id",
    name: "view-payment",
    component: () => import("pages/NLVan/ViewPay.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nl-view-price-list",
    component: () => import("pages/NLVan/PriceList.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nl-view-price-list-update",
    component: () => import("pages/NLVan/PriceUpdate.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nl-price-approval-list",
    component: () => import("pages/NLVan/PriceApproval.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nl-view-req-price/:id",
    name: "view-req-price",
    component: () => import("pages/NLVan/ViewReqPrice.vue"),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nl-report-theo-doi-nhap-van",
    component: () => import("pages/Reports/NLVan/TheoDoiNhapVan.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
