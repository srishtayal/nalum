const mongoose = require('mongoose');
main()
.then(() => {
    console.log("connected to MongoDB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin:admin@mydb.jinmkhc.mongodb.net/?retryWrites=true&w=majority&appName=mydb');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
module.exports = main;