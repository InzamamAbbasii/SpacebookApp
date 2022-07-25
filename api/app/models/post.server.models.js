const db = require('../../config/db');

const get_posts = (id, done) => {
    let query = 'SELECT p.post_id, p.post_text, p.post_timestamp, u.user_id, u.user_givenname, u.user_familyname, u.user_email, COUNT(l.like_post_id) AS likes ';
    query += 'FROM spacebook_posts p INNER JOIN spacebook_users u ON u.user_id = p.post_author LEFT JOIN spacebook_likes l ON p.post_id = l.like_post_id ';
    query += `WHERE p.post_profile =${  id  } GROUP BY p.post_id ORDER BY p.post_timestamp DESC`;

    db.get_pool().query(
        query,
        (err, result)=> {
            if(err) return done(err, null);

            to_return = [];

            result.forEach((element) => {
                to_return.push({
                    'post_id': element.post_id,
                    'text': element.post_text,
                    'timestamp': element.post_timestamp,
                    'author': {
                        'user_id': element.user_id,
                        'first_name': element.user_givenname,
                        'last_name': element.user_familyname,
                        'email': element.user_email,
                    },
                    'numLikes': element.likes
                })  
            });
            

            return done(null, to_return);         
        }
    )
}

const add_post = (profile_id, author_id, post, done) => {
    const values = [[post.text, author_id, profile_id,]];

    db.get_pool().query(
        'INSERT INTO spacebook_posts (post_text, post_author, post_profile) VALUES (?)',
        values,
        (err, results)=> {
            if (err) return done(err);

            return done(err, results.insertId)
        }
    );
}

const getOne = async (user_id, post_id, done) => {
    
    let query = 'SELECT p.post_id, p.post_text, p.post_timestamp, u.user_id, u.user_givenname, u.user_familyname, u.user_email, COUNT(l.like_post_id) AS likes ';
    query += 'FROM spacebook_posts p INNER JOIN spacebook_users u ON u.user_id = p.post_author LEFT JOIN spacebook_likes l ON p.post_id = l.like_post_id ';
    query += `WHERE p.post_profile =${  user_id  } AND p.post_id=${  post_id  } GROUP BY p.post_id ORDER BY p.post_timestamp DESC`;
    
    db.get_pool().query(
        query,
        (err, results)=> {
            if (err){
                return done(err, false);
            }if(results.length == 0){
                return done(false, null);
            }
                const post = results[0];
  
                const to_return = {
                    'post_id': post.post_id,
                    'text': post.post_text,
                    'timestamp': post.post_timestamp,
                    'author': {
                        'user_id': post.user_id,
                        'first_name': post.user_givenname,
                        'last_name': post.user_familyname,
                        'email': post.user_email,
                    },
                    'numLikes': post.likes
                };

                return done(null, to_return);
            
        }
    )
};

const alter = (profile_id, author_id, post_id, text, done) => {
    const query = 'UPDATE spacebook_posts SET post_text=? WHERE post_id=? AND post_author=? AND post_profile=?';
    const values = [text, post_id, author_id, profile_id];

    db.get_pool().query(
        query,
        values,
        (err, results)=> {
            done(err);
        }
    );
}

const remove = (profile_id, author_id, post_id, done) => {
    const query = 'DELETE FROM spacebook_posts WHERE post_id=? AND post_author=? AND post_profile=?';
    const values = [post_id, author_id, profile_id];

    db.get_pool().query(
        query,
        values,
        (err, results)=> {
            done(err);
        }
    );
}

const like = (user_id, post_id, done) => {
    const query = 'INSERT INTO spacebook_likes (like_post_id, like_user_id) VALUES (?, ?)';
    const values = [post_id, user_id];

    db.get_pool().query(
        query,
        values,
        (err, results)=> {
            done(err);
        }
    );
}

const remove_like = (user_id, post_id, done) => {
    const query = 'DELETE FROM spacebook_likes WHERE like_post_id=? AND like_user_id=?';
    const values = [post_id, user_id];

    db.get_pool().query(
        query,
        values,
        (err, results)=> {
            done(err);
        }
    );
}


module.exports = {
    get_posts,
    add_post,
    getOne,
    alter,
    remove,
    like,
    remove_like
}