'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkInsert('ListSettingsTypes', [{
        typeName: 'services',
        fieldType: 'stringType',
        step: 1,
        isEnable: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        typeLabel: 'Additional services',
        isMultiValue: 0
      }], {}),
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
