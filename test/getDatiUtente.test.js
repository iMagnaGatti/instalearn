
const a=require("../server.js");
const { createMocks }=require("node-mocks-http");

describe("POST server.js/getDatiUtente", () => {
  it("should return 400, username doesn't exist", async () => {
    const { req, res } = createMocks({
        method: "POST",
        body: { Username: "usernameInesistente" },
      });
    await getDatiUtente(req, res);
    expect(res.statusCode).toBe(400);
  });


  // it("should return 200, username found", async () => {
  //   const { req, res } = createMocks({
  //     method: "POST",
  //     body: {
  //        Username: "armyalpaca"
  //     },
  //   });
  //   await getDatiUtente(req, res);
  //   expect(res.statusCode).toBe(200);
  // });
});