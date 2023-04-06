import axios from "axios";
const serverKey =
    "key=AAAApKL2Hew:APA91bGwAtre5rIEyltz7uFXCd-FIo7_npjprm4PYxDIOm3FAD_Q-4xNBTVSGT54ZlICIsXUuLLKbDdVLGHt2ZCsfR7SXjGSyBvK7rvI8vtAe_UrBb2vSXUBigbWBeIu7LiqjzWy5_X2";

export default function(title, body, path, data, tokenFCM) {
    let baseUrl = "";
    if (process.env.PROD) {
        baseUrl = "https://app.woodsland.com.vn:1001/";
    } else {
        baseUrl = "http://localhost:8080/";
    }
    const dataSend = {
        to: tokenFCM,
        notification: {
            title: title,
            body: body,
            click_action: baseUrl + "#/" + `yeu-cau-duyet?id=${path}`,
            icon: baseUrl + "statics/app-logo-128x128.png",
            close: '635.67',
            content_available: true,
            priority: "high"
        },
        data: data
    };
    return new Promise((resolve, reject) => {
        axios
            .post("https://fcm.googleapis.com/fcm/send", dataSend, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: serverKey
                }
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err.response);
            });
    });
}