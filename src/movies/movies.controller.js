const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

async function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

async function list(req, res) {
const {is_showing} = req.query
  if (is_showing === "true") {
    const showingData = await service.showingList();
    res.json({ data: showingData });

  } else {
    const data = await service.list();
    res.json({ data });
  }
}

async function theaterRead(req, res) {
    const {movieId} = req.params
    if (movieId) {
        const theaterData = await service.theatersByMovie(movieId)
        res.json({ data: theaterData });
    }
  }

async function reviewsRead(req, res) {
    const {movieId} = req.params
        const data = await service.reviewsByMovie(movieId)
        res.json({ data });
    
}




module.exports = {
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  list: asyncErrorBoundary(list),
  theaterRead: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theaterRead)],
  reviewsRead: [asyncErrorBoundary(movieExists), asyncErrorBoundary(reviewsRead)]
};
