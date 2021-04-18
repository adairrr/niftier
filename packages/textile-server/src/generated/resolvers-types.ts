import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AccountData = {
  __typename?: 'AccountData';
  _id: Scalars['String'];
  id: Scalars['String'];
  did?: Maybe<Scalars['String']>;
};

export type AccountDataCreateInput = {
  id: Scalars['String'];
  did?: Maybe<Scalars['String']>;
};

export type AccountDataPayload = {
  __typename?: 'AccountDataPayload';
  accountData?: Maybe<AccountData>;
};

export type AccountDataUpdateInput = {
  id: Scalars['String'];
  did?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccountData?: Maybe<AccountDataPayload>;
  updateAccountData?: Maybe<AccountDataPayload>;
  deleteAccountData?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateAccountDataArgs = {
  accountData: AccountDataCreateInput;
};


export type MutationUpdateAccountDataArgs = {
  accountData: AccountDataUpdateInput;
};


export type MutationDeleteAccountDataArgs = {
  _id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  accountData?: Maybe<AccountData>;
  accountDatasByIds: Array<Maybe<AccountData>>;
  accountDatas?: Maybe<Array<Maybe<AccountData>>>;
};


export type QueryAccountDataArgs = {
  id: Scalars['String'];
};


export type QueryAccountDatasByIdsArgs = {
  ids: Array<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  accountDataAdded?: Maybe<AccountData>;
  accountDataDeleted?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccountData: ResolverTypeWrapper<AccountData>;
  String: ResolverTypeWrapper<Scalars['String']>;
  AccountDataCreateInput: AccountDataCreateInput;
  AccountDataPayload: ResolverTypeWrapper<AccountDataPayload>;
  AccountDataUpdateInput: AccountDataUpdateInput;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountData: AccountData;
  String: Scalars['String'];
  AccountDataCreateInput: AccountDataCreateInput;
  AccountDataPayload: AccountDataPayload;
  AccountDataUpdateInput: AccountDataUpdateInput;
  Mutation: {};
  Boolean: Scalars['Boolean'];
  Query: {};
  Subscription: {};
}>;

export type AccountDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountData'] = ResolversParentTypes['AccountData']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  did?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountDataPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccountDataPayload'] = ResolversParentTypes['AccountDataPayload']> = ResolversObject<{
  accountData?: Resolver<Maybe<ResolversTypes['AccountData']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createAccountData?: Resolver<Maybe<ResolversTypes['AccountDataPayload']>, ParentType, ContextType, RequireFields<MutationCreateAccountDataArgs, 'accountData'>>;
  updateAccountData?: Resolver<Maybe<ResolversTypes['AccountDataPayload']>, ParentType, ContextType, RequireFields<MutationUpdateAccountDataArgs, 'accountData'>>;
  deleteAccountData?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteAccountDataArgs, '_id'>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  accountData?: Resolver<Maybe<ResolversTypes['AccountData']>, ParentType, ContextType, RequireFields<QueryAccountDataArgs, 'id'>>;
  accountDatasByIds?: Resolver<Array<Maybe<ResolversTypes['AccountData']>>, ParentType, ContextType, RequireFields<QueryAccountDatasByIdsArgs, 'ids'>>;
  accountDatas?: Resolver<Maybe<Array<Maybe<ResolversTypes['AccountData']>>>, ParentType, ContextType>;
}>;

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  accountDataAdded?: SubscriptionResolver<Maybe<ResolversTypes['AccountData']>, "accountDataAdded", ParentType, ContextType>;
  accountDataDeleted?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "accountDataDeleted", ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AccountData?: AccountDataResolvers<ContextType>;
  AccountDataPayload?: AccountDataPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
}>;


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
