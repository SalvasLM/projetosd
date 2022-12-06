const { models } = require('../../sequelize');
const { getIdParam } = require('../../express/helpers');
const cloudinary = require('cloudinary')
const formidable = require('formidable');




cloudinary.config({
  cloud_name: 'dlzn4jynw',
  api_key: 495483183777134,
  api_secret: 'gEAewFKUTicNIEvTgcFNQyDaMcY',
  secure: true,
  unique_filename: true
});

async function getAll(req, res) {

  try {
    const allFiles = await models.files.findAll({
      include: models.users

    })

    console.log(allFiles)
    res.status(200).json(allFiles);
  } catch (err) {
    console.log(err);
    return { status: 500, data: "INTERNAL SERVER ERROR" };
  }

}

async function getById(req, res) {
  const id = getIdParam(req);
  const file = await models.files.findByPk(id);
  if (file) {
    res.status(200).json(file);
  } else {
    res.status(404).send('404 - Not found');
  }
}
/*async function create(req, res) {

  if (req.body.id) {
    res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
  } else {
    try{
      let form = new formidable.IncomingForm();
      await form.parse(req, async (err, fields, files) => {
        let object = fields
        await cloudinary.uploader.upload(files.product_photo.filepath, {
          resource_type: "auto",
        })
            .then((result) => {
              //console.log(result.secure_url);
              object.product_photo = result.secure_url
            })
            .catch((error) => {
              //console.log(error);
              return error
            })
        await models.products.create({
          product_name: object.product_stock,
          product_description: object.product_description,
          product_stock: object.product_stock,
          product_price: object.product_price,
          product_store_id: object.product_store_id,
          product_photo: object.product_photo,
        });


      })


      res.status(200).end();
    }catch (e) {
      console.log(e)
      res.status(500).end()
    }

  }
}*/

async function update(req, res) {
  const id = getIdParam(req);

  // We only accept an UPDATE request if the `:id` param matches the body `id`
  if (req.body.file_id === id) {
    await models.files.update(req.body, {
      where: {
        file_id: req.body.file_id
      }
    });
    res.status(200).end();
  } else {
    res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.product_id}).`);
  }
}

async function remove(req, res) {
  const id = getIdParam(req);
  try{
    await models.products.destroy({
      where: {
        file_id: id
      }
    });
    res.status(200).end();
  }catch (e) {
    console.log("ERRO:" + e)
    res.status(500).end();
  }

}

module.exports = {
  getAll,
  getById,
  update,
  remove,
}