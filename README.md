# zerodev-paymaster-scripts

This script is used to check the balance and deposit to the zerodev paymaster contract on [Conduit](https://www.conduit.xyz/) rollup chains.

To install dependencies:

```bash
bun install
```

Note that you need to configure `CHAIN`, `DEPOSIT_AMOUNT`, and `ENTRYPOINT` in `index.ts` before running the scripts.

To check the balance:

```bash
bun run check-balance
```

To deposit to the paymaster contract:

```bash
bun run deposit
```
