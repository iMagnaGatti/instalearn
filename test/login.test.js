import { createMocks } from "node-mocks-http";
import signup from "server.js/login";

describe("POST server.js/login", () => {
  it("should return 400, no password", async () => {
    const { req, res } = createMocks({ method: "POST" });
    await login(req, res);
    expect(res.statusCode).toBe(400);
  });
  it("should return 400, no email", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { Password: "prova" },
    });
    await login(req, res);
    expect(res.statusCode).toBe(400);
  });
  it("should return 400, wrong credentials", async () => {

    const { req, res } = createMocks({
        method: "POST",
        body: { 
            Email: "ciao@gmail.com",
            Password: "prova" 
        },
      });
    await login(req, res);
    expect(res.statusCode).toBe(500);
  });
  
  
  // it("should return 200, logged in", async () => {
  //   const { req, res } = createMocks({
  //     method: "POST",
  //     body: {
  //        Email: "armypelle69@gmail.com",
  //        Password: "Password123"
  //     },
  //   });
  //   await signup(req, res);
  //   expect(res.statusCode).toBe(200);
  // });
});