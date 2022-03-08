export type UserName = string;
export type Password = string;
export type AccountType = "cardanobox" | "remote";
export type JwToken = string;
export type WalletID = string;
export type AccountName = string;
export type WalletPassPhrase = string;
export type AddressName = string;
export type Utxos = string;
export type Assets = string;
export type Metadata = string;
export type OutputAddress = string;
export type OutputValue = string;
export type ChangeAddress = string;
export type TxTTL = number;
export type Configjson = string;
export type Gcode = string;
export type FileURL = string;
export type FileName = string;
export type UpdateType = "full" | "update" | "ui";
export type StringDoaGddGA = string;
/**
 *
 * Generated! Represents an alias to any of the provided schemas
 *
 */
export type AnyOfUserNamePasswordAccountTypeUserNamePasswordAccountTypeJwTokenWalletIDJwTokenWalletIDAccountNameJwTokenWalletIDWalletPassPhraseAddressNameUtxosAssetsMetadataOutputAddressOutputValueChangeAddressTxTTLJwTokenConfigjsonJwTokenGcodeJwTokenFileURLFileNameJwTokenUpdateTypeStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGA = UserName | Password | AccountType | JwToken | WalletID | AccountName | WalletPassPhrase | AddressName | Utxos | Assets | Metadata | OutputAddress | OutputValue | ChangeAddress | TxTTL | Configjson | Gcode | FileURL | FileName | UpdateType | StringDoaGddGA;
export type InitDevice = () => Promise<StringDoaGddGA>;
export type CreateUser = (userName: UserName, password: Password, accountType: AccountType) => Promise<StringDoaGddGA>;
export type LoginUser = (userName: UserName, password: Password, accountType: AccountType) => Promise<StringDoaGddGA>;
export type ResetUser = () => Promise<StringDoaGddGA>;
export type GetCBWallets = (jwToken: JwToken, walletID: WalletID) => Promise<StringDoaGddGA>;
export type DelCBWallet = (jwToken: JwToken, walletID: WalletID, accountName: AccountName) => Promise<StringDoaGddGA>;
export type GenGruntTX = (jwToken: JwToken, walletID: WalletID, walletPassPhrase: WalletPassPhrase, addressName: AddressName, utxos: Utxos, assets: Assets, metadata: Metadata, outputAddress: OutputAddress, outputValue: OutputValue, changeAddress: ChangeAddress, txTTL: TxTTL) => Promise<StringDoaGddGA>;
export type EditConfig = (jwToken: JwToken, configjson: Configjson) => Promise<StringDoaGddGA>;
export type SendCmdToPrinter = (jwToken: JwToken, gcode: Gcode) => Promise<StringDoaGddGA>;
export type DownloadFile = (jwToken: JwToken, fileURL: FileURL, fileName: FileName) => Promise<StringDoaGddGA>;
export type Update = (jwToken: JwToken, updateType: UpdateType) => Promise<StringDoaGddGA>;