export const notifyRoutes = [
    {
        path: "/create-information",
        component: () =>
            import("pages/NOTIFY/PageCreateInformation.vue")
    },
    {
        path: "/create-request",
        component: () =>
            import("pages/NOTIFY/PageCreateRequest.vue")
    },
    {
        path: "/Notification",
        component: () =>
            import("pages/NOTIFY/Notification.vue")
    },
    {
        path: "/edit-information",
        component: () =>
            import("pages/NOTIFY/PageEditInformation.vue")
    },
    {
        path: "/edit-request",
        component: () =>
            import("pages/NOTIFY/PageEditRequest.vue")
    },
    {
        //them duong dan ticket ....
        path: "/edit-request/information-request/:id",
        component: () =>
            import("pages/NOTIFY/PageInformationViewTicket.vue")
    },
    {
        path: "/confirm-information",
        component: () =>
            import("pages/NOTIFY/PageConfirmInformation.vue")
    },
    {
        path: "/count-confirm-information",
        component: () =>
            import("pages/NOTIFY/PageCountConfirmInformation.vue")
    },
    {
        path: "/create-form",
        component: () =>
            import("pages/NOTIFY/PageCreateForm.vue")
    },
    {
        path: "/print-form-register",
        component: () =>
            import("pages/NOTIFY/PagePrintFormRegister.vue")
    },
    {
        path: "/report-user-viewed-form",
        component: () =>
            import("pages/NOTIFY/PageReportUserViewedForm.vue")
    },
    {
        path: "/report-form-detail",
        component: () =>
            import("pages/NOTIFY/PageReportFormDetail.vue")
    },
];