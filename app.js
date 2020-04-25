const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to todolist",
});

const item2 = new Item({
  name: "+ button to add a new Item",
});

const item3 = new Item({
  name: "<== Delete an Item",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);




app.get("/", function (req, res) {

  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully added default items to Database.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { newListItems: foundItems });
    }

  });

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;

  if (itemName === "") {
    console.log("empty");
  } else {
    const item = new Item({
      name: itemName
    });
    item.save();
    console.log("Item Added Successfully");
  }
  res.redirect("/");

});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;


  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Item deleted Successfully");
      res.redirect("/");
    }
  });


});


app.listen(3000, function () {
  console.log("Server Started Successfully");
});
