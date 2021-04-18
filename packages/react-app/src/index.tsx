import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import './index.css';
import App from './App';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { createHttpClient } from 'mst-gql';
import { RootStore, StoreContext } from './subgraph_models';

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem('theme');

let subgraphUri = `http://${process.env.REACT_APP_GRAPHQL_ADDRESS}/subgraphs/name/nft-minter/composable-contract`;

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

// TODO make script to replace all blockNumber requirements!!!! (generate-mst-gql)
const rootStore = RootStore.create(
  undefined, // snapshot of initial client state
  { gqlHttpClient: createHttpClient(subgraphUri) },
);

ReactDOM.render(
  <StoreContext.Provider value={rootStore}>
    <ApolloProvider client={client}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme ? prevTheme : 'light'}>
        <App subgraphUri={subgraphUri} />
      </ThemeSwitcherProvider>
    </ApolloProvider>
  </StoreContext.Provider>,
  document.getElementById('root'),
);

// window.store = rootStore;
