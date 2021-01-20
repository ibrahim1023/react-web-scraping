const express = require('express');
const cors = require('cors');
const path = require('path');

const { MongoClient } = require('mongodb');
var { PythonShell } = require('python-shell');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const collectionName = 'scrape';
var collection;

app.get('/api/results', async (req, res) => {
  var finalResults;

  const query = { keyword: req.query.searchTerm };

  collection.findOne(query, (error, result) => {
    if (error) {
      return response.status(500).send(error);
    }

    console.log(result);

    if (result == null) {
      let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time
        // scriptPath: '', //If you are having python_test.py script in same folder, then it's optional.
        args: req.query.searchTerm //An argument which can be accessed in the script using sys.argv[1]
      };

      PythonShell.run('amazon_scrape.py', options, function (err, results) {
        if (err) throw err;
        // result is an array consisting of messages collected
        // console.log('result: ', JSON.parse(result[0]));

        searchResults = JSON.parse(results);
        finalResults = { result: searchResults };

        collection.insert(
          { keyword: req.query.searchTerm, result: searchResults },
          (error, result) => {
            if (error) {
              return res.status(500).send(error);
            }
            console.log('New searchQuery added');
          }
        );

        res.send(finalResults);
      });
    } else {
      res.send(result);
    }
  });
});

// Serve static assets
if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging'
) {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
}

app.listen(PORT, async () => {
  MongoClient.connect(
    'mongodb+srv://admin:adminPass@cluster0.c7kwz.mongodb.net/test?retryWrites=true&w=majority',
    function (err, client) {
      if (err) {
        console.log(
          'Error occurred while connecting to MongoDB Atlas...\n',
          err
        );
      }
      console.log('Connected...');
      console.log(`Server running on port ${PORT}..`);
      collection = client.db('test').collection(collectionName);
    }
  );
});
