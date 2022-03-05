export type UserName = string;
export type Password = string;
export type JwToken = string;
export type RestEndpointType = string;
export type RestEndpoint = string;
export interface RestEndpointData { [key: string]: any; }
export type WalletName = string;
export type SeedPhrase = string;
export type WalletPassPhrase = string;
export type XpubKey = string;
export type WalletType = "general" | "printer";
export type WalletID = string;
export type AccountName = string;
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
export type CardanoCliCmd = string;
export type NodeAction = string;
export type NodeNetwork = string;
export type StringDoaGddGA = string;
/**
 *
 * Generated! Represents an alias to any of the provided schemas
 *
 */
export type AnyOfUserNamePasswordUserNamePasswordJwTokenRestEndpointTypeRestEndpointRestEndpointDataJwTokenWalletNameSeedPhraseWalletPassPhraseXpubKeyJwTokenWalletNameSeedPhraseWalletPassPhraseWalletTypeJwTokenWalletIDAccountNameWalletPassPhraseJwTokenWalletIDJwTokenWalletIDAccountNameJwTokenWalletIDWalletPassPhraseAddressNameUtxosAssetsMetadataOutputAddressOutputValueChangeAddressTxTTLJwTokenConfigjsonJwTokenGcodeJwTokenFileURLFileNameJwTokenUpdateTypeJwTokenCardanoCliCmdJwTokenNodeActionNodeNetworkStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGAStringDoaGddGA = UserName | Password | JwToken | RestEndpointType | RestEndpoint | RestEndpointData | WalletName | SeedPhrase | WalletPassPhrase | XpubKey | WalletType | WalletID | AccountName | AddressName | Utxos | Assets | Metadata | OutputAddress | OutputValue | ChangeAddress | TxTTL | Configjson | Gcode | FileURL | FileName | UpdateType | CardanoCliCmd | NodeAction | NodeNetwork | StringDoaGddGA;
export type InitDevice = () => Promise<StringDoaGddGA>;
export type CreateUser = (userName: UserName, password: Password) => Promise<StringDoaGddGA>;
export type LoginUser = (userName: UserName, password: Password) => Promise<StringDoaGddGA>;
export type ResetUser = () => Promise<StringDoaGddGA>;
export type CardanoWallet = (jwToken: JwToken, restEndpointType: RestEndpointType, restEndpoint: RestEndpoint, restEndpointData: RestEndpointData) => Promise<StringDoaGddGA>;
export type CreateCardanoWallet = (jwToken: JwToken, walletName: WalletName, seedPhrase: SeedPhrase, walletPassPhrase: WalletPassPhrase, xpubKey: XpubKey) => Promise<StringDoaGddGA>;
export type GenCBWallet = (jwToken: JwToken, walletName: WalletName, seedPhrase: SeedPhrase, walletPassPhrase: WalletPassPhrase, walletType: WalletType) => Promise<StringDoaGddGA>;
export type GenCBWalletAccount = (jwToken: JwToken, walletID: WalletID, accountName: AccountName, walletPassPhrase: WalletPassPhrase) => Promise<StringDoaGddGA>;
export type GetCBWallets = (jwToken: JwToken, walletID: WalletID) => Promise<StringDoaGddGA>;
export type DelCBWallet = (jwToken: JwToken, walletID: WalletID, accountName: AccountName) => Promise<StringDoaGddGA>;
export type GenGruntTX = (jwToken: JwToken, walletID: WalletID, walletPassPhrase: WalletPassPhrase, addressName: AddressName, utxos: Utxos, assets: Assets, metadata: Metadata, outputAddress: OutputAddress, outputValue: OutputValue, changeAddress: ChangeAddress, txTTL: TxTTL) => Promise<StringDoaGddGA>;
export type EditConfig = (jwToken: JwToken, configjson: Configjson) => Promise<StringDoaGddGA>;
export type SendCmdToPrinter = (jwToken: JwToken, gcode: Gcode) => Promise<StringDoaGddGA>;
export type DownloadFile = (jwToken: JwToken, fileURL: FileURL, fileName: FileName) => Promise<StringDoaGddGA>;
export type Update = (jwToken: JwToken, updateType: UpdateType) => Promise<StringDoaGddGA>;
export type CardanoCli = (jwToken: JwToken, cardanoCliCmd: CardanoCliCmd) => Promise<StringDoaGddGA>;
export type CardanoNode = (jwToken: JwToken, nodeAction: NodeAction, nodeNetwork: NodeNetwork) => Promise<StringDoaGddGA>;