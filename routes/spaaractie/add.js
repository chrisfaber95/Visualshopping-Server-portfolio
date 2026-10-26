const {Spaaractie, SpaaractieHasProduct}= require('../../models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const fs = require('fs');
const path = require('path');
const images = ['back_imgurl', 'front_imgurl', 'imgurl', 'list_image', 'stamp_imgurl']

module.exports = async (req, res) => {
  try{
      var spaaractie = req.body
// Assuming you have a parameter in the request body that identifies the row to update
// Find the row to update by its primary key (e.g., 'id' field)

images.forEach(element => {
  var imageInput = spaaractie[element]
  if (isValidBase64(imageInput)) {
      // Parse the base64 image data
      const imageData = imageInput.split(';base64,').pop();
      const imageExtension = imageInput.split(';')[0].split('/')[1];

      // Generate a unique filename
      const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${imageExtension}`;
      const imagePath = path.posix.join('public/acties', uniqueFilename);
      const imagePath1 = path.posix.join('api/back-images/acties', uniqueFilename);

      // Save the image to the folder
      fs.writeFileSync(imagePath, imageData, { encoding: 'base64' });
      spaaractie[element] = imagePath1
    }  
});

// Perform the update
const NewActie = await Spaaractie.create(spaaractie);
// Insert new records for the updated association
var products = spaaractie.spaaractie_products
for (let i = 0; i < products.length; i++) {
  products.spaaractie_id = NewActie.spaaractie_id
}
await SpaaractieHasProduct.bulkCreate(products);

const updated = await Spaaractie.findByPk(NewActie.spaaractie_id, {
  include: { all: true}
});
// Send the updated data as a response
res.status(200).json(updated);
} catch (error) {
console.error(error);
Logger.log(1, error)
res.status(500).json({ error: 'Internal server error' });
}
};

function isValidBase64(input) {
const base64Pattern = /(data:image\/[^;]+;base64[^"]+)/;

// Test if the input string matches the pattern
return base64Pattern.test(input);
}