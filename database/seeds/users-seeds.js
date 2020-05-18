exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { username: "userOne", password: "passwordOne" },
        { username: "userTwo", password: "passwordTwo" },
        { username: "userThree", password: "passwordThree" },
      ]);
    });
};
