

module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    Promise.all([
      queryInterface.sequelize.query("INSERT INTO Diet (`id`, `dietName`) VALUES (1, 'Whole-Food, Plant-Based')"),
      queryInterface.sequelize.query("INSERT INTO Diet (`id`, `dietName`) VALUES (2, 'Gluten-Free')"),
      queryInterface.sequelize.query("INSERT INTO Diet (`id`, `dietName`) VALUES (3, 'High-Carb, Low-Fat')"),
      queryInterface.sequelize.query("INSERT INTO Diet (`id`, `dietName`) VALUES (4, 'Salt / Oil / Sugar - Free')"),
      queryInterface.sequelize.query("INSERT INTO Diet (`id`, `dietName`) VALUES (5, 'Nut-Free')"),
      queryInterface.sequelize.query("INSERT INTO Diet (`id`, `dietName`) VALUES (6, 'Keto')"),
    ]),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.query('TRUNCATE TABLE Diet'),
};
