import { Defaults, ONEAXC } from 'axia/dist/utils'
import { BN } from 'axia/dist'
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
    defValues = defValues.P

    const {
        maxConsumption,
        minConsumption,
        maxStakingDuration,
        maxSupply,
    } = defValues
    const diffConsumption: number = maxConsumption - minConsumption
    const remainingSupply = maxSupply.sub(currentSupply)

    const amtBig = Big(amount.div(ONEAXC).toString())
    const currentSupplyBig = Big(currentSupply.div(ONEAXC).toString())
    const remainingSupplyBig = Big(remainingSupply.div(ONEAXC).toString())
    const portionOfExistingSupplyBig = amtBig.div(currentSupplyBig)

    const portionOfStakingDuration: number =
        duration / maxStakingDuration.toNumber()
    const mintingRate: number =
        minConsumption + diffConsumption * portionOfStakingDuration

    let rewardBig: Big = remainingSupplyBig.times(portionOfExistingSupplyBig)
    rewardBig = rewardBig.times(Big(mintingRate * portionOfStakingDuration))

    const rewardStr = rewardBig.times(Math.pow(10, 9)).toFixed(0)
    const rewardBN = new BN(rewardStr)

    return rewardBN
}
