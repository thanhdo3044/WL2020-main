var PROTO_PATH = __dirname + '/../../../proto/base.proto'

const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})
const protocol = grpc.loadPackageDefinition(packageDefinition).protocol

const {
    host,
    port
} = require('./../core/config').rpc.service.base

const Items = new protocol.Item(`${host}:${port}`, grpc.credentials.createInsecure())

const Accounts = new protocol.Account(`${host}:${port}`, grpc.credentials.createInsecure())
const Vendors = new protocol.Vendor(`${host}:${port}`, grpc.credentials.createInsecure())
const Customers = new protocol.Customer(`${host}:${port}`, grpc.credentials.createInsecure())

const Steps  = new protocol.Step(`${host}:${port}`, grpc.credentials.createInsecure())

const Departments = new protocol.Department(`${host}:${port}`, grpc.credentials.createInsecure())
const Xuongs = new protocol.Xuong(`${host}:${port}`, grpc.credentials.createInsecure())
const Factorys = new protocol.Factory(`${host}:${port}`, grpc.credentials.createInsecure())
const Markets = new protocol.Market(`${host}:${port}`, grpc.credentials.createInsecure())

module.exports = {
    Items,
    Accounts,
    Customers,
    Vendors,
    Steps,
    Departments,
    Xuongs,
    Factorys,
    Markets
}