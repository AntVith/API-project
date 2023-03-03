'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-21409981/original/a8fa243d-dac8-4238-93e5-f7aa33072ff8.jpeg?im_w=720' ,
        preview: true
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/128c623f-c401-4aa4-80bc-446165fd6884.jpg?im_w=720',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/38bc8081-9415-453a-b8bf-9f4aeb146819.jpeg?im_w=720',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://thumbs.cityrealty.com/assets/smart/736x/webp/2/22/22ca6350cd0dcc474556e1e06bd8144482a45135/15-central-park-west-01.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://wp-tid.zillowstatic.com/bedrock/app/uploads/sites/26/nyc-apartments-for-3200-lic-6fadb8.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://sp-ao.shortpixel.ai/client/q_glossy,ret_img/https://www.glenwoodnyc.com/wp-content/uploads/2022/05/2-JSP-LOBBY-01-02-1280.jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://ap.rdcpix.com/d04c909232a9189e7678c7b59b9a25fcl-b3023719231od-w480_h360_x2.jpg',
        preview: true
      },
      {
        spotId: 8,
        url: 'https://homedesignlover.com/wp-content/uploads/2013/08/15-nick-again.jpg',
        preview: true
      },
      {
        spotId: 9,
        url: 'https://glenwoodadmin.com/webdav/images/slideshow/Encore/Slider%20GLENWOOD-08-TERRACE-P4-FINAL_RGB%20Web%20Edited%2011-30-20.jpg',
        preview: true
      },
      {
        spotId: 10,
        url: 'https://cdn.homedit.com/wp-content/uploads/2017/08/Futuristic-origami-inspired-house-frames-a-single-tree-in-the-garden.jpg',
        preview: true
      },
      {
        spotId: 11,
        url: 'https://s3.amazonaws.com/twotreesny/mh1200x854-1647635818817.jpeg',
        preview: true
      }
    ], {});

  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    const Op = Sequelize.Op;

    await queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['https://a0.muscache.com/im/pictures/miso/Hosting-21409981/original/a8fa243d-dac8-4238-93e5-f7aa33072ff8.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/128c623f-c401-4aa4-80bc-446165fd6884.jpg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/38bc8081-9415-453a-b8bf-9f4aeb146819.jpeg?im_w=720',
      'https://thumbs.cityrealty.com/assets/smart/736x/webp/2/22/22ca6350cd0dcc474556e1e06bd8144482a45135/15-central-park-west-01.jpg',
      'https://wp-tid.zillowstatic.com/bedrock/app/uploads/sites/26/nyc-apartments-for-3200-lic-6fadb8.jpg',
      'https://sp-ao.shortpixel.ai/client/q_glossy,ret_img/https://www.glenwoodnyc.com/wp-content/uploads/2022/05/2-JSP-LOBBY-01-02-1280.jpg',
      'https://ap.rdcpix.com/d04c909232a9189e7678c7b59b9a25fcl-b3023719231od-w480_h360_x2.jpg',
      'https://homedesignlover.com/wp-content/uploads/2013/08/15-nick-again.jpg',
      'https://glenwoodadmin.com/webdav/images/slideshow/Encore/Slider%20GLENWOOD-08-TERRACE-P4-FINAL_RGB%20Web%20Edited%2011-30-20.jpg',
      'https://cdn.homedit.com/wp-content/uploads/2017/08/Futuristic-origami-inspired-house-frames-a-single-tree-in-the-garden.jpg',
      'https://s3.amazonaws.com/twotreesny/mh1200x854-1647635818817.jpeg',
    ]}
    }, {});

  }
};
