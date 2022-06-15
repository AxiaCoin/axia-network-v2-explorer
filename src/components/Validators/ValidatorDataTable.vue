<template>
    <div id="validator_data_table">
        <div class="data_table_header">
            <!-- 2 -->
            <div class="controls">
                <div class="filter_count">
                    <p v-show="search.length === 0">
                        {{ validators.length | pluralize('result') }}
                        found
                    </p>
                    <p v-show="search.length > 0">...filtering results</p>
                </div>
                <div class="filter_input_container">
                    <input
                        v-model="search"
                        class="filter"
                        type="text"
                        placeholder="Filter by NodeID"
                    />
                </div>
            </div>
            <!-- 3 -->
            <div class="duration_toggle_container">
                <v-switch v-model="absolute" :label="modeText"></v-switch>
            </div>
        </div>

        <v-data-table
            :items="validators"
            :headers="headers"
            :search="search"
            multi-sort
            :mobile-breakpoint="0"
        >
            <!-- TODO: reinstate show-expand when client is patched -->
            <template #item.id="{ item }">
                <div class="text-truncate" style="max-width: 100px">
                    {{ item.id }}
                </div>
            </template>
            <template #item.stakeAmount="{ item }">
                {{ item.totalStakeAmount | AXC }} {{ nativeSymbol }}
            </template>
            <template #item.potentialReward="{ item }"
                >{{ item.potentialReward | AXC }} {{ nativeSymbol }}</template
            >
            <template #item.startTime="{ item }">
                <div class="text-right date no-pad-right">
                    {{ item.startTime.getTime() | date }}
                </div>
                <div class="text-right time no-pad-right">
                    {{ item.startTime.getTime() | time }}
                </div>
            </template>
            <template #item.elapsed="{ item }">
                <div v-show="mode === 'absolute'" class="diagram-container">
                    <div class="diagram">
                        <div
                            class="chartbar"
                            :style="{
                                left: `${scale(item.startTime.getTime())}px`,
                                width: `${
                                    scale(item.endTime.getTime()) -
                                    scale(item.startTime.getTime())
                                }px`,
                            }"
                        ></div>
                        <div
                            class="chartbar_complete"
                            :style="{
                                left: `${scale(item.startTime.getTime())}px`,
                                width: `${
                                    scale(currentTime) -
                                    scale(item.startTime.getTime())
                                }px`,
                            }"
                        ></div>
                        <div
                            class="now"
                            :style="{ left: `${scale(currentTime)}px` }"
                        ></div>
                    </div>
                </div>
                <div v-if="mode === 'relative'" class="diagram-container">
                    <div class="diagram">
                        <div
                            class="chartbar"
                            :style="{
                                left: `0px`,
                                width: `${diagramWidth}px`,
                            }"
                        ></div>
                        <div
                            class="chartbar_complete"
                            :style="{
                                left: `0px`,
                                width: `${scaleRelative(
                                    (currentTime - item.startTime.getTime()) /
                                        (item.endTime.getTime() -
                                            item.startTime.getTime())
                                )}px`,
                            }"
                        ></div>
                        <div
                            class="percentage_text text-right"
                            :style="{ left: `71px` }"
                        >
                            {{ item.elapsed }} %
                        </div>
                    </div>
                </div>
            </template>
            <template #item.endTime="{ item }">
                <div class="date">{{ item.endTime.getTime() | date }}</div>
                <div class="time">{{ item.endTime.getTime() | time }}</div>
            </template>
            <template #item.duration="{ item }">
                {{ (item.endTime - item.startTime) | duration }}
            </template>
            <template #item.rewardOwner.addresses?.[0]="{ item }">
                <router-link :to="`/address/${item.rewardOwner.addresses?.[0]}`"
                    >{{ item.rewardOwner.addresses?.[0] }}
                </router-link>
            </template>
            <template #item.delegationFee="{ item }">
                <div>{{ item.delegationFee }}%</div>
            </template>
            <template #item.uptime="{ item }">
                <div>{{ item.uptime?.toFixed(2) }}%</div>
            </template>
            <template #item.nominators="{ item }">
                <div v-show="item.nominators && item.nominators.length > 0">
                    {{ item.nominators.length }}
                </div>
            </template>
            <!-- NOMINATOR EXPANDED ITEM -->
            <template #expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <tr
                        v-for="nominator in item.nominators"
                        :key="nominator.id"
                    >
                        <td style="width: 24px"></td>
                        <td>
                            <div
                                class="text-truncate nominator-label"
                                style="width: 100px"
                            >
                                Nominator
                            </div>
                        </td>
                        <td>
                            <div style="width: 130px">
                                {{ nominator.totalStakeAmount | AXC }}
                                {{ nativeSymbol }}
                            </div>
                        </td>
                        <td style="width: 80px">
                            <div class="text-right date no-pad-right">
                                {{ nominator.startTime.getTime() | date }}
                            </div>
                            <div class="text-right time no-pad-right">
                                {{ nominator.startTime.getTime() | time }}
                            </div>
                        </td>
                        <td style="width: 125px">
                            <div
                                v-show="mode === 'absolute'"
                                class="diagram-container"
                            >
                                <div class="diagram">
                                    <div
                                        class="chartbar"
                                        :style="{
                                            left: `${scale(
                                                nominator.startTime.getTime()
                                            )}px`,
                                            width: `${
                                                scale(
                                                    nominator.endTime.getTime()
                                                ) -
                                                scale(
                                                    nominator.startTime.getTime()
                                                )
                                            }px`,
                                        }"
                                    ></div>
                                    <div
                                        class="chartbar_complete"
                                        :style="{
                                            left: `${scale(
                                                nominator.startTime.getTime()
                                            )}px`,
                                            width: `${
                                                scale(currentTime) -
                                                scale(
                                                    nominator.startTime.getTime()
                                                )
                                            }px`,
                                        }"
                                    ></div>
                                    <div
                                        class="now"
                                        :style="{
                                            left: `${scale(currentTime)}px`,
                                        }"
                                    ></div>
                                </div>
                            </div>
                            <div
                                v-if="mode === 'relative'"
                                class="diagram-container"
                            >
                                <div class="diagram">
                                    <div
                                        class="chartbar"
                                        :style="{
                                            left: `0px`,
                                            width: `${diagramWidth}px`,
                                        }"
                                    ></div>
                                    <div
                                        class="chartbar_complete"
                                        :style="{
                                            left: `0px`,
                                            width: `${scaleRelative(
                                                (currentTime -
                                                    nominator.startTime.getTime()) /
                                                    (nominator.endTime.getTime() -
                                                        nominator.startTime.getTime())
                                            )}px`,
                                        }"
                                    ></div>
                                    <div
                                        class="percentage_text text-right"
                                        :style="{ left: `71px` }"
                                    >
                                        {{ nominator.elapsed }} %
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td style="width: 80px">
                            <div class="date">
                                {{ nominator.endTime.getTime() | date }}
                            </div>
                            <div class="time">
                                {{ nominator.endTime.getTime() | time }}
                            </div>
                        </td>
                        <td style="width: 85px">
                            {{
                                (nominator.endTime - nominator.startTime)
                                    | duration
                            }}
                        </td>
                        <td :colspan="headers.length">
                            <div>{{ nominator.address }}</div>
                        </td>
                    </tr>
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { toAXC } from '@/helper'
import AllyChain from '@/js/AllyChain'
import { AXIA_ALLYCHAIN_ID } from '@/store/modules/platform/platform'
import { IValidator } from '@/store/modules/platform/IValidator'
import ContentMetadata from '@/components/AllyChains/ContentMetadata.vue'
import { scaleLinear } from 'd3-scale'
import { AXC_ID } from '@/known_assets'

@Component({
    components: {
        ContentMetadata,
    },
    filters: {
        AXC(val: number) {
            return parseFloat(toAXC(val).toFixed(9)).toLocaleString()
        },
    },
})
export default class ValidatorDataTable extends Vue {
    defaultAllyChainID: string = AXIA_ALLYCHAIN_ID
    currentTime: number | null = null
    startTimes: number[] = []
    endTimes: number[] = []
    minTime = 0
    maxTime = 1
    absolute = false
    diagramWidth = 125
    expanded: any[] = []
    search = ''
    filteredCount = 0

    @Prop() allyChainID!: string
    @Prop() allyChain!: AllyChain
    @Prop() validators!: IValidator[]
    @Prop() title!: string

    get headers(): any[] {
        return [
            { text: 'Validator', value: 'nodeID', width: 420 },
            { text: 'Stake', value: this.stakeOrWeight, width: 175 },
            { text: 'Potential Reward', value: 'potentialReward', width: 150 },
            { text: 'Start', value: 'startTime', align: 'end', width: 80 },
            {
                text: 'Completion',
                value: 'elapsed',
                align: 'center',
                width: 125,
            },
            { text: 'End', value: 'endTime', width: 80 },
            { text: 'Duration', value: 'duration', width: 85 },
            {
                text: 'Payout Address',
                value: 'rewardOwner.addresses[0]',
                width: 420,
            },
            { text: 'Delegation Fee', value: 'delegationFee', width: 125 },
            { text: 'Connected', value: 'connected', width: 125 },
            { text: 'Local Uptime', value: 'uptime', width: 125 },

            // { text: "Nominators", value: "nominators", width: 100 },
            // { text: "", value: "expand", align: "end" },
        ]
    }

    get stakeOrWeight(): string {
        return this.allyChainID === this.defaultAllyChainID ? 'stakeAmount' : 'weight'
    }

    get mode(): string {
        return this.absolute ? 'absolute' : 'relative'
    }

    get modeText() {
        return this.absolute ? 'Timeline' : 'Completion'
    }

    get nativeSymbol() {
        return this.$store.state.assets[AXC_ID].symbol
    }

    created() {
        const now = new Date()
        this.currentTime = now.getTime()
        this.minTime = this.minStartTime()
        this.maxTime = this.maxEndTime()
    }

    minStartTime() {
        const startTimes: number[] = []
        this.allyChain.validators.forEach((v: IValidator) => {
            startTimes.push(v.startTime.getTime())
        })
        return Math.min(...startTimes)
    }

    maxEndTime() {
        const endTimes: number[] = []
        this.allyChain.validators.forEach((v: IValidator) => {
            endTimes.push(v.endTime.getTime())
        })
        return Math.max(...endTimes)
    }

    scale(val: number) {
        const scale = scaleLinear()
            .domain([this.minTime, this.maxTime])
            .range([0, this.diagramWidth])
        return scale(val)
    }

    scaleRelative(val: number) {
        const scale = scaleLinear().domain([0, 1]).range([0, this.diagramWidth])
        return scale(val)
    }
}
</script>

<style scoped lang="scss">
#validator-data-table {
    margin-left: 1px;
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
    background-color: $secondary-color !important;
}

.diagram {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;
    height: 20px;
    position: relative;
    border-left: 1px solid $gray-light;
    border-right: 1px solid $gray-light;
}

.chartbar {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: $secondary-color-xlight;
}

.chartbar_complete {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: $secondary-color;
    opacity: 0.5;
}

.text-right {
    text-align: right !important;
}

.diagram-container {
    width: 125px;
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
    color: $primary-color;
    font-size: 12px;
    z-index: 3;
}

.date {
    color: $gray;
    padding-top: 21px;
    line-height: 1em !important;
}

.time {
    color: $gray;
    font-size: 10px;
}

.pad {
    padding-top: 9px;
}

.no-pad-right {
    padding-right: 0 !important;
}

.no-pad-left {
    padding-left: 0 !important;
}

.text-truncate {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-top: 7px;
}

.nominator-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.6);
    letter-spacing: 0.0071428571em;
}

@include smOnly {
    .v-card__text {
        padding-left: 16px;
        padding-right: 0;
    }
}

@include xsOrSmaller {
    #validator-data-table {
        .v-data-table td,
        .v-data-table th {
            padding: 0 16px;
        }
    }
}
</style>

<style lang="scss">
#validator_data_table {
    .v-application .primary--text {
        color: $primary-color !important;
        caret-color: $primary-color !important;
    }

    .theme--light.v-tabs > .v-tabs-bar--show-arrows {
        background-color: $white !important;
    }

    .theme--light.v-tabs-items {
        margin-left: 1px;
    }

    .v-input--selection-controls .v-input__slot > .v-label,
    .v-input--selection-controls .v-radio > .v-label {
        width: 113px;
    }

    .v-data-table td,
    .v-data-table th {
        padding: 0 4px;

        &:first-of-type {
            padding-left: 16px;
        }

        &:last-of-type {
            padding-right: 16px;
        }
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
}

@include xsOrSmaller {
    #validator-data-table {
        .v-data-table td,
        .v-data-table th {
            padding: 0 16px;
        }
    }
}
</style>

<style lang="scss">
#validator_data_table {
    .v-data-table__expand-icon {
        border: none;
        background-color: rgba(255, 255, 255, 0);
        border-radius: 0;
    }

    .v-data-footer__icons-before > button,
    .v-data-footer__icons-after > button {
        border-width: inherit;
        cursor: pointer;
    }

    .v-select.v-text-field input {
        border-color: transparent;
    }
}
</style>
