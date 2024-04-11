import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLList as List,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const ListSettings = new ObjectType({
  name: 'getAdminlistSettings',
  description: "Represents listing field values",
  fields: {
    id: {type: IntType },
    typeId: { type: IntType },
    itemName: { type: StringType },
    itemDescription: { type: StringType },
    otherItemName: { type: StringType },
    maximum: { type: IntType },
    minimum: { type: IntType },
    startValue: { type: IntType },
    endValue: { type: IntType },
    isEnable: { type: StringType },
  }
});

const ListSettingsType = new ObjectType({
  name: 'getAdminlistSettingsType',
  description: "Represents listing field types",
  fields: {
    id: {type: IntType },
    typeName: { type: StringType },
    typeLabel: { type: StringType },
    step: { type: StringType },
    fieldType: { type: StringType },
    isEnable: { type: StringType },
    status: { type: StringType },
    listSettings: {
      type: new List(ListSettings),
      resolve (listSettingsType) {
        return listSettingsType.getListSettings();
      }
    },
  },
});

export default ListSettingsType;
