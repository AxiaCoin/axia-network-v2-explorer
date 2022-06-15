import api from '@/axios'
import { resolveResponseData } from '@/services/helpers'

const EVM_BLOCKS_API_BASE_URL = process.env
    .VUE_APP_EVM_BLOCKS_V2_API_BASE_URL as string

/**
 * Get an EVM block (AppChain)
 * @param id block height
 * @link https://docs.axc.network/build/tools/axtract#get-a-corechain-block
 */
export function getEVMBlock(height: string) {
    return api
        .get(`${EVM_BLOCKS_API_BASE_URL}/${height}`)
        .then(resolveResponseData)
}
