const si = require('systeminformation');

// // promises style - new since version 3
// si.cpu()
//     .then(data => console.log(data))
//     .catch(error => console.error(error));
// console.log(si.version())
// console.log(si.time())
// si.versions().then(data=> console.log(data))
//si.system((data)=>console.log(data))
// si.cpuCurrentspeed(data =>console.log(data))
// si.cpuFlags(data => console.log(data))
// si.cpuCache(data=> console.log(data))
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
// si.mem(data =>  Object.keys(data).forEach(key=>{
//     console.log(key,bytesToSize(data[key]))
// }))
// si.currentLoad(data => {
//     delete data.cpus
//     Object.keys(data).forEach(key => {
//         console.log(key, bytesToSize(data[key]))
//     })

// })
// si.processes(data=> {
//     // data.list.sort((a,b)=> a.pid - b.pid)
//     // data.list.length = 3
//     console.log(data.list.find(i=>i.pid == 3712))
// })

// si.fullLoad(data=> console.log(data))
si.diskLayout(data=> console.log(data))