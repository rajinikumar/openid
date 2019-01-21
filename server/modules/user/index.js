import {   Router } from "express";
import {   oidc } from '../../../index';
const routes = new Router();


//authorization endpoint
routes.get('/authorize', oidc.auth());

//token endpoint
routes.post('/token', oidc.token());

//user consent form
routes.get('/consent', function (req, res, next) {
  var head = '<head><title>Consent</title></head>';
  var lis = [];
  for (var i in req.session.scopes) {
    lis.push('<li><b>' + i + '</b>: ' + req.session.scopes[i].explain + '</li>');
  }
  var ul = '<ul>' + lis.join('') + '</ul>';
  var error = req.session.error ? '<div>' + req.session.error + '</div>' : '';
  var body = '<body><h1>Consent</h1><form method="POST">' + ul + '<input type="submit" name="accept" value="Accept"/><input type="submit" name="cancel" value="Cancel"/></form>' + error;
  res.send('<html>' + head + body + '</html>');
});

//process user consent form
routes.post('/consent', oidc.consent());

//user creation form
routes.get('/create', function(req, res, next) {
  var head = '<head><title>Sign in</title></head>';
  var inputs = '';
  //var fields = mkFields(oidc.model('user').attributes);
  var fields = {
          given_name: {
              label: 'Given Name',
              type: 'text'
          },
          middle_name: {
              label: 'Middle Name',
              type: 'text'
          },
          family_name: {
              label: 'Family Name',
              type: 'text'
          },
          email: {
              label: 'Email',
              type: 'email'
          },
          password: {
              label: 'Password',
              type: 'password'
          },
          passConfirm: {
              label: 'Confirm Password',
              type: 'password'
          }
  };
  for(var i in fields) {
    inputs += '<div><label for="'+i+'">'+fields[i].label+'</label><input type="'+fields[i].type+'" placeholder="'+fields[i].label+'" id="'+i+'"  name="'+i+'"/></div>';
  }
  var error = req.session.error?'<div>'+req.session.error+'</div>':'';
  var body = '<body><h1>Sign in</h1><form method="POST">'+inputs+'<input type="submit"/></form>'+error;
  res.send('<html>'+head+body+'</html>');
});

//process user creation
routes.post('/create', oidc.use({policies: {loggedIn: false}, models: 'user'}), function(req, res, next) {
  delete req.session.error;
  req.model.user.findOne({email: req.body.email}, function(err, user) {
      if(err) {
          req.session.error=err;
      } else if(user) {
          req.session.error='User already exists.';
      }
      if(req.session.error) {
          res.redirect(req.path);
      } else {
          req.body.name = req.body.given_name+' '+(req.body.middle_name?req.body.middle_name+' ':'')+req.body.family_name;
          console.log(req.body);
          req.model.user.create(req.body, function(err, user) {
             if(err || !user) {
                 req.session.error=err?err:'User could not be created.';
                 res.redirect(req.path);
             } else {
                 req.session.user = user.id;
                 res.redirect('/user');
             }
          });
      }
  });
});

routes.get('/user', oidc.check(), function(req, res, next){
  res.send('<h1>User Page</h1><div><a href="/client">See registered clients of user</a></div>');
});

//User Info Endpoint
routes.get('/api/user', oidc.userInfo());

export default routes;

