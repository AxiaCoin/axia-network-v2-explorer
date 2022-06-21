import axia_go_api from '@/axia_go_api'
import api from '@/axios'
import { bigToDenomBig, getNullAddress, stringToBig } from '@/helper'
import { Asset } from '@/js/Asset'
import { resolveResponseData } from '@/services/helpers'
import { AXC_ID } from '@/known_assets'
import {
    IAddress,
    IAddressData,
    IAssetsMap,
    IBalancePData,
    IBalanceX,
    IBalanceXData,
    IBalanceXDatum,
    IStakePData,
} from './models'
import Big from 'big.js'
import { IAssetDataAxiaGo, IAssetDataMagellan } from '@/js/IAsset'
import { avm } from '@/axia'
import {
    setUnlockedXP,
    setUnlockedX,
    setAssetMetadata,
    setBalanceData,
    setUnlockedXC,
} from './address'
import qs from 'qs'
import { AX, Core, Swap } from '@/known_blockchains'

const ADDRESSES_V2_API_BASE_URL = process.env.VUE_APP_ADDRESSES_V2_API_BASE_URL

export interface IAddressesParams {
    address?: string
    chainID?: string[]
    sort?: string
    offset?: number
    limit?: number
}

export function getAddressFromMagellan(params?: IAddressesParams) {
    return api
        .get(`${ADDRESSES_V2_API_BASE_URL}`, {
            params,
            paramsSerializer: (params) =>
                qs.stringify(params, { arrayFormat: 'repeat' }),
        })
        .then(resolveResponseData)
}

export async function getBalance_P(id: string): Promise<IBalancePData> {
    const res = await axia_go_api.post('', {
        jsonrpc: '2.0',
        method: 'platform.getBalance',
        params: {
            address: `Core-${id}`,
        },
        id: 1,
    })
    return res.data.result
}

export async function getStake_P(id: string): Promise<IStakePData> {
    const res = await axia_go_api.post('', {
        jsonrpc: '2.0',
        method: 'platform.getStake',
        params: {
            addresses: [`Core-${id}`],
            encoding: 'hex',
        },
        id: 1,
    })
    return res.data.result
}

function setBalances(balanceData: IBalanceXData, assetsMap: any): IBalanceX[] {
    const balances: IBalanceX[] = []

    /**
     * For each balance in the address's portfolio, get and set:
     * - asset metadata
     * - balance data (relies on asset metadata)
     * - balances metadata
     */
    for (const assetID in balanceData) {
        const balanceDatum: IBalanceXDatum = balanceData[assetID]

        // init the balance
        const balance: IBalanceX = {
            id: assetID,
            name: '',
            denomination: 0,
            symbol: '',
            currentSupply: Big(0),
            balance: Big(balanceDatum.balance), // initially undenominated
            totalReceived: Big(balanceDatum.totalReceived), // initially undenominated
            totalSent: Big(balanceDatum.totalSent), // initially undenominated
            proportionOfCurrentSupply: 0,
            transactionCount: balanceDatum.transactionCount,
            utxoCount: balanceDatum.utxoCount,
        }

        // If asset exists in store
        if (assetsMap[assetID]) {
            const asset: Asset = assetsMap[assetID]

            setAssetMetadata(asset, balance)
            setBalanceData(balanceDatum, balance.denomination, balance)
            balance.currentSupply = asset.currentSupply
            balance.proportionOfCurrentSupply = Math.round(
                (parseInt(balanceDatum.balance) /
                    parseInt(asset.currentSupply.toString())) *
                    100
            )
        }

        // If asset does not exist in store
        if (!assetsMap[assetID]) {
            // Try Magellan
            api.get(`/x/assets/${assetID}`).then((res) => {
                if (res.data) {
                    console.log('FOUND ASSET IN MAGELLAN', res.data)
                    const asset: IAssetDataMagellan = res.data

                    setAssetMetadata(asset, balance)
                    setBalanceData(balanceDatum, balance.denomination, balance)
                    balance.currentSupply = stringToBig(
                        asset.currentSupply,
                        balance.denomination
                    )
                    balance.proportionOfCurrentSupply = Math.round(
                        (parseInt(balanceDatum.balance) / parseInt('0')) * 100
                    )
                } else if (!res.data) {
                    // Try Axia-Go as last resort
                    avm.getAssetDescription(assetID).then(
                        (res: IAssetDataAxiaGo) => {
                            if (res) {
                                console.log('FOUND ASSET IN GECKO', res)
                                const asset = res

                                setAssetMetadata(asset, balance)
                                setBalanceData(
                                    balanceDatum,
                                    balance.denomination,
                                    balance
                                )
                                balance.currentSupply = stringToBig(
                                    '0',
                                    balance.denomination
                                )
                                balance.proportionOfCurrentSupply = Math.round(
                                    (parseInt(balanceDatum.balance) /
                                        parseInt('0')) *
                                        100
                                )
                            }
                        }
                    )
                }
            })
        }

        balances.push(balance)
    }

    return balances
}

/**
 * @param params should contain addressID and chainIDs
 * @param assetsMap used to decode asset balances
 * @returns balances for a bech32 address, across three dimensions
 *  - type: staked, locked, unlocked
 *  - on-chain balances: Swap, AX and/or Core
 *  - shared memory balances: Core/Swap, Swap/AX
 */
export async function getAddress(
    id: string,
    assetsMap: IAssetsMap
): Promise<IAddress> {
    // Get data from Magellan and Axia-Go
    const [pAddress, xAddress, cAddress, pBalance, pStake] = await Promise.all([
        getAddressFromMagellan({
            address: id,
            chainID: [Core.id],
        }),
        getAddressFromMagellan({
            address: id,
            chainID: [Swap.id],
        }),
        getAddressFromMagellan({
            address: id,
            chainID: [AX.id],
        }),
        getBalance_P(id!),
        getStake_P(id!),
    ])

    // Exception where no addresses were found for queried chains
    if (
        pAddress.addresses.length === 0 &&
        xAddress.addresses.length === 0 &&
        cAddress.addresses.length === 0
    ) {
        return getNullAddress(id!)
    }

    // Initialize the address and set the data from Axia-Go API
    const address: IAddress = {
        address: id!,
        publicKey: '', // todo

        // CoreChain (excludes Swap -> Core shared memory)
        AXC_balance: bigToDenomBig(
            new Big(pBalance.balance),
            assetsMap[AXC_ID].denomination
        ),
        P_unlocked: bigToDenomBig(
            new Big(pBalance.unlocked),
            assetsMap[AXC_ID].denomination
        ),
        P_lockedStakeable: bigToDenomBig(
            new Big(pBalance.lockedStakeable),
            assetsMap[AXC_ID].denomination
        ),
        P_lockedNotStakeable: bigToDenomBig(
            new Big(pBalance.lockedNotStakeable),
            assetsMap[AXC_ID].denomination
        ),
        P_staked: bigToDenomBig(
            new Big(pStake.staked),
            assetsMap[AXC_ID].denomination
        ),
        P_utxoIDs: pBalance.utxoIDs as string[],

        // Swap -> Core shared memory
        XP_unlocked: Big(0),

        // SwapChain (includes Core -> Swap & AX -> Swap shared memory)
        X_assets: [],
        X_unlocked: Big(0),
        X_locked: Big(0),

        // Swap -> AX shared memory
        XC_unlocked: Big(0),
    }

    // Then set data from Magellan
    const pBalanceMagellan = pAddress.addresses.filter(
        (a: IAddressData) => a.chainID === Core.id
    )
    const xBalanceMagellan = xAddress.addresses.filter(
        (a: IAddressData) => a.chainID === Swap.id
    )
    const cBalanceMagellan = cAddress.addresses.filter(
        (a: IAddressData) => a.chainID === AX.id
    )

    // Magellan pBalance includes UTXOs from CoreChain and Swap -> Core shared memory
    // Avala-Go pBalance includes UTXOs from CoreChain
    // We subtract one from the other to get balance for Swap -> Core shared memory
    if (pBalanceMagellan.length > 0) {
        const pBalanceAndXPbalance = bigToDenomBig(
            setUnlockedXP(pBalanceMagellan[0].assets),
            assetsMap[AXC_ID].denomination
        )
        address.XP_unlocked = pBalanceAndXPbalance.minus(address.AXC_balance)
    }

    if (xBalanceMagellan.length > 0) {
        address.X_assets = setBalances(xBalanceMagellan[0].assets, assetsMap)
        address.X_unlocked = setUnlockedX(address.X_assets)
    }

    if (cBalanceMagellan.length > 0) {
        address.XC_unlocked = bigToDenomBig(
            setUnlockedXC(cBalanceMagellan[0].assets),
            assetsMap[AXC_ID].denomination
        )
    }

    return address
}
