const {app,server}= require('../server.js');

const request=require('request');
const fetch = require("node-fetch");
const url='http://127.0.0.1:3000/login';

describe("POST server.js/login", () => {
  jest.setTimeout(10000);

  it("should return 400, no password", async () => {
    const req= {};
    const res=await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req)
    });
    expect(res.status).toBe(400);

  });
  it("should return 400, no email", async () => {
    const req= {
      Password:"prova"
    };
    const res=await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req)
    });
    expect(res.status).toBe(400);

  });

  it("should return 400, no password", async () => {
    const req= {
      Email: "ciao@gmail.com",
      Password: "prova" 
    };
    const res=await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req)
    });
    expect(res.status).toBe(400);

  });
  //server.close();
  // it("should return 200, logged in", async () => {
  //   const { req, res } = createMocks({
  //     method: "POST",
  //     body: {
  //        Email: "armypelle69@gmail.com",
  //        Password: "Password123"
  //     },
  //   });
  //   await login(req, res);
  //   expect(res.statusCode).toBe(200);
  // });
  afterAll(async () => {
    server.close();
  });
});