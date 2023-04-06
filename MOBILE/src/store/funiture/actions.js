import axios from 'axios'
import apiConfig from '../../configs/api'

//lay danh sach du an
export function ACTION_LOAD_PROJECTS({ commit }) {
  return new Promise((resolve, reject) => {
    axios.get(apiConfig.GET_PROJECTS).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err.response.data)
    })
  })
}
// lấy danh sách sản phẩm trong dự án
export function ACTION_LOAD_ITEM_FROM_PROJECT({commit},projectId){
  return new Promise((resolve,reject)=>{
    axios.get(apiConfig.FUNITURE_GET_ITEM_FROM_PROJECTID+projectId+'/products').then(res=>{
      commit('LOAD_ITEMS',res.data.data)
      resolve(res.data)
    }).catch(err=>{
      reject(err.response.data)
    })
  })
}
// chọn dự án
export function ACTION_SELECT_PROJECT({commit},project){  
  commit('SELECT_PROJECT',project)
}

//lấy danh sách biên bản nghiệm thu lắp đặt
export function ACTION_GET_ACCEPTS({commit},payload){
  return new Promise((resolve,reject)=>{
    axios.get(apiConfig.FUNITURE_GET_ACCEPTS).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err.response.data)
    })
  })
}
// tạo biên bản nghiệm thu
export function ACTION_CREATE_ACCEPT({commit},payload){
  return new Promise((resolve,reject)=>{
    axios.post(apiConfig.FUNITURE_POST_CREATE_ACCEPT,payload).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err.response.data)
    })
  })
}
// chọn biên bản nghiệm thu lăp đặt
export function  ACTION_SELECT_ACCEPT({commit},accept){
  commit('SELECT_ACCEPT',accept)
}
//lần các lần lắp đặt cửa theo biên bản
export function ACTION_LOAD_DETAIL_ACCEPT({commit},acceptId){
  return new Promise((resolve,reject)=>{
    axios.get(apiConfig.FUNITURE_GET_DETAIL_ACCEPT+acceptId+'/products').then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err.response.data)
    })
  })
}
//thêm lần lắp đặt cho biên bản 
export function ACTION_ADD_DATA_TO_ACCEPT({commit},payload){
  return new Promise((resolve,reject)=>{
    axios.post(apiConfig.FUNITURE_POST_ADD_DATA_TO_ACCEPT,payload).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err.response.data)
    })
  })
}
//tạo phiếu xuất kho
export function ACTION_CREATE_GOOD_ISSUE({commit},payload){
  return new Promise((resolve,reject)=>{
    axios.post(apiConfig.FUNITURE_POST_CREATE_GOOD_ISSUE,payload).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      resolve(err.response.data)
    })
  })
}


// lấy danh sách phiếu nhập kho
export function ACTION_GET_GOOD_ISSUES({commit}){
  return new Promise((resolve,reject)=>{
    axios.get(apiConfig.FUNITURE_GET_GOODS_ISSUE).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err.response.data)
    })
  })
}
export function ACTION_SELECT_GOOD_ISSUE({commit},goodIssue){
  commit('SELECT_GOOD_ISSUE',goodIssue)
}
// lấy danh sách các sản phẩm trong biên bản
export function ACTION_GET_PRODUCT_IN_GOOD_ISSUES({commit},gId){
  return new Promise((resolve,reject)=>{
    axios.get(apiConfig.FUNITURE_GET_PRODUCT_IN_GISSUE+gId+'/products').then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err.response.data)
    })
  })
}

//thêm sản phẩm vào biên bản xuất kho
export function ACTION_ADD_ITEM_TO_GOOD_ISSUE({commit},payload){
  return new Promise((resolve,reject)=>{
    axios.post(apiConfig.FUNITURE_POST_ADD_ITEM_TO_GI,payload).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      reject(err.response.data)
    })
  })
}
// hoàn thành biên bản
export function ACTION_GI_COMPLETED({commit},giid){
  return new Promise((resolve,reject)=>{
    axios.post(apiConfig.FUNITURE_POST_WH_CONFIRM_GI+giid+'/completed',{}).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      resolve(err.response.data)
    })
  })
}
// Qc xác nhận biên bản xuất kho
export function ACTION_QC_CONFIRM_GI({commit},giid){
  return new Promise((resolve,reject)=>{
    axios.post(apiConfig.FUNITURE_POST_WH_CONFIRM_GI+giid+'/qc/verify',{}).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      resolve(err.response.data)
    })
  })
}
// Người nhận xác nhận biên bản xuất kho
export function ACTION_RECIVED_CONFIRM_GI({commit},giid){
  return new Promise((resolve,reject)=>{
    axios.post(apiConfig.FUNITURE_POST_WH_CONFIRM_GI+giid+'/reciver/verify',{}).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      resolve(err.response.data)
    })
  })
}
// Xưởng xác nhận biên bản xuất kho
export function ACTION_XUONG_CONFIRM_GI({commit},giid){
  return new Promise((resolve,reject)=>{
    axios.post(apiConfig.FUNITURE_POST_WH_CONFIRM_GI+giid+'/factory/verify',{}).then(res=>{
      resolve(res.data)
    }).catch(err=>{
      resolve(err.response.data)
    })
  })
}