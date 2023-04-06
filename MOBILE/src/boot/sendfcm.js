import sendFcm from '../utils/firebase'
import sendMessageActiveReq from '../utils/sendMessageReqSuccess'
import subcriberTopic from '../utils/fcmSubcriberTopic'
import getSubcrs from '../utils/fcmGetTopicSubcr'
import unSubcrs from '../utils/fcmUnSubcribe'
export default ({ Vue }) => {
    Vue.prototype.$sendFcm = sendFcm
    Vue.prototype.$sendMessageActiveReq = sendMessageActiveReq
    Vue.prototype.$getSubcrs = getSubcrs
    Vue.prototype.$subcriberTopic = subcriberTopic
    Vue.prototype.$unSubcrsTopic = unSubcrs
}