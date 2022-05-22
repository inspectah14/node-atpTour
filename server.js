import express from "express";
import { MongoClient, ObjectId } from "mongodb";
const port = 3000;
const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.urlencoded( { extended: true } ));

app.use(express.static("public"));

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();
const db = client.db("atptour");
const playerCollection = db.collection("players");

app.get('/index', async (req, res) => {
  res.render("index");
});

app.get('/playerList', async (req, res) => {
  const players = await playerCollection.find({}).toArray();
  res.render("playerList", {
    players
  });
});

app.get('/playerList/ascsorted', async (req, res) => {
  const players = await playerCollection.find({}).sort({ name: 1 }).toArray();
  res.render("playerList", {
    players
  });
});

app.get('/playerList/descsorted', async (req, res) => {
  const players = await playerCollection.find({}).sort({ name: -1 }).toArray();
  res.render("playerList", {
    players
  });
});

app.get("/player/:id", async (req, res) => {
  const player = await playerCollection.findOne( { _id: ObjectId(req.params.id) } );
  res.render("player", {
    player
  });
});

app.post("/delete/:id", async (req, res) => {
  await playerCollection.deleteOne( { _id: ObjectId(req.params.id) } );
  res.redirect("/playerList");
});

app.get('/addPlayer', async (req, res) => {
  res.render("addPlayer");
});

app.post('/players/add', async (req, res) => {
  req.body.dateJoined = new Date(req.body.dateJoined);
  await playerCollection.insertOne(req.body);
  res.redirect("/playerList");
});

app.get('/modifyPlayer/:id', async (req, res) => {
  const player = await playerCollection.findOne( { _id: ObjectId(req.params.id) } );
  res.render("modifyPlayer", {
    player
  });
});

app.post('/modify/:id', async (req, res) => {
  await playerCollection.updateOne( { _id: ObjectId(req.params.id) }, { $set: req.body } );
  res.redirect(`/player/${req.params.id}`);
});

app.listen(port, () => console.log(`Listening on port: ${port}`));