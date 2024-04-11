// // Query Type
// import ShowListingType from '../../types/ShowListingType';

// // For sequelize functions
// import sequelize from '../../sequelize';


// // Database models
// import { Listing } from '../../../data/models';


//Query Type


import DocumentVerificationType from '../../../types/DocumentVerification';

// For sequelize functions 
import sequelize from '../../../sequelize';

//Database Models

import { DocumentVerification } from '../../../../data/models';

import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLNonNull as NonNull,
  GraphQLObjectType as ObjectType,
  GraphQLBoolean as BooleanType,
} from 'graphql';

const getAllDocument = {

  type: new List(DocumentVerificationType),

  async resolve({ request }) {

    if(request.user && request.user.admin == true) {

      const getDocument = await DocumentVerification.findAll({      
          
      });
      return getDocument;
      
     } else {
         return {
           status: 'failed'
         }
     }
  },
};

export default getAllDocument;

/*

query getAllDocument{
  getAllDocument {
    id,
    userId,
    fileName,
    fileType,
    documentStatus,
    user{
      id,
      email
       profile {
                firstName,
        				lastName
            }
      }

  }
}



*/