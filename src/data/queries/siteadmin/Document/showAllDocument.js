
import sequelize from '../../../sequelize';
import UserDocumentListType from '../../../types/siteadmin/UserDocumentListType';
import { User, DocumentVerification } from '../../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import Sequelize from 'sequelize';
 
const showAllDocument = {

  type: new List(UserDocumentListType),

  async resolve({ request, response }) {
    const Op = Sequelize.Op;
    if(request.user && request.user.admin == true) {

      // Get All User Profile Data
      return await User.findAll({
        attributes: ['id', 'email'],
        where:{
            id: {
                [Op.in]: [
                    sequelize.literal(`SELECT distinct userId FROM DocumentVerification `)
                ]
            } 
        }
      });

    }
  },
};

export default showAllDocument;


/*

query showAllDocument
{
  showAllDocument {
    id,
    email,
     profile{
          firstName
    }
  
  }
}

	


*/