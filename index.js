const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/products');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/farmStand', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connection open!!!')
    })
    .catch(() => {
        console.log('error')
        console.log(err)
    })

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetable', 'dairy']

app.get('/products', async (req, res) => {
    const products = await Product.find({})
    console.log(products)
    res.render('products/index', {products})
})

app.get('/products/new', (req, res) => {
    res.render('products/new', {categories})
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body)
    await newProduct.save();
    console.log(newProduct)
    console.log(req.body)
    res.redirect('products')
})

app.get('/products/:id', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id)
    res.render('products/details', {product, categories})
    
})

app.get('/products/:id/edit', async (req, res) => {
    const {id} = req.params;
    const product = await Product.findById(id)
    res.render('products/edit', {product, categories})
})

app.put('/products/:id', async (req, res) => {
     const {id} = req.params;
     const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true , useFindAndModify: false})
     res.redirect(`${product._id}`)
    
})

app.delete('/products/:id', async (req, res) => {
    const {id} = req.params;
    const del = await Product.findByIdAndDelete(id)
    res.redirect('/products')

})

app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})