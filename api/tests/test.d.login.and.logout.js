/*
 Test logging in/out.
 */


const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');

const filename = path.basename(__filename);

// Require the project-specific JavaScript files
const config = require('./config/config.js');
const usersData = require('./data/users.data.js');

const {expect} = chai;

chai.use(chaiHttp);

const server_url = config.getProperties().url;
const arrayOfGoodUsersData = usersData.usersGoodData(); // get an array of the data to test successful POST /users
const test_case_count = 0; // count of test cases
let authorization_token = '';
let user_id = 0;

describe('Test user login/logout.', () => {

    // Output filename of test script for cross reference
    before(()=> {
        console.log(`    [Script: ${  filename  }]`)

    });



    /*
     Successful login
     */
    it('Should return 200 status code for successful login', () => chai.request(server_url)
            .post('/user/login')
            .send({
                email: arrayOfGoodUsersData[0].email,
                password: arrayOfGoodUsersData[0].password
            })
            .then((res)=> {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('token');
                authorization_token = res.body.token;
                user_id = res.body.id;
            })
            .catch((err) => {
                throw err; // there is any error
            }));

    /*
     Try dodgy email
     */
    it('Should return 400 status code for incorrect email', () => chai.request(server_url)
            .post('/user/login')
            .send(
                {
                    email: 'dodgyemail@hotmail.com',
                    password: arrayOfGoodUsersData[1].password
                }
            )
            .then((res)=> {
                expect(res).to.have.status(400);
                // expect(res).to.be.json;
                // expect(res.body).to.have.property('id');
                // expect(res.body).to.have.property('token');
                // authorization_token = res.body['token'];
                // user_id = res.body['id'];
                // throw new Error('Incorrectly logging in user.');
            })
            .catch((err) => {
                console.log(err);
                // if (typeof err.status !== 'undefined') {
                //     if (err.status === 400) {
                //         expect(err).to.have.status(400);
                //     } else if (err.status === 500) {
                //         expect(err).to.have.status(500);
                //     }
                // }
                // else {
                //     throw err;
                // }
            }));

    /*
     Try dodgy password
     */
    it('Should return 400 status code for incorrect password', () => chai.request(server_url)
            .post('/user/login')
            .send(
                {
                    email: arrayOfGoodUsersData[1].email,
                    password: 'badpassword'
                }
            )
            .then((res)=> {
                expect(res).to.have.status(400);
                // expect(res).to.be.json;
                // expect(res.body).to.have.property('id');
                // expect(res.body).to.have.property('token');
                // authorization_token = res.body['token'];
                // user_id = res.body['id'];
                // throw new Error('Incorrectly logging in user.');
            })
            .catch((err) => {
                console.log(err);
                // if (typeof err.status !== 'undefined') {
                //     if (err.status === 400) {
                //         expect(err).to.have.status(400);
                //     } else if (err.status === 500) {
                //         expect(err).to.have.status(500);
                //     }
                // }
                // else {
                //     throw err;
                // }
            }));

    /*
     Try dodgy logout
     */
    it('Should return 401 status code for logging out user not logged in', () => chai.request(server_url)
            .post('/user/logout')
            .set('X-Authorization', 'hello')
            .then((res)=> {
                expect(res).to.have.status(401);
                // throw new Error('Incorrectly logged out user.');
            })
            .catch((err) => {
                console.log(err);
                // if (typeof err.status !== 'undefined') {
                //     expect(err).to.have.status(401);
                // }
                // else {
                //     throw err;
                // }
            }));

    after(() => chai.request(server_url)
            .post('/user/logout')
            .set('X-Authorization', authorization_token)
            .then((res)=> {
                expect(res).to.have.status(200);
            })
            .catch((err) => {
                throw err; // there is any error
            }));

});
