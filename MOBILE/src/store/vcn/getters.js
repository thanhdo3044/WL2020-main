export const pos = state => searchQuery => {
    if (searchQuery)
        return state.pos.filter(p => [p.itemName.toLowerCase(), p.itemHeight, p.itemWidth, p.itemLength, p.root]
            .join("")
            .includes(searchQuery.toLowerCase())
        );
    return state.pos;
};
export const sanLuongs = state => s => {
    if (!s) return state.sanLuongs;
    return state.sanLuongs.filter(po => [
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
};
export const lenhSanXuats = state => {
    return state.sanLuongs
        .map(sl => sl.number)
        .reduce((unique, item) => {
            return unique.includes(item) ? unique : [...unique, item];
        }, []);
};