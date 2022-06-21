<template>
    <div id="allychain_details" class="detail">
        <v-breadcrumbs :items="breadcrumbs" />
        <template v-if="!allychainsLoaded">
            <Loader
                :content-id="allychainID"
                :message="'Fetching Allychain Details'"
            />
        </template>
        <template v-else>
            <div class="card">
                <Content
                    :allychain-i-d="allychainID"
                    :allychain="allychains[allychainID]"
                />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import 'reflect-metadata'
import { Vue, Component, Watch } from 'vue-property-decorator'
import Loader from '@/components/misc/Loader.vue'
import { IAllychains } from '@/store/modules/platform/models'
import Allychain from '@/js/Allychain'
import Content from '@/components/Allychains/Content.vue'

@Component({
    components: {
        Loader,
        Content,
    },
})
export default class AllychainPage extends Vue {
    allychain: Allychain | null = null

    breadcrumbs: any = [
        {
            text: 'Home',
            disabled: false,
            href: '/',
        },
        {
            text: 'Allychains',
            disabled: false,
            href: '/allychains',
        },
    ]

    @Watch('allychainsLoaded')
    onAllychainsLoadedChanged() {
        this.getData()
    }

    created() {
        this.getData()
    }

    get allychains(): IAllychains {
        return this.$store.state.Platform.allychains
    }

    get allychainID(): string {
        return this.$route.params.id
    }

    get allychainsLoaded(): boolean {
        return this.$store.state.Platform.allychainsLoaded
    }

    getData(): void {
        if (this.allychainsLoaded) {
            this.allychain = this.allychains[this.allychainID]
        }
    }
}
</script>
