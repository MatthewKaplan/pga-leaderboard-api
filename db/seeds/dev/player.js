const playerData = require('../../../playerData');

const createPlayer = async (knex, player) => {
  await knex('players').insert({
    first_name: player.first_name,
    last_name: player.last_name,
    score: player.score
  }, 'id');
}

exports.seed = async (knex) => {
  try {
    await knex('players').del()

    let playerPromises = playerData.map(player => {
      return createPlayer(knex, player);
    })

    return Promise.all(playerPromises);
  } catch (error) {
    console.log(`Error seeding data: ${error}`)
  }
}
