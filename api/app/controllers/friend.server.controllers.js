const
  friends = require('../models/friend.server.models');
  const users = require('../models/user.server.models');
  const log = require('../lib/logger')();
  const validator = require('../lib/validator');
  const config = require('../../config/config.js');

  const schema = require(`../../config/${  config.get('specification')}`);


const get_list_of_friends = (req, res) => {
    const id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    users.check_user_exists(id, (err, result)=> {
        if(err || result === null){
            log.warn(`friends.controller.get_list_of_friends: ${JSON.stringify(err)} or user not found`);
            return res.status(404).send('User not found'); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`friends.controller.get_list_of_friends: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            friends.check_is_friend(id, _id, (err, results)=> {
                if(err){
                    log.warn(`friends.controller.get_list_of_friends: ${JSON.stringify(err)}`);
                    return res.sendStatus(500);            
                }

                if(_id != id && results == false){
                    log.warn(`friends.controller.get_list_of_friends: ${JSON.stringify(err)} or user not a friend`);
                    return res.status(403).send('Can only view the friends of yourself or your friends'); 
                }
        
                friends.get_list(id, (err, results)=> {
                    if (err) {
                        log.warn(`friends.controller.get_list_of_friends: ${JSON.stringify(err)}`);
                        return res.sendStatus(500);
                    } if (!results) {  // no friends found
                        return res.status(200).json([]);
                    }
                        return res.status(200).json(results);
                    
                });
            });
        });

        
    });
};

const add_new_friend = (req, res) => {
    const id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    users.check_user_exists(id, (err, result)=> {
        if(err){
            log.warn(`friends.controller.add_new_friend: ${JSON.stringify(err)}`);
            return res.sendStatus(500); 
        }

        // console.log("ID", result);

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`friends.controller.add_new_friend: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            if (_id === id){
                log.warn(`friends.controller.add_new_friend: ${JSON.stringify(err)}`);
                return res.status(403).send("You can't add yourself as a friend");
            }

            friends.check_is_friend(id, _id, (err, results)=> {
                if(err){
                    log.warn(`friends.controller.get_list_of_friends: ${JSON.stringify(err)}`);
                    return res.sendStatus(500);            
                }

                if(results === true){
                    return res.status(403).send('User is already added as a friend');
                }

                friends.check_request_submitted(id, _id, (err, results)=> {
                    if(err){
                        log.warn(`friends.controller.get_list_of_friends: ${JSON.stringify(err)}`);
                        return res.sendStatus(500);            
                    }
    
                    if(results === true){
                        return res.status(403).send('A request has already been submitted. Check your friend requests.');
                    }

                    friends.add_friend(_id, id, (err, result)=> {
                        if(err){
                            log.warn(`friends.controller.add_new_friend: ${JSON.stringify(err)}`);
                            return res.sendStatus(500);
                        }
                        // console.log(result);
                        return res.status(201).send('Request submitted');
                    });
                });
            }); 
        });
    });

    
};

const get_outstanding_requests = (req, res) => {
    const token = req.get(config.get('authToken'));
    users.getIdFromToken(token, (err, _id)=> {
        if(err){
            log.warn(`friends.controller.get_outstanding_requests: ${JSON.stringify(err)}`);
            return res.sendStatus(500); 
        }

        friends.get_friend_requests(_id, (err, results)=> {
            if(err){
                log.warn(`friends.controller.get_outstanding_requests: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            return res.status(200).send(results);
        });
    });
};

const accept_friend_request = (req, res) => {
    const id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    users.check_user_exists(id, (err, result)=> {
        if(err){
            log.warn(`friends.controller.accept_friend_request: ${JSON.stringify(err)}`);
            return res.sendStatus(404); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`friends.controller.accept_friend_request: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }
            
            friends.accept_friend_request(_id, id, (err)=> {
                if(err){
                    log.warn(`friends.controller.accept_friend_request: ${JSON.stringify(err)}`);
                    return res.sendStatus(500); 
                }

                return res.sendStatus(200);
            })

        });
    });
};

const delete_friend_request = (req, res) => {
    const id = parseInt(req.params.usr_id);
    if (!validator.isValidId(id)) return res.sendStatus(404);

    users.check_user_exists(id, (err, result)=> {
        if(err){
            log.warn(`friends.controller.delete_friend_request: ${JSON.stringify(err)}`);
            return res.sendStatus(404); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`friends.controller.delete_friend_request: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }
            
            friends.delete_friend_request(_id, id, (err)=> {
                if(err){
                    log.warn(`friends.controller.delete_friend_request: ${JSON.stringify(err)}`);
                    return res.sendStatus(500); 
                }

                return res.sendStatus(200);
            })

        });
    });
};

const search_users = (req, res) => {
    const params = req.query;

    let params_valid = true;

    if(params.search_in){
        console.log(params.search_in)
        if(params.search_in != 'all' && params.search_in != 'friends'){
            params_valid = false;
        }
    }

    if(params.limit){
        if(typeof(params.limit) !== 'number' && params.limit < 0){
            params_valid = false;
        }
    }

    if(params.offset){
        if(typeof(params.offset) !== 'number' && (params.offset < 0 || params.offset > 100)){
            params_valid = false;
        }
    }

    if(!params_valid){
        log.warn('friends.controller.search_users: parameters not valid');
        return res.sendStatus(400); 
    }

    const token = req.get(config.get('authToken'));
    users.getIdFromToken(token, (err, _id)=> {

        if(err){
            log.warn(`friends.controller.search_users: ${JSON.stringify(err)}`);
            return res.sendStatus(500); 
        }

        friends.search_users(params, _id, (err, results)=> {
            if(err){
                log.warn(`friends.controller.search_users: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }
                return res.status(200).send(results);
            
        });
    });

};

module.exports = {
    get_list_of_friends,
    add_new_friend,
    get_outstanding_requests,
    accept_friend_request,
    delete_friend_request,
    search_users
};