<template>
    <div class="navbar_side">
        <v-list dense nav>
            <v-list-item :href="appChainURL">Home</v-list-item>
            <v-list-item to="/allyChains">AllyChains</v-list-item>
            <v-list-item to="/validators">Validators</v-list-item>
            <v-list-item to="/blockchains">Blockchains</v-list-item>
            <v-list-item to="/assets">Assets</v-list-item>
            <v-list-item to="/tx">Transactions</v-list-item>
            <v-list-item :href="appChainURL">AppChain</v-list-item>
            <v-list-item :href="statusPageURL">Status</v-list-item>
            <v-list-item to="/resources">Resources</v-list-item>
        </v-list>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {
    DEFAULT_NETWORK_ID,
    appChainExplorerURL,
    appChainExplorerURL_test,
    statusURL,
    statusURL_test,
} from '@/store/modules/network/network'

@Component({})
export default class NavbarSide extends Vue {
    get appChainURL() {
        return DEFAULT_NETWORK_ID === 1
            ? appChainExplorerURL
            : appChainExplorerURL_test
    }

    get statusPageURL() {
        return DEFAULT_NETWORK_ID === 1 ? statusURL : statusURL_test
    }
}
</script>

<style scoped lang="scss">
.navbar_side {
    /* margin-top: $navbar_height_offset_xl; */
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    min-width: 200px;
    height: 100%;
    background-color: $white;

    a:hover {
        text-decoration: none !important;
    }
}

.v-list--nav {
    padding: 15px 0;
}

.v-list--nav .v-list-item {
    padding: 0 24px;
    color: $primary-color;
}

.v-list--nav .v-list-item,
.v-list--nav .v-list-item:before {
    border-radius: 0;
}

.v-list-item--active::before {
    background-color: $primary-color-light !important;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
    color: $primary-color-light !important;
}
</style>
