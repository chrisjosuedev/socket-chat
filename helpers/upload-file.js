const path = require('path');

const { v4: uuidv4 } = require('uuid');

// If user sends 'folder', we need to create a new folder!!

const uploadFile = (
    files,
    allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'],
    folder = ""
) => {
    return new Promise((resolve, reject) => {
        const { file } = files;

        // Get File Size (Bytes to MB) 1 MB = 1048576 Bytes
        const fileSize = file.size / 1048576;

        if (fileSize > 1) {
            return reject(
                `${fileSize.toFixed(
                    2
                )} MB is not a allowed file size, please upload a file with 1MB min.`
            );
        }

        // Get Extension from File
        const shortName = file.name.split('.');
        const extensionFile = shortName[shortName.length - 1];

        // Validate Extension

        if (!allowedExtensions.includes(extensionFile)) {
            return reject(
                `${extensionFile} is not allowed: ${allowedExtensions}`
            );
        }

        const newTempName = uuidv4() + '.' + extensionFile;
        const uploadPath = path.join(__dirname, '../uploads/', folder, newTempName);

        file.mv(uploadPath, function (err) {
            if (err) {
                reject(err)
            }

            resolve(newTempName)
        });


    });
};

module.exports = {
    uploadFile,
};
