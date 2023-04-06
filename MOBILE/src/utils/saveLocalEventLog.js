import { LocalStorage } from 'quasar'
export default function(eventLog) {
    let totalEventLogString = localStorage.getItem('eventlog')
    let totalEventLog = []
    if (totalEventLogString) {
        totalEventLog = JSON.parse(totalEventLogString)
    }
    totalEventLog.push(eventLog)
    // LocalStorage.set('eventlog',JSON.stringify(totalEventLog))
    localStorage.setItem('eventlog',JSON.stringify(totalEventLog))
}