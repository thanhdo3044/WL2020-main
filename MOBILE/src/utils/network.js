import axios from 'axios'
import { Notify } from 'quasar'

 function getRequest(url,callback) {
    axios.get(url).then((response)=>{
        callback(response)
    }).catch((err)=>{
        const message = 'AXIOS GET REQUEST ERROR ! : '+err
        console.log(message)
        Notify.create({
            message:message,
            position:'bottom',
            color:'red'
        })
    })
}
function postRequest(url,data,callback){
    axios.post(url,data).then((response)=>{
        callback(response)
    }).catch((err)=>{
        const message = 'AXIOS GET POST ERROR ! : '+err
        console.log(message)
        Notify.create({
            message:message,
            position:'bottom',
            color:'red'
        })
    })
}
export default { getRequest , postRequest}