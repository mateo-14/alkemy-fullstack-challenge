require('dotenv').config();
const sequelize = require('./db');
const app = require('./app');

(async () => {
  const port = process.env.PORT || 8080;
  await sequelize.authenticate();
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
