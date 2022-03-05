Put the path to the node socket in the pathToSocket.sh file and put the path to the cardano-cli inside the pathToCli.sh file.

Wallet-a is the customer and wallet-b is the printer.

```bash
# wallet-a creates a printing job in the pool
bash createPrintingJob.sh
# wait a block
# wallet-b selects a job to print
bash selectPrintingJob.sh
# wallet-b prints the object
bash finishPrintingJob.sh
# wallet-a receives item
bash confirmShippedJob.sh
```

```bash
# wallet-a creates a printing job in the pool
bash createPrintingJob.sh
# wallet-a removes
bash removePrintingJob.sh
```

```bash
# wallet-a creates a printing job in the pool
bash createPrintingJob.sh
# wallet-a decides to remove from pool and moveit into the market
bash moveJobToTokenSale.sh
# wallet-a removes the token sale
bash removeTokenSale.sh
```

Check the balances with

```bash
bash balances.sh
```
