import { AXC_ID } from './known_assets'

export const AXC_PRICE_ID = process.env.VUE_APP_AXC_PRICE_ID as string
export const VS_CURRENCIES = process.env.VUE_APP_VS_CURRENCIES as string

interface PricesDict {
    [key: string]: string
}

const dict: PricesDict = {}

dict[AXC_ID] = AXC_PRICE_ID

export default dict
