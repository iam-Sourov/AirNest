const jsonServer = require("json-server");
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "database", "db.json"));
const middlewares = jsonServer.defaults({ static: path.join(__dirname, "src") });

const PORT = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
  console.log(`AirNest server is running at http://localhost:${PORT}`);
});


