const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://gulraizzafar77:OshnKGJUm8E9YmLV@cluster0.pr5kytk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully with Mongoose');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Code schema
const codeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Code = mongoose.model('Code', codeSchema);

// Routes

// GET all code snippets
app.get('/api/codes', async (req, res) => {
  try {
    const codes = await Code.find().sort({ createdAt: -1 });
    res.json(codes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single code snippet by ID
app.get('/api/codes/:id', async (req, res) => {
  try {
    const code = await Code.findById(req.params.id);
    if (!code) {
      return res.status(404).json({ error: 'Code not found' });
    }
    res.json(code);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST new code snippet
app.post('/api/codes', async (req, res) => {
  try {
    const {code } = req.body;
    
    const newCode = new Code({
      code,
    });
    
    const savedCode = await newCode.save();
    res.status(201).json(savedCode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update code snippet
app.put('/api/codes/:id', async (req, res) => {
  try {
    const { title, code, language } = req.body;
    
    const updatedCode = await Code.findByIdAndUpdate(
      req.params.id,
      { title, code, language },
      { new: true, runValidators: true }
    );
    
    if (!updatedCode) {
      return res.status(404).json({ error: 'Code not found' });
    }
    
    res.json(updatedCode);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE code snippet
app.delete('/api/codes/:id', async (req, res) => {
  try {
    const deletedCode = await Code.findByIdAndDelete(req.params.id);
    
    if (!deletedCode) {
      return res.status(404).json({ error: 'Code not found' });
    }
    
    res.json({ message: 'Code deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Code Storage API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler - Fixed the problematic route pattern
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;