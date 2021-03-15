import { getFromIPFS } from '.';
import { PINATA_IPFS_PREFIX } from '../constants';

export interface TokenMetadata {
  id:string;
  uri:string;
  owner:string;
  name:string;
  description:string;
  image:any;
}

const fetchTokenMetadata = async (tokenId: string, tokenUriHash: string, owner: string): Promise<TokenMetadata> => {
  try {
    const tokenUri = tokenUriHash.replace(PINATA_IPFS_PREFIX, '');
    
    console.log(`Fetching ipfs data for ${tokenId} with uri: ${tokenUri}`);
    if (tokenUri != null) {
      const jsonManifestBuffer = await getFromIPFS(tokenUri);

      try {
        const jsonManifest = JSON.parse(jsonManifestBuffer.toString());
        console.log("jsonManifest", jsonManifest);
        return { id:tokenId, uri:tokenUri, owner:owner, ...jsonManifest };
      } catch(e) {console.log(e)}
    }
  } catch (err) {
    console.log(err);
  }
}

export default fetchTokenMetadata;
