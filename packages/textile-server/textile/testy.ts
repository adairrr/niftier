import { Client, CollectionConfig, PrivateKey, ThreadID } from '@textile/hub'

function doTest() {
    const identity = PrivateKey.fromRandom();
    console.log(identity);
    console.log(identity.toString());
}
doTest();
