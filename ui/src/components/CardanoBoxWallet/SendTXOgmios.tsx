import React, { useState, useRef } from "react";
import { SpacePrinterHttp, SpacePrinterWS, SpacePrinterWSSend, CardanoBoxHttp, OgmiosWS, blockfrostApi } from "../../api/SpacePrinterApis";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import  star  from "../../assets/sticker.webp";
import CircularProgress from '@material-ui/core/CircularProgress';

type SendTXProps = {
  jwToken: any,
  txResult: any,
  getAddressInfo: any,
}

export const SendTXOgmios: React.FC<SendTXProps> = ({ jwToken, txResult, getAddressInfo }) => {
  const [ status, setStatus ] = useState("Loading...");
  const darkMode = useDarkMode();
  const [ fee, setFee ] = useState();
  const [ txid, setTxid ]: any = useState();
  const [ mempool, setMempool ]: any = useState();
  const [ open, setOpen ] = useState(false);
  let refreshTimer:any = useRef();

  const handleOpen = () => {
    setOpen(true)
    sendTX();
  };

  const handleClose = () => {
    StopNodePoll();
    getAddressInfo();
    setOpen(false);
  };

  const wsp = (methodname: any, args: any) => {
    OgmiosWS.send(JSON.stringify({
      type: "jsonwsp/request",
      version: "1.0",
      servicename: "ogmios",
      methodname,
      args
    }));
  }

  const sendTX = async () => {
    const submit = txResult.cborHex;
    wsp("SubmitTx", { submit });
    OgmiosWS.onmessage =  async ( e: any ) => {
      const res: any = JSON.parse(e.data)
      console.log(res)
      res.result && res.result.SubmitSuccess && setTxid(res.result.SubmitSuccess.txId)
      res.result && res.result.SubmitSuccess && StartNodePoll()
    };
  };
  
  const getMempoolStatus = async () => {
    const queryTipResult: any = await CardanoBoxHttp.cardanoNode( jwToken, "", "");
    const result = JSON.parse(queryTipResult);
    setMempool(result);
  };

  const StartNodePoll: any = async () => {
    getMempoolStatus();
    const nodePollTimer: any = setInterval(() => {
      getMempoolStatus();
    }, 2420);
    refreshTimer.current = nodePollTimer;
  };

  const StopNodePoll: any  = async () => {
    clearInterval(refreshTimer.current);
  };

  return (
    <>
      <Button onClick={handleOpen}>Send Using Ogmios</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
        </DialogTitle>
        <DialogContent>
          <div style={{maxWidth: 700, wordWrap: "break-word"}}>
            { txid && mempool && mempool.cardano.node.metrics.txsInMempool.int.val > 0 ?
              <div>
                txid: { txid && txid } <br />
                Mempool Bytes: { mempool.cardano.node.metrics.mempoolBytes && mempool.cardano.node.metrics.mempoolBytes.int.val } <br />
                TXs in Mempool: { mempool.cardano.node.metrics.txsInMempool && mempool.cardano.node.metrics.txsInMempool.int.val } <br />
                TXs Processed: { mempool.cardano.node.metrics.txsProcessedNum && mempool.cardano.node.metrics.txsProcessedNum.int.val }<br />
                <CircularProgress disableShrink />
              </div>
              :
              txid && mempool && mempool.cardano.node.metrics.txsInMempool.int.val === 0 && 
              <div>
                <img src={star} height="400" />
              </div>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
