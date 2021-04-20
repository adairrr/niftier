# Niftier

[![CircleCI](https://circleci.com/gh/adairrr/nft_canvas/tree/develop.svg?style=svg&circle-token=9d39105416c911725ecbf2098a2999f4e796d52c)](https://app.circleci.com/pipelines/github/adairrr/nft_canvas)

[![Coverage Status](https://coveralls.io/repos/github/adairrr/nft_canvas/badge.svg?branch=feature/ERC1155Composable&t=ipyeEW)](https://coveralls.io/github/adairrr/nft_canvas?branch=develop)


## Commands

### Development
`yarn chain`: run a local hardhat chain for development
`yarn graph-run-node`: Start the subgraph node
`yarn graph-create-local`: Create the subgraph for the project
`yarn deploy-and-graph`: Deploy the contracts to the frontend and configure the subgraph
`yarn ceramic-run-node`: Run a ceramic node for the user authentication
`yarn textile-run-server`: Run the textile server with graphql container
`yarn start`: run the react-app

### Other
`yarn accounts`: List the accounts for the local hardhat chain
`yarn mint`: Mint some tokens to the account in `packages/hardhat/scripts/mint.ts`


## Textile Server
See the readme in [`pacakages/textile-server`](https://github.com/adairrr/nft_canvas/blob/develop/packages/textile-server/README.md)

## Stitched Server
See the readme in [`pacakages/stitched-gql-server`](https://github.com/adairrr/nft_canvas/blob/develop/packages/stitched-gql-server/README.md)
