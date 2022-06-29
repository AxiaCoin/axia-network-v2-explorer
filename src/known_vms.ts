interface VMDict {
    [key: string]: IVirtualMachine
}

interface IVirtualMachine {
    name: string
    fullName: string
    documentation: string
}

const dict: VMDict = {
    '': {
        name: 'corevm',
        fullName: 'Core',
        documentation: '',
        // 'https://github.com/AxiaCoin/axiago/tree/master/vms/platformvm',
    },
    jvYyfQTxGMJLuGWa55kdP2p2zSUYsQ5Raupu4TW34ZAUBAbtq: {
        name: 'avm',
        fullName: 'AXIA',
        documentation: '',
        // 'https://github.com/AxiaCoin/axiago/tree/master/vms/avm',
    },
    mgj786NP7uDwBCcq6YwThhaN8FLyybkCa4zBWTQbNgmK6k9A6: {
        name: 'evm',
        fullName: 'Ethereum',
        documentation: '',
        // 'https://github.com/AxiaCoin/axiago/tree/master/vms/evm',
    },
}

export default dict
