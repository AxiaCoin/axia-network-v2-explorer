import { IBlockchainData } from '@/store/modules/platform/IBlockchain'
import { Core, Swap, AX } from '@/known_blockchains'
import { profanities } from '@/js/Profanities'

export default class Blockchain {
    id: string
    name: string
    allychainID: string
    vmID: string
    addressCount?: number | null
    txCount?: number | null
    burned?: number | null
    indexed?: boolean
    profane?: boolean

    constructor(data: IBlockchainData) {
        this.id = data.id
        this.name = data.name
        this.allychainID = data.allychainID
        this.vmID = data.vmID
        this.addressCount = null
        this.txCount = null
        this.burned = null
        this.indexed = this.updateIndexed()
        this.profane = false
        this.checkForProfanities(this.name)
    }

    private updateIndexed(): boolean {
        switch (this.id) {
            case Core.id:
                return true
            case Swap.id:
                return true
            case AX.id:
                return true
            default:
                return false
        }
    }
    private checkForProfanities(value: string): void {
        if (this.profane) {
            return
        }
        this.profane = profanities.screen(value)
    }

    public updateAddressCount(value: string | null): void {
        if (!value) return
        this.addressCount = parseInt(value)
    }

    public updateTxCount(value: string | null): void {
        if (!value) return
        this.txCount = parseInt(value)
    }

    public updateBurned(value: number | null): void {
        if (!value) return
        this.burned = value
    }
}
