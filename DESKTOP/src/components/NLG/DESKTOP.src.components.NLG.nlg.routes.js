export const nlgRoutes = [{
        path: "/nlg-nhap-kho",
        component: () =>
            import ("pages/NLG/KHO/NhapKho.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-phieu-nhap-kho",
        component: () =>
            import ("pages/NLG/KHO/Add.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-view-phieu-nhap-kho",
        component: () =>
            import ("pages/NLG/KHO/bbnhapkho.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/bien-ban-nghiem-thu-go/:id",
        component: () =>
            import ("pages/NLG/QC/PageBienBan.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-add-detail/:guid",
        name: "add-detail-nlg",
        component: () =>
            import ("pages/NLG/KHO/Add2.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-edit-detail/:id",
        name: "edit-detail-nlg",
        component: () =>
            import ("pages/NLG/KHO/Edit.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nghiem-thu-go",
        component: () =>
            import ("pages/NLG/QC/PageIndex.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-nghiem-thu",
        component: () =>
            import ("pages/NLG/QC/Index.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-nghiem-thu1",

        component: () =>
            import ("pages/NLG/QC/BienBan.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-bb-nghiem-thu/:guid",
        name: "bb-nghiem-thu",
        component: () =>
            import ("pages/NLG/QC/BienBan1.vue"),
        meta: {
            requiresAuth: true
        }
    },

    {
        path: "/nlg-add-nghiem-thu/:id",
        name: "add-nghiem-thu",
        component: () =>
            import ("pages/NLG/QC/Add.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-ds-de-lai",
        component: () =>
            import ("pages/NLG/KHO/DanhSachDelai.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-ds-tra-ve",
        component: () =>
            import ("pages/NLG/KHO/DanhSachtrave.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-phieu-trave",
        component: () =>
            import ("pages/NLG/KHO/phieutravekho.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-add-tra-ve/:id",
        name: "add-phieutrave-nlg",
        component: () =>
            import ("pages/NLG/KHO/PhieuTrave.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-qui-cach",
        component: () =>
            import ("pages/NLG/SETTING/QuiCach.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-dinh-muc-kho",
        component: () =>
            import ("pages/NLG/SETTING/DinhMucKho.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-group-qui-cach",
        component: () =>
            import ("pages/NLG/SETTING/NhomQuiCach.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-nha-cung-cap",
        component: () =>
            import ("pages/NLG/SETTING/NhaCungCap.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-bang-gia",
        component: () =>
            import ("pages/NLG/SETTING/BangGia.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-update-price",
        component: () =>
            import ("pages/NLG/SETTING/UpdatePrice.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-list-req",
        component: () =>
            import ("pages/NLG/SETTING/ListReq.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-phe-duyet-bang-gia/:no",
        name: "nlg-detail-bang-gia",
        component: () =>
            import ("pages/NLG/SETTING/DetailApprovalPrice.vue"),
        meta: {
            requiresAuth: true
        }
    },

    {
        path: "/nlg-nhap-ke-hoach",
        component: () =>
            import ("pages/NLG/PNL/NhapKeHoach.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-sua-nhap-ke-hoach",
        component: () =>
            import ("pages/NLG/PNL/SuaKeHoach.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-nhap-ke-hoach-tung-kho",
        component: () =>
            import ("pages/NLG/PNL/NhapKeHoachtungkho.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-nhap-ke-hoach-tuan",
        component: () =>
            import ("pages/NLG/PNL/NhapKeHoachtuan.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-bb",
        component: () =>
            import ("pages/NLG/PNL/ListBB.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-bb-tinh-tien/:guid",
        name: "nlg-bb-tinh-tien",
        component: () =>
            import ("pages/NLG/PNL/EditBB.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-bb-tinh-tien-view/:guid",
        name: "nlg-bb-tinh-tien-view",
        component: () =>
            import ("pages/NLG/PNL/ViewBB.vue"),
        meta: {
            requiresAuth: true
        }
    },

    {
        path: "/nlg-reports-kh",
        component: () =>
            import ("pages/NLG/REPORTS/KeHoach.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-kh-tong",
        component: () =>
            import ("pages/NLG/REPORTS/KeHoach2.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-kh-tuan",
        component: () =>
            import ("pages/NLG/REPORTS/KeHoachtuan.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-don-gia-tb",
        component: () =>
            import ("pages/NLG/REPORTS/DonGiaTrungBinh.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-ncc-loai",
        component: () =>
            import ("pages/NLG/REPORTS/NCCLoai.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-thong-ke-kho-nhan",
        component: () =>
            import ("pages/NLG/REPORTS/ThongKeKhoNhan.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-th-nhap-kho",
        component: () =>
            import ("pages/NLG/REPORTS/baocaotonghopnhapkho.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-tong-hop-xuong-hang",
        component: () =>
            import ("pages/NLG/REPORTS/XuongHang.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-tong-hop-kl",
        component: () =>
            import ("pages/NLG/REPORTS/KL.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-tong-hop-ncc",
        component: () =>
            import ("pages/NLG/REPORTS/NCC.vue"),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/nlg-reports-thong-ke-ty-le",
        component: () =>
            import ("pages/NLG/REPORTS/thongketyle.vue"),
        meta: {
            requiresAuth: true
        }
    }
    // {
    //     path: "/nlg-add-phieu-nhap-kho/:guid",
    //     name: "add-detail-nhapkho-nlg",
    //     component: () =>
    //         import ("pages/NLG/KHO/Add.vue"),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },
    // {
    //     path: "/nlg-nghiem-thu-xong",
    //     component: () =>
    //         import ("pages/NLG/QC/BienBan1.vue"),
    //     meta: {
    //         requiresAuth: true,
    //     },
    // },
];