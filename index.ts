import { ENTRYPOINT_ADDRESS_V06, ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import {
    createWalletClient,
    formatEther,
    getContract,
    http,
    parseEther,
    type Address,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import {
    VERIFYING_PAYMASTER_V06_ABI,
    VERIFYING_PAYMASTER_V07_ABI,
} from './abi';

/**
 * @dev Edit these values
 */
const CHAIN = sepolia; // Edit this value to the chain you want to use
const DEPOSIT_AMOUNT = parseEther('1'); // Edit this value to the amount you want to deposit
const ENTRYPOINT: string = ENTRYPOINT_ADDRESS_V07; // or ENTRYPOINT_ADDRESS_V06

/**
 * @notice VERIFYING_PAYMASTER_ADDRESSES
 */
export const VERIFYING_PAYMASTER_V06_ADDRESS: Address =
    '0x9E23b350C3fd3316C813dea7C2B688E2A5611916';
export const VERIFYING_PAYMASTER_V07_ADDRESS: Address =
    '0x9119FDfC6076e9072E2fE74Be79F14660ed00687';

if (!process.env.RPC_URL) {
    throw new Error('RPC_URL is not set');
}

if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is not set');
}

const account = privateKeyToAccount(process.env.PRIVATE_KEY! as `0x${string}`);

const walletClient = createWalletClient({
    account,
    chain: CHAIN,
    transport: http(process.env.RPC_URL),
});

const checkBalance = async () => {
    if (ENTRYPOINT === ENTRYPOINT_ADDRESS_V06) {
        const verifyingPaymasterV06 = await getContract({
            address: VERIFYING_PAYMASTER_V06_ADDRESS,
            abi: VERIFYING_PAYMASTER_V06_ABI,
            client: walletClient,
        });

        const currentBalance = await verifyingPaymasterV06.read.getDeposit();
        console.log(
            'Current balance of VERIFYING_PAYMASTER_V06: ',
            formatEther(currentBalance),
        );
        return;
    }

    const verifyingPaymasterV07 = await getContract({
        address: VERIFYING_PAYMASTER_V07_ADDRESS,
        abi: VERIFYING_PAYMASTER_V07_ABI,
        client: walletClient,
    });
    const currentBalance = await verifyingPaymasterV07.read.getDeposit();
    console.log(
        'Current balance of VERIFYING_PAYMASTER_V07: ',
        formatEther(currentBalance),
    );
    return;
};

const deposit = async () => {
    if (ENTRYPOINT === ENTRYPOINT_ADDRESS_V06) {
        const verifyingPaymasterV06 = await getContract({
            address: VERIFYING_PAYMASTER_V06_ADDRESS,
            abi: VERIFYING_PAYMASTER_V06_ABI,
            client: walletClient,
        });

        await verifyingPaymasterV06.write
            .deposit({
                value: DEPOSIT_AMOUNT,
            })
            .then(() =>
                console.log(
                    `Funded VerifyingPaymaster V0.6: ${DEPOSIT_AMOUNT} ETH`,
                ),
            );
    }

    const verifyingPaymasterV07 = await getContract({
        address: VERIFYING_PAYMASTER_V07_ADDRESS,
        abi: VERIFYING_PAYMASTER_V07_ABI,
        client: walletClient,
    });

    await verifyingPaymasterV07.write
        .deposit({
            value: DEPOSIT_AMOUNT,
        })
        .then(() =>
            console.log(
                `Funded VerifyingPaymaster V0.7: ${DEPOSIT_AMOUNT} ETH`,
            ),
        );
};

const main = async () => {
    // check process args
    if (process.argv.includes('--check-balance')) {
        await checkBalance();
    }
    if (process.argv.includes('--deposit')) {
        await deposit();
    }
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
