import initDevice from "./initDevice";
import createUser from "./createUser";
import loginUser from "./loginUser";
import resetUser from "./resetUser";
import cardanoWallet from "./cardanoWallet";
import createCardanoWallet from "./createCardanoWallet";
import genCBWallet from "./genCBWallet";
import genCBWalletAccount from "./genCBWalletAccount";
import getCBWallets from "./getCBWallets";
import delCBWallet from "./delCBWallet";
import genGruntTX from "./genGruntTX";
import editConfig from "./editConfig";
import sendCmdToPrinter from "./sendCmdToPrinter";
import downloadFile from "./downloadFile";
import update from "./update";
import cardanoCli from "./cardanoCli";
import cardanoNode from "./cardanoNode";

const methods = {
  initDevice,
  createUser,
  loginUser,
  resetUser,
  cardanoWallet,
  createCardanoWallet,
  genCBWallet,
  genCBWalletAccount,
  getCBWallets,
  delCBWallet,
  genGruntTX,
  editConfig,
  sendCmdToPrinter,
  downloadFile,
  update,
  cardanoCli,
  cardanoNode,
};

export default methods;
