const express = require('express')
const app = express()
const cors = require('cors')
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var morgan = require('morgan');
var morganBody = require('morgan-body');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'))

app.use(morgan('combined'));
//morganBody(app, {logAllReqHeader: true, logAllResHeader: true});

const mongo_uri = process.env.MONGO_URI || 'mongodb://127.0.0.1/Api';
mongoose.connect(mongo_uri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on("error", (err) => {
    console.log(`Mongoose Connection to ${mongo_uri} ERROR: ` + err.message);
});
mongoose.connection.once("open", () => {
    console.log(`MongoDB Connected to ${mongo_uri}`);
});

const session = require('express-session');
const Keycloak = require('keycloak-connect'); //Token data: req.kauth.grant.access_token.content

const memoryStore = new session.MemoryStore();
const kcConfig = {
    clientId: process.env.CLIENT_ID,
    bearerOnly: true,
    serverUrl: process.env.BASE_URL,
    realm: process.env.REALM,
    realmPublicKey: process.env.REALM_KEY
};
app.use(
    session({
        secret: 'mySecret',
        resave: false,
        saveUninitialized: true,
        store: memoryStore,
    })
);
const keycloak = new Keycloak({ store: memoryStore }, kcConfig);
app.set( 'trust proxy', true );
app.use(keycloak.middleware())

app.use('/api/movieTheater',
    require("./controllers/MovieTheaterController")(keycloak)
);
app.use('/api/Booking',
    require("./controllers/BookingController")(keycloak)
);
app.use('/api/file',
    require("./controllers/FileController")(keycloak)
);
app.use('/api/movie',
    require("./controllers/MovieController")()
);

const http = require('http').createServer(app)
const PORT = process.env.PORT || 8000;
http.listen(PORT, () => {
    console.log(`HTTP server Listening to ${PORT}`);
})
const fetch = require("./utils/FetchMovies");
fetch();

//REALM_KEY -> Realm settings -> Keys -> RS256 -> Public key button
