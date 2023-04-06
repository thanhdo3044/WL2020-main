let khdh = {
    ngay: new Date('2020-03-31'),
    stepId : 'Dong goi',
    itemId: 'San pham A',
    quantity: 200
}

let bom = [{
        itemId: 'San pham A',
        materialsId: 'Cum B1',
        rate: 2
    },
    {
        itemId: 'San pham A',
        materialsId: 'Cum B2',
        rate: 1
    }, {
        itemId: 'Cum B1',
        materialsId: 'Chi tiet C1',
        rate: 2
    },
    {
        itemId: 'Cum B1',
        materialsId: 'Chi tiet C2',
        rate: 1
    },
    {
        itemId: 'Cum B2',
        materialsId: 'Chi tiet C3',
        rate: 1
    },
]

let routing = [
    // {
    //     itemId: 'San pham A',
    //     stepId: 'Hoan thien',
    //     order: 1
    // },
    {
        itemId: 'San pham A',
        stepId: 'Dong goi',
        order: 2
    }, {
        itemId: 'San pham A',
        stepId: 'Kho thanh pham',
        order: 3
    },
    {
        itemId: 'Cum B1',
        stepId: 'Hoan thien',
        order: 1
    },
    {
        itemId: 'Cum B1',
        stepId: 'Dong goi',
        order: 2
    },
    {
        itemId: 'Cum B2',
        stepId: 'Hoan thien',
        order: 1
    },
    {
        itemId: 'Cum B2',
        stepId: 'Dong goi',
        order: 2
    },
    {
        itemId: 'Chi tiet C1',
        stepId: 'So che',
        order: 1
    },
    {
        itemId: 'Chi tiet C1',
        stepId: 'Tinh che',
        order: 2
    },
    {
        itemId: 'Chi tiet C1',
        stepId: 'Hoan thien',
        order: 3
    },
    {
        itemId: 'Chi tiet C2',
        stepId: 'So che',
        order: 1
    },
    {
        itemId: 'Chi tiet C2',
        stepId: 'Tinh che',
        order: 2
    },
    {
        itemId: 'Chi tiet C2',
        stepId: 'Hoan thien',
        order: 3
    },
    {
        itemId: 'Chi tiet C3',
        stepId: 'So che',
        order: 1
    },
    {
        itemId: 'Chi tiet C3',
        stepId: 'Tinh che',
        order: 2
    },
    {
        itemId: 'Chi tiet C3',
        stepId: 'Hoan thien',
        order: 3
    },
]

let oscp = [{
        stepId: 'Dong goi',
        itemId: 'San pham A',
        time: '1',
        quantity: 200
    },
    {
        stepId: 'Hoan thien',
        itemId: 'San pham A',
        time: '1',
        quantity: 200
    },
    {
        stepId: 'Hoan thien',
        itemId: 'Cum B1',
        time: '1',
        quantity: 400
    },
    {
        stepId: 'Hoan thien',
        itemId: 'Cum B2',
        time: '1',
        quantity: 200
    },
    {
        stepId: 'Tinh che',
        itemId: 'Chi tiet C1',
        time: '1',
        quantity: 800
    },
    {
        stepId: 'Tinh che',
        itemId: 'Chi tiet C2',
        time: '1',
        quantity: 400
    },
    {
        stepId: 'Tinh che',
        itemId: 'Chi tiet C3',
        time: '1',
        quantity: 200
    },
    {
        stepId: 'So che',
        itemId: 'Chi tiet C1',
        time: '1',
        quantity: 800
    },
    {
        stepId: 'So che',
        itemId: 'Chi tiet C2',
        time: '1',
        quantity: 400
    },
    {
        stepId: 'So che',
        itemId: 'Chi tiet C3',
        time: '1',
        quantity: 200
    },
]

module.exports = {
    khdh,
    bom,
    routing,
    oscp
}