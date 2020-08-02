const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
const methodOverride = require('method-override')
const articleRoute = require('./routes/articles')
const adminRoute = require('./routes/admin')

mongoose.connect('mongodb://localhost/blog', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true
})

//Model implementation
const Article = require('./models/article')
const Admin = require('./models/admin')

// sessions for admins
app.use(session({
    key: "admin",
    secret: "admin key + random string"
}))



app.use(express.urlencoded({ extended: false }))
app.use('/static', express.static(__dirname + '/static'));
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('user/home', { articles: articles })

})

app.get('/about', (req, res) => {
    res.render('user/about')
})

app.use('/admin', adminRoute)
app.use('/articles', articleRoute)


app.listen(3000, (req, res) => {
    console.log("Port 3000");
})
