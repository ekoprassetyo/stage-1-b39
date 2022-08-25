const express = require('express') // import express

const app = express()
const port = 8000


app.set('view engine', 'hbs') // method untuk set view engine 
app.use('/assets', express.static(__dirname + '/assets')) // path folder assets
app.use(express.urlencoded({extended: false}))


let dataProject = []


app.get('/', function (request, response) {

    let data = dataProject.map(function (item) {
        return {
            ...item,
            duration: getDistanceTime(new Date(item.start), new Date(item.end))
        }

        
    })
    console.log(data);
    response.render('index', {dataProject: data})
})

app.get('/add-project', function (request, response) {
    response.render('addproject')
})

app.post('/add-project', function (request, response) {

    // console.log(request.body);
    let projectName = request.body.inputProject
    let start = request.body.startDate
    let end = request.body.endDate
    let description = request.body.inputDescription
    let react = request.body.reactJs
    let node = request.body.nodeJs
    let next = request.body.nextJs
    let type = request.body.typeScript
    let image = request.body.inputImage

    console.log(projectName);
    console.log(description);
    
    let project = {
        projectName,
        start,
        end,
        description,
        react,
        node,
        next,
        type,
        image
    }

    dataProject.push(project)

    response.redirect('/')
})

app.get('/project-detail/:index', function (request, response) {
    let index = request.params.index
    let data = dataProject[index]

    data.duration = getDistanceTime(new Date(data.start), new Date(data.end))
    response.render('project-detail', {data})
})

app.get('/edit-project/:index', function (request, response) {
    let index = request.params.index

    let data = {
        projectName: dataProject[index].projectName,
        start: dataProject[index].start,
        end: dataProject[index].end,
        description: dataProject[index].description,
        react: dataProject[index].react,
        node: dataProject[index].node,
        next: dataProject[index].next,
        type: dataProject[index].type,
        image: dataProject[index].image
    }

response.render('edit-project',{index, data})
}) 

app.post('/edit-project/:index', function (request, response) {
    let index = request.params.index

    dataProject[index].projectName = request.body.inputProject
    dataProject[index].start = request.body.startDate
    dataProject[index].end = request.body.endDate
    dataProject[index].description = request.body.inputDescription
    dataProject[index].react = request.body.reactJs
    dataProject[index].node = request.body.nodeJs
    dataProject[index].next = request.body.nextJs
    dataProject[index].type = request.body.typeScript
    dataProject[index].image = request.body.inputImage

    response.redirect('/')
    
})

app.get('/delete-project/:index', function (request, response) {
    let index = request.params.index
    dataProject.splice(index, 1);

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