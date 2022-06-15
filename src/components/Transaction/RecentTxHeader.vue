<template>
    <div class="header">
        <div class="left">
            <h2>{{ heading }}</h2>

            <v-alert class="testnet_alert" text type="info" rounded="0">
                <p class="description">
                    Notice: This explorer only indexes the AssetChain and CoreChain.
                    To view AppChain transactions (EVM chain), click
                    <a class="bold c_chain_link" :href="appChainURL">here</a>.
                </p>
            </v-alert>

            <p class="chain">
                <span class="label">You are viewing transactions for</span>
                <v-tooltip>
                    <template v-slot:activator="{ on }">
                        <span
                            class="chain_tag"
                            :style="{
                                backgroundColor: coreChain.darkColor,
                            }"
                            v-on="on"
                            >{{ coreChain.name }}</span
                        >
                    </template>
                    <span
                        >The CoreChain is the metadata blockchain on Axia,
                        managing validators and custom subnets. Validators stake
                        AXC on the CoreChain to secure the network.</span
                    >
                </v-tooltip>
                <v-tooltip>
                    <template v-slot:activator="{ on }">
                        <span
                            class="chain_tag margin-left"
                            :style="{
                                backgroundColor: assetChain.darkColor,
                            }"
                            v-on="on"
                            >{{ assetChain.name }}</span
                        >
                    </template>
                    <span
                        >The AssetChain is the default asset blockchain on Axia
                        enabling the creation and instant exchange of assets.
                        This blockchain is for transfers that benefit from
                        high-throughput and instant finality. Think X for
                        eXchanging assets.
                    </span>
                </v-tooltip>
                <v-tooltip>
                    <template v-slot:activator="{ on }">
                        <span
                            class="chain_tag margin-left"
                            :style="{
                                backgroundColor: appChain.darkColor,
                            }"
                            v-on="on"
                            >{{ appChain.name }} (atomic txs only)</span
                        >
                    </template>
                    <span
                        >The AppChain is the default smart contract blockchain on
                        Axia and enables the creation of any Ethereum-compatible
                        applications and assets with lower fees and faster
                        transactions.</span
                    >
                </v-tooltip>
            </p>
        </div>
        <div class="right" bottom>
            <v-btn
                :loading="loading"
                :text="true"
                class="refresh ava_btn"
                @click="updateTx"
            >
                <fa icon="sync"></fa>
                <span class="ava-btn-label">Refresh</span>
            </v-btn>
            <v-btn :text="true" class="ava_btn" @click="goToTx">
                View All Transactions
            </v-btn>
        </div>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { P, X, C, getTassetChainType } from '@/known_blockchains'
import {
    DEFAULT_NETWORK_ID,
    appChainExplorerURL,
    appChainExplorerURL_test,
} from '@/store/modules/network/network'

@Component({
    components: {},
})
export default class RecentTxHeader extends Vue {
    @Prop() heading!: string
    @Prop() loading!: boolean

    updateTx() {
        this.$emit('update')
    }

    get assetChain() {
        return getTassetChainType(X.id)
    }

    get coreChain() {
        return getTassetChainType(P.id)
    }

    get appChain() {
        return getTassetChainType(C.id)
    }

    get appChainURL() {
        return DEFAULT_NETWORK_ID === 1
            ? appChainExplorerURL
            : appChainExplorerURL_test
    }

    goToTx() {
        this.$router.push('/tx')
    }
}
</script>
<style scoped lang="scss">
.testnet_alert {
    background-color: $white !important;
}

@if $VUE_APP_DEFAULT_NETWORKID == 1 {
    .v-alert--text:before {
        background-color: $white;
    }
}

.bold {
    font-weight: 700;
}

.margin-left {
    margin-left: 10px;
}

.refresh {
    margin-left: 16px;
}

.ava-btn-label {
    padding-left: 8px;
}

.c_chain_link {
    color: #2196f3 !important;
    text-decoration: underline;
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    h2 {
        padding-bottom: 10px;
    }

    .refresh {
        color: $primary-color;
        text-transform: none;
        border: none;
    }

    .left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex-grow: 1;
    }

    .right {
        flex-grow: 1;
        display: flex;
        flex-direction: row-reverse;
        align-items: flex-end;
    }
}
@include smOnly {
    .header {
        padding-bottom: 0;

        .right {
            display: none;
        }
    }
}

@include xsOrSmaller {
    .header {
        display: flex;
        flex-direction: column;

        .left {
            display: flex;
            width: 100%;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .right {
            padding: 15px 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-content: center;
        }
    }
}
</style>
