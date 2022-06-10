<template>
    <div class="axc_balance_table">
        <v-simple-table>
            <template v-slot:default>
                <thead>
                    <tr class="grid_headers">
                        <th class="text-left">Type</th>
                        <th class="text-right balance">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in balances" :key="item.name">
                        <td class="text-left">{{ item.name }}</td>
                        <td class="text-right balance">
                            {{ item.balance }} <span>AXC</span>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Big from 'big.js'

@Component({
    components: {},
})
export default class AXCBalanceTableSummary extends Vue {
    balances: any[] = [
        {
            name: 'Locked',
            balance: this.totalAXCLocked,
        },
        {
            name: 'Unlocked',
            balance: this.totalAXCUnlocked,
        },
        {
            name: 'Staked',
            balance: this.totalAXCStaked,
        },
        {
            name: 'Total Balance',
            balance: this.totalAXC,
        },
    ]

    @Prop() pUnlocked!: Big
    @Prop() pLockedStakeable!: Big
    @Prop() pLockedNotStakeable!: Big
    @Prop() pStaked!: Big
    @Prop() xpUnlocked!: Big
    @Prop() xUnlocked!: Big
    @Prop() xLocked!: Big
    @Prop() xcUnlocked!: Big

    get totalAXCStaked(): Big {
        return this.pStaked
    }

    get totalAXCLocked(): Big {
        return this.pLockedStakeable
            .plus(this.pLockedNotStakeable)
            .plus(this.xLocked)
    }

    get totalAXCUnlocked(): Big {
        return this.pUnlocked
            .plus(this.xpUnlocked)
            .plus(this.xUnlocked)
            .plus(this.xcUnlocked)
    }

    get totalAXC(): Big {
        return this.pUnlocked
            .plus(this.pLockedStakeable)
            .plus(this.pLockedNotStakeable)
            .plus(this.pStaked)
            .plus(this.xpUnlocked)
            .plus(this.xUnlocked)
            .plus(this.xLocked)
            .plus(this.xcUnlocked)
    }
}
</script>

<style scoped lang="scss">
.axc_balance_table {
    margin-top: 30px;
    margin-bottom: 30px;
    max-width: 500px;
}

.text-left {
    padding-left: 0;
}

.text-right,
.v-data-table thead th.text-right {
    text-align: right;
    padding-right: 0;
}

.v-data-table thead th.balance {
    padding-right: 44px;
}

.balance {
    span {
        display: inline-block;
        width: 38px;
        opacity: 0.4;
        text-align: left;
        padding-left: 4px;
    }
}

@include smOnly {
}

@include xsOrSmaller {
}
</style>
