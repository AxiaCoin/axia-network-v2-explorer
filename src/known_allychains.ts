import { Core } from '@/known_blockchains'

interface AllychainDict {
    [key: string]: string
}

const dict: AllychainDict = {}

dict[Core.id] = 'Primary Network'

export default dict
