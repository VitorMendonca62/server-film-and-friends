const { v1 } = require('uuid');

const rooms = [];

module.exports = {
  async index(req, res) {
    return res.json(rooms);
  },

  async show(req, res) {
    const { id } = req.params;
    console.log(id);
    const room = rooms.filter((one) => one.id == id)[0];
    console.log('[rooms]', rooms);
    console.log('[room]', room);
    return res.json(room);
  },

  async store(req, res) {
    const room = {};
    const { title, release, genre, duration, rating, synopsis, imdbID } =
      req.body;

    room.id = v1();
    room.participant = [];
    room.title = title;
    room.release = release;
    room.genre = genre;
    room.duration = duration;
    room.rating = rating;
    room.synopsis = synopsis;
    room.imdbID = imdbID;

    rooms.push(room);

    return res.json(room);
  },
};
