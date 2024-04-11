import logger from '../core/logger';
import { User } from '../data/models';

export default async function updateLastLogin(userId) {
  const userLogin = await User.findOne({
    where: {
      id: userId,
    },
  });
  if (userLogin) {
    userLogin.update({
      lastLogin: new Date()
    }).then((userUpdateResult) => {
      logger.debug(`src.helpers.updateLastLogin: User logged in successfuly, last login updated with result ${JSON.stringify(userUpdateResult)}`);
    }).catch((userUpdateError) => {
      logger.error(`src.helpers.updateLastLogin: User logged in successfuly: ${JSON.stringify(userLogin)}. But last login could not be updated, result was ${userUpdateError.message}`, userUpdateError);
    });
  } else {
    logger.error('src.helpers.updateLastLogin: User logged in successfuly but user could not be identified when updating lastLogin');
  }
}
