import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================== MONGODB ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* ================== SCHEMA ================== */
const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: String,
  notes: String,
  followUp: String,
});

const Lead = mongoose.model("Lead", leadSchema);

/* ================== ROUTES ================== */
app.get("/leads", async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

app.post("/leads", async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.json(lead);
});

app.put("/leads/:id", async (req, res) => {
  const updated = await Lead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

app.delete("/leads/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
