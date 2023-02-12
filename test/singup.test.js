import { createMocks } from "node-mocks-http";
import signup from "server.js/signup";

describe("POST server.js/signup", () => {
  it("should return 500, no password", async () => {
    const { req, res } = createMocks({ method: "POST" });
    await signup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({
      success: false,
      error: "Password is essential!",
    });
  });
  it("should return 500, password too short", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { password: "prova" },
    });
    await signup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({
      success: false,
      error: "Password must be at least 8 characters",
    });
  });
  it("should return 500, password too long", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { password: "f".repeat(257) },
    });
    await signup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({
      success: false,
      error: "Password too long! (max: 256)",
    });
  });
  it("should return 500, password must contain uppercase", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { password: "foobarbaz" },
    });
    await signup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({
      success: false,
      error: "Password must contain at least 1 uppercase letter",
    });
  });
  it("should return 500, password must contain symbol", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { password: "Foobarbaz" },
    });
    await signup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({
      success: false,
      error: "Password must contain at least 1 symbol letter",
    });
  });
  it("should return 500, password must contain lowercase", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { password: "FOOBARBAZ" },
    });
    await signup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({
      success: false,
      error: "Password must contain at least 1 lowercase letter",
    });
  });
  it("should return 500, password must contain number", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { password: "Foobarbaz." },
    });
    await signup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({
      success: false,
      error: "Password must contain at least 1 number letter",
    });
  });
  it("should return 500, email required", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { password: "Foobarbaz.1" },
    });
    await signup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({
      success: false,
      error: "Email is required!",
    });
  });
  it("should return 500, invalid email", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { password: "Foobarbaz.1", email: "foo" },
    });
    await signup(req, res);
    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual({
      success: false,
      error: "Invalid email",
    });
  });
  
  // it("should return 201, created", async () => {
  //   const { req, res } = createMocks({
  //     method: "POST",
  //     body: {
  //       password: "Foobarbaz.1",
  //       email: "foo@bar.baz",
  //       name: "foo",
  //       surname: "bar",
  //       isGestore: false,
  //     },
  //   });
  //   await signup(req, res);
  //   expect(res.statusCode).toBe(500);
  //   expect(res._getData()).toEqual({
  //     success: true,
  //     isUnitn: false,
  //   });
  // });
});