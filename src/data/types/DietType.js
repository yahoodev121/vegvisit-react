import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLBoolean as BooleanType
} from 'graphql';

const DietType = new ObjectType({
  name: 'Diet',
  fields: {
      id: {
          type: IntType
      },
      dietName: {
          type: StringType
      },
      isEnable: {
          type: BooleanType
      }
  }
});

export default DietType;