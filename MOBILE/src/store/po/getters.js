export function pos(state) {
  return state.pos;
}

export function tasksTodo(state) {
  return state.pos.filter(po => !po.taoPhoi);
}

export function tasksCompleted(state) {
  return state.pos.filter(po => po.taoPhoi && !po.capPhoi);
}

export function yeuCauDuyetPhoi(state) {
  return state.pos.filter(po => po.taoPhoi && !po.capPhoi);
}

export function phoiDaDuyet(state) {
  return state.pos.filter(po => po.capPhoi);
}

export const getPoByItemId = state => itemId => {
  if (itemId) return state.pos.filter(po => po.itemId == itemId);
  return [];
};
