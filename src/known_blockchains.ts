import { txTypeMap, TxType } from '@/store/modules/transactions/maps'
export interface ChainMap {
    id: string
    name: string
    fullname: string
    code: string
    color: string
    darkColor: string
    txTypes: [string, TxType][]
}

interface BlockchainDict {
    [key: string]: ChainMap
}

const DEFAULT_NETWORK_ID = parseInt(
    process.env.VUE_APP_DEFAULT_NETWORKID || '4'
)

export function isMainnetNetwork() {
    return DEFAULT_NETWORK_ID === 1
}

export const Core: ChainMap = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_CORECHAINID
        : process.env.VUE_APP_TEST_CORECHAINID) as string,
    name: 'Core-Chain',
    fullname: 'Platform',
    code: 'Core',
    color: '#F19100',
    darkColor: '#FFF8EE',
    txTypes: [
        ['add_validator', txTypeMap.get('add_validator')!],
        ['add_allychain_validator', txTypeMap.get('add_allychain_validator')!],
        ['add_nominator', txTypeMap.get('add_nominator')!],
        ['create_allychain', txTypeMap.get('create_allychain')!],
        ['create_chain', txTypeMap.get('create_chain')!],
        ['pvm_export', txTypeMap.get('pvm_export')!],
        ['pvm_import', txTypeMap.get('pvm_import')!],
    ],
}

export const Swap: ChainMap = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_SWAPCHAINID
        : process.env.VUE_APP_TEST_SWAPCHAINID) as string,
    name: 'Swap-Chain',
    fullname: 'Exchange',
    code: 'Swap',
    color: '#005FED',
    darkColor: '#EFF7FF',
    txTypes: [
        ['base', txTypeMap.get('base')!],
        ['create_asset', txTypeMap.get('create_asset')!],
        ['operation', txTypeMap.get('operation')!],
        ['import', txTypeMap.get('import')!],
        ['export', txTypeMap.get('export')!],
    ],
}

export const AX: ChainMap = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_AXCHAINID
        : process.env.VUE_APP_TEST_AXCHAINID) as string,
    name: 'AX-Chain',
    fullname: 'Contract',
    code: 'AX',
    color: '#088223',
    darkColor: '#F6FFF6',
    txTypes: [
        ['atomic_import_tx', txTypeMap.get('atomic_import_tx')!],
        ['atomic_export_tx', txTypeMap.get('atomic_export_tx')!],
    ],
}

const dict: BlockchainDict = {}

dict[Core.id] = Core
dict[Swap.id] = Swap
dict[AX.id] = AX

export default dict

export const tswapChainTypeMap = new Map<string, typeof AX>([
    [AX.id, AX],
    [Core.id, Core],
    [Swap.id, Swap],
])

export function getTswapChainType(type: string) {
    return tswapChainTypeMap.get(type)
}
