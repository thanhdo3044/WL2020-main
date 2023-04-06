const {
  khdh,
  dinhMuc,
  dinhTuyen,
  oscp
} = require('./data')

const {
  setDinhMuc,
  setDinhTuyen,
  tinh,
  getKetQua
} = require('./tinhTheoDinhMucVaDinhTuyen')

setDinhMuc(dinhMuc)
setDinhTuyen(dinhTuyen)
tinh(khdh.congDoan, khdh.sanPham, khdh.soLuong, 0)
console.log('Tính KH dựa trên định mức và định tuyến')
console.table(getKetQua())

const kh = getKetQua()

function tinhThoiGianCanHoanThanh (kh, oscp) {
  kh.forEach((e, i) => {
    const nangLucSanXuat = oscp.find(x => x.congDoan == e.congDoan && x.sanPham == e.sanPham)
    kh[i].ca = Math.ceil(e.soLuong / nangLucSanXuat.soLuong)
  })
  return kh
}
console.log('Tính ra số ca cần hoàn thành')
tinhThoiGianCanHoanThanh(kh, oscp)
console.table(kh)

// 2ca = 1 ngay

function createTime () {
  const time = []
  const firtDate = new Date('2020-03-31')
  let buf = firtDate
  for (let i = 0; i < 10; i++) {
    time.push({
      index: i * 2,
      date: buf.toLocaleDateString(),
      ca: 2
    })
    time.push({
      index: i * 2 + 1,
      date: buf.toLocaleDateString(),
      ca: 1
    })
    buf = prevDate(buf)
  }
  return time
}

const time = createTime()
// console.table(time)

function phanGiaiCa () {
  kh.forEach((e, i) => {
    const ca = e.ca
    const nangLucSanXuat = oscp.find(x => x.congDoan == e.congDoan && x.sanPham == e.sanPham)
    for (let i = 1; i < ca; i++) {
      const quantity = nangLucSanXuat.soLuong
      kh.push({
        id: `${e.id}.${i}`,
        parentId: i == 1 ? e.id : `${e.id}.${i - 1}`,
        congDoan: e.congDoan,
        sanPham: e.sanPham,
        soLuong: quantity,
        ca: 1
      })
      e.ca = e.ca - 1
      e.soLuong = e.soLuong - quantity
    }
  })
}
// Phân giải ca
phanGiaiCa()
console.log('Phân giải ca')
console.table(kh)

function tinhCa2 (id, index) {
  if (kh.find(i => i.id == id).ca > 1) {

  }
  kh.find(i => i.id == id).time = index

  kh.filter(i => i.parentId == id).forEach(e => {
    tinhCa2(e.id, index + 1)
  })
}

tinhCa2(1, 0)
// console.table(kh)

function ghepThoiGian () {
  kh.forEach(e => {
    const t = time.find(i => i.index == e.time)
    e.date = t.date
    e.calv = t.ca
  })
}
console.log('Áp thời gian')
ghepThoiGian()
console.table(kh)

// console.log(khdh)
// console.table(dinhMuc)
// console.table(dinhTuyen)
// console.table(oscp)

// Lấy ra số ngày trước đó
function prevDate (ngay, i) {
  const date = new Date(ngay)
  date.setDate(date.getDate() - (i || 1))
  return date
}
