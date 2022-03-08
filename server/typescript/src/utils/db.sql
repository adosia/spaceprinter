CREATE TABLE IF NOT EXISTS Account
(
    id INTEGER PRIMARY KEY autoincrement,
    accountName CHAR(50) NOT NULL UNIQUE,
    accountPassword CHAR(256) NOT NULL,
    accountType CHAR(50) NOT NULL,
    timeCreated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Wallets
(
    id INTEGER PRIMARY KEY autoincrement,
    walletID CHAR(50) NOT NULL UNIQUE,
    walletName CHAR(50) NOT NULL UNIQUE,
    walletType TEXT NOT NULL,
    walletRootKey TEXT NOT NULL UNIQUE,
    timeCreated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS WalletAccounts
(
    id INTEGER PRIMARY KEY autoincrement,
    walletID CHAR(50) NOT NULL,
    accountName CHAR(50) NOT NULL,
    accountIndex INTEGER NOT NULL,
    accountKeyPrv TEXT NOT NULL UNIQUE,
    baseAddr TEXT NOT NULL UNIQUE,
    enterpriseAddr TEXT NOT NULL UNIQUE,
    pointerAddr TEXT NOT NULL UNIQUE,
    rewardAddr TEXT NOT NULL UNIQUE,
    timeCreated TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Config
(
    id INTEGER PRIMARY KEY autoincrement,
    rootDir TEXT NOT NULL UNIQUE,
    serial  TEXT NOT NULL,
    baud TEXT NOT NULL,
    network TEXT NOT NULL,
    testNetMagic TEXT NOT NULL,
    autoStartSlicer TEXT NOT NULL
);
