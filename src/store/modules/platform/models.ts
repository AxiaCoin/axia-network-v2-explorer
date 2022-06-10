import Subnet from '@/js/Subnet'
import Blockchain from '@/js/Blockchain'
import { BN } from '@zee-ava/avajs'

export interface PlatformState {
    subnets: ISubnets
    blockchains: Blockchain[]
    subnetsLoaded: boolean
    minStake: BN
    currentSupply: BN
    annualStakingRewardPercentage: number
}

export interface ISubnets {
    [key: string]: Subnet
}
