const { models } = require('../../sequelize');
const { getIdParam } = require('../../express/helpers');
const cloudinary = require('cloudinary')
const formidable = require('formidable');




cloudinary.config({
  cloud_name: 'dvmobgla4',
  api_key: 515752486812418,
  api_secret: 'zrKHfNtGdXkBBjmLlTQ_fRDIWBI',
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

async function getAllUserFiles(req, res) {
  const id = getIdParam(req);
  try {
    const allFiles = await models.files.findAll({
      where: {
        file_user_id: id
      }

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
  console.log(req.body)
  const file = await models.files.findByPk(id);
  if (file) {
    res.status(200).json(file);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function uploadImage(req, res) {
  try {
    let form = new formidable.IncomingForm();
    await form.parse(req, async (err, fields, files) => {
      let object = fields
      console.log(object)

      await cloudinary.uploader.upload(files.file_file.filepath, {
        resource_type: "auto",
      })
          .then((result) => {

            let link = result.secure_url
            res.status(200).json(link)
          })
          .catch((error) => {
            //console.log(error);
            return error
          })
    })

  }
  catch (err){
    console.log(err)
    res.status
  }
}


async function create(req, res) {


  if (req.body.file_id) {
    res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
  } else {
    try{

        let object = req.body
        const output = object.file_file.replace(/"/g, "");
        console.log(output);



        await models.files.create({
          file_name: object.file_name,
          file_path: object.file_path,
          file_hash: object.file_hash,
          file_user_id: object.file_user_id,
          file_file: output,
        });



      res.status(200).json({success:"File uploaded successfully"});
    }catch (e) {
      console.log(e)
      res.status(500).json({error:e});
    }

  }
}

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
    await models.files.destroy({
      where: {
        file_id: id
      }
    });
    res.status(200).json({success:"File deleted successfully"});
  }catch (e) {
    console.log("ERRO:" + e)
    res.status(500).json({error:e});
  }

}

module.exports = {
  getAll,
  getById,
  update,
  remove,
  create,
  uploadImage,
  getAllUserFiles,
}