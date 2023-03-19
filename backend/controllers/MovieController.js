const express = require('express');
const aqp = require('api-query-params');
const {MovieModel} = require("../models/MovieModel");

module.exports = () => {
    const getAll = async (req, res) => {
        console.log("Here");
        const {filter, skip, limit, sort, projection, population} = aqp(req.query);
        await MovieModel.find(filter)
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
        await MovieModel.find(filter)
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
        MovieModel.findById(_id, (e, result) => {
            if (e) {
                return res.status(404).json(e);
            }
            res.status((result.length === 0) ? 404 : 200);
            return res.json(result);

        });
    };
    let router = express.Router();
    router.head('/', getCount);
    router.get('/', getAll);
    router.get('/:_id', getById);
    return router;
}