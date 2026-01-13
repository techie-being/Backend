require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/twitter',(req,res)=>{
    res.send('Rakesh')

})

const githubdata={
  
  
  "email": null,
  "hireable": null,
  "bio": " Tech enthusiast passionate about DSA, web dev (Python, Flask, JS). Sharpening problem-solving skills and building real-world projects.",
  "twitter_username": null,
  "public_repos": 5,
  "public_gists": 0,
  "followers": 0,
  "following": 0,
  "created_at": "2025-06-13T20:57:04Z",
  "updated_at": "2025-10-01T16:05:33Z"
}

app.get('/github',(req,res)=>{
  res.json(githubdata)
})
app.get('/login',(req,res)=>{
    res.send('login to see any thing')

})

app.get('/youtube',(req,res)=>{
    res.send('<h2>chai aur backend</h2>')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})

