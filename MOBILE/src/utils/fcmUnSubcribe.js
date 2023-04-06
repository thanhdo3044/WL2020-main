export default function(token, topic) {
    const serverKey = 'AAAApKL2Hew:APA91bGwAtre5rIEyltz7uFXCd-FIo7_npjprm4PYxDIOm3FAD_Q-4xNBTVSGT54ZlICIsXUuLLKbDdVLGHt2ZCsfR7SXjGSyBvK7rvI8vtAe_UrBb2vSXUBigbWBeIu7LiqjzWy5_X2'
    fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'key=' + serverKey
        })
    }).then(response => {
        if (response.status < 200 || response.status >= 400) {
            throw 'Error Unsubscribing to topic: ' + response.status + ' - ' + response.text();
        }
        console.log('unSubscribed to "' + topic + '"');

    }).catch(error => {
        console.error(error);

    })
}