const generator = async (Model, item) => {
  const max_runs = 3;
  let run = 0;

  const generate = async () => {
    run = run + 1;
    try {
      const doc = await Model.create(item);
      return { error: false, data: doc };
    } catch (err) {
      // Duplicate key error in MongoDB = 11000
      if (err.code === 11000 && run < max_runs) {
        return await generate();
      } else {
        return {
          error: true,
          message: err.message || "Some error occurred while creating the document.",
        };
      }
    }
  };

  return generate();
};

module.exports = generator;
