import { Defaults, ONEAXC } from '@axia-systems/axiajs/dist/utils'
import { BN } from '@axia-systems/axiajs/dist'
import { axia } from '@/axia'
import Big from 'big.js'

export function calculateStakingReward(
    amount: BN,
    duration: number,
    currentSupply: BN
): BN {
    const networkID = axia.getNetworkID()

    //@ts-ignore
    let defValues = Defaults.network[networkID]

    if (!defValues) {
        console.error('Network default values not found.')
        return new BN(0)
    }
    //@ts-ignore
    defValues = defValues.Core

    const {
        maxConsumption,
        minConsumption,
        maxStakingDuration,
        maxSupply,
    } = defValues
    //@ts-ignore
    const diffConsumption: number = maxConsumption - minConsumption
    //@ts-ignore
    const remainingSupply = maxSupply.sub(currentSupply)

    const amtBig = Big(amount.div(ONEAXC).toString())
    const currentSupplyBig = Big(currentSupply.div(ONEAXC).toString())
    const remainingSupplyBig = Big(remainingSupply.div(ONEAXC).toString())
    const portionOfExistingSupplyBig = amtBig.div(currentSupplyBig)
    const portionOfStakingDuration: number =
        //@ts-ignore
        duration / maxStakingDuration.toNumber()
    const mintingRate: number =
        //@ts-ignore
        minConsumption + diffConsumption * portionOfStakingDuration

    let rewardBig: Big = remainingSupplyBig.times(portionOfExistingSupplyBig)
    rewardBig = rewardBig.times(Big(mintingRate * portionOfStakingDuration))

    const rewardStr = rewardBig.times(Math.pow(10, 9)).toFixed(0)
    const rewardBN = new BN(rewardStr)

    return rewardBN
}
