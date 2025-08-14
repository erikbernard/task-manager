import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Rapadura e doce mas não e mole" });
});


export default app;
