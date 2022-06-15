const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.user("view engine", "ejs");

app.get("/", (req, res) => {
    const d = new Data();
    const day = d.getDay;
    let weekDay_or_Not = "";
    if(day === 6 || day === 0){
        weekDay_or_Not = "weekend";
    }
    else{
        weekDay_or_Not = "Working Day";
    }
})

app.listen(8080);