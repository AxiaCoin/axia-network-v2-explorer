import { P } from '@/known_blockchains'

interface AllyChainDict {
    [key: string]: string
}

const dict: AllyChainDict = {}

dict[P.id] = 'Primary Network'

export default dict
