// express app
require("dotenv").config()
const { Configuration, OpenAIApi } = require("openai")
const express = require('express')
const app = express()
const cors = require('cors')

// use cors and allow all origins to access the server 
app.use(cors())

// calling body-parser to handle the Request Object from POST requests
var bodyParser = require('body-parser');
// parse application/json, basically parse incoming Request Object as a JSON Object 
app.use(bodyParser.json());

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
    messages: req.body.messages
  });

  await res.json(completion.data.choices[0].message)
})














