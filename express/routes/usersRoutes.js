const { models } = require('../../sequelize');
const { getIdParam } = require('../../express/helpers');
const bcrypt = require("bcrypt");
const sequelize = require("sequelize")
const jwt = require('jsonwebtoken');
const crypto = require('crypto')



async function getAll (req, res) {
  try {

    const allUsers = await models.users.findAll()
    console.log(allUsers)
    res.status(200).json(allUsers);
  }catch (err) {
    console.log(err);
    return { status: 500, data: err };
  }
}



async function getById(req, res) {
  const id = getIdParam(req);
  const user = await models.users.findByPk(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function create(req, res) {

  if (req.body.user_id) {
    res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
  } else {
    try{

      await models.users.create(req.body);
      res.status(200).json(`User created succesfully`);
    }catch (e) {
      console.log(e)
      res.status(500).end()
    }

  }
}

async function update(req, res) {
  const id = getIdParam(req);
  try {
    // We only accept an UPDATE request if the `:id` param matches the body `id`
    if (req.body.user_id === id) {
      await models.users.update(req.body, {
        where: {
          user_id: req.body.user_id
        },
        individualHooks: true

      });
      res.status(200).end();
    } else {
      res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.user_id}).`);
    }
  }catch (e) {
    console.log(e)
    res.status(500).send(e)
  }


}

async function remove(req, res) {

  const id = getIdParam(req);
  try{
    await models.users.destroy({
      where: {
        user_id: id
      }
    });
    res.status(200).end();
  }catch (e) {
    console.log("ERRO:" + e)
    res.status(500).end();
  }
}

async function login(req, res) {
  const email = req.body.email
  const password = req.body.password
  console.log(password)

  try {
    let user = await models.users.findOne({
      where: {
        user_email: email,
      }
    });

    if (user) {
      const password_valid = await user.validPassword(password, user.user_password);
      if (password_valid) {
        const token = jwt.sign({ id: user.id }, "4ta$!sS2q#jGXOq0*7", {
          expiresIn: 86400 // expires in 24 hours
        });
        /*// Encrypt the user data using the 'secret' key
        const cipher = crypto.createCipher('aes-256-cbc', 'secret');
        let encrypted = cipher.update(JSON.stringify(user), 'utf8', 'hex');
        encrypted += cipher.final('hex');*/

        let encrypted = encrypt(user);

        res.send({ auth: true, token: token, user: encrypted });
      } else {
        res.status(400).json({error: "Password Incorrect"});
      }

    } else {
      res.status(404).json({error: "User does not exist"});
    }


  } catch (e) {
    console.log("ERRO:" + e)
    res.status(500).end();
  }


}
function encrypt(data) {
  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // Create the cipher using the '8x/A?D(G+KbPeShVmYq3s6v9y$B&E)H@' key and the IV
  const cipher = crypto.createCipheriv('aes-256-gcm', '8x/A?D(G+KbPeShVmYq3s6v9y$B&E)H@', iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return the IV and the encrypted data as a base64-encoded string
  return Buffer.concat([iv, Buffer.from(encrypted, 'hex')]).toString('base64');
}




module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  login,

};