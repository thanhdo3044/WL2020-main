export function SELECT_PROJECT (state,project) {
    state.projectSelected = project
}
export function LOAD_ITEMS(state,items){
    state.items = items
}
//chon bien ban
export function SELECT_ACCEPT(state,accept){
    state.acceptSelected = accept
}

//chọn biên bản xuất kho
export function SELECT_GOOD_ISSUE(state,goodIssue) {
    state.goodIssueSelected = goodIssue
}