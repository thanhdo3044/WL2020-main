/*
Tính ra được kế hoạch sản xuất phụ thuộc: 
Định mức
Định tuyến
Tồn kho
Gối thêm hàng

*/

const bomsDefault = [{
    parent : new Number(),
    child : new Number(),
    rate : new Number()
}]

const routingsDefault = [{
    itemId : new Number(),
    stepId : new Number(),
    order : new Number()
}]

const inventorysDefault = [{
    itemId : new Number(),
    stepId : new Number(),
    remain : new Number()
}]

const quantityMoreDefault = [{
    itemId : new Number(),
    stepId : new Number(),
    quantity : new Number()
}]

class Plan {
    constructor(boms = bomsDefault, routings = routingsDefault, inventorys = inventorysDefault){
        this.boms = boms
        this.routings = routings
        this.inventorys = inventorys
    }
    getPlan(quantityMore = quantityMoreDefault, itemId = new Number(),quantity = new Number()){
        return [{
            itemId : new Number(),
            stepId : new Number(),
            quantity : new Number()
        }]
    }
}

Plan.prototype.getPlan = function(quantityMore = quantityMoreDefault,itemId,quantity){
    let plan = []
    addPlanForItem(this.boms,this.routings,this.inventorys,quantityMore,plan,itemId,quantity)
    return plan
}

function addPlanForItem(boms = [], routings = [], inventorys = [], quantityMores = [], plan = [], itemId = new Number(), quantity = new Number()) {
    /*
        Tìm tuyến đường của item đó
        Tính toán số lượng cần sản xuất của từng bước
        Kiểm tra xem item đó có child không, nếu có thì đệ quy lại
    */

    // Tìm tuyến đường của item
    let item = {
        id: itemId,
        routing: [],
        bom: [],
        quantityStepLast: new Number()
    }
    item.routing = routings.filter(i => i.itemId == itemId)
    if (item.routing.length == 0) { // Kiểm tra xem item đó đã được định tuyến chưa
        return console.error(`Item : ${itemId} chưa được định tuyến`)
    }
    // Sắp xếp lớn đến bé theo order
    item.routing.sort((a, b) => b.order - a.order)

    for (let i = 0; i < item.routing.length; i++) {
        // Tìm ra số lượng mục tiêu (số lượng ban đầu hoặc số lượng của công đoạn trước đó)
        let targetBuf = plan.find(e => e.itemId == item.id && e.stepId == item.routing[i - 1].stepId)
        let target = targetBuf !== undefined ? targetBuf.quantity : quantity // Nếu là order đầu tiên thì sẽ lấy luôn giá tự quantity từ param, không thì lấy giá trị của step trước đó làm mục tiêu
        // Tìm tồn của item này ở công đoạn này
        let inventoryBuf = inventorys.find(e => e.itemId == item.id && e.stepId == item.routing[i].stepId)
        let inventory = inventoryBuf !== undefined ? inventoryBuf.remain : 0
        // Tìm xem có thêm số lượng ngoài ở công đoạn này không
        let quantityMoreBuf = quantityMores.find(e => e.itemId == item.id && e.stepId == item.routing[i].stepId)
        let quantityMore = quantityMoreBuf !== undefined ? quantityMoreBuf.quantity : 0

        plan.push({
            itemId: item.id,
            stepId: item.routing[i].stepId,
            quantity: target + quantityMore - inventory // Mục tiêu +  thêm  -  tồn
        })
    }

    // Tìm bom của item đó
    item.bom = boms.filter(i => i.parent == item.id)
    if (item.bom.length > 0) {
        item.quantityStepLast = plan.find(i => i.itemId == item.id && i.stepId == item.routing[item.routing.length - 1].stepId).quantity
        for (let i = 0; i < item.bom.length; i++) {
            addPlanForItem(boms, routings, inventorys, quantityMores, plan, item.bom[i].child, item.quantityStepLast * item.bom[i].rate)
        }
    }
}

module.exports = Plan







/*
// example
const bom = [{
        parent: 1,
        child: 11,
        rate: 1
    },
    {
        parent: 1,
        child: 12,
        rate: 3
    }, {
        parent: 12,
        child: 121,
        rate: 2
    }, {
        parent: 2,
        child: 21,
        rate: 3
    },
    {
        parent: 2,
        child: 22,
        rate: 4
    }
]

const inventory = [{
    itemId: 1,
    stepId: 3,
    remain: 10,
}, {
    itemId: 2,
    stepId: 3,
    remain: 10,
}, {
    itemId: 11,
    stepId: 3,
    remain: 10,
}, {
    itemId: 11,
    stepId: 2,
    remain: 10,
}, {
    itemId: 11,
    stepId: 1,
    remain: 10,
}, {
    itemId: 12,
    stepId: 3,
    remain: 10
}, {
    itemId: 12,
    stepId: 2,
    remain: 10,
}, {
    itemId: 12,
    stepId: 1,
    remain: 10,
}, {
    itemId: 21,
    stepId: 1,
    remain: 10,
}, {
    itemId: 21,
    stepId: 2,
    remain: 10,
}, {
    itemId: 12,
    stepId: 1,
    remain: 10,
}, {
    itemId: 22,
    stepId: 1,
    remain: 10,
}, {
    itemId: 22,
    stepId: 2,
    remain: 10,
}, {
    itemId: 22,
    stepId: 3,
    remain: 10,
}, {
    itemId: 21,
    stepId: 3,
    remain: 10,
}]

const routing = [{
    itemId : 1,
    stepId : 3,
    order :1
}, {
    itemId: 2,
    stepId: 3,
    order: 1
}, {
    itemId: 11,
    stepId: 3,
    order: 3
}, {
    itemId: 11,
    stepId: 2,
    order: 2
}, {
    itemId: 11,
    stepId: 1,
    order: 1
}, {
    itemId: 12,
    stepId: 3,
    order: 3
}, {
    itemId: 12,
    stepId: 2,
    order: 2
}, {
    itemId: 12,
    stepId: 1,
    order: 1
}, {
    itemId: 21,
    stepId: 3,
    order: 3
}, {
    itemId: 21,
    stepId: 2,
    order: 2
}, {
    itemId: 21,
    stepId: 1,
    order: 1
}, {
    itemId: 22,
    stepId: 3,
    order: 3
}, {
    itemId: 22,
    stepId: 2,
    order: 2
}, {
    itemId: 22,
    stepId: 1,
    order: 1
}, {
    itemId: 121,
    stepId: 3,
    order: 2
}, {
    itemId: 121,
    stepId: 2,
    order: 1
}]

let quantityPlus = [{
    itemId: 11,
    stepId: 3,
    quantity: 50
}, {
    itemId: 12,
    stepId: 2,
    quantity: 50
}]

//example
const plan = new Plan(bom,routing,inventory)

const planOfItem = plan.getPlan(quantityPlus,1,100)
console.table(planOfItem)
*/