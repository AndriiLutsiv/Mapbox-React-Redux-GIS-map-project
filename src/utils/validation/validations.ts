import {
  requiredValidator,
  passwordValidator,
  atLeastOneLetter
} from "./validators";

export const signinValidations = {
  email: [
    requiredValidator('The field is required')
  ],
  password: [
    requiredValidator('The field is required'),
    atLeastOneLetter('Invalid data'),
    passwordValidator('Must be at least 8 characters, one lower case letter, one upper case letter, one number, one special character'),
  ]
};

export const signupValidations = {
  name: [
    requiredValidator('The field is required'),
    atLeastOneLetter('Invalid data'),
  ],
  email: [
    requiredValidator('The field is required')
  ],
  password: [
    requiredValidator('The field is required'),
    atLeastOneLetter('Invalid data'),
    passwordValidator('Must be at least 8 characters, one lower case letter, one upper case letter, one number, one special character'),
  ]
};

export const createUserValidations = {
  username: [
    requiredValidator('The field is required'),
    atLeastOneLetter('Invalid data'),
  ],
  userEmail: [
    requiredValidator('The field is required')
  ],
  userPassword: [
    requiredValidator('The field is required'),
    atLeastOneLetter('Invalid data'),
    passwordValidator('Must be at least 8 characters, one lower case letter, one upper case letter, one number, one special character'),
  ]
};