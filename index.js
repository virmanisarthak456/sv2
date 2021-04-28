const express = require("express");
const path = require("path");
const port = 8000;
const db = require("./config/mongoose");
const Contact = require("./models/contact");
const bodyParser = require("body-parser");
const app = express();
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded());
app.use(express.static("assets"));

app.get("/", function (req, res) {
  Contact.find({}, function (err, contacts) {
    if (err) {
      console.log("error in fetching contacts from mongodb");
      return;
    }
    return res.render("home", {
      title: "My_contact_list",
      contact_list: contacts,
    });
  });
});
app.post("/create-contact", function (req, res) {
  Contact.create(
    {
      name: req.body.name,
      phone: req.body.phone,
    },
    function (err, newContact) {
      if (err) {
        console.log("error in creating a conatact");
        return;
      }
      console.log("*******", newContact);
      return res.redirect("back");
    }
  );
});

app.get("/delete-contact/", function (req, res) {
  let id = req.query.id;
  Contact.findByIdAndDelete(id, function (err) {
    if (err) {
      console.log("error in deletong an object from the database");
    }
    return res.redirect("back");
  });
});

//                   **********CRUD APIs are Below*******

//   API to read/fetch the contact from the DB
app.get("/read", function (req, res) {
  try {
    Contact.find({}, function (err, contacts) {
      if (err) {
        console.log(err, "err in fetching from DB");
      }
      return res.json(200, {
        Message: "Contacts fetched",
        Contacts: contacts,
      });
    });
  } catch (error) {
    return res.json(400).json({
      Message: " error in finding contacts",
    });
  }
});

//    API to create the contact in the DB
app.post("/create", function (req, res) {
  try {
    Contact.create(
      {
        name: req.body.name,
        phone: req.body.phone,
      },
      function (err, newContact) {
        if (err) {
          console.log("error in creating a conatact", err);
          return;
        }
        console.log("new Contact:", newContact);
        return res.json(200, {
          Message: " Contact created ",
          Contact: newContact,
        });
      }
    );
  } catch (error) {
    return res.json(400, {
      Message: " error in creating contact",
    });
  }
});

//   API to delete the contact from the DB
app.get("/delete", function (req, res) {
  try {
    let id = req.body.id;
    console.log(id);
    Contact.findByIdAndDelete(id, function (err) {
      if (err) {
        console.log("error in deletong an object from the database");
      }
      return res.json(200, {
        Message: " contact deleted",
      });
    });
  } catch (error) {
    return res.json(400, {
      Message: " error in deleting",
    });
  }
});

//    Update API
app.post("/update", function (req, res) {
  try {
    let id = req.body.id;
    Contact.findByIdAndUpdate(
      id,
      { name: req.body.name },

      function (err, data) {
        if (err) {
          console.log(err);
        }
        console.log("Updated : ", data);
        return res.json(200, {
          Message: "updated",
        });
      }
    );
  } catch (error) {
    return res.json(400, {
      Message: " error in updating",
    });
  }
});

app.listen(port, function (err) {
  if (err) {
    console.log("error in running the sever", err);
  }
  console.log("server is running fine", port);
});
