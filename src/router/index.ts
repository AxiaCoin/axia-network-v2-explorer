import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import { IMetaTag } from '@/router/IMetaTag'
// import {
//     DEFAULT_NETWORK_ID,
//     axChainExplorerURL,
//     axChainExplorerURL_test,
// } from '@/store/modules/network/network'

Vue.use(VueRouter)

const suffix = ' | Axia Explorer'
const description =
    'Axia Explorer is an analytics tool that enables people to search the Axia blockchain for transactions, addresses, and other platform activities.'
const defaultMetaTags: IMetaTag[] = [
    {
        name: 'description',
        content: description,
    },
    {
        property: 'og:description',
        content: description,
    },
]

// const axChainURL =
//     DEFAULT_NETWORK_ID === 1 ? axChainExplorerURL : axChainExplorerURL_test

const routes = [
    {
        path: '/allychains',
        name: 'Allychains',
        component: () =>
            import(
                /* webpackChunkName: "allychains" */ '../views/Allychains.vue'
            ),
        meta: {
            auth: false,
            title: 'Allychains' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/allychain/:id',
        name: 'Allychain',
        component: () =>
            import(
                /* webpackChunkName: "allychain" */ '../views/Allychain.vue'
            ),
        meta: {
            auth: false,
            title: 'Allychain' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/validators',
        name: 'Validators',
        component: () =>
            import(
                /* webpackChunkName: "validators" */ '../views/Validators.vue'
            ),
        meta: {
            auth: false,
            title: 'Validators Transparency' + suffix,
            metaTags: [
                {
                    name: 'description',
                    content:
                        'Axia Explorer for validators is the perfect analytics tool that enables transactions, addresses, and other platform transparency.',
                },
                {
                    property: 'og:description',
                    content:
                        'Axia Explorer for validators is the perfect analytics tool that enables transactions, addresses, and other platform transparency.',
                },
            ],
        },
    },
    {
        path: '/tx',
        name: 'Transactions',
        component: () =>
            import(
                /* webpackChunkName: "transactions" */ '../views/Transactions.vue'
            ),
        meta: {
            auth: false,
            title: 'Transactions' + suffix,
            metaTags: [
                {
                    name: 'description',
                    content:
                        'View transactions on Core-Chain, Swap-Chain, and AX-Chain with the Axia Explorer. Providing our community of individuals, developers, and investors piece of mind.',
                },
                {
                    property: 'og:description',
                    content:
                        'View transactions on Core-Chain, Swap-Chain, and AX-Chain with the Axia Explorer. Providing our community of individuals, developers, and investors piece of mind.',
                },
            ],
        },
    },
    {
        path: '/tx/:id',
        name: 'Transaction',
        component: () =>
            import(
                /* webpackChunkName: "transaction" */ '../views/Transaction.vue'
            ),
        meta: {
            auth: false,
            title: 'Transaction' + suffix,
            metaTags: [
                {
                    name: 'description',
                    content:
                        'View transactions on Core-Chain, Swap-Chain, and AX-Chain with the Axia Explorer. Providing our community of individuals, developers, and investors piece of mind.',
                },
                {
                    property: 'og:description',
                    content:
                        'View transactions on Core-Chain, Swap-Chain, and AX-Chain with the Axia Explorer. Providing our community of individuals, developers, and investors piece of mind.',
                },
            ],
        },
    },
    {
        path: '/evmtx/:id',
        name: 'EVM Transaction',
        component: () =>
            import(
                /* webpackChunkName: "evmtransaction" */ '../views/EVMTransaction.vue'
            ),
        meta: {
            auth: false,
            title: 'Transaction' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/evmblock/:id',
        name: 'EVM Block',
        component: () =>
            import(/* webpackChunkName: "evmblock" */ '../views/EVMBlock.vue'),
        meta: {
            auth: false,
            title: 'Block' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/evmaddress/:id',
        name: 'EVM Address',
        component: () =>
            import(
                /* webpackChunkName: "evmaddress" */ '../views/EVMAddress.vue'
            ),
        meta: {
            auth: false,
            title: 'Address' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/',
        name: 'Blockchains',
        component: () =>
            import(
                /* webpackChunkName: "blockchains" */ '../views/Blockchains.vue'
            ),
        meta: {
            auth: false,
            title: 'Blockchains' + suffix,
            metaTags: [
                {
                    name: 'description',
                    content:
                        'Blockchain transparency with the Axia Explorer enables people to search for transactions, addresses, and other platform activities.',
                },
                {
                    property: 'og:description',
                    content:
                        'Blockchain transparency with the Axia Explorer enables people to search for transactions, addresses, and other platform activities.',
                },
            ],
        },
    },
    {
        path: '/blockchains',
        name: 'Blockchains',
        component: () =>
            import(
                /* webpackChunkName: "blockchains" */ '../views/Blockchains.vue'
            ),
        meta: {
            auth: false,
            title: 'Blockchains' + suffix,
            metaTags: [
                {
                    name: 'description',
                    content:
                        'Blockchain transparency with the Axia Explorer enables people to search for transactions, addresses, and other platform activities.',
                },
                {
                    property: 'og:description',
                    content:
                        'Blockchain transparency with the Axia Explorer enables people to search for transactions, addresses, and other platform activities.',
                },
            ],
        },
    },
    {
        path: '/blockchain/:id',
        name: 'Blockchain',
        component: () =>
            import(
                /* webpackChunkName: "blockchains" */ '../views/Blockchain.vue'
            ),
        meta: {
            auth: false,
            title: 'Blockchain' + suffix,
            metaTags: [
                {
                    name: 'description',
                    content:
                        'Blockchain transparency with the Axia Explorer enables people to search for transactions, addresses, and other platform activities.',
                },
                {
                    property: 'og:description',
                    content:
                        'Blockchain transparency with the Axia Explorer enables people to search for transactions, addresses, and other platform activities.',
                },
            ],
        },
    },
    {
        path: '/assets',
        name: 'Assets',
        component: () =>
            import(/* webpackChunkName: "assets" */ '../views/Assets.vue'),
        beforeEnter() {
            const NETWORK_ID = parseInt(
                process.env.VUE_APP_DEFAULT_NETWORKID || '1'
            )
            window.location.href =
                NETWORK_ID === 1
                    ? 'https://avascan.info/tokens'
                    : 'https://testnet.avascan.info/tokens'
        },
        meta: {
            auth: false,
            title: 'Assets' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/asset/:id',
        name: 'Asset',
        component: () =>
            import(/* webpackChunkName: "asset" */ '../views/Asset.vue'),
        meta: {
            auth: false,
            title: 'Asset' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/addresses',
        name: 'Addresses',
        component: () =>
            import(
                /* webpackChunkName: "addresses" */ '../views/Addresses.vue'
            ),
        meta: {
            auth: false,
            title: 'Addresses' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/address/:address',
        name: 'Address',
        component: () =>
            import(/* webpackChunkName: "address" */ '../views/Address.vue'),
        meta: {
            auth: false,
            title: 'Address' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/search',
        name: 'Search',
        component: () =>
            import(/* webpackChunkName: "search" */ '../views/Search.vue'),
        meta: {
            auth: false,
            title: 'Search' + suffix,
            metaTags: defaultMetaTags,
        },
    },
    {
        path: '/resources',
        name: 'Resources',
        component: () =>
            import(
                /* webpackChunkName: "resources" */ '../views/Resources.vue'
            ),
        meta: {
            auth: false,
            title: 'Resources' + suffix,
            metaTags: defaultMetaTags,
        },
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    // Scroll to top on route change
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes,
})

export default router
