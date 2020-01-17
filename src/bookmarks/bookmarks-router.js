const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const { dummyBookmarks } = require('../dummyBookmarks');

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(dummyBookmarks);
  })
  .post(bodyParser, (req, res) => {
    
    const { title, url, rating, desc } = req.body;
  
    if (!title) {
      logger.error(`Title is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!url) {
      logger.error(`URL is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
  
    // get an id
    const id = uuid();
  
    const bookmark = {
      id,
      title,
      url,
      rating: (rating > 0)? rating : 1,
      desc
    };
  
    dummyBookmarks.push(bookmark);
  
    logger.info(`Bookmark with id ${id} created`);
  
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({id});
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = dummyBookmarks.find(bk => bk.id == id);
  
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark Not Found');
    }
  
    res.json(bookmark);
  })
  .delete((req, res) => {
    
    const { id } = req.params;
  
    const bookmarkIndex = dummyBookmarks.findIndex(bk => bk.id == id);
  
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not Found');
    }
  
    dummyBookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  })

module.exports = bookmarksRouter;