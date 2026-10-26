const {Productinformation}= require('../../models/index');
const { Op } = require("sequelize");
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Logger = require('../../config/logging.js');

module.exports = async (req, res) => {
    console.log(req.body)
    const imageName = `${req.body.product.ean}-base.jpg`; // Replace with your image name
    const imageData = req.body.imageData; // Assuming imageData is sent in the request body
  
    // Decode base64 and save the image
    const imagePath = path.join('public/products', imageName);
    
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const decodedImage = Buffer.from(base64Data, 'base64');

    const sharpImage = sharp(decodedImage);

  // Resize the image to fit within a 1000x1000 square while maintaining aspect ratio
  const resizedImageBuffer = await sharpImage.resize(1000, 1000, {
    fit: 'inside',
  }).toBuffer();

  const squaredImageBuffer = await sharp({
    create: {
      width: 1000,
      height: 1000,
      channels: 4, // 4 channels for RGBA
      background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
    },
  }).composite([{ input: resizedImageBuffer }])
    .toBuffer();
    
    try {
      await fs.promises.writeFile(imagePath, squaredImageBuffer);
      res.json({ message: 'Image changed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to change image' });
    }

    let product = req.body.product
    product.product_information.imgurl = `/api/back-images/products/${req.body.product.ean}-base.jpg`
    Productinformation.update(product.product_information,
    {
        logging: false, 
        where: {id: product.product_information.id}
    })
    .then((product) => {
        res.status(200).json( product );
    })
    .catch((err) =>{        
        Logger.log(1, err)
    })
}