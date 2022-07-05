export interface IValidator {
    nodeID: string // validator node id
    startTime: Date
    endTime: Date
    // Primary Network only
    rewardOwner?: IRewardOwner
    potentialReward?: number
    stakeAmount?: number
    uptime?: number // local uptime (percentrage)
    connected?: boolean
    nominationFee?: number
    nominators?: INominator[] | null
    // Other Networks only
    weight?: number // analogous to stakeAmount. arbitrarily set by the control key holder

    // Frontend Properties
    totalStakeAmount?: number // sum of validator and nominator stake amountsd
    rank?: number // based on stake or weight
    elapsed?: number // how much of the staking period has elasped (%)
}

// Primary Network Only
export interface INominator {
    nodeID: string
    startTime: Date
    endTime: Date
    rewardOwner: IRewardOwner
    potentialReward: number
    stakeAmount: number
}

export interface IRewardOwner {
    locktime: number
    threshold: number
    addresses: string[] // extensible, but will only contain one address for now
}

export interface IPendingValidator {
    nodeID: string
    startTime: Date
    endTime: Date

    stakeAmount: number
    connected?: boolean
    nominationFee?: number
    nominators: IPendingNominator | null
}

export interface IPendingNominator {
    nodeID: string
    startTime: Date
    endTime: Date
    stakeAmount: number
}

/* ==========================================
   API DATA
   ========================================== */

export interface IValidatorData {
    nodeID: string
    startTime: string
    endTime: string
    // Primary Network Only
    rewardOwner?: IRewardOwnerData
    potentialReward?: string
    stakeAmount?: string
    uptime?: string
    connected?: boolean
    nominationFee?: string
    nominators?: INominatorData[] | null
    // Other Networks Only
    weight?: string
}

export interface INominatorData {
    nodeID: string
    startTime: string
    endTime: string
    rewardOwner: IRewardOwnerData
    potentialReward: string
    stakeAmount: string
}

export interface IRewardOwnerData {
    locktime: string
    threshold: string
    addresses: string[]
}

export interface IPendingValidatorData {
    nodeID: string
    startTime: string
    endTime: string

    stakeAmount: string
    connected?: boolean
    nominationFee?: string
    nominators?: null // always null (even if there is a pendingNominator). API to be redesigned
}

// the top-level API response will contain pendingNominators for currentValidators and pendingValdators
export interface IPendingNominatorData {
    nodeID: string
    startTime: string
    endTime: string
    // rewardOwner:        IRewardOwnerData     // currently missing from API
    // potentialReward:    string               // currently missing from API
    stakeAmount: string
}
