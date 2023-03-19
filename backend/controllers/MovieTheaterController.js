const express = require('express');
const aqp = require('api-query-params');
const {MovieTheaterModel, MovieTheaterJsonSchema} = require("../models/MovieTheaterModel");
const {validate} = require("jsonschema");

module.exports = (keycloak) => {

    const hasRole = (req, role) => req.kauth.grant.access_token.content.realm_access.roles.includes(role);
    const getUserId = (req) => req.kauth.grant.access_token.content.sub;

    const ownershipPolicy = async (_id, req) => {
        const {owner} = await MovieTheaterModel.findById(_id);
        if (!hasRole(req, "user")) return true;
        return owner === getUserId(req);
    }
    const post = (req, res) => {
        const {body} = req;

        MovieTheaterModel.create(body, (e, newEntry) => {
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
        await MovieTheaterModel.find(filter)
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
        await MovieTheaterModel.find(filter)
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

        MovieTheaterModel.findById(_id, (e, result) => {
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
            const result = await MovieTheaterModel.findById(_id).select('__v');
            if (result === null) {
                return res.status(404).json({error: '_id not valid'});
            }
            body['__v'] = result.__v + 1;
        } catch (e) {
            res.status(404);
            return res.end();
        }

        await MovieTheaterModel.findOneAndReplace(_id, body, {new: true}, async (e, doc) => {
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

        MovieTheaterModel.findOneAndDelete(_id, (e, deleted) => {
            if (e) {
                return res.status(404).json(e);
            }
            res.status((deleted === null) ? 404 : 200);
            return res.end();
        });
    };

    const getSchema = (req, res) => {
        res.json(MovieTheaterJsonSchema);
    }

    const validateInput = (req, res, next) => {
        const {body} = req;
        if (MovieTheaterJsonSchema !== undefined) {
            const val = validate(body, MovieTheaterJsonSchema);
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
    router.get('/:_id', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), getById);
    router.post('/', keycloak.protect(['realm:admin', 'realm:manager']), validateInput, post);
    router.put('/:_id', keycloak.protect(['realm:admin', 'realm:manager']), validateInput, put);
    router.delete('/:_id', keycloak.protect(['realm:admin', 'realm:manager']), deleteById);

    return router;
}
