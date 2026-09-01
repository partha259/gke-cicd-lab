/**
 * Simple Node.js microservice for GKE hands-on lab.
 * Exposes:
 *   GET  /health          -> liveness/readiness check
 *   GET  /api/data        -> list all items
 *   GET  /api/data/:id    -> get one item
 *   PUT  /api/data/:id    -> create or update one item
 */

const express = require('express');
const app = express();

app.use(express.json());

// In-memory data store (for lab purposes only; not persistent)
const store = new Map();

// Seed a bit of sample data
store.set('1', { id: '1', name: 'sample-item', value: 42 });

// --- Health check (used by k8s readiness/liveness probes) ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', pod: process.env.HOSTNAME || 'local' });
});

// --- GET all items ---
app.get('/api/data', (req, res) => {
  res.status(200).json(Array.from(store.values()));
});

// --- GET single item ---
app.get('/api/data/:id', (req, res) => {
  const item = store.get(req.params.id);
  if (!item) {
    return res.status(404).json({ error: `Item ${req.params.id} not found` });
  }
  res.status(200).json(item);
});

// --- PUT (create or update) an item ---
app.put('/api/data/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body || {};
  const item = { id, ...body };
  store.set(id, item);
  res.status(200).json({ message: `Item ${id} saved`, item });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Microservice listening on port ${PORT}`);
});
