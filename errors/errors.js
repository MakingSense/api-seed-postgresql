module.exports = {

  'bad_request_400'             : {
    //-------------------------//
    //-------  Generic  -------//
    //-------------------------//
    'generic_bad_format': {
      'status' : 400,
      'message': 'Request could not be recognized.'
    },
    'json_parse_error'  : {
      'status' : 400,
      'message': 'Could not parse JSON body.'
    },

    //--------------------------------//
    //-------  Authentication  -------//
    //--------------------------------//
    'invalid_token_format': {
      'status' : 400,
      'message': 'Invalid token format. Format is Authorization: Bearer [token]'
    },
    //-----------------------//
    //-------  Common -------//
    //-----------------------//
    'user_already_signed_up'           :{
      'status' : 400,
      'message': 'User already signed up.'
    },
    'user_id_missing'                       : {
      'status' : 400,
      'message': 'User ID missing or invalid in request.'
    },
    'invalid_user_id'                       :  {
      'status' : 400,
      'message': 'Invalid userId.'
    },
    'invalid_first_name'                    : {
      'status' : 400,
      'message': 'Invalid first name. Names should be between 2 and 255 characters.'
    },
    'invalid_last_name'                     : {
      'status' : 400,
      'message': 'Invalid last name. Names should be between 2 and 255 characters.'
    },
    'invalid_email'                         : {
      'status' : 400,
      'message': 'Invalid email address.'
    },
    'invalid_phone'                         : {
      'status' : 400,
      'message': 'Invalid phone. Phone should be between 2 and 45 characters.'
    },
    'invalid_password'                      : {
      'status' : 400,
      'message': 'Invalid phone. Phone should be between 2 and 45 characters.'
    },
    //-----------------------//
    //------- User    -------//
    //-----------------------//
    'invalid_user_status'             : {
      'status' : 400,
      'message': "Invalid user status. Allowed event types are 'active', 'inactive' or 'blocked'."
    },
    'user_email_used'                 : {
      'status' : 400,
      'message': 'There is an active User with the same email already registered.'
    },
    'user_auth0_integration'                 : {
      'status' : 400,
      'message': 'There was an error to request to Auth0.'
    }
  },
  'unauthorized_401'            : {
    'bad_credentials': {
      'status' : 401,
      'message': 'Bad username or password.'
    },
    'token_required' : {
      'status' : 401,
      'message': 'This request requires an authentication token. Login at: /login'
    },
    'token_invalid'  : {
      'status' : 401,
      'message': 'This token is no longer valid. Please request a new token at: /login'
    },
    'token_jwt_invalid'  : {
      'status' : 401,
      'message': 'This token is a JWT invalid. Details: '
    }
  },
  'forbidden_403'                         : {
    'user_permission_denied'              : {
      'status' : 403,
      'message': 'This user does not have permission to access this resource.'
    },
    'user_is_inactive'                    : {
      'status' : 403,
      'message': 'This user has been deactivated.'
    }
  },
  'not_found_404'               : {
    'generic'                   : {
      'status' : 404,
      'message': 'Resource not found.'
    },
    'user_not_signed_up'        :{
      'status' : 404,
      'message': 'User not signed up.'
    },
    'user_not_found'            :{
      'status' : 404,
      'message': 'User not found.'
    }
  },
  'method_not_allowed_405'      : {},
  'fixable_conflict_409'        : {},
  'request_entity_too_large_413': {
    'upload_size_limit_exceeded': {
      'status' : 413,
      'message': 'Upload size limit exceeded. Maximum image size is 5 MB.'
    }
  },
  'internal_server_error_500'  : {
    'server_error' : {
      'status' : 500,
      'message': 'The server encountered an internal error. Please try again later.'
    },
    'hashing_error'            : {
      'status' : 500,
      'message': 'Error hashing password.'
    },
    'signing_credentials_error': {
      'status' : 500,
      'message': 'Error with signing credentials.'
    }
  }
}
