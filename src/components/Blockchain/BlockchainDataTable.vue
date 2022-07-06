<template>
    <div id="blockchain_data_table">
        <v-data-table
            :items="blockchains"
            :headers="headers"
            multi-sort
            :mobile-breakpoint="0"
        >
            <template #item.name="{ item }">
                <div class="chain_logo_name">
                    <div
                        class="chain_avatar"
                        :style="{
                            backgroundColor: chainDarkColor(item.id),
                        }"
                    >
                        <p>
                            {{ chainCode(item.id) }}
                        </p>
                    </div>
                    <router-link
                        v-if="links"
                        :to="`/blockchain/${item.id}`"
                        class="chain_name"
                        >{{ item.name }}</router-link
                    >
                    <span v-else class="chain_name">
                        {{ item.name }}
                    </span>
                </div>
            </template>
            <template #item.indexed="{ item }">
                <Indexed :indexed="item.indexed" :not-indexed-label="false" />
            </template>
            <template #item.vmID="{ item }">
                <div>
                    <!-- <a :href="vmDocumentation(item.vmID)"> -->
                    <p>{{ vmFullName(item.vmID) }}</p>
                    <p class="vm_abbrev">{{ vm(item.vmID) }}</p>
                    <!-- </a> -->
                </div>
            </template>
            <template #item.allychainID="{ item }">
                <div>
                    <router-link :to="`/allychain/${item.allychainID}`">{{
                        item.allychainID | allychain
                    }}</router-link>
                </div>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import {
    allychainMap,
    VMMap,
    VMDocumentationMap,
    VMFullNameMap,
} from '@/helper'
import Blockchain from '@/js/Blockchain'
import Indexed from '@/components/Blockchain/Indexed.vue'
import { getTswapChainType } from '@/known_blockchains'
import { Core, Swap, AX } from '@/known_blockchains'

@Component({
    components: {
        Indexed,
    },
})
export default class BlockchainDataTable extends Vue {
    @Prop() blockchains!: Blockchain[]
    @Prop() links?: boolean
    @Prop() allychains?: boolean
    @Prop() title?: string

    get headers(): any[] {
        const headers = [
            { text: 'Name', value: 'name', width: 200, fixed: true },
            { text: 'VM', value: 'vmID', width: 125 },
            { text: 'Allychain', value: 'allychainID', width: 300 },
            { text: 'Index', value: 'indexed', width: 125 },
        ]
        return this.allychains ? headers : headers.slice(0, 5)
    }

    chainDarkColor(id: string) {
        switch (id) {
            case Core.id:
                return getTswapChainType(id)!.darkColor
            case Swap.id:
                return getTswapChainType(id)!.darkColor
            case AX.id:
                return getTswapChainType(id)!.darkColor
            default:
                return '#FFF'
        }
    }

    chainCode(id: string) {
        switch (id) {
            case Core.id:
                return getTswapChainType(id)!.code
            case Swap.id:
                return getTswapChainType(id)!.code
            case AX.id:
                return getTswapChainType(id)!.code
            default:
                return ''
        }
    }

    allychain(val: string) {
        return allychainMap(val)
    }

    vm(val: string) {
        return VMMap(val)
    }

    vmDocumentation(val: string) {
        return VMDocumentationMap(val)
    }

    vmFullName(val: string) {
        return VMFullNameMap(val)
    }
}
</script>

<style scoped lang="scss">
.chain_avatar {
    width: 35px;
    height: 35px;
    border-radius: 35px;
    line-height: 35px;
    text-align: center;

    p {
        width: 100%;
        font-weight: 500;
        color: $primary-color;
        font-size: 16px;
        padding-left: 1px;
    }
}

.chain_name {
    font-weight: 700;
    padding-left: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.id_overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-size: 12px;
    color: $gray;
    line-height: 1em;
}

.vm_abbrev {
    font-size: 12px;
    font-weight: 300;
    line-height: 1em;
}

@include smOnly {
}

@include xsOrSmaller {
}
</style>

<style lang="scss">
.chain_logo_name {
    display: flex;
    flex-direction: row;
    align-items: center;
}

#blockchain_data_table {
    .v-data-footer__icons-before > button,
    .v-data-footer__icons-after > button {
        border-width: inherit;
        cursor: pointer;
    }

    .v-select.v-text-field input {
        border-color: transparent;
    }

    .hide {
        display: none;
    }
}
</style>
