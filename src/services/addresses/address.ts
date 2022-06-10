import { stringToBig } from '@/helper'
import { Asset } from '@/js/Asset'
import { IAssetDataOrtelius, IAssetDataAxiaGo } from '@/js/IAsset'
import { AXC_ID } from '@/known_assets'
import { IBalanceX, IBalanceXData, IBalanceXDatum } from './models'
import Big from 'big.js'

// set asset metadata for convenience
export function setAssetMetadata(
    asset: Asset | IAssetDataOrtelius | IAssetDataAxiaGo,
    balance: IBalanceX
) {
    balance.name = asset.name
    balance.denomination = asset.denomination
    balance.symbol = asset.symbol
}

// set balance data (relies on asset metadata)
export function setBalanceData(
    balanceDatum: IBalanceXDatum,
    denomination: number,
    balance: IBalanceX
) {
    balance.balance = stringToBig(balanceDatum.balance, denomination)
    balance.totalReceived = stringToBig(
        balanceDatum.totalReceived,
        denomination
    )
    balance.totalSent = stringToBig(balanceDatum.totalSent, denomination)
}

export function setUnlockedXP(assets: IBalanceXData): Big {
    return assets[AXC_ID] ? Big(assets[AXC_ID].balance) : Big(0)
}

export function setUnlockedX(assets: IBalanceX[]): Big {
    const result = assets.find((asset) => asset.id === AXC_ID)
    return result ? result.balance : Big(0)
}

export function setUnlockedXC(assets: IBalanceXData): Big {
    return assets[AXC_ID] ? Big(assets[AXC_ID].balance) : Big(0)
}
