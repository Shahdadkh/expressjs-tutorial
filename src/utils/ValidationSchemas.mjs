export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        "Username must be at least 5 characters with a max 32 characters",
    },
    notEmpty: {
      errorMessage: "Username not be empty",
    },
    isString: {
      errorMessage: "Username must be string",
    },
  },
  displayName: {
    notEmpty: true,
  },
  password: {
    notEmpty: true,
  },
};
