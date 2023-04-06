import { Notify } from 'quasar'

export default function(topic) {
    let token = localStorage.getItem('tokenFBB')
    if (token) {
        let data = {
            abc: 1
        }
        const serverKey = 'AAAApKL2Hew:APA91bGwAtre5rIEyltz7uFXCd-FIo7_npjprm4PYxDIOm3FAD_Q-4xNBTVSGT54ZlICIsXUuLLKbDdVLGHt2ZCsfR7SXjGSyBvK7rvI8vtAe_UrBb2vSXUBigbWBeIu7LiqjzWy5_X2'
        fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'key=' + serverKey
            })
        }).then(response => {
            if (response.status < 200 || response.status >= 400) {
                throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
            }
            // Notify.create({
            //   message:'Subscribed to "'+topic+'"'
            // })
            console.log('Subscribed to "' + topic + '"' + response);

        }).catch(error => {
            console.error(error);
            Notify.create({
                    message: 'Subcriber ' + JSON.stringify(error)
                })
                // alert(JSON.stringify(error))
        })
    }
}