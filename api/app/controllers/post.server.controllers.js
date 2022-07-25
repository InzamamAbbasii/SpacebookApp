const
  posts = require('../models/post.server.models');
  const users = require('../models/user.server.models');
  const friends = require('../models/friend.server.models');
  const log = require('../lib/logger')();
  const validator = require('../lib/validator');
  const config = require('../../config/config.js');

  const schema = require(`../../config/${  config.get('specification')}`);


const get_list_of_posts = (req, res) => {
    const user_id = parseInt(req.params.usr_id);
    if (!validator.isValidId(user_id)) return res.sendStatus(404);

    users.check_user_exists(user_id, (err, result)=> {
        if(err || result === null){
            log.warn(`friends.controller.get_list_of_friends: ${JSON.stringify(err)} or user not found`);
            return res.status(404).send('User not found'); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`posts.controller.get_list_of_posts: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            friends.check_is_friend(user_id, _id, (err, results)=> {
                if(err){
                    log.warn(`friends.controller.get_list_of_friends: ${JSON.stringify(err)}`);
                    return res.sendStatus(500);            
                }

                if(results != true && user_id != _id){
                    return res.status(403).send('Can only view the posts of yourself or your friends');
                }
                    posts.get_posts(user_id, (err, results)=> {
                        if(err){
                            return res.sendStatus(500);
                        }
                        return res.status(200).send(results);
                    });
                
            });
        });
    });
}

const add_new_post = (req, res) => {
    const user_id = parseInt(req.params.usr_id);
    if (!validator.isValidId(user_id)) return res.sendStatus(404);

    users.check_user_exists(user_id, (err, result)=> {
        if(err || result === null){
            log.warn(`posts.controller.add_new_post: ${JSON.stringify(err)} or user not found`);
            return res.status(404).send('User not found'); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`posts.controller.add_new_post: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            friends.check_is_friend(user_id, _id, (err, results)=> {
                if(err){
                    log.warn(`posts.controller.add_new_post: ${JSON.stringify(err)}`);
                    return res.sendStatus(500);            
                }

                if(results != true && user_id != _id){
                    return res.status(403).send('Can only post on the profile of yourself or your friends');
                }if (!validator.isValidSchema(req.body, 'components.schemas.AddPost')) {
                        log.warn(`posts.controller.add_new_post: bad post ${JSON.stringify(req.body)}`);
                        log.warn(validator.getLastErrors());
                        return res.status(400).send('Bad Request - body must match specification');
                    } 

                        const post = { ...req.body};

                        posts.add_post(user_id, _id, post, (err, id)=> {
                            if(err){
                                return res.sendStatus(500);
                            }
                            res.status(201).send({id});
                        });
                    
            });
        });
    });
}

const view_single_post = (req, res) => {
    const user_id = parseInt(req.params.usr_id);
    const post_id = parseInt(req.params.post_id);

    if (!validator.isValidId(user_id)) return res.sendStatus(404);
    if (!validator.isValidId(post_id)) return res.sendStatus(404);

    users.check_user_exists(user_id, (err, result)=> {
        if(err || result === null){
            log.warn(`posts.controller.view_single_post: ${JSON.stringify(err)} or user not found`);
            return res.status(404).send('User not found'); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`posts.controller.view_single_post: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            friends.check_is_friend(user_id, _id, (err, results)=> {
                if(err){
                    log.warn(`posts.controller.view_single_post: ${JSON.stringify(err)}`);
                    return res.sendStatus(500);            
                }

                if(results != true && user_id != _id){
                    return res.status(403).send('Can only view the posts of yourself or your friends');
                }
                    posts.getOne(user_id, post_id, (err, results)=> {
                        if (err) {
                            log.warn(`posts.controller.view_single_post: ${JSON.stringify(err)}`);
                            return res.sendStatus(500);
                        } if (!results) {  // no user found
                              log.warn('posts.controller.view_single_post: no results found');
                            return res.sendStatus(404);
                        }
                            res.status(200).json(results);
                        
                    });
                
            });
        });
    }); 
}

const update_post = (req, res) => {
    const user_id = parseInt(req.params.usr_id);
    const post_id = parseInt(req.params.post_id);

    if (!validator.isValidId(user_id)) return res.sendStatus(404);
    if (!validator.isValidId(post_id)) return res.sendStatus(404);

    users.check_user_exists(user_id, (err, result)=> {
        if(err || result === null){
            log.warn(`posts.controller.update_post: ${JSON.stringify(err)} or user not found`);
            return res.status(404).send('User not found'); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`posts.controller.update_post: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            if (!validator.isValidSchema(req.body, 'components.schemas.AddPost')) {
                log.warn(`posts.controller.update_post: bad post ${JSON.stringify(req.body)}`);
                return res.sendStatus(400);
            }

            posts.getOne(user_id, post_id, (err, results)=> {
                if (err) {
                    log.warn(`posts.controller.update_post: ${JSON.stringify(err)}`);
                    return res.sendStatus(500);
                } if (!results) {  // no user found
                    log.warn('posts.controller.update_post: no results found');
                    return res.sendStatus(404);
                }
                    if(results.author.user_id != _id){
                        log.warn('posts.controller.update_post: not authored by user');
                        return res.status(403).send('Forbidden - you can only update your own posts');
                    }


                    let text = '';
           

                    if(req.body.hasOwnProperty('text')){
                        text = req.body.text;
                    }else{
                        text = results.text;
                    }
                
                    posts.alter(user_id, _id, post_id, text, (err)=> {
                        if (err){
                            console.log(err);
                            return res.sendStatus(400);
                        }
                            return res.sendStatus(200);
                        
                    });
                
            });
        });
    }); 
}

const delete_post = (req, res) => {
    const user_id = parseInt(req.params.usr_id);
    const post_id = parseInt(req.params.post_id);

    if (!validator.isValidId(user_id)) return res.sendStatus(404);
    if (!validator.isValidId(post_id)) return res.sendStatus(404);

    users.check_user_exists(user_id, (err, result)=> {
        if(err || result === null){
            log.warn(`posts.controller.delete_post: ${JSON.stringify(err)} or user not found`);
            return res.status(404).send('User not found'); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`posts.controller.delete_post: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            posts.getOne(user_id, post_id, (err, results)=> {
                if (err) {
                    log.warn(`posts.controller.delete_post: ${JSON.stringify(err)}`);
                    return res.sendStatus(500);
                } if (!results) {  // no user found
                    log.warn('posts.controller.delete_post: no results found');
                    return res.sendStatus(404);
                }
                    if(results.author.user_id != _id){
                        log.warn('posts.controller.delete_post: not authored by user');
                        return res.status(403).send('Forbidden - you can only delete your own posts');
                    }
                
                    posts.remove(user_id, _id, post_id, (err)=> {
                        if (err){
                            console.log(err);
                            return res.sendStatus(400);
                        }
                            return res.sendStatus(200);
                        
                    });
                
            });
        });
    }); 
}

const like_post = (req, res) => {
    const user_id = parseInt(req.params.usr_id);
    const post_id = parseInt(req.params.post_id);

    if (!validator.isValidId(user_id)) return res.sendStatus(404);
    if (!validator.isValidId(post_id)) return res.sendStatus(404);

    users.check_user_exists(user_id, (err, result)=> {
        if(err || result === null){
            log.warn(`posts.controller.like_post: ${JSON.stringify(err)} or user not found`);
            return res.status(404).send('User not found'); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`posts.controller.like_post: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            friends.check_is_friend(user_id, _id, (err, results)=> {
                if(err){
                    log.warn(`posts.controller.like_post: ${JSON.stringify(err)}`);
                    return res.sendStatus(500);            
                }

                if(results != true){
                    return res.status(403).send('Can only like the posts of your friends');
                }

                posts.getOne(user_id, post_id, (err, results)=> {
                    if (err) {
                        log.warn(`posts.controller.like_post: ${JSON.stringify(err)}`);
                        return res.sendStatus(500);
                    } if (!results) {  // no user found
                        log.warn('posts.controller.like_post: no results found');
                        return res.sendStatus(404);
                    }    
                        
                        if(results.author.user_id === _id){
                            log.warn('posts.controller.like_post: not authored by user');
                            return res.status(403).send('Forbidden - you cant like your own posts');
                        }

                        posts.like(_id, post_id, (err)=> {
                            if (err){
                                console.log(err);
                                return res.sendStatus(400);
                            }
                                return res.sendStatus(200);
                            
                        });
                    
                });
            });
        });
    });    
}

const remove_like = (req, res) => {
    const user_id = parseInt(req.params.usr_id);
    const post_id = parseInt(req.params.post_id);

    if (!validator.isValidId(user_id)) return res.sendStatus(404);
    if (!validator.isValidId(post_id)) return res.sendStatus(404);

    users.check_user_exists(user_id, (err, result)=> {
        if(err || result === null){
            log.warn(`posts.controller.remove_like: ${JSON.stringify(err)} or user not found`);
            return res.status(404).send('User not found'); 
        }

        const token = req.get(config.get('authToken'));
        users.getIdFromToken(token, (err, _id)=> {
            if(err){
                log.warn(`posts.controller.remove_like: ${JSON.stringify(err)}`);
                return res.sendStatus(500); 
            }

            friends.check_is_friend(user_id, _id, (err, results)=> {
                if(err){
                    log.warn(`posts.controller.remove_like: ${JSON.stringify(err)}`);
                    return res.sendStatus(500);            
                }

                if(results != true){
                    return res.status(403).send('Can only unlike the posts of your friends');
                }

                posts.getOne(user_id, post_id, (err, results)=> {
                    if (err) {
                        log.warn(`posts.controller.remove_like: ${JSON.stringify(err)}`);
                        return res.sendStatus(500);
                    } if (!results) {  // no user found
                        log.warn('posts.controller.remove_like: no results found');
                        return res.sendStatus(404);
                    }    
                        
                        if(results.author.user_id === _id){
                            log.warn('posts.controller.remove_like: not authored by user');
                            return res.status(403).send('Forbidden - you cant like/unlike your own posts');
                        }

                        posts.remove_like(_id, post_id, (err)=> {
                            if (err){
                                console.log(err);
                                return res.sendStatus(400);
                            }
                                return res.sendStatus(200);
                            
                        });
                    
                });
            });
        });
    }); 
}


module.exports = {
    get_list_of_posts,
    add_new_post,
    view_single_post,
    update_post,
    delete_post,
    like_post,
    remove_like
};