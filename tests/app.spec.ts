import request from "supertest";
import app from "../src/app";

describe("App Tests", () => {
  it("GET / should return hello message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty(
      "message",
      "Rapadura e doce mas não e mole"
    );
  });

});
