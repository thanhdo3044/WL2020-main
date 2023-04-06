import axios from 'axios'
const serverKey = 'key=AAAApKL2Hew:APA91bGwAtre5rIEyltz7uFXCd-FIo7_npjprm4PYxDIOm3FAD_Q-4xNBTVSGT54ZlICIsXUuLLKbDdVLGHt2ZCsfR7SXjGSyBvK7rvI8vtAe_UrBb2vSXUBigbWBeIu7LiqjzWy5_X2'
export default function(token) {
    return new Promise((resolve, reject) => {
        axios.get('https://iid.googleapis.com/iid/info/' + token + '?details=true', { headers: { 'Content-Type': 'application/json', Authorization: serverKey } }).then(res => {
            resolve(res.data.rel)
            console.log(res.data)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}