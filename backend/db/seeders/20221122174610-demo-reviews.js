'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        review: 'Amazing',
        stars: 5
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Dirty',
        stars: 2
      },
      {
        spotId: 3,
        userId: 3,
        review: 'Nice',
        stars: 4
      }

    ], {});

  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete(options, {
      review: {[Op.in]: ['Amazing', 'Dirty', 'Nice']}
    }, {});

  }
};
