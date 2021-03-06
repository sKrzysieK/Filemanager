//zmienne, stałe

var express = require("express")
var hbs = require('express-handlebars')
var app = express()
const PORT = process.env.PORT || 3000;

var path = require("path")

var formidable = require('formidable')
var bodyParser = require("body-parser")
var data = { file: [], fileInfo: "" }
var currentIndex = 1

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'))          // ustalamy katalog views
app.engine('hbs', hbs({
    extname: '.hbs',
    partialsDir: "views/partials",
}))
app.set('view engine', 'hbs')                            // określenie nazwy silnika szablonów



app.get("/", function (req, res) {
    res.render('upload.hbs', data)

})

app.get("/upload", function (req, res) {
    res.render('upload.hbs', data)

})

app.get("/filemanager", function (req, res) {
    res.render('filemanager.hbs', data)

})

app.get("/info", function (req, res) {
    res.render('info.hbs', data)
})

app.post('/handleUpload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + '/static/upload/'       // folder do zapisu zdjęcia
    form.keepExtensions = true                           // zapis z rozszerzeniem pliku
    form.multiples = true                                // zapis wielu plików                          
    form.parse(req, function (err, fields, files) {
        console.log(files)
        var a = files
        if (a['imagetoupload'][0] === undefined) {
            console.log("POJEDYŃCZY PLIK")
            var ext = a['imagetoupload']['name'].slice(parseInt(a['imagetoupload']['name'].indexOf('.')) + 1, a['imagetoupload']['name'].length)
            //console.log(ext)
            data.file.push({ id: currentIndex, extension: ext, name: a['imagetoupload']['name'], size: a['imagetoupload']['size'], type: a['imagetoupload']['type'], path: a['imagetoupload']['path'], savedate: Date.now() })
            currentIndex++
        } else {
            console.log("WIELE PLIKÓW")
            for (let i = 0; i < a['imagetoupload'].length; i++) {
                var ext = a['imagetoupload'][i]['name'].slice(parseInt(a['imagetoupload'][i]['name'].indexOf('.')) + 1, a['imagetoupload'][i]['name'].length)
                data.file.push({ id: currentIndex, extension: ext, name: a['imagetoupload'][i]['name'], size: a['imagetoupload'][i]['size'], type: a['imagetoupload'][i]['type'], path: a['imagetoupload'][i]['path'], savedate: Date.now() })
                currentIndex++
            }

        }
        console.log(data)
        //console.log(Object.keys(a['imagetoupload']))
        //console.log(a['imagetoupload']['path'])
        //console.log(a)
        //res.send(files)
        res.redirect("/filemanager")
    });
});

app.post('/handleDelete', function (req, res) {
    data.file[parseInt(req.body.id) - 1] = {}
    if (req.body.id == data.fileInfo.id) {
        data.fileInfo = ""
    }
    res.redirect("/filemanager")
});

app.post('/handleDeleteAll', function (req, res) {
    data = { file: [], fileInfo: "" }
    currentIndex = 1
    res.redirect("/filemanager")
});

app.post('/handleDownload', function (req, res) {

    for (let i = 0; i < data.file.length; i++) {
        if (data.file[i].id == parseInt(req.body.id)) {
            // console.log("OK,pobieram")
            // console.log(data.file[i].path)
            // console.log(typeof (data.file[i].path))
            res.download(data.file[i].path)
        }
    }

});

app.post('/handleInfo', function (req, res) {
    data.fileInfo = data.file[parseInt(req.body.id) - 1]
    console.log(data)
    res.redirect("/info")



});


//nasłuch na określonym porcie

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})