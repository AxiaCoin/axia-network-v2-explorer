const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

export const AXC_ID =
    DEFAULT_NETWORK_ID === 1
        ? (process.env.VUE_APP_AXCID as string)
        : (process.env.VUE_APP_TEST_AXCID as string)

export const BAGUETTE_ID =
    DEFAULT_NETWORK_ID === 1
        ? 'F4MyJcUvq3Rxbqgd4Zs8sUpvwLHApyrp4yxJXe2bAV86Vvp38'
        : undefined

interface AssetDict {
    [key: string]: {
        logo: string
    }
}

const dict: AssetDict = {}

dict[AXC_ID] = {
    logo: 'img/axc_icon_circle.png',
}

if (BAGUETTE_ID) {
    dict[BAGUETTE_ID] = {
        logo: 'img/baguette_icon_circle.jpg',
    }
}

export default dict
