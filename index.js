const express = require('express') // import express
const db = require('./connection/db')
const bcrypt = require('bcrypt')
const session = require('express-session') // import session untuk menyimpan data ke dalam browser
const flash = require('express-flash')

const app = express()
const port = 8000


app.set('view engine', 'hbs') // method untuk set view engine 
app.use('/assets', express.static(__dirname + '/assets')) // path folder assets
app.use(express.urlencoded({extended: false}))
app.use(flash())

app.use(session({
    secret: 'whatever',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000 // 2 hours
    }
}))


app.get('/contact', function (request, response) {
    response.render('contact')
})
    
db.connect(function(err, client, done){
        if (err) throw err // menampilkan error koneksi database


app.get('/', function (request, response) {

    console.log(request.session);
        
        client.query('SELECT * FROM tb_projects ORDER BY id DESC', function (err, result) {
            if (err) throw err // menampilkan error dari queary
            
            // console.log(result.rows);
            let data = result.rows
            
            let dataProject = data.map(function(item){

                item.technologies = item.technologies.map(function (tech){
                    if (tech != 'undefined') {
                        return tech
                    } else {
                        tech = undefined
                    }
                })
                return {
                    ...item,
                    duration: getDistanceTime(new Date(item.start_date), new Date(item.end_date)),
                    isLogin: request.session.isLogin
                }
            })
            response.render('index', {dataProject, user: request.session.user, isLogin: request.session.isLogin})
         })
    })


app.get('/add-project', function (request, response) {
    if(!request.session.user){
        request.flash('danger','You have to login first')
    return response.redirect('login')
    }
    response.render('addproject')
})

app.post('/add-project', function (request, response) {

    // console.log(request.body);

    let {
        inputProject: title,startDate: start,endDate: end,inputDescription: description,react,node,vuejs,js,inputImage: image
    } = request.body
    
       let query = `INSERT INTO tb_projects (project_name, start_date, end_date, description, technologies, image) VALUES 
        ('${title}','${start}','${end}','${description}', '{"${react}","${node}","${vuejs}","${js}"}', '${image}' )`



    client.query(query, function(err, result){

        if (err) throw err // menampilkan error pada query
        response.redirect('/')
        })
})

app.get('/project-detail/:id', function (request, response) {

    let id = request.params.id

        let query = `SELECT * FROM tb_projects WHERE id=${id}`

        client.query(query, function (err, result) {
            if (err) throw err // menampilkan error dari queary
            
            let data = result.rows
            // console.log(data);
            
            let dataProject = data.map(function(item){
                item.technologies = item.technologies.map(function (tech){
                    if (tech != 'undefined') {
                        return tech
                    } else {
                        tech = undefined
                    }
                })
                return {
                    ...item,
                    start_date: getFullTime(new Date(item.start_date)),
                    end_date: getFullTime(new Date(item.end_date)),
                    duration: getDistanceTime(new Date(item.start_date), new Date(item.end_date))

                }
            })
            response.render('project-detail',{data: dataProject[0]} )
         })
})

app.get('/edit-project/:id', function (request, response) {
    if(!request.session.user){
        request.flash('danger','You have to login first')
    return response.redirect('login')
    }

    let id = request.params.id
        
        let query = `SELECT * FROM tb_projects WHERE id=${id}`

        client.query(query, function (err, result) {
            if (err) throw err // menampilkan error dari queary
            
            let data = result.rows
            // console.log(data);

            response.render('edit-project',{data: data[0]} )
         })
}) 

app.post('/edit-project/:id', function (request, response) {
    let id = request.params.id

    let {
        inputProject: title,startDate: start,endDate: end,inputDescription: description,react,node,vuejs,js,inputImage: image
    } = request.body
    
       let query = `UPDATE tb_projects
	SET project_name='${title}', start_date='${start}', end_date='${end}', description='${description}', technologies='{${react},${node},${vuejs},${js}}', image = '${image}' WHERE id=${id}`

    client.query(query, function(err, result){
        if (err) throw err // menampilkan error pada query

        let data = result.rows
            // console.log(data);
            
            let dataProject = data.map(function(item){
                return {
                    ...item,
                    start_date: getFullTime(item.start_date),
                    end_date: getFullTime(item.end_date),
                    duration: getDistanceTime(new Date(item.start_date), new Date(item.end_date))

                }
            })

        response.redirect('/')
        })
    
})

app.get('/delete-project/:id', function (request, response) {
    let id = request.params.id

        let query = `DELETE FROM tb_projects WHERE id=${id}`

        client.query(query, function (err, result) {
            if (err) throw err // menampilkan error dari queary
            
            response.redirect('/')
         })
})

app.get('/register', function (request, response) {
response.render('register')
})

app.post('/register', function(request,response){

    let { username: name, password: pass , email} = request.body

    const hashedPassword = bcrypt.hashSync(pass, 10)

    db.connect(function(err, client, done){
        if (err) throw err // menampilkan error koneksi database
        
        let query = `INSERT INTO public.tb_user(name, email, password)
            VALUES ('${name}', '${email}', '${hashedPassword}');`

        client.query(query, function (err, result) {
            if (err) throw err // menampilkan error dari queary
            
            let data = result.rows
            // console.log(data);

            response.redirect('register')
         })
    })
})

app.get('/login', function(request,response){
    response.render('login')
})

app.post('/login', function(request,response){

    let = {inputEmail: email, inputPassword: pass} = request.body

    let query = `SELECT * FROM tb_user WHERE email='${email}'`

    client.query(query, function(err,result){
        if (err) throw err // menampilkan error query

        // console.log(result.rows[0]);
        if (result.rows.length == 0) {
            console.log('email belum terdaftar')
            request.flash('danger', 'Email is not register')

        return response.redirect('login')
        } 

    const isMatch = bcrypt.compareSync(pass, result.rows[0].password)

    console.log(isMatch)

    if (isMatch) {
        console.log('Login Success !');

        request.session.isLogin =true
        request.session.user = {
            id: result.rows[0].id,
            name: result.rows[0].name,
            email: result.rows[0].email
        }
        request.flash('success','Login Succesful')
        response.redirect('/')
    } else {
        console.log('Login Failed');
        response.redirect('/login')
    }
    })
})

app.get('/logout', function(request,response){
    request.session.destroy()

    response.redirect('/login')
})

})


function getFullTime(time) {

    let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"]

    let date = time.getDate()
    let monthIndex = time.getMonth()
    let year = time.getFullYear()

    let hours = time.getHours()
    let minutes = time.getMinutes()

    // 12 Agustus 2022
    let fullTime = `${date} ${month[monthIndex]} ${year}`
    // console.log(fullTime);
    return fullTime
}


// function durasi

function getDistanceTime(start_date, end_date){

    let start = new Date(start_date)
    let end = new Date(end_date)

    let distance = end - start
    // console.log(distance);

    let milisecond = 1000 // 1 detik 1000 milisecond
    let secondInHours = 3600 // 1 jam sama dengan 3600 detik
    let hoursInDay = 24 // 1 hari 24 jam
    let daysInWeek = 7 // 7 hari 1 minggu
    let weekInMonth = 4// 4 minggu 1 bulan

    let distanceMonth = Math.floor(distance / (milisecond * secondInHours * hoursInDay * daysInWeek * weekInMonth))
    let distanceDay = Math.floor(distance / (milisecond * secondInHours * hoursInDay))
    
    if(distanceMonth > 0){
        return `${distanceMonth} month ago`
    } else {
        return `${distanceDay} day ago`
    }
}

app.listen(port, function(){
    console.log(`server running on ${port}`)
})