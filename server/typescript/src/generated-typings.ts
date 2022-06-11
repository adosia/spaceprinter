export type UserName = string;
export type Password = string;
export type SessionType = "cardanobox" | "remote" | "blockfrost";
export type JwToken = string;
export type WalletName = string;
export type SeedPhrase = string;
export type WalletPassPhrase = string;
export type WalletType = "general" | "printer";
export type WalletID = string;
export type AccountName = string;
export type Utxos = string;
export type Assets = string;
export type Metadata = string;
export type Outputs = string;
export type ChangeAddress = string;
export type TxTTL = number;
export type Configjson = string;
export type Gcode = string;
export type FileURL = string;
export type FileName = string;
export type UpdateType = "full" | "update" | "ui";
export type Hostname = string;
export type WifiAction = string;
export type Ssid = string;
export type SsidPass = string;
export type SslCommonName = string;
export type SslCountry = string;
export type SslLocation = string;
export type SslOrg = string;
export type StringDoaGddGA = string;
/**
 *
 * Generated! Represents an alias to any of the provided schemas
 *
 */
export type AnyOfUserNamePasswordSessionTypeUserNamePasswordSessionTypeJwTokenUserNameSessionTypeWalletNameSeedPhraseWalletPassPhraseWalletTypeJwTokenUserNameSessionTypeWalletIDJwTokenUserNameSessionTypeWalletIDAccountNameJwTokenUserNameSessionTypeWalletIDWalletPassPhraseAccountNameUtxosAssetsMetadataOutputsChangeAddressTxTTLJwTokenUserNameSessionTypeConfigjsonJwTokenUserNameSessionTypeGcodeJwTokenUserNameSessionTypeFileURLFileNameJwTokenUserNameSessionTypeUpdateTypeJwTokenUserNameSessionTypeHostnameJwTokenUserNameSessionTypeWifiActionSsidSsidPassJwTokenUserNameSessionTypeSslCommonNameSslCountrySslLocationSslOrgStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGA = UserName | Password | SessionType | JwToken | WalletName | SeedPhrase | WalletPassPhrase | WalletType | WalletID | AccountName | Utxos | Assets | Metadata | Outputs | ChangeAddress | TxTTL | Configjson | Gcode | FileURL | FileName | UpdateType | Hostname | WifiAction | Ssid | SsidPass | SslCommonName | SslCountry | SslLocation | SslOrg | StringDoaGddGA;
export type InitDevice = () => Promise<StringDoaGddGA>;
export type CreateUser = (userName: UserName, password: Password, sessionType: SessionType) => Promise<StringDoaGddGA>;
export type LoginUser = (userName: UserName, password: Password, sessionType: SessionType) => Promise<StringDoaGddGA>;
export type ResetUser = () => Promise<StringDoaGddGA>;
export type GenPrinterWallet = (jwToken: JwToken, userName: UserName, sessionType: SessionType, walletName: WalletName, seedPhrase: SeedPhrase, walletPassPhrase: WalletPassPhrase, walletType: WalletType) => Promise<StringDoaGddGA>;
export type GetCBWallets = (jwToken: JwToken, userName: UserName, sessionType: SessionType, walletID: WalletID) => Promise<StringDoaGddGA>;
export type DelCBWallet = (jwToken: JwToken, userName: UserName, sessionType: SessionType, walletID: WalletID, accountName: AccountName) => Promise<StringDoaGddGA>;
export type GenGruntTX = (jwToken: JwToken, userName: UserName, sessionType: SessionType, walletID: WalletID, walletPassPhrase: WalletPassPhrase, accountName: AccountName, utxos: Utxos, assets: Assets, metadata: Metadata, outputs: Outputs, changeAddress: ChangeAddress, txTTL: TxTTL) => Promise<StringDoaGddGA>;
export type EditConfig = (jwToken: JwToken, userName: UserName, sessionType: SessionType, configjson: Configjson) => Promise<StringDoaGddGA>;
export type SendCmdToPrinter = (jwToken: JwToken, userName: UserName, sessionType: SessionType, gcode: Gcode) => Promise<StringDoaGddGA>;
export type DownloadFile = (jwToken: JwToken, userName: UserName, sessionType: SessionType, fileURL: FileURL, fileName: FileName) => Promise<StringDoaGddGA>;
export type Update = (jwToken: JwToken, userName: UserName, sessionType: SessionType, updateType: UpdateType) => Promise<StringDoaGddGA>;
export type ChangeDeviceName = (jwToken: JwToken, userName: UserName, sessionType: SessionType, hostname: Hostname) => Promise<StringDoaGddGA>;
export type ManageWifi = (jwToken: JwToken, userName: UserName, sessionType: SessionType, wifiAction: WifiAction, ssid: Ssid, ssidPass: SsidPass) => Promise<StringDoaGddGA>;
export type GenSSL = (jwToken: JwToken, userName: UserName, sessionType: SessionType, sslCommonName: SslCommonName, sslCountry: SslCountry, sslLocation: SslLocation, sslOrg: SslOrg) => Promise<StringDoaGddGA>;