const express = require('express');
const aqp = require('api-query-params');
const {BookingModel, BookingJsonSchema} = require("../models/BookingModel");
const {validate} = require("jsonschema");
const {date_jsonSchema} = require("mongoose-schema-jsonschema/lib/types");

module.exports = (keycloak) => {

    const hasRole = (req, role) => req.kauth.grant.access_token.content.realm_access.roles.includes(role);
    const getUserId = (req) => req.kauth.grant.access_token.content.sub;

    const ownershipPolicy = async (_id, req) => {
        const {owner} = await BookingModel.findById(_id);
        if (!hasRole(req, "user")) return true;
        return owner === getUserId(req);
    }

    const post = (req, res) => {
        const {body} = req;

        BookingModel.create(body, (e, newEntry) => {
            if (e) {
                return res.status(500).json(e);
            }
            res.status(201)
            res.location(req.protocol + "://" + req.hostname + ":" + req.socket.localPort + req.baseUrl + "/" + newEntry._id);
            return res.end();

        });
    };

    const getAll = async (req, res) => {
        const {filter, skip, limit, sort, projection, population} = aqp(req.query);
        await BookingModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .exec((e, result) => {
                if (e) {
                    return res.status(500).json(e);
                }
                res.set("X-Total-Count", result.length)
                return res.json(result);
            });
    };

    const getCount = async (req, res) => {
        const {filter, skip, limit, sort, projection, population} = aqp(req.query);
        await BookingModel.find(filter)
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .select(projection)
            .populate(population)
            .count()
            .exec((e, result) => {
                if (e) {
                    return res.status(500).json(e);
                }
                res.set("X-Total-Count", result)
                return res.end();
            });
    };

    const getById = (req, res) => {
        const {_id} = req.params;

        BookingModel.findById(_id, (e, result) => {
            if (e) {
                return res.status(404).json(e);
            }
            res.status((result.length === 0) ? 404 : 200);
            return res.json(result);

        });
    };

    const put = async (req, res) => {
        const {_id} = req.params;
        const {body} = req;
        if(await ownershipPolicy(_id, req) === false) return res.status(401).end();

        try {
            const result = await BookingModel.findById(_id).select('__v');
            if (result === null) {
                return res.status(404).json({error: '_id not valid'});
            }
            body['__v'] = result.__v + 1;
        } catch (e) {
            res.status(404);
            return res.end();
        }

        await BookingModel.findOneAndReplace(_id, body, {new: true}, async (e, doc) => {
            if (e) {
                return res.status(500).json(e);
            }
            res.status(200);
            return res.end();
        });
    };

    const deleteById = async (req, res) => {
        const {_id} = req.params;

        if(await ownershipPolicy(_id, req) === false) return res.status(401).end();

        BookingModel.findOneAndDelete(_id, (e, deleted) => {
            if (e) {
                return res.status(404).json(e);
            }
            res.status((deleted === null) ? 404 : 200);
            return res.end();
        });
    };

    const getFilledSeats = async (req, res) => {
        const {movieTheater, time, date, movie} = req.query;
        await BookingModel.find({movieTheater, time, movie})
            .exec((e, result) => {
                if (e) {
                    return res.status(500).json(e);
                }
                let data = [];
                for (let r of result) {
                    if(datesAreOnSameDay(r.date, new Date(date))){
                        data = [...r.seats, ...data]
                    }
                }
                return res.json(data);
            });
    };

    const datesAreOnSameDay = (first, second) =>
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();

    const getSchema = (req, res) => {
        console.dir(getUserId(req));
        res.json(BookingJsonSchema);
    }

    const validateInput = (req, res, next) => {
        const {body} = req;
        if (BookingJsonSchema !== undefined) {
            const val = validate(body, BookingJsonSchema);
            if (val.valid === false) {
                return res.status(422).json({errors: val.errors});
            }
        }
        return next();
    }

    let router = express.Router();
    router.get('/schema', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), getSchema);
    router.head('/', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), getCount);
    router.get('/', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), getAll);
    router.get('/getFilledSeats', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), getFilledSeats);
    router.get('/:_id', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), getById);
    router.post('/', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), validateInput, post);
    router.put('/:_id', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), validateInput, put);
    router.delete('/:_id', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), deleteById);

    return router;
}
