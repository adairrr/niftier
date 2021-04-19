import CeramicClient from '@ceramicnetwork/http-client';
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { initiateCeramicWithIDX } from '../helpers/ceramic';
import { useCeramicContext, useProviderContext } from '../contexts';

export const QueryDoc = (did, client: CeramicClient) => {
  const [doc, setDoc] = useState(null);
  const [docID, setDocID] = useState(null);

  const query = async () => {
    const doc = await client.loadDocument(btoa(docID));
    setDoc(doc);
    console.log(doc);
  };

  const handleChange = e => {
    setDocID(e.target.value);
  };

  return (
    <>
      <input type="text" onChange={handleChange} />
      <button className="btn btn-primary btn-pill text-info mr-2 mb-2" type="button" onClick={query}>
        query doc
      </button>
    </>
  );
};

export default function CeramicDocs() {
  const [ceramicClient, setCeramicClient] = useState<CeramicClient>(null);
  const [document, setDocument] = useState(null);
  const ceramicAuth = useCeramicContext();

  // console.log(window.ceramic);

  // useEffect(() => {
  //   const initClient = async () => {
  //     const client = await initiateCeramicWithIDX();
  //     console.log(client);
  //     setCeramicClient(client);
  //     console.log(client.did)
  //   }
  //   if (!ceramicClient) initClient();
  // }, [setCeramicClient]);

  const create = async () => {
    console.log(ceramicClient);
    console.log(ceramicClient.did);
    console.log('here');
    // console.log(aliases)
    const content = {
      content: { created: new Date().toISOString() },
      metadata: {
        // schema: "ceramic://"+aliases.meta,
        controllers: [ceramicClient.did.id],
        family: 'testing',
      },
    };
    console.log(`Content: ${JSON.stringify(content)}`);
    const doc = await ceramicClient.createDocument('tile', content);
    setDocument(doc);
    console.log('Document: ');
    console.log(doc);
  };

  const doLogin = () => {
    ceramicAuth.login();
    // initiateCeramicWithIDX();
  };

  return (
    <>
      <div>
        {/* {console.log(ceramicClient)} */}
        <Button onClick={create}>create doc</Button>
        <Button onClick={doLogin}>Login?</Button>
      </div>
      <div>{/* <QueryDoc/> */}</div>
    </>
  );
}
