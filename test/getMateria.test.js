import { createMocks } from "node-mocks-http";
import signup from "server.js/getMateria";

describe("POST server.js/getMateria", () => {
  it("should return 400, topic doesn't exist", async () => {
    const { req, res } = createMocks({
        method: "POST",
        body: { IdMateria: "idnonesistente" },
      });
    await getMateria(req, res);
    expect(res.statusCode).toBe(400);
  });
  
  // it("should return 200, topic has been found in", async () => {
  //    const { req, res } = createMocks({
  //        method: "POST",
  //        body: { IdMateria: "idnonesistente" },
  //   });
  //   await getMateria(req, res);
  //   expect(res.statusCode).toBe(200);
  // });
});