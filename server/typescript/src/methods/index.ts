import initDevice from "./initDevice";
import createUser from "./createUser";
import loginUser from "./loginUser";
import resetUser from "./resetUser";
import genPrinterWallet from "./genPrinterWallet";
import getCBWallets from "./getCBWallets";
import delCBWallet from "./delCBWallet";
import genGruntTX from "./genGruntTX";
import editConfig from "./editConfig";
import sendCmdToPrinter from "./sendCmdToPrinter";
import downloadFile from "./downloadFile";
import update from "./update";
import changeDeviceName from "./changeDeviceName";
import manageWifi from "./manageWifi";
import genSSL from "./genSSL";

const methods = {
  initDevice,
  createUser,
  loginUser,
  resetUser,
  genPrinterWallet,
  getCBWallets,
  delCBWallet,
  genGruntTX,
  editConfig,
  sendCmdToPrinter,
  downloadFile,
  update,
  changeDeviceName,
  manageWifi,
  genSSL,
};

export default methods;
