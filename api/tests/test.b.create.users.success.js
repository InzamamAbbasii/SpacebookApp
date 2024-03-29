/*
 Test the successful creation of users
 */


// Require the necessary testing libraries
const chai = require('chai');
const chaiHttp = require('chai-http');

// Require the project-specific JavaScript files
const path = require('path');
const config = require('./config/config.js');
const userdata = require('./data/users.data.js');

const filename = path.basename(__filename);

const {expect} = chai;
chai.use(chaiHttp);

const server_url = config.getProperties().url;
const arrayOfGoodUsersData = userdata.usersGoodData(); // get an array of the data to test successful POST /users
const test_case_count = 0; // count of test cases

describe('Test successful creation of users.', () => {

    // Output filename of test script for cross reference
    before(()=> {
        console.log(`    [Script: ${  filename  }]`)
    });

    /*
     Good data has been prepared in file users.data.js. The appropriate data is 'loaded' via a require function above).
     Loop through the good data and for each item of data attempt to create a user.
     */

    arrayOfGoodUsersData.forEach((user) => {

        it(`Should return 201, and JSON with id of new user: ${  user.testDescription}`, () => chai.request(server_url)
                .post('/user')
                .send({
                    first_name: user.givenName,
                    last_name: user.familyName,
                    email: user.email,
                    password: user.password
                })
                .then((res) => {
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('id');
                    user.userid = res.body.id;
                })
                .catch((err) => {
                    throw err;
                }));
});


});
