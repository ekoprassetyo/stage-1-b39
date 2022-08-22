const express = require('express')

const app = express()
const port = 8000


app.set('view engine', 'hbs') // method untuk set view engine 
app.use('/assets', express.static(__dirname + '/assets')) // path folder assets
app.use(express.urlencoded({extended: false}))

app.get('/', function (request, response) {
    response.render('index')
})

app.get('/add-project', function (request, response) {
    response.render('addproject')
})

app.post('/add-project', function (request, response) {

    // console.log(request.body);
    let title = request.body.inputProject
    let description = request.body.inputDescription
    
    console.log(title)
    console.log(description)

    response.redirect('/')
})

app.get('/contact', function (request, response) {
    response.render('contact')
})

app.listen(port, function(){
    console.log(`server running on ${port}`)
})