import {isObjectEmpty} from '../utils/utils'
export default ({ Vue }) => {
    Vue.prototype.$isObjectEmpty = isObjectEmpty
}