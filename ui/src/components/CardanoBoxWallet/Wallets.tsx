import React, { useState, useEffect, useRef } from "react";
import { Button, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@material-ui/core"; //tslint:disable-line
import { SpacePrinterHttp, SpacePrinterWS, SpacePrinterWSSend, CardanoBoxHttp } from "../../api/SpacePrinterApis";
import useDarkMode from "use-dark-mode";
import { WalletAccounts } from "./WalletAccounts";
import { useHistory } from "react-router-dom";
import { DelWalletPopup } from "./DelWalletPopup";
import { DecodeDatum } from "./DecodeDatum";

const Wallets: React.FC = () => {
  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 400,
    },
    button:{
      background: "#930006"
    }
  });
  const columns: any[] = [
    { id: "walletName", label: 'Wallet Name', minWidth: 100 },
    { id: "walletType", label: 'Wallet Type', minWidth: 100 },
    { id: "created", label: 'Created', minWidth: 100 },
    { minWidth:100 },
  ];

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const darkMode = useDarkMode();
  const [ wallets, setWallets ] = useState<undefined | any >([]);
  let refreshTimer:any = useRef();
  const history = useHistory();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const queryWallets = async () => {
    const jwToken: any = sessionStorage.getItem("jwtoken");
    const userName: any = sessionStorage.getItem("userName");
    const sessionType: any = sessionStorage.getItem("sessionType");
    try{
      const walletsResult: any = await SpacePrinterHttp.getCBWallets( jwToken, userName, sessionType, "" );
      console.log(walletsResult);
      walletsResult == "authError" && history.push("/LoginPage");
      setWallets(walletsResult);
    }catch( error ){
      console.log(error);
    };
  };

  const StartWallet: any = async () => {
    queryWallets();
    const refreshWalletTimer: any = setInterval(() => {
      queryWallets();
    }, 10000);
    refreshTimer.current = refreshWalletTimer;
  };

  const StopWallet: any  = async () => {
    clearInterval(refreshTimer.current);
  };

  useEffect( 
    () => {
      queryWallets();
      // StartWallet();
      // return () => StopWallet();// eslint-disable-next-line
  }, []);

  return (
    <>
      {
        <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table" >
            <TableHead >
              <TableRow >
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {wallets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
                console.log(row)
                return(
                <TableRow hover role="checkbox" tabIndex={-1} key={row.walletID}>
                  <TableCell component="th" scope="row">
                    { row.walletName }
                  </TableCell>
                  <TableCell align="left">
                    { row.walletType }
                  </TableCell>
                  <TableCell align="left">
                    { new Date(row.timeCreated*1000).toLocaleTimeString("en-US")} | { new Date(row.timeCreated*1000).toLocaleDateString("en-US") }
                  </TableCell>
                  <TableCell align="right">
                    <WalletAccounts walletInfo={row} /> || <DelWalletPopup walletID={row.walletID} queryWallets={queryWallets} />
                  </TableCell>
                </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={wallets.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
           
        </Paper>

      }
        <>
         <DecodeDatum datum="8392f0c940435c06888f9bdb8c74a95dc69f156367d6a089cf008ae05caae01e" />
        </>
    </>
  );
};

export default Wallets;