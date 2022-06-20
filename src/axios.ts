import axios from 'axios'

const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

const MAGELLAN_URL =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_MAGELLAN_URL as string)
        : (process.env.VUE_APP_TEST_MAGELLAN_URL as string)

export default axios.create({
    baseURL: MAGELLAN_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})
