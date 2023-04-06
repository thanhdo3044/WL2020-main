import eventLogService from '../utils/saveLocalEventLog'
export default ({ Vue }) => {
    Vue.prototype.$eventLog = eventLogService
}