import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead } from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { a2hex, hex2a } from "../../utils/hextools";
import { STLViewer } from "../AssetViewer/STLviewer";

type jobsTableProps = {
  rows: any,
}

export const JobsOgmiosTable: React.FC<jobsTableProps> = ({ rows }) => {
  const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 600,
    },
  });

  const columns: any[] = [
    { id: "asset", label: 'Asset Name', width: 100, disablePadding: false, },
    { id: "mediaType", label: 'Media Type',  minWidth: 150 },
    { id: "media", label: "media",  minWidth: 150 },
    {minWidth: 100}
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
              console.log(row)
              return(
              row.asset &&
              <TableRow hover role="checkbox" tabIndex={-1} key={row.asset} style={{ height: 120 }} >
                <TableCell component="th" scope="row" style={{  minHeight: 100 }}>
                  {hex2a(row.meta.asset_name)}
                </TableCell>
                <TableCell style={{  minHeight: 100 }}>
                  { 
                    row.meta.onchain_metadata && row.meta.onchain_metadata.files && row.meta.onchain_metadata.files.length > 0 ?
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
                { 
                  row.meta.onchain_metadata && row.meta.onchain_metadata.files && row.meta.onchain_metadata.files.length > 0 &&
                  row.meta.onchain_metadata.files.map( (file: any, key: any) => {
                    return(
                      <>
                        { file.mediaType == "image/jpeg" && <img src={`https://ipfs.io/ipfs/${file.src.replace("ipfs://","")}`} alt="image" height="100" /> }
                        { file.mediaType == "image/png" && <img src={`https://ipfs.io/ipfs/${file.src.replace("ipfs://","")}`} alt="image"height="100" /> } 
                        { file.mediaType == "image/gif" && <img src={`https://ipfs.io/ipfs/${file.src.replace("ipfs://","")}`} alt="image" height="100" /> } 
                        { file.mediaType == "video/mp4" && <video controls height="100">
                                                            <source src={`https://ipfs.io/ipfs/${file.src.replace("ipfs://","")}`} type="video/mp4" />
                                                            Sorry, your browser doesn't support embedded videos.
                                                            </video> 
                        }
                        { file.mediaType == "model/stl" && "Has STL" }  
                      </>
                    )
                  })  
                }    
                {
                  row.meta.onchain_metadata != null && row.meta.onchain_metadata.files &&
                  <>
                    {row.meta.onchain_metadata.files.mediaType == "image/jpeg" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.files.src.replace("ipfs://","")}`} alt="image" height="100" /> <br />Not CIP25</> }
                    {row.meta.onchain_metadata.files.mediaType == "image/png" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.files.src.replace("ipfs://","")}`} alt="image" height="100" />  <br />Not CIP25</> } 
                    {row.meta.onchain_metadata.files.mediaType == "image/gif" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.files.src.replace("ipfs://","")}`} alt="image" height="100" /> <br />Not CIP25</> } 
                  </>
                }
                {
                  row.meta.onchain_metadata && row.meta.onchain_metadata.mediaType && row.meta.onchain_metadata.image && row.meta.onchain_metadata.files == undefined &&
                  <>
                    { console.log( row.meta.onchain_metadata) }
                    { row.meta.onchain_metadata.mediaType === "image/jpeg" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.image.replace("ipfs://","")}`} alt="image" height="100" /> <br /></> }
                    { row.meta.onchain_metadata.mediaType === "image/png" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.image.replace("ipfs://","")}`} alt="image" height="100" /> <br /></> }
                    { row.meta.onchain_metadata.mediaType === "image/gif" && <><img src={`https://ipfs.io/ipfs/${row.meta.onchain_metadata.image.replace("ipfs://","")}`} alt="image" height="100" /> <br /></> }
                  </>
                }
                </TableCell>
                <TableCell align="right" style={{  minHeight: 100 }}>
                  <Button disabled={true} >SELECT</Button>
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
