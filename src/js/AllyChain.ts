import axia_go_api from '@/axia_go_api'
import { IAllyChainData } from '@/store/modules/platform/IAllyChain'
import Blockchain from '@/js/Blockchain'
import {
    IValidator,
    IValidatorData,
    INominator,
    INominatorData,
    IPendingValidatorData,
    IPendingValidator,
    IPendingNominator,
    IPendingNominatorData,
} from '@/store/modules/platform/IValidator'
import { AXIA_ALLYCHAIN_ID } from '@/store/modules/platform/platform'

export default class AllyChain {
    id: string
    controlKeys: string[]
    threshold: number
    blockchains: Blockchain[]
    validators: IValidator[]
    nominators: INominator[]
    pendingValidators: IPendingValidator[]
    pendingNominators: IPendingNominator[]

    constructor(data: IAllyChainData) {
        this.id = data.id
        this.controlKeys = data.controlKeys
        this.threshold = parseInt(data.threshold)
        this.blockchains = []
        this.validators = []
        this.pendingValidators = []
        this.nominators = []
        this.pendingNominators = []
    }

    // TODO: get address details for Platform Keys (https://docs.axc.network/v1.0/en/api/platform/#platformgetaccount)

    async updateValidators(endpoint: string) {
        /* ==========================================
            GET DATA FROM SERVICE
           ========================================== */
        const req = {
            jsonrpc: '2.0',
            method: endpoint,
            params: {
                allyChainID: this.id,
            },
            id: 1,
        }
        const response = await axia_go_api.post('', req)

        // console.log(`------------- ${this.id.substring(0,4)} ------------ ${endpoint}`);
        // console.log("result:                        ", response.data.result);

        /* ==========================================
            CURRENT VALIDATORS
           ========================================== */
        if (endpoint === 'platform.getCurrentValidators') {
            const validatorsData = response.data.result
                .validators as IValidatorData[]
            let validators: IValidator[] = []
            let nominators: INominator[] = []

            if (validatorsData.length > 0) {
                // All AllyChains
                validators = this.setValidators(validatorsData)
                validators = this.sortByStake(validators, this.id)

                // Primary Network Only
                if (this.id === AXIA_ALLYCHAIN_ID) {
                    validators.forEach((v: IValidator) => {
                        if (v.nominators !== null) {
                            v.nominators?.forEach((d: INominator) =>
                                nominators.push(d)
                            )
                        }
                    })
                }
                nominators = this.sortNominators(nominators)
            }

            this.validators = validators
            this.nominators = nominators
        } else if (endpoint === 'platform.getPendingValidators') {
            /* ==========================================
            PENDING VALIDATORS
           ========================================== */
            const pendingValidatorsData = response.data.result
                .validators as IPendingValidatorData[]
            let pendingValidators: IPendingValidator[] = []
            let pendingNominators: IPendingNominator[] = []

            // All AllyChains
            if (pendingValidatorsData.length > 0) {
                pendingValidators = this.setPendingValidators(
                    pendingValidatorsData
                )
            }

            // Primary Network Only
            if (this.id === AXIA_ALLYCHAIN_ID) {
                const pendingNominatorsData = response.data.result
                    .nominators as IPendingValidatorData[]
                if (pendingNominatorsData.length > 0) {
                    pendingNominators = this.setPendingNominators(
                        pendingNominatorsData
                    )
                }
            }

            this.pendingValidators = pendingValidators
            this.pendingNominators = pendingNominators
        }
    }

    addBlockchain(data: Blockchain) {
        this.blockchains.push(data)
    }

    /**
     * Convert API data to validators
     */
    private setValidators(validatorsData: IValidatorData[]): IValidator[] {
        const validators = validatorsData.map((v: IValidatorData) => {
            const validator: IValidator = {
                nodeID: v.nodeID,
                startTime: new Date(parseInt(v.startTime) * 1000),
                endTime: new Date(parseInt(v.endTime) * 1000),
            }

            // Primary Network
            if ({}.hasOwnProperty.call(v, 'stakeAmount')) {
                validator.rewardOwner = {
                    locktime: parseInt(v.rewardOwner!.locktime),
                    threshold: parseInt(v.rewardOwner!.threshold),
                    addresses: v.rewardOwner!.addresses,
                }
                validator.potentialReward = parseInt(
                    v.potentialReward as string
                )
                validator.stakeAmount = parseInt(v.stakeAmount as string)
                validator.uptime = parseFloat(v.uptime as string) * 100 // percentage
                validator.connected = v.connected
                validator.delegationFee = parseInt(v.delegationFee as string)
                validator.nominators = this.setNominators(v.nominators!) as
                    | INominator[]
                    | null
                validator.totalStakeAmount = this.calculateTotalStakeAmount(
                    validator.nominators,
                    validator.stakeAmount
                )
                validator.elapsed = this.getElapsedStakingPeriod(validator)
            }
            // AllyChains
            if ({}.hasOwnProperty.call(v, 'weight')) {
                validator.weight = parseInt(v.weight as string)
            }
            return validator
        })
        return validators
    }

    /**
     * Convert API data to nominators
     */
    private setNominators(
        nominatorsData: INominatorData[] | null
    ): INominator[] | null {
        let nominators = null

        if (nominatorsData) {
            nominators = nominatorsData.map((d) => {
                const nominator: INominator = {
                    nodeID: d.nodeID,
                    startTime: new Date(parseInt(d.startTime) * 1000),
                    endTime: new Date(parseInt(d.endTime) * 1000),
                    rewardOwner: {
                        locktime: parseInt(d.rewardOwner.locktime),
                        threshold: parseInt(d.rewardOwner.threshold),
                        addresses: d.rewardOwner.addresses,
                    },
                    potentialReward: parseInt(d.potentialReward),
                    stakeAmount: parseInt(d.stakeAmount),
                }
                return nominator
            })
        }
        return nominators
    }

    /**
     * Convert API data to pending validators
     */
    private setPendingValidators(
        pendingValidatorsData: IPendingValidatorData[]
    ): IPendingValidator[] {
        const pendingValidators = pendingValidatorsData.map(
            (pv: IPendingValidatorData) => {
                const pendingValidator: IPendingValidator = {
                    nodeID: pv.nodeID,
                    startTime: new Date(parseInt(pv.startTime) * 1000),
                    endTime: new Date(parseInt(pv.endTime) * 1000),
                    stakeAmount: parseInt(pv.stakeAmount),
                    nominators: null,
                }

                // Pending Validators - set optional props
                if ({}.hasOwnProperty.call(pv, 'connected')) {
                    pendingValidator.connected = pv.connected as boolean
                    pendingValidator.delegationFee = parseInt(
                        pv.delegationFee as string
                    )
                }

                return pendingValidator
            }
        )
        return pendingValidators
    }

    /**
     * Convert API data to pending nominators
     */
    private setPendingNominators(
        pendingNominatorsData: IPendingNominatorData[] | null
    ): IPendingNominator[] {
        let pendingNominators: IPendingNominator[] = []

        if (pendingNominatorsData) {
            pendingNominators = pendingNominatorsData.map((pd) => {
                const pendingNominator: IPendingNominator = {
                    nodeID: pd.nodeID,
                    startTime: new Date(parseInt(pd.startTime) * 1000),
                    endTime: new Date(parseInt(pd.endTime) * 1000),
                    stakeAmount: parseInt(pd.stakeAmount),
                }
                return pendingNominator
            })
        }
        return pendingNominators
    }

    /**
     *  validated + delegated stake
     */
    private calculateTotalStakeAmount(
        nominators: INominator[] | null,
        stakeAmount: number
    ): number {
        let totalStakeAmount = stakeAmount

        if (nominators) {
            let delegatedStakeAmount = 0
            nominators.forEach((d) => (delegatedStakeAmount += d.stakeAmount))
            totalStakeAmount += delegatedStakeAmount
        }

        return totalStakeAmount
    }

    /**
     *  Sort by stake or weight and add rank
     */
    private sortByStake(validators: IValidator[], id: string): IValidator[] {
        id === AXIA_ALLYCHAIN_ID
            ? validators.sort(
                  (a, b) =>
                      (b.totalStakeAmount as number) -
                      (a.totalStakeAmount as number)
              )
            : validators.sort(
                  (a, b) => (b.weight as number) - (a.weight as number)
              )
        validators.forEach((v, i) => (v.rank = i + 1))
        return validators
    }

    /**
     *  Sort by stake
     */
    private sortNominators(nominators: INominator[]): INominator[] {
        return nominators.length > 0
            ? nominators.sort((a, b) => b.stakeAmount - a.stakeAmount)
            : []
    }

    /**
     *  Elapsed staking period (%)
     */
    private getElapsedStakingPeriod(validator: IValidator): number {
        const currentTime = new Date().getTime()
        const numerator = currentTime - validator.startTime.getTime()
        const denominator =
            validator.endTime.getTime() - validator.startTime.getTime()
        return Math.round((numerator / denominator) * 100)
    }
}
