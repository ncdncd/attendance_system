'use strict';
const bcrypt = require('bcryptjs');

// const makePassword = (password) => {
//   return new Promise(async res => {
//     let salt, hash;
//     salt = await bcrypt.genSalt(10);
//     hash = await bcrypt.hash(password, salt);
//     return res(hash);
//   })
// }

const makePassword = async (pass) => {
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(pass, salt);
  return hashed;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const password = await makePassword("Andreadmin123!");
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Users', [
    {
      id: 1,
      email: 'andret@admin.com',
      password: password,
      access_token: "",
      exp_access_token: new Date(),
      role_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  }
};
