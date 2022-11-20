const client = require('../models/connection.js')
const express = require('express');
const {log} = require("debug");
const app = express();


client.connect();


const getFiles = (request, response) => {
  client.query('select * from files ORDER BY file_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getFileById = (request, response) => {
  const id = parseInt(request.params.id)

  client.query('SELECT * FROM files WHERE file_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createFile = (request, response) => {
    const files = request.body;
    let insertQuery = `insert into files(file_name, file_path, file_hash)
                      values ('${files.name}', '${files.path}', '${files.hash}')`
    client.query(insertQuery, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const deleteFile = (request, response) => {
    let insertQuery = `DELETE from files WHERE file_id = ${request.params.id}`
    client.query(insertQuery, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const updateFile = (request, response) => {
    let files = request.body;
    console.log(files);
    let updateQuery = `UPDATE files SET file_path = '${files.email}',
                                        file_name = '${files.password}'
                                        WHERE file_id = ${files.id} `
    client.query(updateQuery, (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  
  }

module.exports = {
    getFiles,
    getFileById,
    createFile,
    deleteFile,
    updateFile,
  }