const express = require('express')
const Admin = require('../models/admin')
const router = express.Router()
const Article = require('../models/article')

router.get('/dashboard', (req, res) => {
    if (req.session.admin) {
        res.render('admin/dashboard')
    }
    else {
        res.redirect("/admin")
    }
})

router.get('/posts', async (req, res) => {
    if (req.session.admin) {
        const articles = await Article.find().sort({ createdAt: 'desc' })
        res.render('admin/posts', { articles: articles })
    }
    else {
        res.redirect("/admin")
    }
})

router.get('/', (req, res) => {
    if (req.session.admin) {
        res.redirect('admin/dashboard')
    }
    else {
        res.render('admin/login')

    }

})



router.post('/do-post', async (req, res, next) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    })
    try {
        await article.save()
        res.send('posted successfuly')
    } catch (e) {
        res.render('/admin/posts', { article: article })
    }
})

router.post('/do-admin-login', async (req, res) => {
    const admin = await Admin.findOne({ email: req.body.email, password: req.body.password }, (error, admin) => {


        if (admin != "") {
            req.session.admin = admin;
        }
        res.send(admin)
    })
})

router.get('/do-logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin')
})


router.post('/createAdmin', async (req, res) => {
    const admin = new Admin({
        email: "admin@hotmail.com",
        password: "kyounuke123"
    })

    await admin.save()
    res.send('admin saved successfuly')
})


module.exports = router