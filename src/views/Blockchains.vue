<template>
    <div class="blockchains">
        <div class="card">
            <div class="header">
                <h2>Blockchains</h2>
                <template v-show="!loading && allyChainsLoaded">
                    <div class="bar">
                        <p class="count">
                            {{ totalBlockchains.toLocaleString() }} blockchains
                            found
                        </p>
                    </div>
                </template>
            </div>
            <template v-if="loading && !allyChainsLoaded">
                <v-progress-circular
                    key="1"
                    :size="16"
                    :width="2"
                    color="#E84970"
                    indeterminate
                />
            </template>
            <template v-else>
                <BlockchainDataTable
                    :blockchains="blockchains"
                    :links="true"
                    :allyChains="true"
                />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import BlockchainDataTable from '@/components/Blockchain/BlockchainDataTable.vue'
import { PlatformGettersMixin } from '@/store/modules/platform/platform.mixins'
import Blockchain from '@/js/Blockchain'

@Component({
    components: {
        BlockchainDataTable,
    },
})
export default class Blockchains extends Mixins(PlatformGettersMixin) {
    loading = true

    async created() {
        this.loading = false
    }

    get allyChainsLoaded() {
        return this.$store.state.Platform.allyChainsLoaded
    }

    get blockchains() {
        return (this.$store.state.Platform
            .blockchains as Blockchain[]).sort((a, b) =>
            a.allyChainID > b.allyChainID ? 1 : b.allyChainID > a.allyChainID ? -1 : 0
        )
    }

    get totalBlockchains() {
        return this.getTotalBlockchains()
    }
}
</script>

<style scoped lang="scss">
.blockchains {
    font-size: 12px;
}

.header {
    padding-bottom: 20px;
    margin-bottom: 10px;

    .count {
        padding-top: 10px;
        color: $primary-color-light;
    }
}

.bar {
    display: flex;
    align-items: center;
    > p {
        flex-grow: 1;
    }
}

.bar-table {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
}

@include xsOrSmaller {
    .table_headers {
        display: none;
    }
}
</style>
