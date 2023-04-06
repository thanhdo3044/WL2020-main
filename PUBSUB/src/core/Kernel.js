const Kernel = () => {
    const channels = {}
    let counts = 0
    return {
        services : {},
        getChannels() {
            return Object.keys(channels)
        },
        publish(channel, message) {
            console.log({
                channel,message
            })
            let fnIds = Object.keys(channels[channel] || {})
            fnIds.forEach(e => {
                channels[channel][e](message)
            })
        },
        subcribe(channel, fn) {
            if (typeof fn !== 'function')
                return null
            let id = this.createCallbackId()
            if (channels[channel] === undefined)
                channels[channel] = {}
            channels[channel][id] = fn
            return id
        },
        unsubcribe(channel, fnId) {
            delete channels[channel][fnId]
        },
        createCallbackId() {
            return `${new Date().toLocaleString("en-VN",{ hour12: false }).replace(`/`,'-').replace('/','-').replace(',','')} ${++counts}`
        },
        addService(service,name){
            service.kernel = this
            this.services[name] = service
        }

    }
}


module.exports  = Kernel