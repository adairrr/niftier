import { Client, CollectionConfig, PrivateKey, ThreadID } from '@textile/hub'
import dotenv from 'dotenv';

dotenv.config()


function doTest() {
    // const identity = PrivateKey.fromRandom();
    // console.log(identity);
    // console.log(identity.toString());
    if (process.env.APP_IDENTITY) {
        console.log(PrivateKey.fromString(process.env.APP_IDENTITY));
    } else {
        console.log('not found!!!!');
    }
    
}
doTest();
