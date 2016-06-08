'use strict';

import express from 'express';
import passport from 'passport';
import * as auth from '../auth.service';

var router = express.Router();

router
  .get('/',
    passport.authenticate('auth0', {}), function(req, res) {
      res.redirect("/");
    })

  .get('/callback', passport.authenticate('auth0', {
    failureRedirect: '/',
    session: false
  }), auth.setTokenCookie);

export default router
