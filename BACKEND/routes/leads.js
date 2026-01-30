import express from "express";
import Lead from "../models/Lead.js";

const router = express.Router();

/* GET all leads */
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ADD lead */
router.post("/", async (req, res) => {
  try {
    const lead = new Lead(req.body);
    const savedLead = await lead.save();
    res.status(201).json(savedLead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* UPDATE lead (status, notes, followUp) */
router.put("/:id", async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedLead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE lead */
router.delete("/:id", async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
