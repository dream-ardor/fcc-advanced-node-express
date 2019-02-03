const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = (app, db) => {
  app.route('/')
    .get((req, res) => {
      res.render(process.cwd() + '/views/pug/index.pug', { title: '\nHello', message: 'Please login', showLogin: true, showRegistration: true });
    });
  
  app.route('/login')
    .post(passport.authenticate('local', { failureRedirect: '/' }),
          (req,res) => {
            res.redirect('/profile');
          }
    );
    
  app.route('/profile')
    .get(ensureAuthenticated, (req, res) => {
         res.render(process.cwd() + '/views/pug/profile.pug', {username: req.user.username});
    });
    
  app.route('/register')
    .post((req, res, next) => {
        const hash = bcrypt.hashSync(req.body.password, 12);
        db.collection('users').findOne({ username: req.body.username }, function (err, user) {
            if(err) {
                next(err);
            } else if (user) {
                res.redirect('/login');
            } else {
                db.collection('users').insertOne(
                  {
                    username: req.body.username,
                    password: hash
                  },
                  (err, doc) => {
                      if(err) {
                          res.redirect('/login');
                      } else {
                          next(null, user);
                      }
                  }
                )
            }
        })},
      passport.authenticate('local', { failureRedirect: '/' }),
      (req, res, next) => {
          res.redirect('/profile');
      }
    );
    
  app.route('/logout')
    .get((req, res) => {
      req.logout();
      res.redirect('/');
    });
  
  app.use((req, res, next) => {
      res.status(404)
        .type('text')
        .send('Page not found.');
    });
  
  function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  }
}