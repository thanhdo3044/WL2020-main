import axios from 'axios'
import apiConfig from '../configs/api'

const getPalletInLine = () =>{
    return new Promise((resolve,reject)=>{
        commit('REQUEST_PENDING')
        axios.get(apiConfig.PALLETS_IN_LINE).then(resp=>{
            commit('FETCH_PALLETS_IN_LINE',resp.data.data)
            commit('REQUEST_DONE')
            resolve(resp)
        }).catch(err=>{
            commit('REQUEST_DONE')
            reject(err)
        })
    })
}
const createPallet = ()=>{

} 
export {getPalletInLine,createPallet}