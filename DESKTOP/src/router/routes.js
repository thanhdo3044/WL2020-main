import { adminRoutes } from "components/Adminsitrator/admin.routes";
import { eOfficeRoutes } from "components/E-Offices/e-office.routes";
import { eof } from "components/eof/e-ofice.routes";
import { nlgRoutes } from "components/NLG/nlg.routes";
import { prodRoutes } from "components/Prod/prod.routes";
import {vcnRoutes } from "components/VCN/vcn.routes";
import {notifyRoutes } from "components/NOTIFY/notify.routes";
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      ...nlgRoutes,
      ...prodRoutes,
      ...eof,
      ...eOfficeRoutes,
      ...adminRoutes,
      ...vcnRoutes,
      ...notifyRoutes
    ]
  }
];

//Nguyen lieu go sua o file rout NLG/nlg.routes

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
