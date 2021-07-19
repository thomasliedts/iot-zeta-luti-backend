import express from 'express';

const app = express();
// Init Middleware
app.use(express.json({ extended: false }));

// Test route
app.get('/ping', (req, res) => {
  res.json('pong');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
