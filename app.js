const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const _ = require('lodash');

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

// listSchema 

const listSchema = {
    name: {
        type: String,
        required: true
    },
    items: [appSchema]
}

const defaultItem = new note({
    note: "welcome to the new list"
});

const List = mongoose.model('list', listSchema);


// let items = [];
let workItems = [];


// routing
app.get("/", (req, res) => {
    // const day = d()
    note.find().then((items) => {
        res.render('list', { listTitle: "Today", itemList: items });
    })
        .catch(err => console.log(err));
});

app.get("/:customList", (req, res) => {
    const customListName = _.capitalize(req.params.customList);
    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                // creating list here if does not exist
                let list = new List({
                    name: customListName,
                    items: defaultItem

                })
                list.save();
                res.redirect("/" + customListName);
            }
            else {
                res.render('list', { listTitle: customListName, itemList: foundList.items })
            }
        }
    })




})

// Inserting data 
app.post("/", (req, res) => {

    const listName = req.body.list;
    console.log(typeof (listName));
    const itemName = req.body.newItem;
    console.log(itemName);

    const item = new note({
        note: itemName
    })

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, (err, foundList) => {
            if (err)
                console.log(err);
            else {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
        })
    }

}

)

// deleting data from data base 
app.post("/delete", (req, res) => {
    const delId = req.body.delItem;
    const listName = req.body.listName;

    console.log(delId);

    if (listName === "Today") {
        note.deleteOne({ id: delId }, (err) => {
            if (err)
                console.log(err);rs
        });
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: {items: {_id:delId} } }, (err) => {
           if(!err){
            res.redirect("/" + listName);
           }

        })
    }


})


// app.get("/work", (req, res) => {
//     res.render('list', { listTitle: "work", itemList: workItems });
// });


app.listen(8000);