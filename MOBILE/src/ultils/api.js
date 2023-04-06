let BASE_URL = "";
let BASE_URLV3 = "";
let apiVersion = "v2";
let apiVersion3 = "v3";
if (process.env.PROD) {
    BASE_URL = "/api/" + apiVersion;
    BASE_URLV3 = "/api/" + apiVersion3;
} else {
    BASE_URL = "//localhost:2003/api/" + apiVersion;
    BASE_URLV3 = "//localhost:2003/api/" + apiVersion3;
}
//http://localhost:2003/api/
const api = {
    AUTH: BASE_URLV3 + "/login",
    VENDOR: BASE_URL + "/vendors",
    ITEMS: BASE_URL + "/items",
    ITEM_TYPE: BASE_URL + "/item-types",
    UNITS: BASE_URL + "/units",
    DEPARTMENTS: BASE_URL + "/departments",
    PROPOSALFORMS: BASE_URL + "/proposal-forms",
    ACCOUNTFORMS: BASE_URL + "/account-forms/",
    BOM: BASE_URL + "/boms",
    DM_MENU: BASE_URL + "/menu",
    PROD_REPORT_RESULT_BY_PROD_ORDER: BASE_URL + "/bao-cao-raw-data/order",
    GET_ROLE_INFO_BY_ID: BASE_URL + "/roles/",
    ROLE_VALUES: BASE_URL + "/role-values",
    ROLE: BASE_URL + "/roles",
    ACCOUNT: BASE_URL + "/accounts",
    SIGNUP: BASE_URL + "/signup",
    PROD_REPORT_DATE: BASE_URL + "/bao-cao-raw-data/date",
    PROD_REPORT_MONTH: BASE_URL + "/bao-cao-raw-data/month",
    PROD_REPORT_WEEK: BASE_URL + "/bao-cao-raw-data/week2",
    PROD_REPORT_WEEK3: BASE_URL + "/bao-cao-raw-data/week3",
    PROD_REPORT_WEEK4: BASE_URL + "/bao-cao-raw-data/week4",
    PROD_REPORT_INVENTORY: BASE_URL + "/bao-cao-ton/raw",
    PROD_REPORT_DETAIL: BASE_URL + "/bao-cao-raw-data/raw",
    PROD_DEFECT_DETAIL: BASE_URL + "/bao-cao-qc/hang-den-kho-qc",
    PROD_QC_REPORT_SOLUTION: BASE_URL + "/bao-cao-qc/qc-xu-ly",
    PROD_REPORT_COC: BASE_URL + "/coc",
    PROD_RESULT_LSX: BASE_URL + "/bao-cao-raw-data/order",
    PROD_REPORT_QC_LUA_PHOI: BASE_URL + "/bao-cao-so-sanh-ty-le-dat-qc-va-lua-phoi",
    PROD_REPORT_ME_SAY: BASE_URL + "/bao-cao-me-say",
    PROD_MATERIAL_OF_ME_SAY: BASE_URL + "/bao-cao-phoi-theo-me-say",
    PROD_ORDERS: BASE_URL + "/production-orders",
    PROD_BOM: BASE_URL + "/boms",
    PROD_ROUTING: BASE_URL + "/routings",
    PROD_PACKAGE: BASE_URL + "/packages",
    PROD_KE_HOACH_DON_HANG: BASE_URL + "/delivery-plan",
    PROD_OSCP: BASE_URL + "/oscp",
    PROD_PLAN_ORDER: BASE_URL + "/production-order",
    PROD_TIME: BASE_URL + "/production-time",
    PROD_MARKET: BASE_URL + "/markets",
    PROD_DINH_MUC_TON: BASE_URL + "/dinh-muc-ton",
    PROD_TON_DETAIL: BASE_URL + "/ton-dau-ky-chi-tiet",
    PROD_CHO_SAY: BASE_URL + "/ballets/bao-cao-cho-say",

    NL_PAYMENT: BASE_URL + "/wood-payment",
    NL_RECEIPT: BASE_URL + "/wood-warehouse",
    NL_REGION: BASE_URL + "/wood-region",
    NL_PRICE: BASE_URL + "/wood-price",
    NL_REQUEST_PRICE: BASE_URL + "/wood-req-price",
    NL_DTYPE: BASE_URL + "/wood-dtype",
    NL_WOOD_TYPE: BASE_URL + "/wood-type",
    NL_INPUT_TYPE: BASE_URL + "/wood-input-type",
    NL_REPORT_THEO_DOI_NHAP_VAN: BASE_URL + "/wood-report/theo-doi-nhap-van",
    IKEA: BASE_URL + "/markets",
    ROUTING_NAME: BASE_URL + "/routing-name",

    NLG_PHIEU_NHAP_KHO: BASE_URL + "/nlg-phieu-nhap-kho",
    NLG_PHIEU_NHAP_KHO1: BASE_URL + "/nlg-phieu-nhap-kho1",
    NLG_PHIEU_NHAP_KHO2: BASE_URL + "/nlg-phieu-nhap-kho2",
    NLG_PHIEU_NHAP_KHO3: BASE_URL + "/nlg-phieu-nhap-kho3",
    NLG_PHIEU_NHAP_KHO4: BASE_URL + "/nlg-phieu-nhap-kho4",
    NLG_PHIEU_NHAP_KHO_DT: BASE_URL + "/nlg-detail-nk",
    NLG_PHIEU_NHAP_KHO_DT1: BASE_URL + "/nlg-nhap-kho",
    NLG_GET_DS_DE_LAI: BASE_URL + "/nlg-ds-de-lai",
    NLG_NHA_CUNG_CAP: BASE_URL + "/nha-cung-cap",
    NLG_GET_NCC_THANG: BASE_URL + "/nha-cung-cap-thang",
    NLG_GET_NCC_THANG1: BASE_URL + "/nha-cung-cap-thang1",
    NLG_GET_NCC_THANG2: BASE_URL + "/nha-cung-cap-thang2",
    NLG_GET_NHAP_THANG: BASE_URL + "/khoi-luong-ncc-thang",
    NLG_KHO: BASE_URL + "/ma-kho",
    NLG_QUI_CACH: BASE_URL + "/qui-cach",
    NLG_GROUP_QUI_CACH: BASE_URL + "/group-qui-cach",
    NLG_DINH_MUC_KHO: BASE_URL + "/dinh-muc-kho",
    NLG_GET_CHINH_PHAM_EDIT: BASE_URL + "/chinh-pham",
    NLG_HA_CAP: BASE_URL + "/ha-cap",
    BLG_TYPE_HA_CAP: BASE_URL + "/type-ha-cap",
    NLG_REPORT: BASE_URL + "/reports-nlg",
    NLG_STAFF: BASE_URL + "/accounts",
    NLG_KE_HOACH: BASE_URL + "/plan-nlg",
    NLG_KE_HOACH1: BASE_URL + "/plan-nlg1",
    NLG_BB_NGHIEMTHU: BASE_URL + "/bien-ban-nghiem-thu",
    NLG_BB_TINHTIEN: BASE_URL + "/bien-ban-tinh-tien",
    NLG_BB_TINHTIEN1: BASE_URL + "/bien-ban-tinh-tien1",
    NLG_BB_TINHTIEN2: BASE_URL + "/bien-ban-tinh-tien2",
    NLG_NGUYEN_LIEU_GO: BASE_URL + "/nguyen-lieu-go",
    NLG_BANG_GIA: BASE_URL + "/bang-gia",
    NLG_REQ_BANGGIA: BASE_URL + "/req-cost",

    B_ITEMS: BASE_URL + "/dinh-muc-phoi",
    P_POS: BASE_URL + "/khsx",
    P_PACKAGES: BASE_URL + "/cong-doan"
};

export {
    api
};