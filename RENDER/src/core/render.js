const view = require('../data/view')

function render(raw = {}, option = {}) {
    option.field = option.field || {}
    if (typeof raw !== 'object' || raw == null || raw == undefined)
        return raw
    if (Array.isArray(raw)) {
        raw.forEach((e, i) => {
            raw[i] = render(e, option)
        })
    } else {
        Object.keys(raw).forEach(field => {
            if (typeof raw[field] === 'object')
                raw[field] = render(raw[field], option)
            else {
                if (option.field[field]) { //Tìm trong option xem có target của field này không.
                    let fieldTarget = option.field[field]
                    if (view[fieldTarget] !== undefined) {
                        let buf = view[fieldTarget].getById(raw[field]) || {}
                        Object.keys(buf).forEach(oldKey => {
                            let newKey = `${field}${oldKey.charAt(0).toLocaleUpperCase()}${oldKey.slice(1)}`
                            delete Object.assign(buf, {
                                [newKey]: buf[oldKey]
                            })[oldKey]
                        })
                        Object.assign(raw, buf)
                    }
                } else {
                    if (view[field]) //ưu tiên các trường cũ hơn
                        raw = Object.assign({}, view[field].getById(raw[field]) || {}, raw)
                    if ((field == 'createDate' || field === 'verifyDate' || field === 'timeout')) {
                        if (raw[field].length > 10) {
                            raw[field] = raw[field].replace('T', ' ').slice(0, -5)
                        }
                    }
                }
            }
        })
    }
    return raw
}


module.exports = render