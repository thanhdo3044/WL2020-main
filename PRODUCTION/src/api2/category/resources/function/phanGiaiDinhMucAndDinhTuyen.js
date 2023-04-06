let bom = []
let routing = []
let code = 0
let po = []
let os = []
const {
  v4: uuidv4
} = require('uuid')

function getStepsByItem (stepId, itemId) {
  console.log(stepId)
  const steps = [
    ...routing
      .filter((i) => i.itemId === itemId)
      .sort((a, b) => {
        return b.order - a.order
      })
  ]
  console.log(steps)
  const step = steps.find((i) => i.stepId === stepId)
  console.log(step)
  if (step) {
    const order = step.order
    let length = 0
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].order > order) {
        length++
      }
    }
    for (let i = 0; i < length; i++) {
      steps.shift()
    }
  } else {
    steps.shift()
  }
  return steps
}

function calculate (stepId, itemId, quantity, parent) {
  // lấy các công đoạn mà sản phẩm sẽ phải đi qua
  const steps = getStepsByItem(stepId, itemId)
  console.log(steps)

  if (steps[0]) {
    const found = os.find(
      (o) => o.itemId === itemId && o.stepId === steps[0].stepId
    )
    const keHoach = quantity
    let ton = 0
    if (found) {
      quantity -= found.tonDauKy
      ton = found.tonDauKy
    }

    const po1 = po.filter((po) => po.stepId === steps[0].stepId)

    const thoiGianBatDau = po1.reduce(function (accumulator, po) {
      return accumulator + po.ngayLamViec
    }, 0)

    const findPo = po.find(
      (o) => o.itemId === itemId && o.stepId === steps[0].stepId
    )
    if (findPo) {
      findPo.quantity += quantity < 0 ? 0 : quantity
      findPo.keHoach += keHoach
      findPo.ton += ton
    } else {
      code = uuidv4()
      po.push({
        code,
        parent,
        stepId: steps[0].stepId,
        itemId,
        ton,
        quantity: quantity < 0 ? 0 : quantity,
        keHoach,
        caLamViec: steps[0].caLamViec,
        thoiGianThucHien: steps[0].thoiGianThucHien,
        thoiGianCanSanXuat: quantity < 0 ? 0 : quantity * steps[0].thoiGianThucHien,
        ngayLamViec: quantity < 0
          ? 0 : (quantity * steps[0].thoiGianThucHien) /
                    (60 * 60 * 8 * steps[0].caLamViec),
        thoiGianBatDau,
        thoiGianCho: 0
      })
    }
    if (quantity <= 0) return
  }

  if (steps.length > 1) {
    calculate(steps[1].stepId, itemId, quantity, code)
  } else {
    bom.filter((i) => i.itemId === itemId)
      .forEach((e) => {
        calculate(null, e.materialsId, quantity * e.rate, code)
      })
  }
}

function getProductionOrders (stepId, itemId, quantity) {
  calculate(stepId, itemId, quantity, 0)
  return po
}

module.exports = function (b, r, o, c) {
  bom = b
  routing = r
  os = o
  code = c
  po = [] // set lai po
  return getProductionOrders
}
