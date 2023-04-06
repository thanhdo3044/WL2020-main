export function lenhSanXuats(state) {
  return state.lenhSanXuats.map((lenhSanXuat, id) => ({ ...lenhSanXuat, id }));
}
export function keHoachSanXuats(state) {
  return state.keHoachSanXuats;
}
