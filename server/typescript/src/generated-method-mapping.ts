// Code generated by @open-rpc/generator DO NOT EDIT or ur gonna have a bad tiem
import { MethodMapping } from "@open-rpc/server-js/build/router";

import methods from "./methods";

export const methodMapping: MethodMapping = {
  initDevice: methods.initDevice,
  createUser: methods.createUser,
  loginUser: methods.loginUser,
  resetUser: methods.resetUser,
  cardanoWallet: methods.cardanoWallet,
  createCardanoWallet: methods.createCardanoWallet,
  genCBWallet: methods.genCBWallet,
  genCBWalletAccount: methods.genCBWalletAccount,
  getCBWallets: methods.getCBWallets,
  delCBWallet: methods.delCBWallet,
  genGruntTX: methods.genGruntTX,
  editConfig: methods.editConfig,
  sendCmdToPrinter: methods.sendCmdToPrinter,
  downloadFile: methods.downloadFile,
  update: methods.update,
  cardanoCli: methods.cardanoCli,
  cardanoNode: methods.cardanoNode,
};

export default methodMapping;
