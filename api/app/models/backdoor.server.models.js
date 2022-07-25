      const fs = require('fs');
const db = require('../../config/db');


const reset = (done) => {
  const script = fs.readFileSync('./app/scripts/tables.sql', 'utf8');

  db.get_pool().query(script, (err, rows)=> {
      // console.log(err, rows);
      if (err){
          console.log(err);
          return done(err);
      }
          console.log('DB script executed successfully')
          done(false);
      
  });
}



const resample = (done) => {
  const script = fs.readFileSync('./app/scripts/dummy_data.sql', 'utf8');

  db.get_pool().query(script, (err, rows)=> {
      // console.log(err, rows);
      if (err){
          console.log(err);
          return done(err);
      }
          console.log('DB script executed successfully')
          done(false);
      
  });
}

module.exports = {
  reset,
  resample
}
