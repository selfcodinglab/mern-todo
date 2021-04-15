const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const Todo = require('./models/Todo');

mongoose.connect('your url here');

app.use(cors());
app.use((bodyParser.json()));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/signup', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10)
  });

  newUser.save(err => {
    if (err) {
      return res.status(400).json({
        title: 'error',
        error: 'Email already in use'
      })
    }
    return res.status(200).json({
      title: 'user successfully added'
    })
  })
});

app.post('/login', (req,res) => {
  User.findOne({ username: req.body.username}, (err, user) => {
    if (err) return res.status(500).json({
      title: 'server error',
      error: err
    });
    if (!user) {
      return res.status(400).json({
        title: 'user is not found',
        error: 'invalid username or password'
      })
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({
        title: 'login failed',
        error: 'invalid username or password'
      })
    }

    // authentication is done, give them a token
    let token = jwt.sign({ userId: user._id}, 'secretkey');
    return res.status(200).json({
      title: 'login successful',
      token: token
    });
  })
});

// get todo route
app.get('/todos', (req, res) => {
  // verify
  jwt.verify(req.headers.token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({
      title: 'not authorized'
    });

    // now we know token is valid
    Todo.find({ author: decoded.userId }, (err, todos) => {
      if (err) return console.log(err);

      return res.status(200).json({
        title: 'success',
        todos: todos
      });
    })
  })
})

// const requireToken = (req, res, next) => {
//   jwt.verify(req.headers.token, 'secretkey', (err, decoded) => {
//     if (err) return res.status(401).json({
//       title: 'not authorized'
//     });
//   })
//   next();
// }

// add todo route
// mark todo as completed route
app.post('/todo',(req, res) => {
  // verify
  jwt.verify(req.headers.token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({
      title: 'not authorized'
    });

    let newTodo = new Todo({
      title: req.body.title,
      isCompleted: false,
      author: decoded.userId
    });

    newTodo.save(error => {
      if (error) return console.log(error);
      return res.status(200).json({
        title: "successfully added",
        todo: newTodo
      })
    })
  })
});

app.put('/todo/:todoId', (req, res) => {
  jwt.verify(req.headers.token, 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({
      title: 'not authorized'
    });

    // now we know token is valid
    Todo.findOne({ author: decoded.userId, _id: req.params.todoId }, (err, todo) => {
      if (err) return console.log(err);

      todo.isCompleted = true;
      todo.save(error => {
        if (error) return console.log(error);

        //saved
        return res.status(200).json({
          title: 'success',
          todo: todo
        });
      });
    })
  })
})

// app.get('/user', (req, res) => {
//   let token = req.headers.token;
//   // verify
//   jwt.verify(token, 'secretkey', (err, decoded) => {
//     if (err) return res.status(401).json({
//       title: 'not authorized'
//     });

//     // now we know token is valid
//     User.findOne({ _id: decoded.userId }, (err, user) => {
//       if (err) return console.log(err);
//       return res.status(200).json({
//         title: 'success',
//         user: {
//           username: user.username
//         }
//       })
//     })
//   })
// })


const port = process.env.PORT || 5000;



app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log('Server running on port: ', port);
});