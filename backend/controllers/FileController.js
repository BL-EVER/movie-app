const express = require("express");
const multer = require("multer");
const fs = require('fs');
const path = require("path");

module.exports = (keycloak) => {
    const fileRoot = './public';

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, fileRoot)
        },
        filename: function (req, file, cb) {
            cb(null, req.params.id + '-' + file.originalname )
        }
    })
    const fileFilter = (req, file, cb) => cb(null, (/\.(gif|jpe?g|png|webp|bmp)$/i).test(file.originalname));

    const upload = multer({ storage: storage, fileFilter: fileFilter })

    const getFile = (req, res) => {
        const files = fs.readdirSync(fileRoot);
        for (const file of files){
            if(file.split('-')[0] === req.params.id) {
                return res.sendFile(path.join(__dirname, "../", fileRoot, file));
            }
        }
        return res.status(404).end();
    }

    const uploadFile = async (req, res) => {
        if(!req.file) return res.status(400).end();

        const files = fs.readdirSync(fileRoot);
        for (const file of files){
            if(file !== req.file.filename && file.split('-')[0] === req.params.id) {
                await fs.unlink(path.join(__dirname, "../", fileRoot, file), (err) => {
                    if(err) throw err;
                });
            }
        }
        res.json({fileName: req.file.filename})
    }

    const deleteFile = async (req, res) => {
        const files = fs.readdirSync(fileRoot);
        for (const file of files){
            if(file.split('-')[0] === req.params.id) {
                await fs.unlink(path.join(__dirname, "../", fileRoot, file), (err) => {
                    if(err) throw err;
                });
                res.status(200)
                return res.end()
            }
        }
        return res.status(404).end();
    }

    //keycloak.protect(['admin', 'user', 'manager'])
    let router = express.Router();
    router.get('/:id', getFile);
    router.post('/:id', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), upload.single('file'), uploadFile);
    router.delete('/:id', keycloak.protect(['realm:admin', 'realm:user', 'realm:manager']), deleteFile);
    return router;
}