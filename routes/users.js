const client = require('../models/connection.js')
const express = require('express');
const {log} = require("debug");
const app = express();


client.connect();

//
const getUsers = (request, response) => {
  client.query('select * from users ORDER BY user_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  client.query('SELECT * FROM users WHERE user_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const users = request.body;
  let insertQuery = `insert into users(user_name, user_email, user_password, user_role_id)
                    values ('${users.name}', '${users.email}', '${users.password}', 1)`
  client.query(insertQuery, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const deleteUser = (request, response) => {
  let insertQuery = `DELETE from users WHERE user_id = ${request.params.id}`
  client.query(insertQuery, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateUser = (request, response) => {
  let users = request.body;
  console.log(users);
  let updateQuery = `UPDATE users SET user_email = '${users.email}',
                                      user_password = '${users.password}'
                                      WHERE user_id = ${users.id} `
  client.query(updateQuery, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })

}

const getUserLogin = (request, response) => {
  let users = request.body
  client.query(`SELECT *
                FROM users
                WHERE user_email = '${users.email}'
                  AND user_password = '${users.password}'`, (error, results) => {
    if (results.length != 1) {
      throw error
    } else {
      response.status(200).json(results.rows)
    }
  })
}


module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  getUserLogin,
}