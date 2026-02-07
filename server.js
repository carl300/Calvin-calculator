const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <h1>Calvin's Calculator</h1>
    <p>Use POST /calculate with JSON:</p>
    <pre>
{
  "a": 10,
  "b": 5,
  "operation": "add"
}
    </pre>
  `);
});

const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Enable default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ register });

// Expose /metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});


app.post('/calculate', (req, res) => {
  const { a, b, operation } = req.body;

  if (a === undefined || b === undefined || !operation) {
    return res.status(400).json({ error: "Please provide a, b, and operation" });
  }

  let result;

  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      if (b === 0) return res.status(400).json({ error: "Cannot divide by zero" });
      result = a / b;
      break;
    default:
      return res.status(400).json({ error: "Invalid operation" });
  }

  res.json({
    calculator: "Calvin's Calculator",
    a,
    b,
    operation,
    result
  });
});

app.listen(3000, () => {
  console.log("Calvin's Calculator running on port 3000");
});
