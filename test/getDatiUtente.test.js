
const {app}= require('../server.js');
const request=require('request');
const fetch = require("node-fetch");
const url='http://127.0.0.1:3000/getDatiUtente';
describe("POST server.js/getDatiUtente", () => {
  jest.setTimeout(300000);
  it("should return 400, username doesn't exist", async () => {
    const req= {
        Username: "usernameInesistente"
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