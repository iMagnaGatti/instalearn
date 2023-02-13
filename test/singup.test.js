const {app,server}= require('../server.js');

const request=require('request');
const fetch = require("node-fetch");
const url='http://127.0.0.1:3000/signup';

describe("POST server.js/signup", () => {
  jest.setTimeout(10000);


  it("should return 400, missing data", async () => {
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

  it("email already exists", async () => {
    const req= {
        Nome: "armando" ,
        Cognome: "Pellegrini",
        Username: "armypelle",
        Password: "Password_123",
        Descrizione: "prova",
        Email: "armypelle69@gmail.com"
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

  
  // it("should return 200, created", async () => {
  //   const { req, res } = createMocks({
  //     method: "POST",
  //      body: { 
  //      Nome: "armando" ,
  //      Cognome: "Pellegrini",
  //      Username: "armypelle",
  //      Password: "Password_123",
  //      Descrizione: "prova",
  //      Email: "armypelle96@gmail.com"
  //    },
  //   });
  //   await signup(req, res);
  //   expect(res.statusCode).toBe(200);
  // });
  afterAll(async () => {
    server.close();
  });
});