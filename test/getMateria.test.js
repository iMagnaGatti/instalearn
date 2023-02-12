const {app}= require('../server.js');
const request=require('request');
const fetch = require("node-fetch");
const url='http://127.0.0.1:3000/getMateria';
describe("POST server.js/getMateria", () => {

  it("should return 400, topic doesn't exist", async () => {
    const req= {
        IdMateria: 214123
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
  // it("should return 200, topic has been found in", async () => {
  //    const { req, res } = createMocks({
  //        method: "POST",
  //        body: { IdMateria: "idnonesistente" },
  //   });
  //   await getMateria(req, res);
  //   expect(res.statusCode).toBe(200);
  // });
});