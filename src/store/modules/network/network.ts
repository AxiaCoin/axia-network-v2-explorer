import { Module } from 'vuex'
import { IRootState } from '@/store/types'
import { INetworkState } from '@/store/modules/network/types'
import { axia } from '@/axia'
import Network from '@/js/Network'
import axios from '@/axios'

export const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '1'
)
export const DEFAULT_NETWORK_NAME =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_NETWORKNAME as string)
        : (process.env.VUE_APP_TEST_NETWORKNAME as string)

// Mainnet
const networkName = process.env.VUE_APP_NETWORKNAME
const explorerFEUrl = process.env.VUE_APP_EXPLORER_FE_URL || ''
const orteliusURL = process.env.VUE_APP_ORTELIUS_URL || ''
export const ethereumAPI = process.env.VUE_APP_AXIA_GO_ETH_URL || ''
export const peerInfoURL = process.env.VUE_APP_PEER_INFO_URL || ''
const axiaJSProtocol = process.env.VUE_APP_AXIA_JS_PROTOCOL || ''
const axiaJSIP = process.env.VUE_APP_AXIA_JS_IP || ''
const axiaJSPort = parseInt(process.env.VUE_APP_AXIA_JS_PORT || '443')
const axiaJSNetworkID = parseInt(process.env.VUE_APP_AXIA_JS_NETWORKID || '1')
const axiaJSChainID = process.env.VUE_APP_AXIA_JS_CHAINID || 'X'
export const cChainExplorerURL = process.env.VUE_APP_CCHAIN_EXPLORER_URL || ''
export const statusURL = process.env.VUE_APP_STATUS_URL || ''

// Testnet
const networkName_test = process.env.VUE_APP_TEST_NETWORKNAME || ''
const explorerFEUrl_test = process.env.VUE_APP_TEST_EXPLORER_FE_URL || ''
const orteliusURL_test = process.env.VUE_APP_TEST_ORTELIUS_URL || ''
export const ethereumAPI_test = process.env.VUE_APP_TEST_AXIA_GO_ETH_URL || ''
export const peerInfoURL_test = process.env.VUE_APP_TEST_PEER_INFO_URL || ''
const axiaJSProtocol_test = process.env.VUE_APP_TEST_AXIA_JS_PROTOCOL || ''
const axiaJSIP_test = process.env.VUE_APP_TEST_AXIA_JS_IP || ''
const axiaJSPort_test = parseInt(process.env.VUE_APP_TEST_AXIA_JS_PORT || '443')
const axiaJSNetworkID_test = parseInt(
    process.env.VUE_APP_TEST_AXIA_JS_NETWORKID || '5'
)
const axiaJSChainID_test = process.env.VUE_APP_TEST_AXIA_JS_CHAINID || ''
export const cChainExplorerURL_test =
    process.env.VUE_APP_TEST_CCHAIN_EXPLORER_URL || ''
export const statusURL_test = process.env.VUE_APP_TEST_STATUS_URL || ''

const network_module: Module<INetworkState, IRootState> = {
    namespaced: true,
    state: {
        status: 'disconnected', // disconnected | connecting | connected
        networks: [],
        selectedNetwork: null,
    },
    mutations: {
        addNetwork(state, net: Network) {
            state.networks.push(net)
        },
    },
    actions: {
        async init({ state, commit, dispatch }) {
            const mainnet = new Network(
                `${networkName} Mainnet`,
                `${axiaJSProtocol}://${axiaJSIP}:${axiaJSPort}`,
                axiaJSNetworkID,
                axiaJSChainID,
                orteliusURL,
                explorerFEUrl
            )
            const testnet = new Network(
                `${networkName_test} Testnet`,
                `${axiaJSProtocol_test}://${axiaJSIP_test}:${axiaJSPort_test}`,
                axiaJSNetworkID_test,
                axiaJSChainID_test,
                orteliusURL_test,
                explorerFEUrl_test
            )

            await commit('addNetwork', mainnet)
            await commit('addNetwork', testnet)

            // initialize selected network
            try {
                const defaultNetwork = state.networks.find(
                    (network: Network) =>
                        network.networkId === DEFAULT_NETWORK_ID
                )
                await dispatch('setNetwork', defaultNetwork)
                return true
            } catch (e) {
                console.log(e)
                state.status = 'disconnected'
            }
        },
        async setNetwork({ state }, net: Network): Promise<boolean> {
            // Query the network to get network id
            state.status = 'connecting'
            axia.setAddress(net.ip, net.port, net.protocol)
            axia.setNetworkID(net.networkId)
            axia.XChain().refreshBlockchainID()

            state.selectedNetwork = net
            axios.defaults.baseURL = net.explorerUrl

            state.status = 'connected'
            return true
        },
    },
}

export default network_module
