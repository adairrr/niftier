import { gql } from 'apollo-boost';

export const ACCOUNT_BALANCE_QUERY = gql`
  query UserTokens($accountId: ID!) {
    account(id: $accountId) {
      id
      balances {
        token {
          id
          uri
        }
      value
      }
    }
  }
`;

export const TRANSFERS_QUERY = gql`
  query GetTransfers {
    transfers(orderBy: timestamp) {
      timestamp
      token {
        id
      }
      from {
        id
      }
      to {
        id
      }
    }
  }
`;

export const TOKEN_QUERY = gql`
  query GetToken($tokenId:ID!) {
    token(id: $tokenId) {
      id
      uri
      children {
        child {
          id
          uri
        }
      }
      parents {
        parent {
          id
          uri
        }
        
      }
      tokenType {
        name
      }
    }
  }
`;
