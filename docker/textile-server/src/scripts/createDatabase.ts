import { getIntrospectionQuery, graphqlSync, IntrospectionQuery } from 'graphql'
import Textile from '../textile/textile'

import { fromIntrospectionQuery } from 'graphql-2-json-schema'
import { JSONSchema4 } from 'json-schema'
import { graphQlSchema } from '../graphql/schemaLoader'
import { isArray } from 'lodash'
import * as dotenv from "dotenv";

const createJsonSchemaFromGraphQl = () => {
  const result = graphqlSync(graphQlSchema, getIntrospectionQuery())
  const introspection = result.data as IntrospectionQuery
  const jsonSchema = fromIntrospectionQuery(introspection, {
    ignoreInternals: true
  })
  return jsonSchema
}

const createCollections = async (
  textile: Textile,
  definitions: {
    [k: string]: JSONSchema4
  }
) => {
  for (let key of Object.keys(definitions)) {
    //Remove Hacks
    if (key === 'Subscription') continue 
    if (key.includes("Input")) continue 
    const entity = definitions[key] as JSONSchema4
    await textile.newCollection({ name: key, schema: entity })
  }
}

const convertToTextileSchema = (schema: JSONSchema4) => {
  if (!schema.definitions) return
  delete schema.definitions.Subscription

  const map = new Map<string, JSONSchema4>()
  Object.keys(schema.definitions).forEach(
    (x) => schema.definitions && map.set('#/definitions/' + x, schema.definitions[x])
  )
  const relations = getRelations(map)
  for (const key of Object.keys(schema.definitions)) {
    const entity = schema.definitions[key]
    deleteObjectProperties(entity)
  }

  relations.forEach((relation) => {
    const entity = map.get(relation.entity) as JSONSchema4
    switch (relation.type) {
      case ReferenceType.OneToOne:
        entity[relation.fieldName] = { type: 'object', properties: { _id: { type: 'string' } } }
        break
      case ReferenceType.OneToMany:
        if (
          !relations.some(
            (x) =>
              x.entity === relation.refEntity && x.refEntity === relation.entity && x.type === ReferenceType.ManyToOne
          )
        )
          throw `${relation.entity} is not referenced or not referenced as Single Relation of ${relation.refEntity}. This implementation does not auto-create the properties, so please update your schema.`
        break
      case ReferenceType.ManyToOne:
        entity[relation.fieldName] = { type: 'object', properties: { _id: { type: 'string' } } }
        break
      case ReferenceType.ManyToMany:
        throw 'ManyToMany not implemented yet'
    }
    entity[relation.fieldName]
  })
}

enum ReferenceType {
  OneToMany = '1:*',
  ManyToOne = '*:1',
  OneToOne = '1:1',
  ManyToMany = '*:*'
}
interface Reference {
  entity: string
  refEntity: string
  type: ReferenceType
  fieldName: string
}
interface ReferencedEntity {
  ref: string
  array: boolean
}

const getRelations = (entities: Map<string, JSONSchema4>) => {
  const refs = new Array<Reference>()
  entities.forEach((entity, name) => {
    if (!entity.properties) return
    for (const propName of Object.keys(entity.properties)) {
      if (entity.properties[propName].type !== 'object') continue
      refs.push(getReference(name, entity.properties[propName], entities, propName))
    }
  })
  return refs
}

const getReference = (
  entity: string,
  property: JSONSchema4,
  entities: Map<string, JSONSchema4>,
  fieldName: string
): Reference => {
  const refEntity = getReferencedEntity(property)
  const refs = getReferences(entities.get(refEntity.ref)).filter((x) => x.ref == entity)
  if (refs.length > 1)
    throw `${refEntity.ref} has more than one reference to ${entity}. This is not implemented at the moment.`
  let ref = refs.length ? refs[0] : undefined

  let refType = refEntity.array
    ? !ref || !ref.array
      ? ReferenceType.OneToMany
      : ReferenceType.ManyToMany
    : !ref || ref.array
    ? ReferenceType.ManyToOne
    : ReferenceType.OneToOne

  return { entity, refEntity: refEntity.ref, type: refType, fieldName }
}

const getReferences = (entity: JSONSchema4 | undefined) => {
  const retVal = new Array<ReferencedEntity>()
  if (entity && entity.properties)
    Object.values(entity.properties).forEach((prop) => prop.type === 'object' && retVal.push(getReferencedEntity(prop)))
  return retVal
}

const getReferencedEntity = (entity: JSONSchema4) => {
  if (entity.properties && entity.properties.return) {
    if (entity.properties.return.$ref) return { ref: entity.properties.return.$ref, array: false }
    if (
      entity.properties.return.items &&
      entity.properties.return.items &&
      !isArray(entity.properties.return.items) &&
      //@ts-ignore
      entity.properties.return.items.$ref
    )
      //@ts-ignore
      return { ref: entity.properties.return.items.$ref, array: true }
  }
  throw 'Now Reference found'
}

const deleteObjectProperties = (entity: JSONSchema4) =>
  entity.properties &&
  Object.keys(entity.properties).forEach(
    (key) =>
      entity.properties &&
      entity.properties[key] &&
      entity.properties[key].type === 'object' &&
      delete entity.properties[key]
  )

const createDatabase = async (textile: Textile) => {
  const jsonSchema = createJsonSchemaFromGraphQl()
  convertToTextileSchema(jsonSchema)
  jsonSchema.definitions && (await createCollections(textile, jsonSchema.definitions))
}

dotenv.config()
Textile.Instance(true).then(async (t) => {
  t = await t.reset()
  await createDatabase(t)
})
