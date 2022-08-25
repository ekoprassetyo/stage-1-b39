const express = require('express') // import express

const app = express()
const port = 8000


app.set('view engine', 'hbs') // method untuk set view engine 
app.use('/assets', express.static(__dirname + '/assets')) // path folder assets
app.use(express.urlencoded({extended: false}))

const db = require('./connection/db')



app.get('/', function (request, response) {

    
    db.connect(function(err, client, done){
        if (err) throw err // menampilkan error koneksi database
        
        client.query('SELECT * FROM tb_projects', function (err, result) {
            if (err) throw err // menampilkan error dari queary
            
            console.log(result.rows);
            let data = result.rows
            
            let dataProject = data.map(function(item){
                return {
                    ...item,
                    duration: getDistanceTime(new Date(item.start_date), new Date(item.end_date))
                }
            })
            response.render('index', {dataProject})
         })
    })

        
})

app.get('/add-project', function (request, response) {
    response.render('addproject')
})

app.post('/add-project', function (request, response) {
   
 response.redirect('/')
})

app.get('/project-detail/:index', function (request, response) {
    response.render('project-detail', {data})
})

app.get('/edit-project/:index', function (request, response) {

response.render('edit-project',{index, data})
}) 

app.post('/edit-project/:index', function (request, response) {

response.redirect('/')
    
})

app.get('/delete-project/:index', function (request, response) {

response.redirect('/')
})


app.get('/contact', function (request, response) {
response.render('contact')
})



// function durasi

function getDistanceTime(time){

    let start = new Date()
    let end = time

    let distance = start - end
    // console.log(distance);

    let milisecond = 1000 // 1 detik 1000 milisecond
    let secondInHours = 3600 // 1 jam sama dengan 3600 detik
    let hoursInDay = 24 // 1 hari 24 jam

    let distanceDay = Math.floor(distance / (milisecond * secondInHours * hoursInDay))
    let distanceHours = Math.floor(distance / (milisecond * 60 * 60))
    let distanceMinutes = Math.floor(distance / (milisecond * 60))
    let distanceSeconds = Math.floor(distance / milisecond)

    if(distanceDay > 0){
        return `${distanceDay} day ago`
    } else if(distanceHours > 0){
        return `${distanceHours} hours ago`
    } else if(distanceMinutes > 0){
        return `${distanceMinutes} minutes ago`
    } else {
        return `${distanceSeconds} seconds ago`
    }
}

app.listen(port, function(){
    console.log(`server running on ${port}`)
})