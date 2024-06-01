const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(403);
      throw new Error(error.details[0].message);
    }
    next();
  };
};

module.exports = validateRequest;
