const
    dotenv = require('dotenv').config();
    const db = require('./config/db');
    const express = require('./config/express');
    const config = require('./config/config');

    const version = config.get('version');

if(dotenv.error){
  console.log('broken here');
  console.log(dotenv.error);
  process.exit(1);
}

const app = express();


db.connect((err)=> {
    if(err){
        console.log('Unable to connect to MySQL');
        process.exit(1);
    }else{
        const port = process.env.PORT || 3333;
        app.listen(port, () => {
            console.log(`API Ver: ${  version  }; Listening on port: 3333`);
        })
    }
});
