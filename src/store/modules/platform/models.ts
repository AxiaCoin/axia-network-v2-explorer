import Allychain from '@/js/Allychain'
import Blockchain from '@/js/Blockchain'
import { BN } from '@axia-systems/axiajs'

export interface PlatformState {
    allychains: IAllychains
    blockchains: Blockchain[]
    allychainsLoaded: boolean
    minStake: BN
    currentSupply: BN
    annualStakingRewardPercentage: number
}

export interface IAllychains {
    [key: string]: Allychain
}
