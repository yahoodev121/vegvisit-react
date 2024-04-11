import FooterBlockType from '../../types/FooterBlockType';

import sequelize from '../../sequelize';

import { FooterBlock } from '../../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLObjectType as ObjectType,
} from 'graphql';

const getFooterSetting = {

    type: FooterBlockType,

    async resolve({ request }) {

        return await FooterBlock.findOne();
        
    }
};

export default getFooterSetting;
