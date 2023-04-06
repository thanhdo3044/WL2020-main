let dinhMuc = []
let dinhTuyen = []

function getCongDoanDiQua (congDoan, sanPham, dinhTuyen) {
  // copy va sap xep
  const congDoanDiQua = [...dinhTuyen
    .filter(i => i.sanPham === sanPham)
    .sort((a, b) => {
      return b.buoc - a.buoc
    })
  ]
  // lay nhung cong doan can di qua
  if (congDoan != null && congDoan !== undefined) {
    const buoc = congDoanDiQua.find(i => i.congDoan === congDoan).buoc
    let length = 0
    for (let i = 0; i < congDoanDiQua.length; i++) {
      if (congDoanDiQua[i].buoc > buoc) {
        length++
      }
    }
    for (let i = 0; i < length; i++) {
      congDoanDiQua.shift()
    }
  } else {
    congDoanDiQua.shift()
  }
  return congDoanDiQua
}

let id = 0
const kq = []

function tinh (congDoan, sanPham, soLuong, parentId) {
  // tinh cho chinh san pham do
  const congDoanDiQua = getCongDoanDiQua(congDoan, sanPham, dinhTuyen)
  // let soLuongByOSCP = getSoLuongByOSCP(soLuong, congDoanDiQua[0].congDoan, sanPham, oscp)
  if (congDoanDiQua[0]) {
    id++
    kq.push({
      id: id,
      parentId: parentId,
      congDoan: congDoanDiQua[0].congDoan,
      sanPham: sanPham,
      soLuong: soLuong
    })
  }
  const current = kq.find(i => i.id === id)
  if (congDoanDiQua.length > 1) {
    tinh(congDoanDiQua[1].congDoan, sanPham, current.soLuong, current.id)
  } else {
    dinhMuc.filter(i => i.sanPham === sanPham).forEach((e, i) => {
      tinh(null, e.phoi, current.soLuong * e.tyLe, current.id)
    })
  }
}

function setDinhMuc (dm) {
  dinhMuc = dm
  return 1
}

function setDinhTuyen (dt) {
  dinhTuyen = dt
  return 1
}

function getKetQua () {
  return kq
}

module.exports = {
  tinh,
  setDinhMuc,
  setDinhTuyen,
  getKetQua
}
