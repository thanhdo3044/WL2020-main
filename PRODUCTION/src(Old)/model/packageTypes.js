const orm = require('./orm')

const packageType = {
    id: 'ID',
    code: 'CODE',
    name: 'NAME',
    typeId : 'TYPE_ID',
    active : 'ACTIVE',
    description : 'DESCRIPTION',
    imagesUrl : 'IMAGES_URL'
}
const packageTypes = orm.create(packageType, '[PACKAGE_TYPE]')
module.exports = packageTypes