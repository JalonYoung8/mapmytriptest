var express = require('express');
var router = express.Router();
const connection = require('../services/db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('trips/index', { title: 'My Trips' });

  await selectTrips(
      (trips) => {
          console.log(trips.length);
          console.log(trips[0]);
          res.render('trips/index', { title: 'My Trips', triplist: trips });
      } 
  )
});

/* GET new trip form. */
router.get('/new', function(req, res, next) {
  res.render('trips/new', { title: 'Add a Trip' });
});

router.post('/create', async function(req, res, next) {
  console.log(req.body);
  await insertTrip( req.body.trip_name, req.body.trip_year, req.body.description, (trip) => {console.log(trip.insertId);})
});


/* GET home page. */
router.get('/view', async function(req, res, next) {
  res.render('trips/index', { title: 'My Trips' });

  await selectOneTrip(req.query.trip_id,
      async (trips) => {
          myTrip = trip[0];
          tripID = myTrip.trip_id;

            // Call MongoDB for our photos
            await retrievePhotos(req.db, tripID, function(docs){
              console.log(docs);
              var photos = docs;
              for (var photo of photos) {
                  var photoURL = 'https://storage.googleapis.com/final_thumbnail_bucket/${process.env.GCLOUD_THUMBNAIL_BUCKET}/${photo.fileName}';

                  var thumbURL = 'https://storage.googleapis.com/final_thumbnail_bucket/${process.env.GCLOUD_THUMBNAIL_BUCKET}/thumb@256_${photo.fileName}';

                  photo['photoURL'] = photoURL;
                  photo['thumbURL'] = thumbURL;

              }

             res.render('trips/view', { title: myTrip.trip_name, trip: myTrip, photos: photo });

            });


      } 
  )
});


module.exports = router;

// HELPER FUNCTIONS

const insertTrip = async function(name, year, description, callback) {
  console.log('!!!!! In insertTrip!');
  connection.query(
    `INSERT INTO trips (trip_name, trip_year, description)
     VALUES ("${name}", "${year}","${description}")`,
     function(error, results, fields) {
       if (error) throw error;
       callback(results);
     }
  )
}

const selectTrips = async function(callback) {
    connection.query('SELECT * FROM trips', function(error, results, fields){
        if (error) throw error;
        callback(results);
    } )
}

const selectOneTrips = async function(trip_id, callback) {
    connection.query('SELECT * FROM trips WHERE trip_id=${trip_id}', function(error, results, fields){
        if (error) throw error;
        callback(results);
    } )
}

const retrievePhotos = async function(mongo_db, trip_id, callback){

  var searchString = trip_id + "_";

  // Find all of the documents in the collection
  mongo_db.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_COLLECTION_NAME).find({fileName: new RegExp(searchString) }).toArray(function(err, docs) {
      callback(docs);
  });
};