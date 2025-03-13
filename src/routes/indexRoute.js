const authRoute = require("./authRoute");
const supplierRoute = require("./supplierRoute")

function route(app) {
  app.use("/auth", authRoute);
  app.use("/supplier", supplierRoute);
}

module.exports = route;