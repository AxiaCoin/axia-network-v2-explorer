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

export const P: ChainMap = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_CORECHAINID
        : process.env.VUE_APP_TEST_CORECHAINID) as string,
    name: 'CoreChain',
    fullname: 'Platform',
    code: 'P',
    color: '#F19100',
    darkColor: '#FFF8EE',
    txTypes: [
        ['add_validator', txTypeMap.get('add_validator')!],
        ['add_subnet_validator', txTypeMap.get('add_subnet_validator')!],
        ['add_nominator', txTypeMap.get('add_nominator')!],
        ['create_subnet', txTypeMap.get('create_subnet')!],
        ['create_chain', txTypeMap.get('create_chain')!],
        ['pvm_export', txTypeMap.get('pvm_export')!],
        ['pvm_import', txTypeMap.get('pvm_import')!],
    ],
}

export const X: ChainMap = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_ASSETCHAINID
        : process.env.VUE_APP_TEST_ASSETCHAINID) as string,
    name: 'AssetChain',
    fullname: 'Exchange',
    code: 'X',
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

export const C: ChainMap = {
    id: (isMainnetNetwork()
        ? process.env.VUE_APP_APPCHAINID
        : process.env.VUE_APP_TEST_APPCHAINID) as string,
    name: 'AppChain',
    fullname: 'Contract',
    code: 'C',
    color: '#088223',
    darkColor: '#F6FFF6',
    txTypes: [
        ['atomic_import_tx', txTypeMap.get('atomic_import_tx')!],
        ['atomic_export_tx', txTypeMap.get('atomic_export_tx')!],
    ],
}

const dict: BlockchainDict = {}

dict[P.id] = P
dict[X.id] = X
dict[C.id] = C

export default dict

export const tassetChainTypeMap = new Map<string, typeof C>([
    [C.id, C],
    [P.id, P],
    [X.id, X],
])

export function getTassetChainType(type: string) {
    return tassetChainTypeMap.get(type)
}
