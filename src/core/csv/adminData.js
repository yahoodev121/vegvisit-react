import moment from 'moment';
import {
  User,
  UserProfile,
  Reservation,
  Listing,
  ListingData,
} from '../../data/models';
import sequelize from '../../data/sequelize';

export async function users() {
  let dataItems = [];
  const data = await User.findAll({
    include: [{ model: UserProfile, as: 'profile' }],
  });
  if (data && data.length > 0) {
    data.map((item) => {
      let consolidatedData = Object.assign(
        {
          Email: item.email,
          EmailConfirmed: item.emailConfirmed,
          Type: item.type,
          LastLogin: item.lastLogin ? moment(item.lastLogin).format() : '',
        },
        item.profile.dataValues
      );
      dataItems.push(consolidatedData);
    });
  }
  return dataItems;
}

export async function reservations() {
  let dataItems = [];
  const data = await sequelize.query(
    `SELECT 
        Reservation.*, User.email as HostEmail, GuestUser.email as GuestEmail 
        from Reservation, User, User as GuestUser 
        where Reservation.hostId=User.id and Reservation.guestId=GuestUser.id`,
    { type: sequelize.QueryTypes.SELECT }
  );

  if (data && data.length > 0) {
    data.map(async (item) => {
      let consolidatedData = Object.assign(item);
      dataItems.push(consolidatedData);
    });
  }
  return dataItems;
}

export async function listings() {
  let dataItems = [];
  const data = await Listing.findAll({
    include: [
      { model: ListingData, as: 'listingData' },
      { model: User, as: 'user' },
      { model: UserProfile, as: 'userProfile' },
    ],
  });
  if (data && data.length > 0) {
    data.map((item) => {
      let listingOtherData = item.listingData
        ? item.listingData.dataValues
        : {};
      delete listingOtherData.id;
      delete listingOtherData.listId;
      delete listingOtherData.createdAt;
      delete listingOtherData.updatedAt;
      let hostEmail = item.user ? item.user.dataValues.email : {};
      let hostFirstName = item.userProfile
        ? item.userProfile.dataValues.firstName
        : {};
      let hostLastName = item.userProfile
        ? item.userProfile.dataValues.lastName
        : {};
      let consolidatedData = Object.assign(
        item.dataValues,
        { hostEmail },
        { hostFirstName },
        { hostLastName },
        listingOtherData
      );
      delete consolidatedData.listingData;
      delete consolidatedData.user;
      delete consolidatedData.userProfile;
      dataItems.push(consolidatedData);
    });
  }
  return dataItems;
}

export async function messagesData() {
  let dataItems = [];
  const data = await sequelize.query(
    `SELECT l.title AS Listing, hp.displayName AS Host, h.email AS 'Host Email', gp.displayName AS Guest, g.email AS 'Guest Email', t.createdAt, t.updatedAt 
        FROM Threads t 
        INNER JOIN User h ON t.host = h.id 
        INNER JOIN UserProfile hp ON t.host = hp.userId 
        INNER JOIN User g ON t.guest = g.id 
        INNER JOIN UserProfile gp ON t.guest = gp.userId 
        INNER JOIN Listing l ON t.listId = l.id 
        ORDER BY t.createdAt DESC;`,
    { type: sequelize.QueryTypes.SELECT }
  );

  if (data && data.length > 0) {
    data.map(async (item) => {
      let consolidatedData = Object.assign(item);
      if (consolidatedData.createdAt) {
        consolidatedData.createdAt = moment(
          consolidatedData.createdAt
        ).format();
      }
      if (consolidatedData.updatedAt) {
        consolidatedData.updatedAt = moment(
          consolidatedData.updatedAt
        ).format();
      }
      dataItems.push(consolidatedData);
    });
  }
  return dataItems;
}
