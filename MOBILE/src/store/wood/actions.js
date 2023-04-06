import apiConfig from '../../configs/api'
import { isObjectEmpty, getRequest, postRequest, setToken,getRequestWithProgressIndicator ,putRequest} from "../../utils/utils";

export async function GET_RECEIPTS ({commit},payload) {
    let res = await getRequest(apiConfig.WOOD_GET_RECEIPTS+'?warehouseId='+payload.warehouseId+'&moduleCode='+payload.moduleCode)
    return res.data
}

export async function GET_VENDORS({commit},moduleCode) {
    let res = await getRequest(apiConfig.WOOD_GET_VENDORS+'?module='+moduleCode)
    return res.data
}
export async function CREATE_WH_RECEIPT({commit},payload) {
    let res = await postRequest(apiConfig.WOOD_CREATE_WH_RECEIPT,payload)
    return res.data
}

// LẤY CHI TIẾT PHIẾU NHẬP KHO
export async function GET_DETAIL_RECEIPT({commit},id) {
    let res = await getRequest(apiConfig.WOOD_GET_RECEIPT_BY_ID+id)
    return res.data
}
export async function GET_INPUT_TYPE({commit},payload) {
    let res = await getRequest(apiConfig.WOOD_GET_INPUT_TYPE+'?moduleCode='+payload.moduleCode+'&type='+payload.type)
    return res.data
}
export async function GET_WOOD_TYPE({commit}) {
    let res = await getRequest(apiConfig.WOOD_TYPE)
    return res.data
}
export async function GET_ITEM({commit},payload) {
    let res = await getRequest(apiConfig.GET_ITEM+'?factoryId='+payload.factoryId+'&typeId='+payload.typeId)
    return res.data
}
export async function GET_ITEM_BY_TYPE({commit},payload) {
    let res = await getRequest(apiConfig.GET_ITEM+'?typeId='+payload.typeId)
    return res.data
}
export async function GET_ITEM_BY_MODULE_ID({commit},moduleId) {
    let res = await getRequest(apiConfig.GET_ITEM+'?moduleId='+moduleId)
    return res.data
}
export function SELECT_RECEIPT({commit},receipt){
    commit('SELECT_RECEIPT',receipt)
}
export async function CREATE_DETAIL_RECEIPT({commit},payload){
    let url = apiConfig.CREATE_DETAIL_WH
    let data = await postRequest(url,payload)
    return data.data
}
export async function UPDATE_DETAIL_RECEIPT({commit},payload){
    let url = apiConfig.GET_RECEIPT_DETAIL_DLT+payload.id
    let data = await putRequest(url,payload.data)
    return data.data
}
export async function GET_DETAIL_DLT({commit},id){
    let res = await getRequest(apiConfig.GET_RECEIPT_DETAIL_DLT+id)
    return res.data
}
// lay thong tin ha cap theo id 
export async function GET_INSPECTION_BY_RECEIPT_ID({commit},id){
    let res = await getRequest(apiConfig.GET_INSPECTION_BY_RID+id)
    return res.data
}
export async function GET_DETAIL_RECEIPT_BY_RECEIPT({commit},id){
    let res = await getRequestWithProgressIndicator(apiConfig.GET_DLT_BY_RECEIPT_ID+'?receiptId='+id)
    return res.data
}
export async function CREATE_INSPECTION({commit},payload) {
    let res = await postRequest(apiConfig.CREATE_INSPECTION,payload)
    return res.data
}
export async function UPDATE_WH_RECEIPT({commit},payload) {
    let res = await putRequest(apiConfig.WOOD_UPDATE_WH_RECEIPT+payload.receiptDetailId,payload.data)
    return res.data
}
export async function GET_LIST_PAYMENT({commit}){
    let res = await getRequest(apiConfig.GET_LIST_PAYMENT)
    return res.data
}
export async function GET_PAYMENT_DETAIL_BY_RECEIPT_ID ({commit},id) {
    let res = await getRequest(apiConfig.GET_PAYMENT_DETAIL+id)
    return res.data
}
export async function GET_PRICE_RAW_DATA ({commit},payload) {
    let res = await getRequest(apiConfig.GET_PRICE_RAW_DATA+'?moduleId='+payload.moduleId+'&regionId='+payload.regionId)
    return res.data
}
export async function GET_DTYPE({commit},moduleCode) {
    let res = await getRequest(apiConfig.GET_DTYPE+'?moduleCode='+moduleCode)
    return res.data
}
export async function CREATE_REQ_PRICE({commit},payload) {
    let res = await postRequest(apiConfig.CREATE_REQ_PRICE,payload)
    return res.data
}
export async function GET_MY_REQUEST({commit},id) {
    let res
    if (id) {
        res = await getRequest(apiConfig.GET_REQUEST_PRICE+'?uid='+id)
    }else {
        res  = await getRequest(apiConfig.GET_REQUEST_PRICE)
    }
    return res.data
}
export async function GET_PRICE_BY_REQID({commit},id) {
    let res = await getRequest(apiConfig.GET_PRICE_BY_REQ_ID+id)
    return res.data
}
export async function APPROVAL_PRICE({commit},payload){
    let res = await putRequest(apiConfig.APPROVAL_PRICE,payload)
    return res.data
}
export async function COMPLETED_PAYMENT({commit},payload) {
    let res = await postRequest(apiConfig.POST_COMPLETED_PAYMENT+payload.id,payload.data)
    if (res.data.meta.success) {
        let resCreatePallet = await postRequest(apiConfig.POST_CREATE_PALLET,payload.pallet)
    }
    return res.data
}
//load pay info
export async function VIEW_COMPLETED_PAYMENT({commit},id){
    let res = await getRequest(apiConfig.GET_PAYMENT_DETAIL+id+'/view')
    return res.data
}
export function STORE_PAY_CALCUTALOR({commit},payload){
    commit('STORE_PAY',payload)
}
export async function GET_REGION({commit},id){
    let res = await getRequest(apiConfig.GET_REGION+'?moduleId='+id)
    return res.data
}
export async function POST_REGION({commit},payload) {
    let res = await postRequest(apiConfig.POST_REGION,payload)
    return res.data
}
export async function POST_VENDOR({commit},payload) {
    let res = await postRequest(apiConfig.POST_VENDOR,payload)
    return res.data
}
export async function UPDATE_VENDOR({commit},payload) {
    let res = await putRequest(apiConfig.UPDATE_VENDOR+payload.id,payload.data)
    return res.data
}

export async function CHANGE_MAP_CONDITION({commit},payload) {
    let res = await postRequest(apiConfig.GET_PRICE_RAW_DATA,payload)
    return res.data
}
export async function GET_LIST_INSP_BY_RDLT_ID({commit},id){
    let res = await getRequest(apiConfig.GET_LIST_INSP_BY_RDLT_ID+id+'/view')
    return res.data
}
export async function EDIT_INSPECTION({commit},payload){
    // id là ID của bảng WOOD_INSP
    let res = await putRequest(apiConfig.GET_LIST_INSP_BY_RDLT_ID+payload.id,payload)
    return res.data
}
export async  function LOAD_MATERIAL_IN_PROD({commit},id){
    let res = await getRequest(apiConfig.GET_PROD_ORDERS+'/'+id)
    return res.data
}

//kho đóng biên bản
export async function LOCK_RECEIPT({commit},id){
    let res = await putRequest(apiConfig.WOOD_UPDATE_WH_RECEIPT+id)
    return res.data
}