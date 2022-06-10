import * as axiaJS from '@zee-ava/avajs'

const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

let PROTOCOL = ''
let IP = ''
let PORT = 80
let NETWORK_ID = 0
let CHAIN_ID = 'X'

if (DEFAULT_NETWORK_ID === 1) {
    PROTOCOL = process.env.VUE_APP_AXIA_JS_PROTOCOL as string
    IP = process.env.VUE_APP_AXIA_JS_IP as string
    PORT = parseInt(process.env.VUE_APP_AXIA_JS_PORT as string)
    NETWORK_ID = parseInt(process.env.VUE_APP_AXIA_JS_NETWORKID as string)
    CHAIN_ID = process.env.VUE_APP_AXIA_JS_CHAINID as string
} else {
    PROTOCOL = process.env.VUE_APP_TEST_AXIA_JS_PROTOCOL as string
    IP = process.env.VUE_APP_TEST_AXIA_JS_IP as string
    PORT = parseInt(process.env.VUE_APP_TEST_AXIA_JS_PORT as string)
    NETWORK_ID = parseInt(process.env.VUE_APP_TEST_AXIA_JS_NETWORKID as string)
    CHAIN_ID = process.env.VUE_APP_TEST_AXIA_JS_CHAINID as string
}

const axia = new axiaJS.Axia(IP, PORT, PROTOCOL, NETWORK_ID, CHAIN_ID)
const avm = axia.XChain()
const platform = axia.PChain()

export { axia, avm, platform }
