import ListViewsType from '../types/ListViewsType';
import {ListViews} from '../../data/models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLInt as IntType,
    GraphQLNonNull as NonNull,
    GraphQLBoolean as BooleanType,
    GraphQLFloat as FloatType
} from 'graphql';

import Sequelize from 'sequelize';

const GetListViews = {

    type: ListViewsType,

    args: {
        listId: { type: IntType }
    },

    async resolve({request}, {listId}) {
        const Op = Sequelize.Op;
        const count = await ListViews.count({
            where: {
                listId,
                createdAt: {
                    [Op.lte]: new Date(),
                    [Op.gt]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        return {
            count
        };
    }
};

export default GetListViews;