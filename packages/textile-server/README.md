# Textile-server

This package transforms a graphql schema into a textile-compatible representation, where textile acts as the database,
while queries are performed using graphql.

## Commands
`yarn generate:graphql`: generates the schemas from `src/graphql/schema.graphql`

`yarn generate:textile`: 
* creates the textile database based on the schema in `src/graphql/schema.graphql`
* input types MUST be prefixed/suffixed with "Input" to avoid generating collections
* output/payload types MUST be prefixed/suffixed with "Payload" to avoid generating collections

`yarn build`: Generates the schemas and compiles the modules into dist

`yarn dev`: Runs a graphql server and watches for file changes, upon which it will automatically reload

`yarn start`: Runs a graphql server from the generated build files at dist


## Adding Collections
1. Create a `YourModelRepository` class inheriting from `TextileRepository` in `src/textile/repositories`
1. Add the respective resolver context in `src/graphql/resolverContext.ts`
    ```ts
    readonly YourModel: YourModelRepository;
    ...
    constructor(t: Textile) {
        ...
        this.YourModel = t.getRepository(YourModelRepository, 'YourModel');
    }
    ```
1. Add the respective resolvers in `src/graphql/resolvers.ts`
