const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router("./database/db.json");
const middlewares = jsonServer.defaults({
  static: null,   // disable looking for "public"
});

server.use(middlewares);
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log("JSON Server is running on port", port);
});
