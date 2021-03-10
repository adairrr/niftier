import {
	ethereum,
	BigInt, 
	Address,
	Bytes,
	store,
  Value
} from "@graphprotocol/graph-ts"
  
import {
	YourContract,
	SetPurpose
} from "../generated/YourContract/YourContract"
  
import {
  TypedERC1155Composable,
  // ApprovalForAll as ApprovalForAllEvent,
  TransferSingle as TransferSingleEvent,
  TransferBatch  as TransferBatchEvent,
  ReceivedChildToken as ReceivedChildTokenEvent,
  ReceivedChildTokenBatch as ReceivedChildTokenBatchEvent,
	Mint as MintEvent,
	MintBatch as MintBatchEvent,
	TransferChildToken as TransferChildTokenEvent,
	TransferChildTokenBatch as TransferChildTokenBatchEvent,
  AssociateChildToken as AssociateChildTokenEvent,
  DisassociateChildToken as DisassociateChildTokenEvent,
  TokenTypesCreated as TokenTypesCreatedEvent,
  ChildTypeAuthorized
  
	  // URI            as URIEvent,
} from '../generated/TypedERC1155Composable/TypedERC1155Composable'
  
import {
  Debug,
	Purpose, 
	Sender,
	Account,
  // TokenRegistry,
  Token,
  Balance,
  Transfer,
  Approval,
	TokenRelationship,
  TokenTypeRelationship,
  TokenType
} from "../generated/schema"
  
import {
  constants,
  events,
  integers,
  transactions,
} from '@amxx/graphprotocol-utils'

import {
  TypedERC1155ComposableAddress
} from '../config/config';

const TOKEN_TYPE_SHIFT: u8 = 240;
  
export function handleSetPurpose(event: SetPurpose): void {

  let senderString = event.params.sender.toHexString()

  let sender = Sender.load(senderString)

  if (sender == null) {
    sender = new Sender(senderString)
    sender.address = event.params.sender
    sender.createdAt = event.block.timestamp
    sender.purposeCount = BigInt.fromI32(1)
  } else {
    sender.purposeCount = sender.purposeCount.plus(BigInt.fromI32(1))
  }

  let purpose = new Purpose(event.transaction.hash.toHex() + "-" + event.logIndex.toString())

  purpose.purpose = event.params.purpose
  purpose.sender = senderString
  purpose.createdAt = event.block.timestamp
  purpose.transactionHash = event.transaction.hash.toHex()

  purpose.save()
  sender.save()
}

// helper method to fetch a token stored in a token registry
// function fetchToken(registry: TokenRegistry, id: BigInt): Token {
function fetchToken(id: BigInt): Token {
  // let tokenId = registry.id.concat('-').concat(id.toHex());
  let tokenId = id.toHex();
  let token = Token.load(tokenId);

  // this uses substring because it's easiest... shifting and other methods don't work
  let tokenType = TokenType.load(tokenId.substring(0, (tokenId.length == 32 ? 4 : 3)));

  if (tokenType == null) {
    debug("Token type is null, errored token id? id: ".concat(tokenId));
    // this is a terrible way of doing this
    tokenType = new TokenType("0x0");
    tokenType.name = "ERRORED TOKEN TYPE";
  }

  // doesn't exist yet
  if (token == null) {
    token = new Token(tokenId)
    // token.registry = registry.id;
    token.identifier = id;
    token.totalSupply = constants.BIGINT_ZERO as BigInt;
    token.tokenType = tokenType.id;
  }
  return token as Token;
}

// Get the token balance of an account
function fetchBalance(token: Token, account: Account): Balance {
  let balanceId = token.id.concat('-').concat(account.id)
  let balance = Balance.load(balanceId)
  
  // no prior balance
  if (balance == null) {
    balance = new Balance(balanceId)
    balance.token = token.id
    balance.account = account.id
    balance.value = constants.BIGINT_ZERO as BigInt
  }
  return balance as Balance;
}

function fetchOrCreateRelationship(parentToken: Token, childToken: Token): TokenRelationship {
  let relationshipId = parentToken.id.concat('-').concat(childToken.id);
  let relationship = TokenRelationship.load(relationshipId);

  if (relationship == null) {
    relationship = new TokenRelationship(relationshipId);
    relationship.parent = parentToken.id;
    relationship.child = childToken.id;
  }
  return relationship as TokenRelationship;
}
  
export function handleMint(event: MintEvent): void {
  // let registry = new TokenRegistry(event.address.toHex());
  let operator = new Account(event.params.operator.toHex());
  let to = new Account(event.params.to.toHex());
  let creator = new Account(event.params.creator.toHex());
  
  // save the types
  // registry.save();
  operator.save();
  to.save();
  creator.save();

  registerMint(
    event,
    "",
    // registry,
    operator,
    to,
    event.params.tokenId,
    event.params.amount,
    creator
  );
}
  
export function handleMintBatch(event: MintBatchEvent): void {
	// let registry = new TokenRegistry(event.address.toHex());
  let operator = new Account(event.params.operator.toHex());
  let to = new Account(event.params.to.toHex());
  let creator = new Account(event.params.creator.toHex());
	  
	// save the types
	// registry.save();
  operator.save();
  to.save();
  creator.save();

  // guaranteed to be the same length
  let tokenIds = event.params.tokenIds;
  let amounts = event.params.amounts;
  
	for (let i = 0; i < tokenIds.length; ++i) {
	  registerMint(
		event,
		"",
		// registry,
    operator,
		to,
		tokenIds[i],
		amounts[i],
		creator
	  );
	}
}
  
export function registerMint(
	event: ethereum.Event,
  suffix: string,
  // registry: TokenRegistry,
  operator: Account,
  to: Account,
  tokenId: BigInt,
  amount: BigInt,
  creator: Account
): void {
  // this will need to deal with the from and to being the contract and those balances should always be zero afterwards
  // let token = fetchToken(registry, tokenId);
  let token = fetchToken(tokenId);
  let transfer = new Transfer(events.id(event).concat(suffix));
  transfer.transaction = transactions.log(event).id;
  transfer.timestamp = event.block.timestamp;
  transfer.token = token.id;
  transfer.from = constants.ADDRESS_ZERO; // mint
  transfer.to = to.id;
  transfer.value = amount;
  transfer.operator = operator.id;

  // when minting, the total supply will increase
  token.totalSupply = integers.increment(token.totalSupply, amount) as BigInt;
  
  // If we are minting to this contract (child -> parent), the creator's balance should be updated
  // otherwise, the to account's balance will be updated
  let userBalance = fetchBalance(token, (to.id == TypedERC1155ComposableAddress) ? creator : to);
  
  // update the balance
  userBalance.value = integers.increment(userBalance.value, amount) as BigInt;
  userBalance.save();
  transfer.toBalance = userBalance.id;

  // save
  token.save();
  transfer.save();
}


export function handleAssociateChildToken(event: AssociateChildTokenEvent): void {
  // let registry = new TokenRegistry(event.address.toHex());
  // let parentToken = fetchToken(registry, event.params.toTokenId);
  // let childToken = fetchToken(registry, event.params.childTokenId);
  let parentToken = fetchToken(event.params.toTokenId);
  let childToken = fetchToken(event.params.childTokenId);

  let relationship = fetchOrCreateRelationship(parentToken, childToken);

  // save the types
  // registry.save();
  parentToken.save();
  childToken.save();
  relationship.save();
}

export function handleDisassociateChildToken(event: DisassociateChildTokenEvent): void {
  // let registry = new TokenRegistry(event.address.toHex());
  // let exParentToken = fetchToken(registry, event.params.fromTokenId);
  // let childToken = fetchToken(registry, event.params.childTokenId);
  let exParentToken = fetchToken(event.params.fromTokenId);
  let childToken = fetchToken(event.params.childTokenId);

  let exRelationship = TokenRelationship.load(exParentToken.id.concat('-').concat(childToken.id));

  if (exRelationship == null) {
    throw new Error("THIS IS REALLY BAD ACTUALLY");
  }

  // remove the previous relationship
  store.remove('TokenRelationship', exRelationship.id);

  // save the types
  // registry.save();
  exParentToken.save();
  childToken.save();
}
  
/**
 * Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`.
 * TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
 */
export function handleTransferSingle(event: TransferSingleEvent): void {  
  // let registry = new TokenRegistry(event.address.toHex());
  let operator = new Account(event.params.operator.toHex());
  let from = new Account(event.params.from.toHex());
  let to = new Account(event.params.to.toHex());
  // registry.save();
  operator.save();
  from.save();
  to.save();
;
  registerTransfer(
    event,
    "",
    // registry,
    operator,
    from,
    to,
    event.params.id,
    event.params.value
  );
}
  
/**
 * Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all transfers.
 * TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
 */
export function handleTransferBatch(event: TransferBatchEvent): void {
  // let registry = new TokenRegistry(event.address.toHex());
  let operator = new Account(event.params.operator.toHex());
  let from = new Account(event.params.from.toHex());
  let to = new Account(event.params.to.toHex());
  // registry.save();
  operator.save();
  from.save();
  to.save();

  let ids    = event.params.ids;
  let values = event.params.values;
  for (let i = 0; i < ids.length; ++i) {
    registerTransfer(
      event,
      "-".concat(i.toString()),
      // registry,
      operator,
      from,
      to,
      ids[i],
      values[i]
    );
  }
}
  
function registerTransfer(
  event: ethereum.Event,
  suffix: string,
  // registry: TokenRegistry,
  operator: Account,
  from: Account,
  to: Account,
  id: BigInt,
  value: BigInt
  // data: Bytes
): void {
  if (
	  from.id != constants.ADDRESS_ZERO            // mint (handled by registerMint)
	  && to.id != TypedERC1155ComposableAddress    // internal transfer (handled by (dis)associateChildToken)
    && to.id != constants.ADDRESS_ZERO           // TODO burn once implemented
	) {
    // let token = fetchToken(registry, id);
    let token = fetchToken(id);
    let transfer = new Transfer(events.id(event).concat(suffix)); // concat index if batched
    transfer.transaction = transactions.log(event).id;
    transfer.timestamp = event.block.timestamp;
    transfer.token = token.id;
    transfer.operator = operator.id;
    transfer.from = from.id;
    transfer.to = to.id;
    transfer.value = value;


    // transfers from a Token -> user should not have from balance updated 
    if (from.id != TypedERC1155ComposableAddress) {
      // Whomever the transfer is FROM will have their balance decremented
      let fromBalance = fetchBalance(token, from);
      fromBalance.value = integers.decrement(fromBalance.value, value) as BigInt;
      fromBalance.save();
      transfer.fromBalance = fromBalance.id;
    } else if (operator.id != to.id) {
      // if the operator is different from to, this means that this is a transfer from a token to ANOTHER user
      // this is because the operator MUST be the creator of the token to initiate this transfer
      let operatorBalance = fetchBalance(token, operator);
      operatorBalance.value = integers.decrement(operatorBalance.value, value) as BigInt;
      operatorBalance.save();
      transfer.fromBalance = operatorBalance.id;
    }

    // if the operator and to are the same, no balance is updated because it is simply transferring from a token to its creator
    if (operator.id != to.id) {
      // Whomever the transfer is TO will have their balance incremented
      let toBalance = fetchBalance(token, to)
      toBalance.value = integers.increment(toBalance.value, value) as BigInt
      toBalance.save()
      transfer.toBalance = toBalance.id
    }
      // save the types:
    token.save()
    transfer.save()
  }
}

export function handleTokenTypesCreated(event: TokenTypesCreatedEvent): void {
  let tokenTypeIds = event.params.tokenTypeIds;
  let tokenTypeNames = event.params.tokenTypeNames;

  // we save each new token type, since the smart contract forbids duplicates
  for (let i = 0; i < tokenTypeIds.length; ++i) {
    let tokenType = new TokenType(tokenTypeIds[i].toHex());
    tokenType.name = tokenTypeNames[i].toString();
    tokenType.save();
  }
}

export function handleChildTypeAuthorized(event: ChildTypeAuthorized): void {
  let parentType = TokenType.load(event.params.parentType.toHex());
  let childType = TokenType.load(event.params.childType.toHex());

  let relationshipId = parentType.id.concat('-').concat(childType.id);

  let typeRelationship = new TokenTypeRelationship(relationshipId);
  typeRelationship.parent = parentType.id;
  typeRelationship.child = childType.id;

  typeRelationship.save();
}

// export function handleTransferChildToken(event: TransferChildTokenEvent): void {
//   let registry = new TokenRegistry(event.address.toHex());
//   let operator = new Account(event.params.operator.toHex());
    
//   registerChildTokenTransfer(
//     event,
//     '',
//     registry,
//     operator,
//     event.params.fromTokenId,
//     event.params.childContract,
//     event.params.childTokenId,
//     event.params.amount
//   );
// }

// export function registerChildTokenTransfer(
//   event: ethereum.Event,
//   suffix: string,
//   registry: TokenRegistry,
//   operator: Account,
//   fromTokenId: BigInt,
//   childContract: Address,
//   childTokenId: BigInt,
//   amount: BigInt
// ): void {
//   let exParentToken = fetchToken(registry, fromTokenId);
//   let childToken = fetchToken(registry, childTokenId);
//   let exRelationship = TokenRelationship.load(exParentToken.id.concat('-').concat(childToken.id));

//   if (exRelationship == null) {
//     throw new Error("THIS IS REALLY BAD ACTUALLY");
//   }
  
//   // remove the relationship that was once true
//   store.remove('TokenRelationship', exRelationship.id);
  
//   // since the transfer is to an account, only the creator can call this, 
  
//   // save the types

// }

/**
 * WORKAROUND: there's no `console.log` functionality in mapping.
 * so we use `debug(..)` which writes a `Debug` entity to the store so you can see them in graphiql.
 * https://github.com/daostack/subgraph/blob/master/src/utils.ts
 */
let debugId = 0;
export function debug(msg: string): void {
 
  let id = BigInt.fromI32(debugId).toHex();
  let ent = new Debug(id);
  ent.set('message', Value.fromString(msg));
  store.set('Debug', id, ent);
  debugId++;
}
