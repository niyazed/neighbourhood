const express = require('express');
const fs = require('fs');
const Datastore = require('nedb');


const app = express();
app.listen(3000, () => console.log('[INFO] Listening at port 3000, Goto - http://localhost:3000/'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

setInterval(init_db, 17280000); //reinit db every 48 hours 48 x 60 x 60 x 1000 = [] ms
function init_db(){
    const path = './database.db'
    
    try {
      fs.unlinkSync(path)
      database.loadDatabase();
      console.log("[INFO] Database Reinitialized");
      //file removed
    } catch(err) {
      console.error(err)
    }
}

app.post('/api', (request, response) => {
    const data = request.body
    database.insert(data);    
            response.json({
                status: 'success'
            });

            
    // database.update({username: data.username}, 
    //     {
    //         latitude: data.latitude, 
    //         longitude: data.longitude,
    //         username: data.username, 
    //         text: data.text, 
    //         dateTime: data.dateTime 
    //     }, 
    //     {}, function(err, numReplaced){
    //         if (numReplaced == 0){
    //             database.insert(data);
    //         }
    //     });
    
    // database.find({phone: data.phone}, function (err,docs) {
    //     if (docs != []) {
    //         console.log(docs)
            
    //     }
    //     // else {
    //     //     console.log(docs)
    //     //     //database.insert(data);    
    //     //     response.json({
    //     //         status: 'success'
    //     //     });
    //     // }
    // });
});



app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});