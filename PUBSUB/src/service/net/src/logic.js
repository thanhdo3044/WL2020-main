module.exports = {
    decode(data) {
        try {
            return {
                header: data[1] * 255 + data[2],
                body: JSON.parse(data.slice(3))
            }
        } catch (error) {
            console.log('JSON.parcel không thành công')
            return
        }
    },
    encode(option) {
        let command = Buffer.from([1])
        let header = Buffer.from([parseInt(option.header / 255), option.header % 255])
        let body = Buffer.from(option.body)
        return Buffer.concat([command, header, body])
    }
}