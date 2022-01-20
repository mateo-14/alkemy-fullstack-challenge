require('dotenv').config();
const app = require('./app');

(async () => {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
})();
