// express app
require("dotenv").config()
const { Configuration, OpenAIApi } = require("openai")
const express = require('express')
const app = express()
const cors = require('cors')

// use cors and allow all origins to access the server 
app.use(cors())
app.use(express.json())

// start the server
app.listen(4000, () => {
  console.log("listening on port 4000!")
})

app.post('/', async (req, res) => {
  const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

  const openai = new OpenAIApi(configuration);
  console.log('body')
  await console.log(req.headers.message)
    
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo", 
    messages: req.headers.message
  });

  await console.log(completion.data.choices)
  await res.json({role: "assistant", content: completion.data.choices[0].message.content})
})














