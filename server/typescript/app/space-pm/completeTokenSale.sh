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
buyer_address=$(cat ${wallets}/wallet-b/payment.addr)
# echo -e "\nPrinter: " ${buyer_address}

# Define Asset to be printed here
asset="1 385a4b10e2aa436462dc70152601ab59043c2ae016dd193f3be8685c.Poopdoopydo010"

min_utxo=$(${cli} transaction calculate-min-required-utxo \
    --protocol-params-file tmp/protocol.json \
    --tx-out="${buyer_address} ${asset}" | tr -dc '0-9')
sale_is_finished="${buyer_address} + ${min_utxo} + ${asset}"

echo -e "\nCompleting A Token Sale:\n" ${sale_is_finished}

echo -e "\033[0;36m Getting Buyer UTxO Information  \033[0m"
${cli} query utxo \
    --testnet-magic 1097911063 \
    --address ${buyer_address} \
    --out-file tmp/buyer_utxo.json

TXNS=$(jq length tmp/buyer_utxo.json)
if [ "$TXNS" -eq "0" ]; then
   echo -e "\n \033[0;31m NO UTxOs Found At ${buyer_address} \033[0m \n";
   exit;
fi
alltxin=""
TXIN=$(jq -r --arg alltxin "" 'keys[] | . + $alltxin + " --tx-in"' tmp/buyer_utxo.json)
CTXIN=$(jq -r --arg alltxin "" 'keys[] | . + $alltxin + " --tx-in-collateral"' tmp/buyer_utxo.json)
COLLAT=${CTXIN::-19}
HEXTXIN=${TXIN::-8}

echo -e "\033[0;36m Getting Script UTxO Information  \033[0m"
${cli} query utxo \
    --address ${script_address} \
    --testnet-magic 1097911063 \
    --out-file tmp/script_utxo.json
# transaction variables
TXNS=$(jq length tmp/script_utxo.json)
if [ "$TXNS" -eq "0" ]; then
   echo -e "\n \033[0;31m NO UTxOs Found At ${script_address} \033[0m \n";
   exit;
fi
alltxin=""
TXIN=$(jq -r --arg alltxin "" 'keys[] | . + $alltxin + " --tx-in"' tmp/script_utxo.json)
SCRIPT_TXIN=${TXIN::-8}


echo -e "\033[0;36m Building Tx \033[0m"
FEE=$(${cli} transaction build \
    --alonzo-era \
    --protocol-params-file tmp/protocol.json \
    --invalid-hereafter 99999999 \
    --out-file tmp/tx.draft \
    --change-address ${buyer_address} \
    --tx-in ${HEXTXIN} \
    --tx-in-collateral ${COLLAT} \
    --tx-in ${SCRIPT_TXIN}  \
    --tx-in-datum-file data/datum4.json \
    --tx-in-redeemer-file data/redeemer8.json \
    --tx-out ${customer_address}+10000000 \
    --tx-out="${sale_is_finished}" \
    --required-signer ${wallets}/wallet-b/payment.skey \
    --tx-in-script-file ${script_path} \
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