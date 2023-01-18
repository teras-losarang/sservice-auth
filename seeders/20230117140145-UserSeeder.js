"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let password = await bcrypt.hash("password", bcrypt.genSaltSync(10));
    return queryInterface.bulkInsert("Users", [
      {
        name: "John Doe",
        email: "admin@mailinator.com",
        password: password,
        token: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
