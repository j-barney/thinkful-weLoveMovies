const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
     critic_id: "critic.critic_id",
     preferred_name: "critic.preferred_name",
     surname: "critic.surname",
     organization_name: "critic.organization_name",
   })
  
  
function list() {
  return knex("movies").select("*");
}

function read(movieId) {
  return (
    knex("movies as m")
      .select("m.*")
    .where({movie_id: movieId} )
    .first()
  );
}

function theatersByMovie(movieId) {
  return(
    knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select(
      "t.*", "mt.movie_id", "mt.is_showing"
    )
    .where({"mt.movie_id": movieId })
    )
}

function reviewsByMovie(movieId) {
  return(
    knex("movies as m")
    .join("reviews as r", "r.movie_id", "m.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .where({"m.movie_id": movieId })
    .select(
      "*"
    )
    .then((reviews) => reviews.map(addCritic))
    )
}


function showingList() {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .distinct()
    .select(
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url"
    )
    .where({ is_showing: true });
}

module.exports = {
  list,
  showingList,
  theatersByMovie,
  reviewsByMovie,
  read,
};
