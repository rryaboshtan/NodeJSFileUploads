const UploadModel = require('../model/schema');
const fs = require('fs');

exports.home = (req, res) => {
   res.render('main');
};
exports.uploads = (req, res, next) => {
   const files = req.files;

   if (!files) {
      const error = new Error('Please choose files');
      error.httpStatusCode = 400;
      return next(error);
   }

   const imageArray = files.map(file => {
      const image = fs.readFileSync(file.path);

      const encodeImage = image.toString('base64');
      return encodeImage;
   });

   const result = imageArray.map((encodeImage, index) => {
      const modelObject = {
         filename: files[index].originalname,
         contentType: files[index].mimetype,
         imageBase64: encodeImage,
      };

      const uploadModel = new UploadModel(modelObject);

      return uploadModel
         .save()
         .then(() => {
            return { message: `${files[index].originalname} uploaded successfully...!` };
         })
         .catch(error => {
            if (error) {
               if (error.name === 'MongoError' && error.code === 11000) {
                  return Promise.reject({ error: `Duplicate ${files[index].originalname}. File already exists!` });
               }

               return Promise.reject({ error: error.message || `Cannot upload ${files[index].originalname} something missing` });
            }
         });
   });

   Promise.all(result)
      .then(message => {
         res.json(message);
      })
      .catch(error => {
         res.json(error);
      });
};
