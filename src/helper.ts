import Big from 'big.js'
import AllychainDict from './known_allychains'
import BlockchainDict, { AX, Core, Swap } from './known_blockchains'
import VMDict from './known_vms'
import { Quote, quotes } from './quotes'
import { BN, Buffer } from '@axia-systems/axiajs/dist'
import { NFTTransferOutput, UTXO } from '@axia-systems/axiajs/dist/apis/avm'
import { PayloadBase, PayloadTypes } from '@axia-systems/axiajs/dist/utils'
import { NetworkIDToHRP } from '@axia-systems/axiajs/dist/utils/constants'
import { DEFAULT_NETWORK_ID } from './store/modules/network/network'
import { IAddress } from './services/addresses/models'

function stringToBig(raw: string, denomination = 0): Big {
    return Big(raw).div(Math.pow(10, denomination))
}

/**
 * Convert nAxc to Axc
 * @param nAXC nAxc amount
 * @param denom 9 or 18 decimal places depending on chain
 */
function nAxcToAXC(nAXC: string | number, denom = 9): number {
    return typeof nAXC === 'string'
        ? parseInt(nAXC) / Math.pow(10, denom)
        : nAXC / Math.pow(10, denom)
}

function bigToDenomBig(val: Big, denomination = 0): Big {
    return val.div(Math.pow(10, denomination))
}

function bnToBig(val: BN, denomination = 0): Big {
    return new Big(val.toString()).div(Math.pow(10, denomination))
}

function allychainMap(id: string): string {
    if (AllychainDict[id]) {
        return AllychainDict[id]
    } else {
        return id
    }
}

function blockchainMap(id: string): string {
    if (BlockchainDict[id]) {
        return BlockchainDict[id].name
    } else {
        return id
    }
}

function VMMap(id: string): string {
    if (VMDict[id]) {
        return VMDict[id].name
    } else {
        return id
    }
}

function VMDocumentationMap(id: string): string {
    if (VMDict[id]) {
        return VMDict[id].documentation
    } else {
        return ''
    }
}

function VMFullNameMap(id: string): string {
    if (VMDict[id]) {
        return VMDict[id].fullName
    } else {
        return ''
    }
}

function getRandomQuote(): Quote {
    return quotes[Math.floor(Math.random() * quotes.length)]
}

function countDecimals(value: number): [boolean, number] {
    if (value <= 1e-7) {
        return [true, parseInt(value.toString().split('-')[1])]
    } else if (Math.floor(value) !== value) {
        return [false, value.toString().split('.')[1].length || 0]
    }
    return [false, 0]
}

function trimmedLocaleString(
    amount: Big,
    denomination = 0,
    normalize = true
): string {
    // produce a localeString with trimmed trailing 0s
    // e.g. 44999999.999120000 to 44,999,999.99912

    // convert and denominate
    const denominatedAmt = normalize
        ? amount.div(Math.pow(10, denomination)).toFixed(denomination)
        : amount.toFixed(denomination)

    // determine cutoff point for trailing 0s
    // handle scientific notation and decimal formats
    const number = parseFloat(denominatedAmt)
    const [scientific, decimalPlaces] = countDecimals(number)

    return scientific
        ? amount.div(Math.pow(10, denomination)).toFixed(denomination)
        : amount.div(Math.pow(10, denomination)).toLocaleString(decimalPlaces)
}

const payloadtypes = PayloadTypes.getInstance()

function getPayloadFromUTXO(utxo: UTXO): PayloadBase {
    const out = utxo.getOutput() as NFTTransferOutput
    const payload = out.getPayloadBuffer()
    const typeId = payloadtypes.getTypeID(payload)
    const pl = payloadtypes.getContent(payload)
    const payloadbase: PayloadBase = payloadtypes.select(typeId, pl)
    return payloadbase
}

function pushPayload(rawPayload: string, assetID: string, groupID: number) {
    const res: { [key in string]: { [key in string]: PayloadBase[] } } = {}
    let payload = Buffer.from(rawPayload, 'base64')
    payload = Buffer.concat([new Buffer(4).fill(payload.length), payload])

    try {
        const typeId = payloadtypes.getTypeID(payload)
        const pl = payloadtypes.getContent(payload)
        const payloadbase: PayloadBase = payloadtypes.select(typeId, pl)

        if (res[assetID]) {
            if (res[assetID][groupID]) {
                return res[assetID][groupID].push(payloadbase)
            } else {
                return (res[assetID] = {
                    [groupID]: [payloadbase],
                })
            }
        } else {
            return (res[assetID] = {
                [groupID]: [payloadbase],
            })
        }
    } catch (e) {
        console.error(e)
    }
}

function foregroundColor(address: string) {
    const prefix = address.charAt(0)
    switch (prefix) {
        case 'Core':
            return Core.color
        case 'Swap':
            return Swap.color
        case 'AX':
            return AX.color
        case '0':
            return AX.color
        default:
            return '#212121'
    }
}

function backgroundColor(address: string) {
    const prefix = address.charAt(0)
    switch (prefix) {
        case 'Core':
            return Core.darkColor
        case 'Swap':
            return Swap.darkColor
        case 'AX':
            return AX.darkColor
        case '0':
            return AX.darkColor
        default:
            return '#e4e4e4'
    }
}

const firstChars = 6
const lastChars = 6

function abbreviateBech32(address: string) {
    const separatorPos = Array.from(address).findIndex((i) => i === '1') + 1
    const prefix = address.substring(0, 2)
    const hrp = address.substring(prefix.length, separatorPos)
    const addressAbbrev = address.substring(
        separatorPos,
        separatorPos + firstChars
    )
    const checksum = address.substr(address.length - lastChars, lastChars)
    return [prefix, hrp, addressAbbrev, '...', checksum]
}

function abbreviateHex(address: string) {
    const prefix = address.substring(0, 2)
    // @ts-ignore
    const hrpLength = NetworkIDToHRP[DEFAULT_NETWORK_ID].length
    const addressFirst = address.substring(
        prefix.length,
        prefix.length + 1 + hrpLength + firstChars
    )
    const addressLast = address.substr(address.length - lastChars, lastChars)
    return [prefix, addressFirst, '...', addressLast]
}

function getNullAddress(id: string, key = ''): IAddress {
    return {
        address: id,
        publicKey: key,
        // CoreChain (excludes Swap -> Core shared memory)
        AXC_balance: Big(0),
        P_unlocked: Big(0),
        P_lockedStakeable: Big(0),
        P_lockedNotStakeable: Big(0),
        P_staked: Big(0),
        P_utxoIDs: [],
        // Swap -> Core shared memory
        XP_unlocked: Big(0),
        // SwapChain (includes AX -> Swap and Core -> Swap shared memory)
        X_unlocked: Big(0),
        X_locked: Big(0),
        X_assets: [],
        // Swap -> AX shared memory
        XC_unlocked: Big(0),
    }
}

export {
    nAxcToAXC as toAXC,
    stringToBig,
    bigToDenomBig,
    bnToBig,
    allychainMap,
    blockchainMap,
    VMMap,
    VMDocumentationMap,
    VMFullNameMap,
    getRandomQuote,
    trimmedLocaleString,
    getPayloadFromUTXO,
    pushPayload,
    foregroundColor,
    backgroundColor,
    abbreviateBech32,
    abbreviateHex,
    getNullAddress,
}
