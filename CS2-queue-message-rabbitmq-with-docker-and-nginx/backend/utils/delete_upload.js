const fs = require('fs');
const path = require('path');

const deleteFiles = () => {
    const uploadsFolder = path.join(__dirname, '../uploads');

    fs.readdir(uploadsFolder, (err, files) => {
        if (err) {
            console.error('Error reading the uploads folder:', err);
            return;
        }

        // Iterate through files and delete each one
        files.forEach((file) => {
            const filePath = path.join(uploadsFolder, file);
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error(`Error deleting file ${file}:`, unlinkErr);
                } else {
                    console.log(`Deleted file: ${file}`);
                }
            });
        });
    });
};
deleteFiles()
// Export the function for use in other files
module.exports = deleteFiles;
