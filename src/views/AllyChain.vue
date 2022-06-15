<template>
    <div id="allyChain_details" class="detail">
        <v-breadcrumbs :items="breadcrumbs" />
        <template v-if="!allyChainsLoaded">
            <Loader
                :content-id="allyChainID"
                :message="'Fetching AllyChain Details'"
            />
        </template>
        <template v-else>
            <div class="card">
                <Content :allyChain-i-d="allyChainID" :allyChain="allyChains[allyChainID]" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import { IAllyChains } from '@/store/modules/platform/models'
import AllyChain from '@/js/AllyChain'
import Content from '@/components/AllyChains/Content.vue'

@Component({
    components: {
        Loader,
        Content,
    },
})
export default class AllyChainPage extends Vue {
    allyChain: AllyChain | null = null

    breadcrumbs: any = [
        {
            text: 'Home',
            disabled: false,
            href: '/',
        },
        {
            text: 'AllyChains',
            disabled: false,
            href: '/allyChains',
        },
    ]

    @Watch('allyChainsLoaded')
    onAllyChainsLoadedChanged() {
        this.getData()
    }

    created() {
        this.getData()
    }

    get allyChains(): IAllyChains {
        return this.$store.state.Platform.allyChains
    }

    get allyChainID(): string {
        return this.$route.params.id
    }

    get allyChainsLoaded(): boolean {
        return this.$store.state.Platform.allyChainsLoaded
    }

    getData(): void {
        if (this.allyChainsLoaded) {
            this.allyChain = this.allyChains[this.allyChainID]
        }
    }
}
</script>
