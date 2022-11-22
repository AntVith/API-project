'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots'

    await queryInterface.bulkInsert(options, [
      {
        address: '123 Rainbow Road',
        ownerId: 1,
        city: 'NY',
        state: 'NY',
        country: 'USA',
        lat: 1111111111,
        lng:1111111111,
        name:'house1',
        description: '2 bed 3 bath',
        price: 150
      },
      {
        address: '111 River Road',
        ownerId: 2,
        city: 'NY',
        state: 'NY',
        country: 'USA',
        lat: 22222222222,
        lng:22222222222,
        name:'house2',
        description: '10 bed 8 bath',
        price: 1150
      },
      {
        address: '122 Stream Road',
        ownerId: 3,
        city: 'NY',
        state: 'NY',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'house3',
        description: '3 bed 5 bath',
        price: 650
      },
     ], {});

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op
     await queryInterface.bulkDelete(options, {
      address: {[Op.in]: ['123 Rainbow Road', '111 River Road', '122 Stream Road']}
     }, {});

  }
};
