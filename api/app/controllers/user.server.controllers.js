const
  users = require('../models/user.server.models');
  const log = require('../lib/logger')();
  const validator = require('../lib/validator');
  const config = require('../../config/config.js');

  const schema = require(`../../config/${  config.get('specification')}`);
  const emailvalidator = require('email-validator');

const photo_tools = require('../lib/photo.tools.js');



const create = (req, res) => {
  if (!validator.isValidSchema(req.body, 'components.schemas.AddUser')) {
        log.warn(`users.controller.create: bad user ${JSON.stringify(req.body)}`);
        log.warn(validator.getLastErrors());
        return res.status(400).send('Bad Request - body must match specification and email must be correct');
    } 
        const user = { ...req.body};

        if(!emailvalidator.validate(user.email) || user.password.length <= 5){
            log.warn(`user.controller.create: failed validation ${JSON.stringify(user)}`);
            res.status(400).send('Bad request - email must be valid and password greater than 5 characters');
        }else{
            users.insert(user, (err, id)=> {
                if (err)
                {
                    log.warn(`user.controller.create: couldn't create ${JSON.stringify(user)}: ${err}`);
                    res.status(400).send('Bad Request - database error. Check the log. Possibly duplicate entry?');
                }else{
                  res.status(201).send({id});
                }
            });
        }
    
}



const login = (req, res) => {
  if(!validator.isValidSchema(req.body, 'components.schemas.LoginUser')){
    log.warn(`users.controller.login: bad request ${JSON.stringify(req.body)}`);
    res.status(400).send('Bad Request - request must match the spec');
  } else{
    const {email} = req.body;
    const {password} = req.body;

    users.authenticate(email, password, (err, id)=> {
        // console.log(err, id);
        if(err){
            log.warn(`Failed to authenticate: ${  err}`);
            res.status(400).send('Invalid email/password supplied');
        } else {
            users.getToken(id, (err, token)=> {
                /// return existing token if already set (don't modify tokens)
                if (token){
                    return res.send({id, token});
                } 
                    // but if not, complete login by creating a token for the user
                    users.setToken(id, (err, token)=> {
                        res.send({id, token});
                    });
                
            });
        }
    });
  }
}



const logout = (req, res) => {
  const token = req.get(config.get('authToken'));
    users.removeToken(token, (err)=> {
        if (err){
            return res.sendStatus(401);
        }
            return res.sendStatus(200);
        
    });
    return null;
}



const get_one = (req, res) => {
  const id = parseInt(req.params.usr_id);
  if (!validator.isValidId(id)) return res.sendStatus(404);

  users.getOne(id, (err, results)=> {
      if (err) {
          log.warn(`users.controller.get_one: ${JSON.stringify(err)}`);
          return res.sendStatus(500);
      } if (!results) {  // no user found
            log.warn('users.controller.get_one: no results found');
          return res.sendStatus(404);
      }
          res.status(200).json(results);
      
  });
}



const update = (req, res) => {
    const id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    const token = req.get(config.get('authToken'));
    users.getIdFromToken(token, (err, _id)=> {
        if (_id !== id)
            return res.sendStatus(403);
        if (!validator.isValidSchema(req.body, 'components.schemas.UpdateUser')) {
            log.warn(`users.controller.update: bad user ${JSON.stringify(req.body)}`);
            return res.sendStatus(400);
        }

        users.getJustUser(id, (err, results)=> {
            if(err) return res.sendStatus(500);
            if (!results) return res.sendStatus(404);  // no user found

            let givenname = '';
            let familyname = '';
            let email = '';
            let password = '';

            if(req.body.hasOwnProperty('first_name')){
                givenname = req.body.first_name;
            }else{
                givenname = results.first_name;
            }

            if(req.body.hasOwnProperty('last_name')){
                familyname = req.body.last_name;
            }else{
                familyname = results.last_name;
            }

            if(req.body.hasOwnProperty('email')){
                email = req.body.email;
            }else{
                email = results.email;
            }

            if(req.body.hasOwnProperty('password')) {
                password = req.body.password;
            }

            if(!emailvalidator.validate(email)){
                res.status(400).send('Invalid email supplied');
            }else{

                let user = {};

                if(password != ''){

                    if(password.length <= 5){
                        return res.status(400).send('Weak password');
                    }

                    user = {
                        'first_name': givenname,
                        'last_name': familyname,
                        'email': email,
                        'password': password
                    }
                }else{
                    user = {
                        'first_name': givenname,
                        'last_name': familyname,
                        'email': email
                    }
                }
                
                users.alter(id, user, (err)=> {
                    if (err){
                      console.log(err);
                      return res.sendStatus(400);
                    }
                      return res.sendStatus(200);
                    
                });
            }
        });
    });
}

const get_profile_photo = (req, res) => {
    const id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    users.getOne(id, async (err, user)=> {
        if(err){
            return res.sendStatus(500);
        }if(!user){
            return res.sendStatus(404);
        }
            users.retreivePhoto(id, (imageDetails, err) => {
                if(err == "Doesn't exist"){
                    return res.sendStatus(404);
                }if(err){
                    return res.sendStatus(500);
                }
                    return res.status(200)
                        .contentType(imageDetails.mimeType)
                        .send(imageDetails.image);
                
            });
        
    });
}

const add_profile_photo = (req, res) => {
    const id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);
      
    if(req.header('Content-Type') == 'application/json'){
        res.status(400).send('Bad Request: content type cannot be JSON')
    }
      
    const token = req.get(config.get('authToken'));
    users.getIdFromToken(token, (err, _id)=> {
        users.getOne(id, async (err, user)=> {
            if(err){
                return res.sendStatus(500);
            }if(!user){
                return res.sendStatus(404);
            }
                if(_id != user.user_id){
                    return res.sendStatus(403);
                }
                    users.deletePhotoIfExists(id, async (err)=> {
                        if(err){
                            console.log(err);
                            res.sendStatus(500);
                        }else{
                            const image = req;
                            const fileExt = photo_tools.getImageExtension(req.header('Content-Type'));
        
                            if(!fileExt){
                                res.status(400).send('Bad Request: photo must be either image/jpeg or image/png type');
                            }else{
                                try{
                                    await users.addPhoto(image, fileExt, id, (err)=> {
                                        if(err){
                                            return res.sendStatus(500);
                                        }
                                            return res.sendStatus(200);
                                        
                                    });
                                }catch(err){
                                    console.log(err);
                                    return res.sendStatus(500);
                                }
                            }
                        }
                    });
                
            
        });
    });
}



module.exports = {
    create,
    login,
    logout,
    get_one,
    update,
    get_profile_photo,
    add_profile_photo
};
