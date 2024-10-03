const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const prisma = new PrismaClient();
const app = express();
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json());

app.get('/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { resource: true },
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve event list' });
  }
});

app.post('/events', async (req, res) => {
  const { title, start, end, resourceId } = req.body;
  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        resourceId,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create event' });
  }
});

app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, start, end, resourceId } = req.body;
  try {
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        resourceId,
      },
    });
    res.json(updatedEvent);
  } catch (error) {
    res.status(404).json({ error: 'Event not found' });
  }
});

app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Event not found' });
  }
});

app.get('/resources', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve resource list' });
  }
});

app.post('/resources', async (req, res) => {
  const { name } = req.body;
  try {
    const newResource = await prisma.resource.create({
      data: { name },
    });
    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create resource' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
