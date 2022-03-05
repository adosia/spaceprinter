#!/usr/bin/bash
set -e
# SET UP VARS HERE
CARDANO_NODE_SOCKET_PATH=$(cat pathToSocket.sh)
cli=$(cat pathToCli.sh)
wallets="wallets"
script_path="data/space_printer_marketplace.plutus"

script=$(${cli} address build --payment-script-file ${script_path} --testnet-magic 1097911063)
customer=$(cat ${wallets}/wallet-a/payment.addr)
printer=$(cat ${wallets}/wallet-b/payment.addr)
other=$(cat ${wallets}/wallet-c/payment.addr)


echo ##############################################################################
echo "Script Address:" ${script}
${cli} query utxo --address ${script} --testnet-magic 1097911063


echo ##############################################################################
echo "Customer Address:" ${customer}
${cli} query utxo --address ${customer} --testnet-magic 1097911063

echo ##############################################################################
echo "Printer Address:" ${printer}
${cli} query utxo --address ${printer} --testnet-magic 1097911063

echo ##############################################################################
echo "Printer Address:" ${other}
${cli} query utxo --address ${other} --testnet-magic 1097911063
