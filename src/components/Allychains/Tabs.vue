<template>
    <div id="allychain_tabs">
        <v-tabs vertical right>
            <v-tab v-for="(s, allychainID) in allychains" :key="s.id">{{
                allychainID | allychain
            }}</v-tab>
            <v-tab-item
                v-for="(s, allychainID) in allychains"
                :key="s.id"
                :vertical="true"
            >
                <Content :allychain-i-d="allychainID" :allychain="s" />
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Content from '@/components/Allychains/Content.vue'
import Allychain from '@/js/Allychain'

interface Allychains {
    [key: string]: Allychain
}

@Component({
    components: {
        Content,
    },
})
export default class AllychainTabs extends Vue {
    @Prop() allychains!: Allychains
}
</script>

<style scoped lang="scss">
.v-tabs--vertical {
    margin-right: 30px;
    flex-direction: row-reverse;
}

.v-tabs--vertical > .v-tabs-bar .v-tab {
    width: 150px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    justify-content: flex-start;
    min-height: 48px;
    height: 30px;
    text-transform: none;
}

.v-tab {
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
}

.v-tab--active{
    color: #178FE1 !important;
    border-left: 4px solid #178FE1;
}

.v-tab:before {
    background-color: $primary-color !important;
}
</style>

<style lang="scss">
#allychain_tabs {
    background-color: #F8F9FA !important;
    .v-tabs--vertical > .v-tabs-bar {
        padding-right: 30px;
        background-color: #F8F9FA !important;
        max-width: 200px !important;
        border-left: 1px solid #cecece;
    }
    .v-tabs--vertical > .v-window {
        overflow: hidden !important;
    }

    .v-card__text {
        padding-left: 0 !important;
    }

    .v-tab.v-tab {
        font-family: 'Inter', sans-serif;
        text-transform: uppercase;
        font-weight: 500;
    }
    .v-application .primary--text {
        color: $primary-color !important;
        caret-color: $primary-color !important;
    }

    .v-tabs-slider-wrapper {
        color: $secondary-color;
        caret-color: $secondary-color;
    }
}
</style>
