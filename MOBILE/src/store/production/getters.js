import { types, feature } from "../../configs/constants";
import { isObjectEmpty } from "../../utils/utils";
export function isLogin(state) {}
export function myFactoryInfor(state) {
    if (!isObjectEmpty(state.userInfo.structure)) {
        return state.userInfo.structure["factory"];
    }
    return null;
}
export function myDepartmentInfor(state) {
    if (state.userInfo.structure["department"]) {
        return state.userInfo.structure["department"];
    } else if (state.userInfo.structure["qc"]) {
        return state.userInfo.structure["qc"];
    } else if (state.userInfo.structure["stock"]) {
        return state.userInfo.structure["stock"];
    } else {
        return state.userInfo.structure["factory"];
    }
}
export function myXuongInfor(state) {
    return state.userInfo.structure["xuong"];
}
export function myStepInfor(state) {
    return state.userInfo.structure["step"];
}
export function mySources(state) {
    const typeConstant = types.SOURCES;
    if (state.userInfo.id) {
        let sources = state.userInfo.role.types.find(type => {
            return type.id === typeConstant;
        }).value;
        return sources;
    }
    return [];
}
export function myDestinations(state) {
    const typeConstant = types.DESTINATIONS;
    if (state.userInfo.id) {
        let des = state.userInfo.role.types.find(type => {
            return type.id === typeConstant;
        }).value;
        return des;
    }
    return [];
}
export function myFeatures(state) {
    const typeConstant = types.FEATURES;
    if (state.userInfo.id) {
        let des = state.userInfo.role.types.find(type => {
            return type.id === typeConstant;
        }).value;
        let defaultFearture = [{
                id: 999999,
                code: "Home",
                name: "Màn hình chính",
                color: "secondary",
                icon: "home",
                active: true
            },
            {
                id: 999998,
                code: "ACCOUNT",
                name: "Tài khoản",
                icon: "people",
                color: "secondary",
                active: false
            },
            {
                id: 999997,
                code: "LOGOUT",
                name: "Đăng Xuất",
                icon: "power_settings_new",
                color: "secondary",
                active: false
            }
        ];
        return des.concat(defaultFearture);
    }
    return [];
}
export function myModules(state) {
    const typeConstant = types.MODULES;
    if (state.userInfo.id) {
        let des = state.userInfo.role.types.find(type => {
            return type.id === typeConstant;
        }).value;
        return des;
    }
    return [];
}

export const tonDauKys = state => {
    return state.tonDauKys;
};
export const lichsucapphoi = state => {
    return state.lichsucapphoi;
};
export const sanLuongs = state => s => {
    if (!s) return state.sanLuongs;
    return state.sanLuongs.filter(po => [
            po.Item.code,
            po.Item.name,
            po.Item.length,
            po.Item.width,
            po.Item.height,
            po.number
        ]
        .join(" ")
        .toLowerCase()
        .includes(s.toLowerCase())
    );
};

export const lenhSanXuats = state => {
    return state.sanLuongs
        .map(sl => sl.number)
        .reduce((unique, item) => {
            return unique.includes(item) ? unique : [...unique, item];
        }, []);
};

export const getTonDauKysByDepartmentId = state => (departmentID, text) => {
    if (departmentID) {
        const xyz = state.tonDauKys.filter(t => t.DEPARTMENT_ID === departmentID);
        if (text)
            return xyz.filter(t =>
                t.ITEM_NAME.toLowerCase().includes(text.toLowerCase())
            );
        return xyz;
    }
    return [];
};
export const pos = state => searchQuery => {
    if (searchQuery)
        return state.pos.filter(p => [p.itemName.toLowerCase(), p.itemHeight,'*',p.itemWidth,'*',p.itemLength, p.root]
            .join("")
            .includes(searchQuery.toLowerCase())
        );
    return state.pos;
};

export const isDongBoPhoi = state => itemId => {
    const sanPham = state.dinhMucs.find(s => s.materialId == itemId);
    if (sanPham === undefined) return true;
    const sanPhams = state.dinhMucs
        .filter(s => s.itemId === sanPham.itemId)
        .map(s => s.materialId + "");
    if (sanPhams.length === 0) return true;
    const tyLeTh = state.tyLeTHs.find(t => t.itemId == itemId);
    if (tyLeTh === undefined) return true;
    const tyLeThs = state.tyLeTHs.filter(
        t => t.itemId != itemId && sanPhams.includes(t.itemId + "")
    );
    if (tyLeThs.length === 0) return false;
    const isLonHon = tyLeThs.some(t => tyLeTh.avgTyLeTH > t.avgTyLeTH);
    if (isLonHon) return true;
    return false;
};

export const tyLeThucHienByItemId = state => itemId => {
    const tyLeTH = state.tyLeTHs.find(t => t.itemId == itemId);
    if (tyLeTH === undefined) return -1;
    return tyLeTH.avgTyLeTH;
};

export const tonTaiTos = state => state.tonTaiTos;

export const findTonTaiTosByItem = state => itemId => {
    const materials = state.dinhMucs
        .filter(d => d.itemId == itemId)
        .map(d => d.materialId);

    if (materials.length > 0) {
        const nguyenLieus = state.tonTaiTos.filter(t =>
            materials.includes(t.itemId)
        );

        if (nguyenLieus.length > 0) {
            return nguyenLieus.map(nl => {
                const dm = state.dinhMucs.find(
                    d => d.itemId == itemId && d.materialId == nl.itemId
                );
                console.log(dm)
                return {
                    ...nl,
                    heSo: dm ? dm.heSo : 1
                };
            });
        }
    }

    const chiTiets = state.tonTaiTos.filter(t => t.itemId == itemId);

    if (chiTiets.length > 0) return chiTiets.map(nl => ({...nl, heSo: 1 }));
    return [];
};

export const findTonTaiTosByItem2 = state => (nguyenLieus = [], itemId) => {
    nguyenLieus = nguyenLieus.map(nl => ({
        UNIT_ID: nl.UNIT_ID,
        itemCode: nl.CODE,
        itemHeight: nl.HEIGHT,
        itemId: nl.ITEM_ID,
        itemLenght: nl.LENGTH,
        itemName: nl.NAME,
        itemWidth: nl.WIDTH,
        ton: nl.ton < 0 ? 0 : nl.ton
    }));
    const materials = state.dinhMucs
        .filter(d => d.itemId == itemId)
        .map(d => d.materialId);

    if (materials.length > 0) {
        // const nguyenLieus = state.tonTaiTos.filter(t =>
        //   materials.includes(t.itemId)
        // );

        //     UNIT_ID: 100000
        // itemCode: "VA3130.03"
        // itemHeight: 30
        // itemId: 118382
        // itemLenght: 143
        // itemName: "Bọ tam giác trước VA3130"
        // itemWidth: 30
        // ton: 1600

        //     ACTIVE: null
        // CODE: "VA3036.01"
        // CREATE_DATE: null
        // FACTORY_ID: 100000
        // GROUP_ITEM: null
        // GUID: "B34723F4-E0E0-4C74-B837-0530BD782677"
        // HEIGHT: 32
        // ID: 118341
        // IMAGE_URL: null
        // ITEM_ID: 118341
        // LENGTH: 889
        // MODULE_ID: null
        // MaterialType: "(gỗ birch)"
        // NAME: "Khung hồi trái VA3036"
        // TYPE_ID: 100002
        // UNIT_ID: 100000
        // VOLUMN: 0.0128016
        // WIDTH: 450
        // WOOD_TYPE_ID: null
        // heSo: 0
        // ton: 0

        if (nguyenLieus.length > 0)
            return nguyenLieus.map(nl => {
                const dm = state.dinhMucs.find(
                    d => d.itemId == itemId && d.materialId == nl.itemId
                )
                return {
                    ...nl,
                    heSo: dm ? dm.heSo : 1
                }
            });
    }
    const chiTiets = nguyenLieus.filter(t => t.itemId == itemId);

    if (chiTiets.length > 0) return chiTiets.map(nl => ({...nl, heSo: 1 }));
    return [];
};

export const isCheckPhoiByItemId = () => itemId => {
    return ![
        "118240",
        "118241",
        "118243",
        "118244",
        "118245",
        "118246",
        "118247",
        "118248",
        "118249",
        "118256",
        "118261",
        "118279",
        "118280",
        "118283",
        "118284",
        "118285",
        "118286",
        "118287",
        "118288",
        "118293",
        "118298",
        "118312",
        "118313",
        "118316",
        "118317",
        "118318",
        "118319",
        "118320",
        "118321",
        "118326",
        "118331",
        "118345",
        "118346",
        "118348",
        "118349",
        "118350",
        "118351",
        "118352",
        "118353",
        "118354",
        "118361",
        "118366",
        "118384",
        "118385",
        "118387",
        "118388",
        "118389",
        "118390",
        "118391",
        "118392",
        "118393",
        "118400",
        "118405",
        "118423",
        "118424",
        "118426",
        "118427",
        "118428",
        "118429",
        "118430",
        "118432",
        "118439",
        "118444",
        "118462",
        "118463",
        "118465",
        "118466",
        "118467",
        "118468",
        "118469",
        "118470",
        "118471",
        "118478",
        "118483",
        "118501",
        "118502",
        "118504",
        "118505",
        "118506",
        "118507",
        "118508",
        "118509",
        "118510",
        "118517",
        "118522",
        "119968",
        "119976",
        "120059"
    ].includes(itemId + "");
};

export const isThieuPhoi = state => itemId => {
    const materials = state.dinhMucs
        .filter(d => d.itemId == itemId)
        .map(d => d.materialId);
    if (materials.length > 0) {
        const nguyenLieus = state.tonTaiTos.filter(t =>
            materials.includes(t.itemId)
        );
        if (nguyenLieus.length > 0)
            return nguyenLieus.some(
                c => parseFloat(parseFloat(c.ton).toFixed(4)) <= 0
            );
    }
    const chiTiets = state.tonTaiTos.filter(t => t.itemId == itemId);

    if (chiTiets.length > 0)
        return chiTiets.some(c => parseFloat(parseFloat(c.ton).toFixed(4)) <= 0);
    return true;
};