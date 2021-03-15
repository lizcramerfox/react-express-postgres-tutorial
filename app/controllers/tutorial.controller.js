const db = require('../models')
const Tutorial = db.tutorials
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  // Validate the request
  if (!req.body.title) {
    res.status(400).send({
      message: 'Content cannot be empty.'
    })
    return
  }
  
  // Create a new Tutorial
  const tutorial = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  }

  // Save new Tutorial to database
  Tutorial.create(tutorial)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Some error occured while creating new Tutorial.'
      })
    })
}

exports.findAll = (req, res) => {
  const title = req.query.title
  let condition = title ? {title: { [Op.iLike]: `%${title}%`} } : null

  Tutorial.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({ message: err.message || 'Some error occured while retrieving Tutorials' })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Tutorial.findByPk(id)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({ 
        message: `Error retrieving Tutorial with ID: ${id}.`
      })
    })
}

exports.update = (req, res) => {
  const id = req.params.id
  
  Tutorial.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Tutorial was updated successfully.'
        })
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Error updating Tutorial with ID: ${id}.`
      })
    })
}

exports.delete = (req, res) => {
  const id = req.params.id

  Tutorial.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'Tutorial deleted successfully.'
        })
      } else {
        res.send({
          message: `Cannot delete Tutorial with ID: ${id}. Please try again.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: `Cannot delete Tutorial with ID: ${id}. Please try again.`
      })
    })
}

exports.deleteAll = (req, res) => {
  Tutorial.destroy({ 
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tutorials were deleted successfully.`})
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Cannot delete all tutorials. Please try again.'
      })
    })
}

exports.findAllPublished = (req, res) => {
  Tutorial.findAll({ where: { published: true } })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'Cannot find all tutorials. Try again.'
      })
    })
}

