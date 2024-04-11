import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from "graphql";

const CategoryType = new ObjectType({
  name: "Category",
  fields: {
    id: { type: IntType },
    name: { type: StringType },
    parentId: { type: IntType },
    eventType: { type: StringType },
  },
});

export default CategoryType;
