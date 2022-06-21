<template>
    <div id="allychains">
        <template v-if="!allychainsLoaded">
            <Loader :content-id="''" :message="'Fetching Allychains'" />
        </template>
        <template v-else>
            <Metadata
                :total-allychains="totalAllychains"
                :total-validators="totalValidators"
                :total-blockchains="totalBlockchains"
                :total-stake="totalStake"
            />
            <div v-if="this.$vuetify.breakpoint.mdAndUp" class="card">
                <Tabs :allychains="allychains" />
            </div>
            <div
                v-if="this.$vuetify.breakpoint.smAndDown"
                class="card selection"
            >
                <v-select
                    v-model="selection"
                    :items="allychainsByName"
                    label="Select Allychain"
                    outlined
                />
                <Content :allychain-i-d="selection" :allychain="allychains[selection]" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Mixins, Component } from 'vue-property-decorator'
import { allychainMap } from '@/helper'
import Metadata from '@/components/Allychains/Metadata.vue'
import Tabs from '@/components/Allychains/Tabs.vue'
import Loader from '@/components/misc/Loader.vue'
import Content from '@/components/Allychains/Content.vue'
import { AXIA_SUBNET_ID } from '@/store/modules/platform/platform'
import Big from 'big.js'
import { IAllychains } from '@/store/modules/platform/models'
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
export default class Allychains extends Mixins(PlatformGettersMixin) {
    selection: string = AXIA_SUBNET_ID

    get allychainsLoaded(): boolean {
        return this.$store.state.Platform.allychainsLoaded
    }

    get allychains(): IAllychains {
        const allychains = this.$store.state.Platform.allychains
        const ordered: IAllychains = {}
        Object.keys(allychains)
            .sort()
            .forEach((key) => (ordered[key] = allychains[key]))
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

    get totalAllychains(): number {
        return Object.keys(this.$store.state.Platform.allychains).length
    }

    get allychainsByName(): IMap[] {
        const list: IMap[] = []
        Object.keys(this.allychains).forEach((key) => {
            const object: IMap = {
                text: allychainMap(key) ? allychainMap(key) : key,
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
#allychains {
    .card {
        padding: 30px 0 30px 30px;
    }
}
</style>
