const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS middleware for cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'javascript'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Code = mongoose.model('Code', codeSchema);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Code Storage API',
    version: '1.0.0',
    endpoints: {
      'GET /api/codes': 'Get all code snippets',
      'GET /api/codes/:id': 'Get code snippet by ID',
      'POST /api/codes': 'Create new code snippet',
      'PUT /api/codes/:id': 'Update code snippet',
      'DELETE /api/codes/:id': 'Delete code snippet',
      'GET /health': 'Health check'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Code Storage API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes

// GET all code snippets
app.get('/api/codes', async (req, res) => {
  try {
    const codes = await Code.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: codes.length,
      data: codes
    });
  } catch (error) {
    console.error('Error fetching codes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch codes',
      message: error.message 
    });
  }
});

// GET single code snippet by ID
app.get('/api/codes/:id', async (req, res) => {
  try {
    const code = await Code.findById(req.params.id);
    if (!code) {
      return res.status(404).json({ 
        success: false,
        error: 'Code snippet not found' 
      });
    }
    res.status(200).json({
      success: true,
      data: code
    });
  } catch (error) {
    console.error('Error fetching code:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch code',
      message: error.message 
    });
  }
});

// POST new code snippet
app.post('/api/codes', async (req, res) => {
  try {
    const { title, code, language } = req.body;
    
    // Validation
    if (!title || !code) {
      return res.status(400).json({
        success: false,
        error: 'Title and code are required fields'
      });
    }
    
    const newCode = new Code({
      title,
      code,
      language: language || 'javascript'
    });
    
    const savedCode = await newCode.save();
    res.status(201).json({
      success: true,
      message: 'Code snippet created successfully',
      data: savedCode
    });
  } catch (error) {
    console.error('Error creating code:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to create code',
      message: error.message 
    });
  }
});

// PUT update code snippet
app.put('/api/codes/:id', async (req, res) => {
  try {
    const { title, code, language } = req.body;
    
    const updatedCode = await Code.findByIdAndUpdate(
      req.params.id,
      { 
        ...(title && { title }),
        ...(code && { code }),
        ...(language && { language })
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedCode) {
      return res.status(404).json({ 
        success: false,
        error: 'Code snippet not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Code snippet updated successfully',
      data: updatedCode
    });
  } catch (error) {
    console.error('Error updating code:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to update code',
      message: error.message 
    });
  }
});

// DELETE code snippet
app.delete('/api/codes/:id', async (req, res) => {
  try {
    const deletedCode = await Code.findByIdAndDelete(req.params.id);
    
    if (!deletedCode) {
      return res.status(404).json({ 
        success: false,
        error: 'Code snippet not found' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Code snippet deleted successfully',
      data: deletedCode
    });
  } catch (error) {
    console.error('Error deleting code:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete code',
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: 'Something went wrong!'
  });
});

// 404 handler - Must be last
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server only if not in production (Vercel handles this)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;