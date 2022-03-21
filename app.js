require('dotenv').config()
// Create express app
const express = require('express');
const cors = require('cors');
const nft = require('./routes/nft');
const merkle = require('./routes/merkle');
const claim = require('./routes/claim');

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use(nft);
app.use(merkle);
app.use(claim);

//default
app.use((req, res, next)=>{
    res.status(404).send('<h1> Page not found </h1>');
 });

 //listeners
 // Server port
let HTTP_PORT = process.env.PORT || 3000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});