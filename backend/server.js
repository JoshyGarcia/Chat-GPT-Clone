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
      apiKey: req.body.userApiKey
    });

  const openai = new OpenAIApi(configuration);
  
  try{
    const completion = await openai.createChatCompletion({
      model: req.body.model, 
      messages: req.body.messages
    })
    
  console.log(req.body.model)

  await res.json(completion.data.choices[0].message)

  }
  catch(err){
    res.status(400).json({message: "Invalid API Key"})
    console.log(err)
  }

})














