export const CreateUserValidationMessage = {
  name: {
    invalidFormat: 'name field must be a string',
    minLength: 'Minimum name length must be 1',
    maxLength: 'Maximum name length must be 15',
  },
  avatar: {
    invalidFormat: 'name field must be a string'
  },
  email: {
    invalidFormat: 'email field must be a valid email'
  },
  userType: {
    invalid: 'UserType must be one of Common, Pro'
  },
  password: {
    invalidFormat: 'password field must be a string',
    length: 'password field length must be between 6 and 12',
  }
} as const;
