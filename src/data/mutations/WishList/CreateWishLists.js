import WishListType from '../../types/WishListType';
import { WishListGroup, WishList, Listing } from '../../models';

import {
    GraphQLList as List,
    GraphQLString as StringType,
    GraphQLNonNull as NonNull,
    GraphQLInt as IntType,
    GraphQLBoolean as BooleanType
} from 'graphql';

const CreateWishLists = {

    type: WishListType,

    args: {
        listId: { type: IntType },
        wishListGroups: { type: new List(IntType) }
    },

    async resolve({ request, response }, { listId, wishListGroups }) {

       // Check whether user is logged in
        if (request.user) {
                const userId = request.user.id;

                const isListOwner = await Listing.count({
                    where: {
                        userId,
                        id: listId
                    }
                });
                if (isListOwner) {
                    return {
                        status: "listOwner"
                    };
                } else {
                    // Wish Lists
                    if (wishListGroups != null && wishListGroups != undefined) {
                        const removeWishList = await WishList.destroy({
                            where: {
                                listId,
                                userId
                            }
                        });

                        wishListGroups.map(async (item, key) => {
                            let updateWishList = await WishList.create({
                                listId,
                                userId,
                                wishListGroupId: item
                            })
                        });
                    }
                    return {
                        status: "success"
                    };
                }
        } else {
            return {
                status: "notLoggedIn"
            };
        }

    },
};

export default CreateWishLists;

/*

mutation CreateWishLists(
    $listId: Int!,
    $wishListGroups: [Int],
){
    CreateWishLists(
        listId: $listId,
        wishListGroups: $wishListGroups
    ) {
        status
    }
}

*/
