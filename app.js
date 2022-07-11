const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// requiring date function from date.js
const d = require(path.join(__dirname, 'modules/date.js'));


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




// connecting to data base 

const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/noteapp");

const appSchema = mongoose.Schema({
    note: {
        type: String,
        required: true
    }
})

// model 
const note = mongoose.model('note', appSchema);

// let items = [];
let workItems = [];


// routing
app.get("/", (req, res) => {
    const day = d()
    note.find().then((items)=>{
        res.render('list', { listTitle: day, itemList: items });
    })
    .catch(err => console.log(err));
});

// Inserting data 
app.post("/", (req, res) => {
    if (req.body.list == "work") {
        // console.log("i am in redirecting");
        const item = req.body.newItem;
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        const item = req.body.newItem;
        const todo = new note({
            note:item
        })
        todo.save();
        res.redirect("/");
    }

})

// deleting data from data base 
app.post("/delete", (req, res) => {
    const delId = req.body.delItem;
    // console.log(typeof(delId));
    note.deleteOne({id:delId},(err)=>{
        if (err) 
            console.log(err);
    });
    res.redirect("/");

})


app.get("/work", (req, res) => {
    res.render('list', { listTitle: "work", itemList: workItems });
});


app.listen(8000);