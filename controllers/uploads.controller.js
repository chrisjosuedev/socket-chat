require('dotenv').config()
const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL)

const { request, response } = require('express');

const { uploadFile } = require('../helpers');

const { User, Product } = require('../models');

/* Local Upload Files */
const uploadFiles = async (req = request, res = response) => {
    try {
        // undefined -> Default Extensions in upload-file.js
        const upload = await uploadFile(req.files, undefined, 'imgs');

        return res.status(200).json({
            ok: true,
            msg: `${upload}`,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: `${error}`,
        });
    }
};

/** LOCAL UPLOADS **/
// const updateFile = async (req = request, res = response) => {
//     const { collection, id } = req.params;

//     let model;

//     switch (collection) {
//         case 'users':
//             model = await User.findById(id);

//             if (!model) {
//                 res.status(400).json({
//                     ok: true,
//                     msg: "User doesn't exists.",
//                 });
//             }

//             break;
//         case 'products':
//             model = await Product.findById(id);

//             if (!model) {
//                 res.status(400).json({
//                     ok: true,
//                     msg: "Product doesn't exists.",
//                 });
//             }

//             break;
//         default:
//             return res.status(500).json({
//                 ok: false,
//                 msg: 'Validation Failed',
//             });
//     }

//     try {

//         // Clean previous pictures
//         if (model.img) {
//             // Img path
//             const pathImg = path.join(__dirname, '../uploads', collection, model.img)

//             // Verify if Path Exists
//             if (fs.existsSync(pathImg)) {
//                 // Delete File
//                 fs.unlinkSync(pathImg)
//             }
            
//         }

//         // undefined -> Default Extensions in upload-file.js
//         const upload = await uploadFile(req.files, undefined, collection);

//         model.img = upload

//         await model.save()

//         return res.status(200).json({
//             ok: true,
//             updated: [model],
//         });

//     } catch (error) {
//         console.log(error);
//         return res.status(400).json({
//             ok: false,
//             msg: `${error}`,
//         });
//     }
// };

/** Cloudinary Uploads **/
const updateFile = async (req = request, res = response) => {
    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);

            if (!model) {
                res.status(400).json({
                    ok: true,
                    msg: "User doesn't exists.",
                });
            }

            break;
        case 'products':
            model = await Product.findById(id);

            if (!model) {
                res.status(400).json({
                    ok: true,
                    msg: "Product doesn't exists.",
                });
            }

            break;
        default:
            return res.status(500).json({
                ok: false,
                msg: 'Validation Failed',
            });
    }

    try {

        // Clean previous pictures
        if (model.img) {
            const nameShort = model.img.split('/')
            const fileName = nameShort[nameShort.length - 1]

            // Desestructuracion [0, 1], solo 1 toma el valor 0 del array
            const [ public_id ] = fileName.split('.')

            await cloudinary.uploader.destroy(public_id)
        }

        const { tempFilePath } = req.files.file

        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        model.img = secure_url
        
        await model.save()

        return res.status(200).json({
            ok: true,
            updated: [model],
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: `${error}`,
        });
    }
};

const showImg = async (req = request, res = response) => {
    const { collection, id } = req.params

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);

            if (!model) {
                res.status(400).json({
                    ok: true,
                    msg: "User doesn't exists.",
                });
            }

            break;
        case 'products':
            model = await Product.findById(id);

            if (!model) {
                res.status(400).json({
                    ok: true,
                    msg: "Product doesn't exists.",
                });
            }

            break;
        default:
            return res.status(500).json({
                ok: false,
                msg: 'Validation Failed',
            });
    }

    try {
        // Verify if img property exists
        if (model.img) {
            return res.redirect(model.img)
        }

        const noFound = path.join(__dirname, '../assets/no-image.jpg')
        return res.status(404).sendFile(noFound)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: `${error}`,
        });
    }
    
}

module.exports = {
    uploadFiles,
    updateFile,
    showImg
};
