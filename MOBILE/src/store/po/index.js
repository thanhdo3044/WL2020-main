import state from "./state";
import * as mutations from "./mutations";
import * as actions from "./actions";

const getters = {
    pos: state => {
        return state.pos;
    },

    posByItemIdAndMarket: state => (itemId, market) =>
        state.pos.filter(p => p.itemId == itemId && p.market == market),

    posG: state => (searchQuery, gop = true) => {
        const map = new Map();
        state.pos.forEach(obj => {
            const {
                code,
                market,
                VItemInPackages,
                itemId,
                keHoach,
                hanMucTon,
                soLuongUuTien,
                ys1a,
                ys1b,
                tb,
                th,
                loiCongDon,
                ton,
                xuatTon
            } = obj;
            const conTon = ton - xuatTon;
            const daThucHien = VItemInPackages.reduce(function(
                    accumulator, { quantity }
                ) {
                    return accumulator + quantity;
                },
                0);
            const thuanHung =
                keHoach +
                hanMucTon -
                ys1a -
                ys1b -
                tb -
                th -
                soLuongUuTien +
                loiCongDon;
            let conThucHien =
                keHoach +
                hanMucTon -
                ys1a -
                ys1b -
                tb -
                th -
                soLuongUuTien +
                loiCongDon -
                daThucHien;
            if (conThucHien < 0) conThucHien = 0;
            if (map.has(itemId + market)) {
                // map.set(itemId, { ...obj, daThucHien });
                if (gop) {
                    const po = map.get(itemId + market);
                    // console.log('map-po')
                    // console.log(po)
                    map.set(itemId + market, {
                        ...po,
                        daThucHien: po.daThucHien + daThucHien,
                        thuanHung: po.thuanHung + thuanHung,
                        conThucHien: po.conThucHien + conThucHien,
                        loiCongDon: po.loiCongDon + loiCongDon,
                        hanMucTon: po.hanMucTon + hanMucTon,
                        soLuongUuTien: po.soLuongUuTien + soLuongUuTien,
                        ys1a: po.ys1a + ys1a,
                        ys1b: po.ys1b + ys1b,
                        tb: po.tb + tb,
                        th: po.th + th,
                        ton: po.ton + ton,
                        conTon: po.conTon + conTon,
                        xuatTon: po.xuatTon + xuatTon,
                        keHoach: po.keHoach + keHoach,
                        VItemInPackages: [...po.VItemInPackages, ...VItemInPackages]
                    });
                }
            } else {
                if (gop || parseFloat((conThucHien + conTon).toFixed(6)) > 0)
                    map.set(gop ? itemId + market : code, {
                        ...obj,
                        daThucHien,
                        thuanHung,
                        conThucHien,
                        loiCongDon,
                        conTon
                    });
            }
        });
        if (searchQuery)
            return [...map.values()].filter(p => [p.Item.name.toLowerCase(), p.Item.height, p.Item.width, p.Item.length]
                .join("")
                .includes(searchQuery.toLowerCase())
            );
        return [...map.values()].filter(x => x.conThucHien > 0 || x.conTon > 0);
    },
    tasksTodo: state => {
        return state.pos.filter(po => !po.taoPhoi);
    },
    tasksCompleted: state => {
        return state.pos.filter(po => po.taoPhoi && !po.capPhoi);
    },
    yeuCauDuyetPhoi: state => {
        return state.pos.filter(po => po.taoPhoi && !po.capPhoi);
    },
    phoiDaDuyet: state => {
        return state.pos.filter(po => po.capPhoi);
    },
    getStepsByNumber: state => tenlsx => {
        if (!tenlsx) return [];
        return state.numbers
            .filter(po => po.number === tenlsx)
            .map(s => ({
                label: s.name,
                value: s.stepId
            }));
    },
    numbers: state => {
        if (!state.numbers.length) return [];
        return state.numbers
            .map(n => n.number)
            .reduce((unique, item) => {
                return unique.includes(item) ? unique : [...unique, item];
            }, []);
    },
    stepIds: state => {
        if (!state.numbers.length) return [];
        const set = new Set([
            ...state.numbers.map(n => ({ value: n.stepId, label: n.name }))
        ]);
        return [...set];
    },
    getAllCongDoan: () => {
        return [{
                label: "Lựa phôi - X3",
                value: "100274"
            },
            {
                label: "Lựa phôi - X1",
                value: "100264"
            }
        ];
    },
    getPoByItemId: state => itemId => {
        if (itemId) {
            const myPos = state.pos.filter(
                po =>
                po.itemId == itemId &&
                po.keHoach +
                po.hanMucTon +
                po.loiCongDon -
                po.VItemInPackages.reduce((n, c) => {
                    return c.quantity + n;
                }, 0) >
                0
            );
            if (myPos.length > 0) return myPos;
        }

        return [];
    },
    timLenhSanXuat: state => s => {
        if (!s)
            return state.pos.filter(
                p =>
                p.keHoach -
                p.ton -
                p.VItemInPackages.reduce((n, c) => {
                    return c.quantity + n;
                }, 0)
            );
        return state.pos.filter(po => [
                po.Item.code,
                po.Item.name,
                po.Item.length,
                po.Item.width,
                po.Item.height,
                po.number
            ]
            .join(" ")
            .toLowerCase()
            .includes(s.toLowerCase())
        );
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};