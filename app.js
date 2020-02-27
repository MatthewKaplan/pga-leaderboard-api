const express = require("express");
const cors = require("cors");
const environment = process.env.NODE_ENV || "development";
const configuration = require("./knexfile")[environment];
const database = require("knex")(configuration);
const app = express();
app.use(express.json());
app.use(cors());

// GET all players
app.get("/api/v1/players", async (req, res) => {
    try {
        const players = await database("players").select();
        res.status(200).json(players);
    } catch(error) {
        res.status(500).json({ error });
    }
});

// GET players by id
app.get("/api/v1/players/:id", async (req, res) => {
    try {
        const players = await database("players").where('id', req.params.id).select();
        if (players.length) {
            res.status(200).json(players);
        } else {
            res.status(404).json({
                error: `Could not find player with id: ${req.params.id}`
            });
        }
    } catch (error) {
        res.status(500).json({ error })
    }
});

// Add players
app.post("/api/v1/players", async (req, res) => {
    const player = req.body;

    for (let requiredParameter of ['first_name', 'last_name', 'score']) {
        if (!player[requiredParameter]) {
            return res.status(422).send({ error: `Expected format: { first_name: <String>, last_name: <String>, score: <String> }. You're missing a ${requiredParameter} property.`});
        }
    }

    try {
        const id = await database("players").insert(player, "id");
        res.status(201).json({ id })
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Edit players by id
app.patch("/api/v1/players/:id", async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, score } = req.body;

    for (let requiredParameter of ['first_name', 'last_name', 'score']) {
        if (!req.body[requiredParameter]) {
            return res.status(422).send({ error: `Expected format: { first_name: <String>, last_name: <String>, score: <String> }. You're missing a ${requiredParameter} property.`});
        }
    }

    try {
        await database("players").where({ id }).update({ first_name, last_name, score }).then(res.status(200).json(req.body))
    } catch (error) {
        res.status(500).json({ error })
    }
});

// Delete players by id
app.delete("/api/v1/players/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await database("players").where("id", id).del().then(result => {
            if (!result) {
                res.status(404).json(`Could not find player with id: ${id}`)
            } else {
                res.status(200).json(`id: ${id} deleted`);
            }
        });
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = app;