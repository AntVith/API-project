'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'

    await queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'testURL1'
      },
      {
        reviewId: 2,
        url: 'testURL2'
      },
       {
        reviewId: 3,
        url: 'testURL3'
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages'
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete(options, {
      url: {[Op.in]: ['testURL1','testURL2','testURL3']}
    }, {});

  }
};
