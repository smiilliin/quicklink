const waitOn = require("wait-on");
const port = process.env.PORT;

(async () => {
  await waitOn({ resources: [`http://127.0.0.1:${port}`] });
})();
