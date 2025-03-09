const authRoute = require("./authRoute");

function route(app) {
  app.use("/auth", authRoute);
}

module.exports = route;