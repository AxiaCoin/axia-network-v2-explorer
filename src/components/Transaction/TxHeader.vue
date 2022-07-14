<template>
    <div class="header">
        <h2>Transactions</h2>
        <v-alert class="testnet_alert" text type="info" rounded="0">
            <p class="description">
                Notice: This explorer only indexes the Swap-Chain and
                Core-Chain. To view AX-Chain transactions (EVM chain), click
                <a class="bold c_chain_link" :href="axChainURL">here</a>.
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
                    >The Core-Chain is the metadata blockchain on AXIA, managing
                    validators and custom allychains. Validators stake AXC on
                    the Core-Chain to secure the network.</span
                >
            </v-tooltip>
            <v-tooltip>
                <template v-slot:activator="{ on }">
                    <span
                        class="chain_tag margin-left"
                        :style="{
                            backgroundColor: swapChain.darkColor,
                        }"
                        v-on="on"
                        >{{ swapChain.name }}</span
                    >
                </template>
                <span
                    >The Swap-Chain is the default asset blockchain on AXIA
                    enabling the creation and instant exchange of assets. This
                    blockchain is for transfers that benefit from
                    high-throughput and instant finality. Think Swap for
                    eXchanging assets.
                </span>
            </v-tooltip>
            <v-tooltip>
                <template v-slot:activator="{ on }">
                    <span
                        class="chain_tag margin-left"
                        :style="{
                            backgroundColor: axChain.darkColor,
                        }"
                        v-on="on"
                        >{{ axChain.name }} (atomic txs only)</span
                    >
                </template>
                <span
                    >The AX-Chain is the default smart contract blockchain on
                    AXIA and enables the creation of any Ethereum-compatible
                    applications and assets with lower fees and faster
                    transactions.</span
                >
            </v-tooltip>
        </p>
    </div>
</template>
<script lang="ts">
import 'reflect-metadata'
import { Vue, Component } from 'vue-property-decorator'
import { Core, Swap, AX, getTswapChainType } from '@/known_blockchains'
import {
    DEFAULT_NETWORK_ID,
    axChainExplorerURL,
    axChainExplorerURL_test,
} from '@/store/modules/network/network'

@Component({})
export default class TxHeader extends Vue {
    get swapChain() {
        return getTswapChainType(Swap.id)
    }

    get coreChain() {
        return getTswapChainType(Core.id)
    }

    get axChain() {
        return getTswapChainType(AX.id)
    }

    get axChainURL() {
        return DEFAULT_NETWORK_ID === 1
            ? axChainExplorerURL
            : axChainExplorerURL_test
    }
}
</script>
<style scoped lang="scss">
.testnet_alert {
    background-color: $white !important;
}

// @if $VUE_APP_DEFAULT_NETWORKID == 1 {
//     .v-alert--text:before {
//         background-color: $white;
//     }
// }

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
    flex-direction: column;
    align-items: flex-start;
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
