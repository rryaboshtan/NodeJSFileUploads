const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const hbs = require('express-handlebars');

app.set('view engine', 'hbs');
app.engine(
   'hbs',
   hbs({
      extname: 'hbs',
      // defaultLayout: 'layout',
      defaultView: 'default',
      layoutsDir: path.join(__dirname, 'views'),
      partialsDir: path.join(__dirname, 'views/partials'),
   })
);
app.set('view engine', 'hbs');

app.use('/', require('./server/router/router'))

app.listen(3000, () => console.log('Server is started on http://localhost:3000'));
