export function SELECT_INVENTORY_QC(state, inv) {
    state.inventoryQCSelected = inv;
}
export function setSanLuongs(state, payload) {
    state.sanLuongs = payload;
}
export function FETCH_SOLUTION_QC(state, solutions) {
    state.solutions = solutions;
}

export function FETCH_PACKAGE_TYPE(state, packageTypess) {
    state.packageTypes = packageTypess;
    const palletTypes = packageTypess.filter(obj => {
        return obj.typeId === 100001;
    });
    const palletTypeInOut = packageTypess.filter(obj => {
        return obj.typeId === 100002;
    });
    const defects = packageTypess;
    state.defects = defects;
    state.typePalletInOutdoors = palletTypeInOut;
    state.palletTypes = palletTypes;
}
export function FETCH_INVENTORY_QC(state, invents) {
    state.inventoryQCs = invents;
}
export function setPos(state, payload) {
    state.pos = payload;
}
