const { writeFile } = require('fs').promises
const CeramicClient = require('@ceramicnetwork/http-client').default
const { createDefinition, publishSchema } = require('@ceramicstudio/idx-tools')
const { Ed25519Provider } = require('key-did-provider-ed25519')
const fromString = require('uint8arrays/from-string')
const CERAMIC_URL = `http://localhost:7007`;

const TokenMetadataSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Note',
  type: 'object',
  properties: {
    name: {
      title: 'name',
      type: 'string',
      maxLength: 40,
    },
    description: {
      type: 'string',
      title: 'description',
      maxLength: 4000,
    },
    image: {
      type: 'string',
      title: 'image',
      maxLength: 240
    },
    external_url: {
      type: 'string',
      title: 'external_url',
      maxLength: 240
    },
    attributes: {
      type: 'array',
      items: {
        '$ref': '#/definitions/#attribute'
      }
    }
  },
  definitions: {
    attribute: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          title: 'attribute_key',
          maxLength: 40
        },
        value: {
          type: 'string',
          title: 'attribute_value',
          maxLength: 40
        }
      },
      required: ['key', 'value']
    }
  }
}

const NiftierTokenSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'NiftierToken',
  type: 'object',
  properties: {
    tokenType: {
      type: 'string',
      title: 'tokenType'
    },
    childTokens: {
      
    },

  },
  definitions: {

  }
}

const ControllerTokenSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'NiftierToken',
  type: 'object',
  properties: {
    api_url: {
      title: 'api_url',
      type: 'string',
      maxLength: 240
    },


  },
  definitions: {

  }
}

const NotesListSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'NotesList',
  type: 'object',
  properties: {
    notes: {
      type: 'array',
      title: 'notes',
      items: {
        type: 'object',
        title: 'NoteItem',
        properties: {
          id: {
            $ref: '#/definitions/CeramicDocId',
          },
          title: {
            type: 'string',
            title: 'title',
            maxLength: 100,
          },
        },
      },
    },
  },
  definitions: {
    CeramicDocId: {
      type: 'string',
      pattern: '^ceramic://.+(\\\\?version=.+)?',
      maxLength: 150,
    },
  },
}

async function run() {
  // The seed must be provided as an environment variable
  const seed = fromString(process.env.SEED, 'base16')
  // Connect to the local Ceramic node
  const ceramic = new CeramicClient(CERAMIC_URL)
  // Authenticate the Ceramic instance with the provider
  await ceramic.setDIDProvider(new Ed25519Provider(seed))

  // Publish the two schemas
  const [noteSchema, notesListSchema] = await Promise.all([
    publishSchema(ceramic, { content: NoteSchema }),
    publishSchema(ceramic, { content: NotesListSchema }),
  ])

  // Create the definition using the created schema ID
  const notesDefinition = await createDefinition(ceramic, {
    name: 'notes',
    description: 'Simple text notes',
    schema: notesListSchema.commitId.toUrl(),
  })

  // Write config to JSON file
  const config = {
    definitions: {
      notes: notesDefinition.id.toString(),
    },
    schemas: {
      Note: noteSchema.commitId.toUrl(),
      NotesList: notesListSchema.commitId.toUrl(),
    },
  }
  await writeFile('./src/ceramicConfig.json', JSON.stringify(config));

  console.log('Config written to src/config.json file:', config)
  process.exit(0)
}

run().catch(console.error)
