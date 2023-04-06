export const eof = [{
        path: "/print",
        name: "print",
        component: () =>
            import ("pages/E-Offices/PrintOrder.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/e-office",
        name: "e-office",
        component: () =>
            import ("pages/Eof/E-Office.vue"),
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
        path: "/report-detail-form",
        component: () =>
            import ("pages/E-Offices/PageReportDetailForm.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/home-page-dang-ky-xe",
        component: () =>
            import ("pages/Eof/PageHomeDangKyXe.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/page-xe-cong-tac",
        component: () =>
            import ("pages/Eof/PageDangKyXeCongTac.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/bao-cao-dat-xe",
        component: () =>
            import ("pages/Eof/PageReportCalendarDetail.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/de-xuat-mua-hang",
        name: "mua-hang",
        component: () =>
            import ("pages/Eof/PageMuaHang.vue"),
        meta: {
            requiresAuth: true
        }
    },

    {
        path: "/cap-bao-ho-lao-dong",
        name: "cap-bao-ho-lao-dong",
        component: () =>
            import ("pages/Eof/PageCapBaoHoLaoDong.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/vat-tu",
        name: "vat-tu",
        component: () =>
            import ("pages/Eof/PageCapVatTu.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/sua-chua",
        name: "sua-chua",
        component: () =>
            import ("pages/Eof/PageSuaChua.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/chuyen-nhan-vien",
        name: "chuyen-nhan-vien",
        component: () =>
            import ("pages/Eof/PageChuyenNhanVien.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/xac-nhan-cong",
        name: "xac-nhan-cong",
        component: () =>
            import ("pages/Eof/PageXacNhanCong.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/bien-ban-ban-giao",
        name: "bien-ban-ban-giao",
        component: () =>
            import ("pages/Eof/PageBienBanBanGiao.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/van-phong-pham",
        name: "van-phong-pham",
        component: () =>
            import ("pages/Eof/PageVanPhongPham.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/de-nghi-luong",
        name: "de-nghi-luong",
        component: () =>
            import ("pages/Eof/PageDeNghiLuong.vue"),
        meta: {
            requiresAuth: true
        }
    },

    {
        path: "/di-cong-tac",
        name: "di-cong-tac",
        component: () =>
            import ("pages/Eof/PageDeNghiDiCongTac.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/xin-ra-cong",
        name: "xin-ra-cong",
        component: () =>
            import ("pages/Eof/PageXinRaCong.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/xin-nghi-viec",
        name: "xin-nghi-viec",
        component: () =>
            import ("pages/Eof/PageXinNghiViec.vue"),
        meta: {
            requiresAuth: true
        }
    },

    {
        path: "/tuyen-nhan-vien",
        name: "tuyen-nhan-vien",
        component: () =>
            import ("pages/Eof/PageTuyenNhanVien.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/de-nghi-thanh-toan",
        name: "thanh-toan",
        component: () =>
            import ("pages/Eof/PageThanhToan.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/de-nghi-tam-ung",
        name: "de-nghi-tam-ung",
        component: () =>
            import ("pages/Eof/PageRequestAdvance.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/lich-lam-viec",
        name: "lich-lam-viec",
        component: () =>
            import ("pages/Eof/RegisterCalendarWork.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/calendarWork-Detail",
        name: "calendarWork-Detail",
        component: () =>
            import ("pages/Eof/PageDangKiLichLamViec.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/phe-duyet",
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
            import ("pages/Eof/PageDuyetCapXe.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/yeu-cau-duyet",
        name: "request",
        component: () =>
            import ("pages/Eof/PageRequest.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/dang-ky-xe",
        name: "dang-ky-xe",
        component: () =>
            import ("pages/Eof/PageDangKyXe.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/tra-cuu-lich-xe",
        name: "tra-cuu-lich-xe",
        component: () =>
            import ("pages/Eof/PageTraCuuLichXe.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/report-xin-nghi-viec",
        component: () =>
            import ("src/pages/Eof/PageReport/XinNghiViec.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/report-loi-cham-cong",
        component: () =>
            import ("src/pages/Eof/PageReport/LoiChamCong.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/import-error-time",
        component: () =>
            import ("src/pages/Eof/PageReport/ImportErrorTime.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/import-payslip",
        component: () =>
            import ("src/pages/Eof/PageReport/Payslip.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/import-payslip-t13",
        component: () =>
            import ("src/pages/Eof/PageReport/PayslipT13.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/report-dashboard",
        component: () =>
            import ("src/pages/Eof/PageReport/DashboardReport.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/report-lam-them-gio",
        component: () =>
            import ("src/pages/Eof/PageReport/XacNhanCong.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/report-di-cong-tac",
        component: () =>
            import ("src/pages/Eof/PageReport/DiCongTac.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/report-xin-ra-cong",
        component: () =>
            import ("src/pages/Eof/PageReport/XinRaCong.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/report-mua-hang-vat-tu",
        component: () =>
            import ("src/pages/Eof/PageReport/MuaHangVatTu.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/report-tuyen-nhan-vien",
        component: () =>
            import ("src/pages/Eof/PageReport/TuyenNhanVien.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/xem-lich-xe",
        name: "xem-lich-xe",
        component: () =>
            import ("pages/Eof/PageXemLichXe.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/create-meeting-room",
        name: "create-meeting-room",
        component: () =>
            import ("pages/Eof/meeting/createMeetingRoom.vue"),
        meta: {
            requiresAuth: true
        }
    }
];