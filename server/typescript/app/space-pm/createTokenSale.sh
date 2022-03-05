#!/bin/bash
set -e

# SET UP VARS HERE
CARDANO_NODE_SOCKET_PATH=$(cat pathToSocket.sh)
cli=$(cat pathToCli.sh)
wallets="wallets"
script_path="data/space_printer_marketplace.plutus"

# Addresses
script_address=$(${cli} address build --payment-script-file ${script_path} --testnet-magic 1097911063)
# echo -e "Script: " $script_address

customer_address=$(cat ${wallets}/wallet-a/payment.addr)
# echo -e "\nCustomer: " ${customer_address}

# Define Asset to be printed here
asset="1 385a4b10e2aa436462dc70152601ab59043c2ae016dd193f3be8685c.Poopdoopydo010"

min_utxo=$(${cli} transaction calculate-min-required-utxo \
    --protocol-params-file tmp/protocol.json \
    --tx-out="${script_address} ${asset}" | tr -dc '0-9')
token_to_be_sold="${script_address} + ${min_utxo} + ${asset}"

echo -e "\nCreating A New Token Sale:\n" ${token_to_be_sold}

echo -e "\033[0;36m Getting Customer UTxO Information  \033[0m"
${cli} query utxo \
    --testnet-magic 1097911063 \
    --address ${customer_address} \
    --out-file tmp/customer_utxo.json

TXNS=$(jq length tmp/customer_utxo.json)
if [ "$TXNS" -eq "0" ]; then
   echo -e "\n \033[0;31m NO UTxOs Found At ${customer_address} \033[0m \n";
   exit;
fi
alltxin=""
TXIN=$(jq -r --arg alltxin "" 'keys[] | . + $alltxin + " --tx-in"' tmp/customer_utxo.json)
HEXTXIN=${TXIN::-8}

echo -e "\033[0;36m Building Tx \033[0m"
FEE=$(${cli} transaction build \
    --alonzo-era \
    --protocol-params-file tmp/protocol.json \
    --invalid-hereafter 99999999 \
    --out-file tmp/tx.draft \
    --change-address ${customer_address} \
    --tx-in ${HEXTXIN} \
    --tx-out="${token_to_be_sold}" \
    --tx-out-datum-embed-file data/datum4.json \
    --testnet-magic 1097911063)

IFS=':' read -ra VALUE <<< "$FEE"
IFS=' ' read -ra FEE <<< "${VALUE[1]}"
FEE=${FEE[1]}
echo -e "\033[1;32m Fee: \033[0m" $FEE

echo -e "\033[0;36m Signing \033[0m"
${cli} transaction sign \
    --signing-key-file ${wallets}/wallet-a/payment.skey \
    --tx-body-file tmp/tx.draft \
    --out-file tmp/tx.signed \
    --testnet-magic 1097911063

echo -e "\033[0;36m Submitting \033[0m"
${cli} transaction submit \
    --testnet-magic 1097911063 \
    --tx-file tmp/tx.signed