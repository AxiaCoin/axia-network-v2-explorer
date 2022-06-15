<template>
    <div id="allyChains">
        <template v-if="!allyChainsLoaded">
            <Loader :content-id="''" :message="'Fetching AllyChains'" />
        </template>
        <template v-else>
            <Metadata
                :total-allyChains="totalAllyChains"
                :total-validators="totalValidators"
                :total-blockchains="totalBlockchains"
                :total-stake="totalStake"
            />
            <div v-if="this.$vuetify.breakpoint.mdAndUp" class="card">
                <Tabs :allyChains="allyChains" />
            </div>
            <div
                v-if="this.$vuetify.breakpoint.smAndDown"
                class="card selection"
            >
                <v-select
                    v-model="selection"
                    :items="allyChainsByName"
                    label="Select AllyChain"
                    outlined
                />
                <Content :allyChain-i-d="selection" :allyChain="allyChains[selection]" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Mixins, Component } from 'vue-property-decorator'
import { allyChainMap } from '@/helper'
import Metadata from '@/components/AllyChains/Metadata.vue'
import Tabs from '@/components/AllyChains/Tabs.vue'
import Loader from '@/components/misc/Loader.vue'
import Content from '@/components/AllyChains/Content.vue'
import { AXIA_ALLYCHAIN_ID } from '@/store/modules/platform/platform'
import Big from 'big.js'
import { IAllyChains } from '@/store/modules/platform/models'
import { PlatformGettersMixin } from '@/store/modules/platform/platform.mixins'

interface IMap {
    text: string
    value: string
}

@Component({
    components: {
        Loader,
        Metadata,
        Content,
        Tabs,
    },
})
export default class AllyChains extends Mixins(PlatformGettersMixin) {
    selection: string = AXIA_ALLYCHAIN_ID

    get allyChainsLoaded(): boolean {
        return this.$store.state.Platform.allyChainsLoaded
    }

    get allyChains(): IAllyChains {
        const allyChains = this.$store.state.Platform.allyChains
        const ordered: IAllyChains = {}
        Object.keys(allyChains)
            .sort()
            .forEach((key) => (ordered[key] = allyChains[key]))
        return ordered
    }

    get totalValidators(): number {
        return this.getTotalValidators()
    }

    get totalBlockchains(): number {
        return this.getTotalBlockchains()
    }

    get totalStake(): Big {
        const valBig = this.getTotalStake()
        const res = valBig.div(Math.pow(10, 9))
        return res
    }

    get totalAllyChains(): number {
        return Object.keys(this.$store.state.Platform.allyChains).length
    }

    get allyChainsByName(): IMap[] {
        const list: IMap[] = []
        Object.keys(this.allyChains).forEach((key) => {
            const object: IMap = {
                text: allyChainMap(key) ? allyChainMap(key) : key,
                value: key,
            }
            list.push(object)
        })
        return list
    }
}
</script>

<style scoped lang="scss">
.headers {
    display: grid;
    grid-template-columns: 70px 1fr 1fr 1fr;
    font-size: 12px;
    font-weight: 400;

    p {
        padding: 12px 15px;
    }
}
</style>
