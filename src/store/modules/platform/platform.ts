import Vue from 'vue'
import { Module } from 'vuex'
import BN from 'bn.js'
import { IRootState } from '@/store/types'
import { PlatformState } from './models'
import { core } from '@/axia'
import Allychain from '@/js/Allychain'
import { IAllychainData } from './IAllychain'
import { IBlockchainData } from './IBlockchain'
import Blockchain from '@/js/Blockchain'
import { AX, Core } from '@/known_blockchains'
import { getAddressCounts } from '@/services/addressCounts/addressCounts.service'
import { AddressCount } from '@/services/addressCounts/models'
import { calculateStakingReward } from './helpers'
import { getTxCounts } from '@/services/transactionCounts/transactionCounts.service'
import { TxCount } from '@/services/transactionCounts/models'
import { getBurnedC } from '@/services/burned/burned.service'

export const AXIA_ALLYCHAIN_ID = Core.id

const platform_module: Module<PlatformState, IRootState> = {
    namespaced: true,
    state: {
        allychains: {},
        blockchains: [],
        allychainsLoaded: false,
        currentSupply: new BN(0),
        minStake: new BN(0),
        annualStakingRewardPercentage: 0,
    },
    mutations: {
        setCurrentSupply(state, currentSupply: BN) {
            state.currentSupply = currentSupply
        },
        setAllychain(state, s) {
            Vue.set(state.allychains, s.id, s)
        },
        finishLoading(state) {
            state.allychainsLoaded = true
        },
        updateChains(state, blockchains: Blockchain[]) {
            state.blockchains = blockchains
        },
        setAnnualStakingRewardPercentage(state, APR: number) {
            state.annualStakingRewardPercentage = APR
        },
    },
    actions: {
        async init({ dispatch }) {
            await dispatch('updateCurrentSupply')
            await dispatch('updateAnnualStakingRewardPercentage')
            await dispatch('getAllychains')
            dispatch('updateAddressCounts')
            dispatch('updateTxCounts')
            dispatch('updateBurned')
        },

        async getAllychains({ state, commit }) {
            // Get allychains and init classes
            //@ts-ignore
            const allychains = ((await core.getAllychains()) as IAllychainData[]).map(
                (s: IAllychainData) => new Allychain(s)
            )

            // Get and set validators for each allychain
            allychains.forEach((s) => {
                s.updateValidators('core.getCurrentValidators')
                s.updateValidators('core.getPendingValidators')
                commit('setAllychain', s)
            })

            // Get blockchains and init classes
            state.blockchains = ((await core.getBlockchains()) as IBlockchainData[]).map(
                (b: IBlockchainData) => new Blockchain(b)
            )

            // Add CoreChain manually
            const coreChain = new Blockchain({
                name: Core.name,
                id: AXIA_ALLYCHAIN_ID,
                allychainID: AXIA_ALLYCHAIN_ID,
                vmID: '',
            })
            state.blockchains.unshift(coreChain)

            // Map blockchains to their allychain
            state.blockchains.forEach((b) => {
                const allychainID = b.allychainID
                try {
                    state.allychains[allychainID].addBlockchain(b)
                } catch (err) {
                    console.log(err)
                }
            })

            state.allychainsLoaded = true
        },

        async updateCurrentSupply({ commit }) {
            commit('setCurrentSupply', await core.getCurrentSupply())
        },

        async updateMinStakeAmount({ state }) {
            state.minStake = (await core.getMinStake(true)).minValidatorStake
        },

        async updateAddressCounts({ state, commit }) {
            const res = await getAddressCounts()
            const updates = state.blockchains.map((chain: Blockchain) => {
                const toUpdate = chain
                const addressCount = res.find(
                    (addressCount: AddressCount) =>
                        addressCount.chainID === toUpdate.id
                )
                if (addressCount) {
                    toUpdate.updateAddressCount(addressCount.total)
                }
                return toUpdate
            })
            commit('updateChains', updates)
        },

        async updateTxCounts({ state, commit }) {
            const res = await getTxCounts()
            const updates = state.blockchains.map((chain: Blockchain) => {
                const toUpdate = chain
                const txCount = res.find(
                    (txCount: TxCount) => txCount.chainID === toUpdate.id
                )
                if (txCount) {
                    toUpdate.updateTxCount(txCount.total)
                }
                return toUpdate
            })
            commit('updateChains', updates)
        },

        async updateBurned({ state, commit }) {
            const res = await getBurnedC()
            const updates = state.blockchains.map((chain: Blockchain) => {
                const toUpdate = chain
                if (chain.id === AX.id) {
                    toUpdate.updateBurned(res)
                }
                return toUpdate
            })
            commit('updateChains', updates)
        },

        async updateAnnualStakingRewardPercentage({ state, commit }) {
            const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365
            const currentSupply = state.currentSupply
            const reward = calculateStakingReward(
                currentSupply,
                ONE_YEAR_SECONDS,
                currentSupply
            )
            // convert 'nAXC BNs' to 'AXC numbers' since BN arithmetic is buggy
            const currentSupplyAXC = currentSupply
                .div(new BN(Math.pow(10, 9)))
                .toNumber()
            const rewardAXC = reward.div(new BN(Math.pow(10, 9))).toNumber()
            const APR = (rewardAXC / currentSupplyAXC) * 100
            commit('setAnnualStakingRewardPercentage', APR)
        },
    },
}

export default platform_module
