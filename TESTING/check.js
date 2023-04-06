module.exports = {
    schema: {
        title: 'Kiểm tra mô hình',
        fn: (res) => {
            res.body.should.be.a('object')
            res.body.should.have.property('meta')
            res.body.should.have.property('data')
            res.body.meta.should.have.property('messages')
        }
    },
    success: {
        title: 'Kiểm tra success',
        fn: (res) => {
            res.body.meta.success.should.have.eql(true)
        }
    },
    messageFaile: {
        title: 'Kiểm tra mô hình của lỗi trả về',
        fn: (res) => {
            if (res.body.meta.success == false) {
                res.body.meta.messages.should.have.property('number')
                res.body.meta.messages.should.have.property('message')
                res.body.meta.messages.message.should.be.a('string')
            }

        }
    },
    status: {
        title: 'Kiểm tra mã trạng thái',
        fn: (res) => {
            res.should.have.status(200)
        }
    }

}