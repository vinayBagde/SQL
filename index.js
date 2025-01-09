const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");


app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "Vinay@032011",
});

let getRandomUser = () => {
  return [
    // userId: faker.string.uuid(),
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    // faker.image.avatar(),
    faker.internet.password(),
    // birthdate: faker.date.birthdate(),
    // registeredAt: faker.date.past(),
  ];
};

// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let users = [
//   ["123b", "123_newuserb", "abc@gmail.comb", "abcb"],
//   ["123c", "123_newuserc", "abc@gmail.comc", "abcc"],
// ];

// let data = [];

// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser());
// }

app.get("/", (req, res) => {
  let q = ` SELECT count(*) FROM user`;
  try {
    connection.query(
      q,
      /*[data],*/ (err, result) => {
        if (err) throw err;
        console.log(result);
        // console.log(result[0]["count(*)"]);
        let count = result[0]["count(*)"];
        res.render("home.ejs", { count });
      }
    );
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
  // res.send("welcome to home page");
});

app.get("/users", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showUsers.ejs", { users });
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0]
      res.render("edit.ejs", { user });
      console.log(result);
    });
  } catch (err) {
    res.send("some error occurred");
  }
});


app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
      console.log(result);
    });
  } catch (err) {
    res.send("some error occurred");
  }
})

const port = 8080;

app.listen(port, () => {
  console.log("sever is listening to port 8080");
});

// connection.end();
