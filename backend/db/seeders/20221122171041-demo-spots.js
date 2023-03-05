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
        city: 'Long Island',
        state: 'New York',
        country: 'USA',
        lat: 1111111111,
        lng:1111111111,
        name:'Getaway Oasis',
        description: 'Beautiful 2 bed 3 bath',
        price: 450
      },
      {
        address: '111 River Road',
        ownerId: 2,
        city: 'Portland',
        state: 'Oregon',
        country: 'USA',
        lat: 22222222222,
        lng:22222222222,
        name:'Lavish Interior Home ',
        description: '10 bed 8 bath',
        price: 1150
      },
      {
        address: '122 Stream Road',
        ownerId: 3,
        city: 'Denver',
        state: 'Colorado',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'Secluded artic getaway',
        description: '3 bed 5 bath',
        price: 650
      },
      {
        address: '234 Park Ave',
        ownerId: 1,
        city: 'New York City',
        state: 'New York',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'Lavish apartment with views of the city',
        description: '2 bed 4 bath',
        price: 1550
      },{
        address: '12 Demo Road',
        ownerId: 1,
        city: 'Atlanta',
        state: 'Georgia',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'Heart of Atlanta home base',
        description: '3 bed 5 bath',
        price: 379
      },
      {
        address: '10 Tuttle Road',
        ownerId: 2,
        city: 'Atlanta',
        state: 'Georgia',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'Cozy getaway with lakeside view',
        description: '2 bed 1 bath',
        price: 379
      },
      {
        address: '220 Broadway St',
        ownerId: 3,
        city: 'San Francisco',
        state: 'California',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'Beautiful San Fran spot ',
        description: '4 bed 4 bath',
        price: 1199
      },
      {
        address: '436 Brickell',
        ownerId: 1,
        city: 'Miami',
        state: 'Florida',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'Heart of Miami spot ',
        description: '3 bed 4 bath',
        price: 1489
      },
      {
        address: '444 Broadway St.',
        ownerId: 3,
        city: 'New York City',
        state: 'New York',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'Pure luxury within',
        description: '6 bed 8 bath',
        price: 2599
      },
      {
        address: '1212 Lotus Lane',
        ownerId: 2,
        city: 'Seattle',
        state: 'Washington',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'Mountain side bliss',
        description: '2 bed 4 bath',
        price: 850
      },
      {
        address: '12 Park Ave',
        ownerId: 2,
        city: 'New York City',
        state: 'New York',
        country: 'USA',
        lat: 3333333333,
        lng:3333333333,
        name:'Condo of your dreams!',
        description: '2 bed 3 bath',
        price: 1999
      }
     ], {});

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots'
    const Op = Sequelize.Op
     await queryInterface.bulkDelete(options, {
      address: {[Op.in]: ['123 Rainbow Road', '111 River Road', '122 Stream Road',
      '12 Park Ave','1212 Lotus Lane','444 Broadway St.', '436 Brickell', '220 Broadway St'
      ,'10 Tuttle Road', '12 Demo Road' ]}
     }, {});

  }
};
