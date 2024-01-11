const express = require('express')
const {Search,Ingest} = require("sonic-channel")
const {v4 : uuid} = require('uuid')

const app = express()
const configCon  = {
    host : "localhost",          
    port : 1491,             
    auth : "SecretPassword"
}

const sonicChannelIngest = new Ingest(configCon)
const sonicChannelSearch =  new Search(configCon)
const con =  str =>  console.log(str)
sonicChannelIngest.connect({ connected: con('sonicChannelIngest') })
sonicChannelSearch.connect({ connected: con('sonicChannelSearch') })
const port = 3003
app.use(express.json())

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/pages', async (req,res) => {
    const id = uuid();
    const {title, content} = req.body
    //cadastrar pag banco
    

    await sonicChannelIngest.push("pages","default",`page:${id}`, `${title} ${content}`, {lang: "por"})
    return res.json({status: true,id})
})

app.get('/search', async (req,res) => {
    const {q} = req.query
    const results = await sonicChannelSearch.query("pages", "default", q, {lang : "por"})
    return res.json(results)
})

app.get('/suggest', async (req,res) => {
    const {q} = req.query
    const results = await sonicChannelSearch.suggest("pages", "default", q, {limit: 5})
    return res.json(results)
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))