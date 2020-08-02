const express = require('express')
const Article = require('../models/article')
const router = express.Router()

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) return res.redirect('/')
    res.render('user/post', { article: article })

    //res.render('articles/show', { article: article })
})

// call edit page
router.get('/edit/:id', async (req, res) => {

    if (req.session.admin) {
        const article = await Article.findById(req.params.id)
        res.render('admin/editPost', { article: article })
    }
    else {
        res.redirect("/admin")
    }

})

// delete article
router.delete('/delete/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/admin/posts')
})

//edit
router.post('/do-edit-post/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    let article = req.article
    article.title = req.body.title,
        article.content = req.body.content

    try {
        article = await article.save()

        const articles = await Article.find().sort({ createdAt: 'desc' })
        res.render(`admin/posts`, { articles: articles })
    } catch (e) {
        console.log("error occured");
        console.log(e);
        res.render('admin/editPost', { article: article })
    }
})

module.exports = router