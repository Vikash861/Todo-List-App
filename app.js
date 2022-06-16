const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// requiring date function
const d = require(path.join(__dirname, 'modules/date.js'));

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let items = [];
let workItems = [];

app.get("/", (req, res) => {

    const day  = d();
    
    res.render('list', { listTitle: day, itemList:items});
});

app.post("/",(req,res)=>{
    if(req.body.list == "work"){
        console.log("i am in redirecting");
        const item = req.body.newItem;
        workItems.push(item);
        res.redirect("/work");
    }
    else{
    const item = req.body.newItem;
    items.push(item)
    res.redirect("/");
    }

})

app.get("/work",(req,res)=>{
    res.render('list',{listTitle:"work", itemList:workItems});
});


app.listen(8080);