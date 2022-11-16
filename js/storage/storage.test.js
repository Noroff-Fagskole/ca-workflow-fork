const saveToken = require("./storage");

test("gets valid token", () => {
  expect(saveToken()).toBe(true);
});
