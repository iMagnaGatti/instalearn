
const a=require("../server.js");
const { createMocks }=require("node-mocks-http");

describe("POST server.js/signup", () => {
  it("should return 400, missing data", async () => {
    const { req, res } = createMocks({ method: "POST" });
    await signup(req, res);
    expect(res.statusCode).toBe(400);
  });
  it("should return 400, email already exist", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { 
        Nome: "armando" ,
        Cognome: "Pellegrini",
        Username: "armypelle",
        Password: "Password_123",
        Descrizione: "prova",
        Email: "armypelle69@gmail.com"
      
      },
    });
    await signup(req, res);
    expect(res.statusCode).toBe(400);

  });
  
  
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
});