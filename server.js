const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const TickerSymbols = require('path')
const axios = require('axios')


const stockData = require('./data')
const json = require('body-parser/lib/types/json')

app.set('views','./views')
app.set('view engine','ejs')
app.use('/js',express.static(__dirname+'/public/js'))
app.use('/css',express.static(__dirname+'/public/css'))
app.use('/fonts',express.static(__dirname+'/public/fonts'))
app.use('/vendor',express.static(__dirname+'/public/vendor'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.get('/',(req,res)=>{
    res.render('index',{data:""})
})

app.post('/',async (req,res)=>{//
    // console.log(TickerSymbols)
    var key = req.body.search.trim()
    //var symbol;

    var symbol = stockData.TickerSymbols.reduce((res,curr)=>{
        if(curr.name == key) {
            res = curr.symbol
        }
        return res
    })

    console.log(symbol)
    const API_KEY = "SoMPFBofxQ657OFMapUHEaPuAcGt1aUq3vRT8UZq"
    const url = "https://yfapi.net/v6/finance/quote?lang=en&symbols="+symbol
    const trendURL = "https://yfapi.net/v1/finance/trending/IN"
    const response = await axios.get(url,{
        headers : {
            'X-API-KEY': API_KEY     
        }
    })
    const trendResponse = await axios.get(trendURL,{
        headers : {
            'X-API-KEY': API_KEY     
        }
    })
    console.log(response.data.quoteResponse.result)
    //res.reder('index',{data:""})
    res.render('index',{data:response.data.quoteResponse.result})
})

app.get("/data",(req,res)=>{
    var output = stockData.TickerSymbols.map(data => data.name)
    res.status(200).send({status:200,data:output})
})

// app.get("/news",async(req,res)=>{
//     const NEWS_URL = "https://eodhistoricaldata.com/api/news?api_token=62567cafa90d42.33777310&t=companyannouncement&offset=0&limit=10"
//     const response = await axios.get(NEWS_URL);
//     console.log(response.data);
//     res.render('new',{data:response.data});

// })

app.listen(3000,()=> console.log('Server running on port 3000'))