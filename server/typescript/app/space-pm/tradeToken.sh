#!/bin/bash
set -e

# SET UP VARS HERE
CARDANO_NODE_SOCKET_PATH=$(cat pathToSocket.sh)
cli=$(cat pathToCli.sh)
wallets="wallets"
script_path="data/space_printer_marketplace.plutus"

# Addresses
customer_address=$(cat ${wallets}/wallet-a/payment.addr)
printer_address=$(cat ${wallets}/wallet-b/payment.addr)
# echo -e "\nCustomer: " ${customer_address}

# Define Asset to be printed here
asset="1 385a4b10e2aa436462dc70152601ab59043c2ae016dd193f3be8685c.Poopdoopydo010"

min_utxo=$(${cli} transaction calculate-min-required-utxo \
    --protocol-params-file tmp/protocol.json \
    --tx-out="${customer_address} ${asset}" | tr -dc '0-9')
token_to_be_traded="${customer_address} + ${min_utxo} + ${asset}"

echo -e "\nCreating A New Printing Job:\n" ${token_to_be_traded}

echo -e "\033[0;36m Getting Customer UTxO Information  \033[0m"
${cli} query utxo \
    --testnet-magic 1097911063 \
    --address ${printer_address} \
    --out-file tmp/printer_utxo.json

TXNS=$(jq length tmp/printer_utxo.json)
if [ "$TXNS" -eq "0" ]; then
   echo -e "\n \033[0;31m NO UTxOs Found At ${printer_address} \033[0m \n";
   exit;
fi
alltxin=""
TXIN=$(jq -r --arg alltxin "" 'keys[] | . + $alltxin + " --tx-in"' tmp/printer_utxo.json)
HEXTXIN=${TXIN::-8}

echo -e "\033[0;36m Building Tx \033[0m"
FEE=$(${cli} transaction build \
    --alonzo-era \
    --protocol-params-file tmp/protocol.json \
    --invalid-hereafter 99999999 \
    --out-file tmp/tx.draft \
    --change-address ${printer_address} \
    --tx-in ${HEXTXIN} \
    --tx-out="${token_to_be_traded}" \
    --testnet-magic 1097911063)

IFS=':' read -ra VALUE <<< "$FEE"
IFS=' ' read -ra FEE <<< "${VALUE[1]}"
FEE=${FEE[1]}
echo -e "\033[1;32m Fee: \033[0m" $FEE

echo -e "\033[0;36m Signing \033[0m"
${cli} transaction sign \
    --signing-key-file ${wallets}/wallet-b/payment.skey \
    --tx-body-file tmp/tx.draft \
    --out-file tmp/tx.signed \
    --testnet-magic 1097911063

echo -e "\033[0;36m Submitting \033[0m"
${cli} transaction submit \
    --testnet-magic 1097911063 \
    --tx-file tmp/tx.signed