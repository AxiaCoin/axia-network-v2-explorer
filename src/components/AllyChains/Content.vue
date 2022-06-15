<template>
    <div id="content">
        <v-card flat>
            <v-card-text>
                <div class="allyChain_header">
                    <div class="subheading">AllyChainwork</div>
                    <h2>{{ allyChainID | allyChain }}</h2>
                </div>
                <ContentMetadata
                    :total-blockchains="allyChain.blockchains.length"
                    :total-validators="allyChain.validators.length"
                    :total-nominators="allyChain.nominators.length"
                    :total-control-keys="allyChain.controlKeys.length"
                />
                <v-tabs v-model="tab" show-arrows>
                    <v-tab href="#validators">Validators</v-tab>
                    <v-tab href="#pending-validators">Pending Validators</v-tab>
                    <v-tab href="#blockchains">Blockchains</v-tab>
                    <v-tab href="#control-keys">Control Keys</v-tab>
                    <v-tab href="#delegations">Delegations</v-tab>
                    <v-tab-item class="tab_content" value="validators">
                        <template v-if="allyChain.validators.length === 0">
                            <p class="null">
                                There are no validators for this allyChain.
                            </p>
                        </template>
                        <template v-else>
                            <ValidatorDataTable
                                :validators="allyChain.validators"
                                :allyChain-i-d="allyChainID"
                                :allyChain="allyChain"
                                :title="'Validators'"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content" value="pending-validators">
                        <template v-if="allyChain.pendingValidators.length === 0">
                            <p class="null">
                                There are no pending validators for this allyChain.
                            </p>
                        </template>
                        <template v-else>
                            <ValidatorDataTable
                                :validators="allyChain.pendingValidators"
                                :allyChain-i-d="allyChainID"
                                :allyChain="allyChain"
                                :title="'Pending Validators'"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content" value="blockchains">
                        <template v-if="allyChain.blockchains.length === 0">
                            <p class="null">
                                There are no blockchains for this allyChain.
                            </p>
                        </template>
                        <template v-else>
                            <BlockchainDataTable
                                :blockchains="allyChain.blockchains"
                                :title="'Blockchains'"
                                :links="true"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content" value="control-keys">
                        <template v-if="allyChain.controlKeys.length === 0">
                            <p class="null">
                                There are no control keys for this allyChain.
                            </p>
                        </template>
                        <template v-else>
                            <ControlKeyTable
                                :allyChain="allyChain"
                                :title="'Control Keys'"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                    <v-tab-item class="tab_content" value="delegations">
                        <template v-if="allyChain.nominators.length === 0">
                            <p class="null">
                                There are no delegated stakes for this allyChain.
                            </p>
                        </template>
                        <template v-else>
                            <DelegationDataTable
                                :validators="allyChain.nominators"
                                :allyChain-i-d="allyChainID"
                                :allyChain="allyChain"
                                :title="'Delegations'"
                                class="table_margin"
                            />
                        </template>
                    </v-tab-item>
                </v-tabs>
            </v-card-text>
        </v-card>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AllyChain from '@/js/AllyChain'
import { AXIA_ALLYCHAIN_ID } from '@/store/modules/platform/platform'
import ContentMetadata from '@/components/AllyChains/ContentMetadata.vue'
import ValidatorDataTable from '@/components/Validators/ValidatorDataTable.vue'
import BlockchainDataTable from '@/components/Blockchain/BlockchainDataTable.vue'
import DelegationDataTable from '@/components/Validators/DelegationDataTable.vue'
import ControlKeyTable from '@/components/Validators/ControlKeyTable.vue'

@Component({
    components: {
        ContentMetadata,
        ValidatorDataTable,
        BlockchainDataTable,
        ControlKeyTable,
        DelegationDataTable,
    },
})
export default class Content extends Vue {
    dense = true
    fixedHeader = true
    defaultAllyChainID: string = AXIA_ALLYCHAIN_ID
    currentTime: number | null = null
    startTimes: number[] = []
    endTimes: number[] = []
    minTime = 0
    maxTime = 1
    absolute = false

    @Prop() allyChainID!: string
    @Prop() allyChain!: AllyChain

    get mode(): string {
        return this.absolute ? 'absolute' : 'relative'
    }

    get modeText() {
        return this.absolute ? 'Timeline' : 'Completion'
    }

    get tab() {
        return this.$route.query.tab
    }

    set tab(tab: string | (string | null)[]) {
        this.$router.replace({ query: { ...this.$route.query, tab } })
    }
}
</script>

<style scoped lang="scss">
.allyChain_count {
    margin-top: 5px;
}

.bar {
    margin-bottom: 15px;
}

.tab_content {
    padding-top: 15px;
}

.v-card__text {
    padding-top: 0;
    box-sizing: border-box;
    border-radius: 0 !important;
    padding-left: 16px;
}

.v-tab {
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
}

.v-tab:before {
    background-color: $primary-color !important;
}

.allyChain_header {
    color: $black;

    .subheading {
        text-transform: capitalize;
        font-size: 12px;
        font-weight: 400;
    }

    h2 {
        color: $primary-color;
        margin: 0;
        padding-top: 0;
    }
}

.null {
    padding: 10px 0 0 16px;
    font-size: 0.75rem;
    font-weight: 400;
}

.table_image {
    height: 20px;
    display: inline-block;
    margin-top: -4px;
    margin-right: 8px;
    vertical-align: middle;
}

.text-right {
    text-align: right !important;
}

.duration_text_container {
    margin-top: -20px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    width: 100%;
}

.now {
    position: absolute;
    top: -11px;
    font-size: 12px;
    background-color: $primary-color;
    height: calc(100% + 22px);
    width: 1px;
    z-index: 5;
}

.percentage_text {
    position: absolute;
    text-align: right;
    top: 0;
    width: 50px;
    color: $black;
    font-size: 12px;
    z-index: 3;
}

.pad {
    padding-top: 9px;
}

@include smOnly {
    .v-card__text {
        padding-left: 16px;
        padding-right: 0;
    }
}

@include xsOrSmaller {
    .allyChain_header {
        padding: 0;
    }
}
</style>

<style lang="scss">
.v-application .primary--text {
    color: $primary-color !important;
    caret-color: $primary-color !important;
}

.theme--light.v-tabs > .v-tabs-bar--show-arrows {
    background-color: $white !important;
}

th {
    .v-input--selection-controls {
        padding-top: 0;
    }
    .v-label {
        font-size: 0.75rem;
    }
    .v-messages {
        display: none;
    }
}

#content {
    .table_margin {
        margin-left: 1px;
    }

    a.v-tab {
        display: flex;

        &:hover {
            text-decoration: none;
        }
    }
}
</style>
