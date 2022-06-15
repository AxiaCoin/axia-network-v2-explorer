import AllyChain from '@/js/AllyChain'
import Blockchain from '@/js/Blockchain'
import { BN } from '@zee-ava/avajs'

export interface PlatformState {
    allyChains: IAllyChains
    blockchains: Blockchain[]
    allyChainsLoaded: boolean
    minStake: BN
    currentSupply: BN
    annualStakingRewardPercentage: number
}

export interface IAllyChains {
    [key: string]: AllyChain
}
