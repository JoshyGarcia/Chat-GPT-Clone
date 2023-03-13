// express app
require("dotenv").config()
const { Configuration, OpenAIApi } = require("openai")
const express = require('express')
const app = express()
const cors = require('cors')

// use cors and allow all origins to access the server 
app.use(cors())

// start the server
app.listen(4000, () => {
  console.log("listening on port 4000")
})

app.post('/', async (req, res) => {
  const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

  const openai = new OpenAIApi(configuration);
    
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", 
    messages: JSON.parse(req.headers.messages)
  });

  await res.json(completion.data.choices[0].message)
})














