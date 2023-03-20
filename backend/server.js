require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

// use cors and allow all origins to access the server
app.use(cors());

// calling body-parser to handle the Request Object from POST requests
var bodyParser = require('body-parser');
const { query } = require('express');
// parse application/json, basically parse incoming Request Object as a JSON Object
app.use(bodyParser.json());

// start the server
app.listen(4000, () => {
  console.log('listening on port 4000');
});

// Store clients' SSE connections
const clients = new Map();

// Handle the SSE endpoint
app.get('/events/:clientId', (req, res) => {
  try {
  console.log('Client connected', req.params.clientId);
  const clientId = req.params.clientId;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.set(clientId, res);

  req.on('close', () => {
    clients.delete(clientId);
  });
  } catch (error) {
    console.error(error)
  }
});

const sendToClient = (clientId, message) => {
  const client = clients.get(clientId);
  if (client) {
    console.log('Sending to client', clientId, message);
    client.write(`data: ${JSON.stringify(message)}\n\n`);
  }
};

app.post('/', async (req, res) => {
  try {

  console.log('Request body', req.body);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.body.userApiKey}`
    },
    body: JSON.stringify({
      model: req.body.model,
      messages: req.body.messages,
      stream: true,
    })
  }).catch((error) => {
    console.error(error)
    return res.status(500).json({ error: 'Something went wrong' })
  })

  if (!response.ok) {
    console.error(response.statusText)
    return res.status(500).json({ error: 'Something went wrong' })
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')

  while (true) {
    const { value } = await reader.read()

    const chunk = decoder.decode(value)
    const transformedChunk = chunk
      .split('\n')
      .filter(Boolean)
      .map((line) => line.replace('data: ', '').trim())


    for (const data of transformedChunk) {
      if (data === '[DONE]') {
        console.log('Done')
        // sendToClient(req.body.clientId, { done: true });
        return res.end('data: [DONE]\n\n') 
      }

      try {
        const json = JSON.parse(data)
        const { content } = json.choices?.[0]?.delta
        content && sendToClient(req.body.clientId, content); // Send the response to the appropriate SSE client
      } catch (error) {
        console.error(error)
      }
    }
  }
} 
  catch (error) {
  console.error(error)
  return res.status(500).json({ error: 'Something went wrong' })
  }
});