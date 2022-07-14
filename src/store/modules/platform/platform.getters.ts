import store from '@/store'
import { AXIA_ALLYCHAIN_ID } from './platform'
import Big from 'big.js'
import { ONEAXC } from '@axia-systems/axiajs/dist/utils'
import { bigToDenomBig } from '@/helper'

/**
 * @returns Count of active validators in Primary Network
 */
export function getTotalValidators(): number {
    const defaultAllychain = store.state.Platform.allychains[AXIA_ALLYCHAIN_ID]
    return !defaultAllychain ? 0 : defaultAllychain.validators.length
}

/**
 * @returns Count of pending validators in Primary Network
 */
export function getTotalPendingValidators(): number {
    const defaultAllychain = store.state.Platform.allychains[AXIA_ALLYCHAIN_ID]
    return !defaultAllychain ? 0 : defaultAllychain.pendingValidators.length
}

/**
 * @returns Total $AXC active stake on Primary Network
 */
export function getTotalStake(): Big {
    const defaultAllychain = store.state.Platform.allychains[AXIA_ALLYCHAIN_ID]
    let total = Big(0)
    return !defaultAllychain
        ? total
        : (total = defaultAllychain.validators.reduce(
              (a, v) => a.add(Big(v.totalStakeAmount as number)),
              total
          ))
}

/**
 * @returns Total $AXC pending stake on Primary Network
 */
export function getTotalPendingStake(): Big {
    const defaultAllychain = store.state.Platform.allychains[AXIA_ALLYCHAIN_ID]
    let total = Big(0)
    return !defaultAllychain
        ? total
        : (total = defaultAllychain.pendingValidators.reduce(
              (a, v) => a.add(Big(v.stakeAmount as number)),
              total
          ))
}

/**
 * @returns Accumulative distribution of active stakes
 */
export function getCumulativeStake(): number[] {
    const defaultAllychain = store.state.Platform.allychains[AXIA_ALLYCHAIN_ID]
    const res: number[] = []
    let total = 0
    if (defaultAllychain) {
        defaultAllychain.validators.forEach((v) => {
            total += v.totalStakeAmount as number
            res.push(total)
        })
    }
    return res
}

/**
 * @returns Accumulative distribution of pending stakes
 */
export function getCumulativePendingStake(): number[] {
    const defaultAllychain = store.state.Platform.allychains[AXIA_ALLYCHAIN_ID]
    const res: number[] = []
    let total = 0
    if (defaultAllychain) {
        defaultAllychain.pendingValidators.forEach((v) => {
            total += v.stakeAmount as number
            res.push(total)
        })
    }
    return res
}

/**
 * @returns Count of blockchains across all allychains
 */
export function getTotalBlockchains(): number {
    let total = 0
    for (const allychainID of Object.keys(store.state.Platform.allychains)) {
        total += store.state.Platform.allychains[allychainID].blockchains.length
    }
    return total
}

/**
 * @returns AXC Market Cap in USD
 */
// export function getMarketCapUSD(): string {
//     const currentSupplyBN = store.state.Platform.currentSupply
//     const currentSupplyBig = Big(currentSupplyBN.div(ONEAXC).toString())
//     // TODO: need to use circulatingSupply as currentSupply is both locked and unlocked AXC
//     if (store.state.prices) {
//         const marketCapUSD = currentSupplyBig.times(store.state.prices['usd'])
//         return marketCapUSD.toLocaleString(2)
//     }
//     return '-'
// }

export function getStakingRatio(): number {
    let totalStake = getTotalStake()
    totalStake = bigToDenomBig(totalStake, 9)
    const currentSupply = store.state.Platform.currentSupply
        .div(ONEAXC)
        .toNumber()
    const percentStaked = totalStake.div(currentSupply).times(100)
    return parseFloat(percentStaked.toFixed(2))
}
