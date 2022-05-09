import React from 'react';
import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, FormControlLabel, Checkbox, TextField } from '@material-ui/core/';
import { a2hex, hex2a } from "../../utils/hextools";
import { STLDialog } from "./STLDialog";

type AccountAssetsTableProps = {
  rows: any,
  utxos: any,
  setUtxos: any,
  utxoCheck: any, 
  setUtxocheck: any,
  assetCheck: any,
  setAssetcheck: any,
  outputs: any, 
  setOutputs: any,
  outputAddress: string,
  outputLovelace: string,
  
}

export const AccountAssetsTable: React.FC<AccountAssetsTableProps> = ({ rows, utxos, setUtxos, utxoCheck, setUtxocheck, assetCheck, setAssetcheck, outputs, setOutputs, outputAddress, outputLovelace }) => {
  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 600,
    }
  });

  const columns: any[] = [
    { id: "asset", label: 'Asset Name', width: 100, disablePadding: false, },
    { id: "amount", label: 'Amount',  minWidth: 150 },
    { id: "mediaType", label: 'Media Type',  minWidth: 150 },
    { id: "media", label: "media",  minWidth: 150 }
  ];

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSelected = async ( event: React.ChangeEvent<HTMLInputElement>, TxId: string, txIndex:any, inputValue: any, assets: any, outputAsset: any ) => {
    const policyID: string = outputAsset.split(".")[0];
    const assetName: string = outputAsset.split(".")[1];
    // console.log(event.target.name)
    setAssetcheck({ ...assetCheck, [event.target.name]: event.target.checked });
    setUtxocheck({ ...utxoCheck, [TxId+"#"+txIndex.toString()]: event.target.checked });
    // console.log(assetCheck)

    if ( event.target.checked == false ){
      utxos.length == 0 && setOutputs([]);
      outputs.length == 0 && setUtxos([]);
      setOutputs(outputs.filter((output: any ) => 
        outputAsset !== output.outputAsset
      ));
    };

    if ( event.target.checked == true ){
      if (utxos.length > 0 ){
        let exists = 0;
        await utxos.map((utxo: any) => {
          if( TxId == utxo.txix && txIndex == utxo.txIndex ){
            exists = 1;
          }
        })
        exists == 0 && setUtxos( [ ...utxos, {
                                              id: TxId+txIndex,
                                              txix: TxId, 
                                              txIndex, 
                                              inputValue: inputValue.toString(), 
                                              assets 
                                            }])
      }else{
        console.log("setting new UTXO")
        setUtxos( [ ...utxos, { 
                                id: TxId+txIndex,
                                txix:TxId, 
                                txIndex, 
                                inputValue: inputValue.toString(), 
                                assets 
                              }])
      }
  
      if (outputs.length > 0 ){
        let exists = 0;
        await outputs.map((output: any) => {
          if( policyID == output.policyID && assetName == output.assetName ){
            exists = 1;
          }
        })
        exists == 0 && setOutputs( [ ...outputs, { 
                                                  id: outputAsset+TxId+txIndex,
                                                  outputAddress: outputAddress, 
                                                  policyID, 
                                                  assetName, 
                                                  assetAmount: "1",
                                                  outputValue: "0",
                                                  outputAsset
                                                }])
      }else{
        console.log("setting new output")
        setOutputs( [ ...outputs, { 
                                    id: outputAsset+TxId+txIndex,
                                    outputAddress: outputAddress, 
                                    policyID, 
                                    assetName, 
                                    assetAmount: "1",
                                    outputValue: "0",
                                    outputAsset
                                  }])
      };
    };
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
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
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {      
              // row.asset && console.log(row);        
              return(
              row.asset &&              
              <TableRow hover role="checkbox" tabIndex={-1} key={row.asset} style={{ height: 120 }} >
                <TableCell component="th" scope="row" style={{  minHeight: 100 }}>
                  {
                    typeof row !== "number" && 
                    <FormControlLabel
                      control={<Checkbox 
                        checked={assetCheck[row.asset+row.TxId+row.txIndex]} 
                        onChange={(event:any)=>{ handleSelected(event, row.TxId, row.txIndex, row.utxo[1].value.coins, row.utxo[1].value.assets, row.asset  ); }} 
                        name={row.asset+row.TxId+row.txIndex} 
                        disabled={outputAddress.length < 108  && true}
                        />

                      }
                      label={hex2a(row.meta.asset_name)}
                    />    
                  }
                </TableCell>
                <TableCell align="left" style={{  minHeight: 100 }}>
                  {row.assetAmount}
                  <TextField
                    variant="outlined"
                    type="text"
                    margin="dense"
                    required
                    id="outputAddress"
                    name="outputAddress"
                    label="Send to Address"
                    value={outputAddress}
                    // onChange={(event:any) => {setOutputAddress( event.target.value )}}
                    style={{ height: "50px", width: "100%" }}
                    disabled
                  />                  
                </TableCell>
                <TableCell style={{  minHeight: 100 }}>
                  { row.meta.onchain_metadata && row.meta.onchain_metadata.files && row.meta.onchain_metadata.files.length > 0 ?
                    row.meta.onchain_metadata.files.map( (file: any, key: any) => {
                    return(
                      <>  
                        { file.mediaType }<br />
                      </>
                    )}) :
                    row.meta.onchain_metadata != null && "No CIP-25"
                  }
                </TableCell>
                <TableCell align="left" style={{  minHeight: 100 }}>
                { row.meta.onchain_metadata && row.meta.onchain_metadata.files && row.meta.onchain_metadata.files.length > 0 &&
                  row.meta.onchain_metadata.files.map( (file: any, key: any) => {
                    return(
                      <>
                        { file.mediaType == "image/jpeg" && <img src={`https://ipfs.io/ipfs/${file.src[0].replace("ipfs://","")}`} alt="image" height="100" /> }
                        { file.mediaType == "image/png" && <img src={`https://ipfs.io/ipfs/${file.src[0].replace("ipfs://","")}`} alt="image"height="100" /> } 
                        { file.mediaType == "image/gif" && <img src={`https://ipfs.io/ipfs/${file.src.replace("ipfs://","")}`} alt="image" height="100" /> } 
                        { file.mediaType == "video/mp4" && <video controls height="100">
                                                            <source src={`https://ipfs.io/ipfs/${file.src[0].replace("ipfs://","")}`} type="video/mp4" />
                                                            Sorry, your browser doesn't support embedded videos.
                                                            </video> 
                        }
                        { file.mediaType == "model/stl" && <STLDialog fileUrl={`https://ipfs.io/ipfs/${file.src[0].replace("ipfs://","")}` } fileName="" /> }<br/>
                      </>
                    )
                  })
                }
                {
                  row.meta.onchain_metadata != null && row.meta.onchain_metadata.files &&
                  <>
                    {row.meta.onchain_metadata.files.mediaType == "image/jpeg" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.files.src.replace("ipfs://","")}`} alt="image" height="100" /> <br /></> }
                    {row.meta.onchain_metadata.files.mediaType == "image/png" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.files.src.replace("ipfs://","")}`} alt="image" height="100" />  <br /></> } 
                    {row.meta.onchain_metadata.files.mediaType == "image/gif" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.files.src.replace("ipfs://","")}`} alt="image" height="100" /> <br /></> } 
                  </>
                }
                {
                  row.meta.onchain_metadata && row.meta.onchain_metadata.mediaType && row.meta.onchain_metadata.image && row.meta.onchain_metadata.files == undefined &&
                  <>
                    { row.meta.onchain_metadata.mediaType === "image/jpeg" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.image.replace("ipfs://","")}`} alt="image" height="100" /> <br /></> }
                    { row.meta.onchain_metadata.mediaType === "image/png" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.image.replace("ipfs://","")}`} alt="image" height="100" /> <br /></> }
                    { row.meta.onchain_metadata.mediaType === "image/gif" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.image.replace("ipfs://","")}`} alt="image" height="100" /> <br /></> }
                  </>
                }
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
