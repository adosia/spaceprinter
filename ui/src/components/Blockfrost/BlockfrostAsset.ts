export const getAssetInfo = async ( asset: string ) => {
    // console.log(asset);
    const  blockfrostApi: any = localStorage.getItem("blockfrostApi");
    const settings = {
      method: 'GET',
      headers: {
        'project_id': blockfrostApi
      }
    };
    try {
      const fetchResponse: any = await fetch(`https://cardano-testnet.blockfrost.io/api/v0/assets/${asset}`, settings);
      const data: any = await fetchResponse.json();
      // console.log(data);
      return(data);
    } catch (e) {
      console.log(e);
      return e;
    }; 
  };