require('dotenv').config()
require('dotenv').config({
    path: require('path').join(__dirname, './../.env')
})
const path = require("path");
const fs = require('fs');
//require('./src/core/event')
//const {Api} = require('api-formatter')
const bodyParser = require('body-parser')
//const router = require('./src/router/index')
const multer = require('multer');
const http = require('http')
const express = require('express');

const cors = require('cors')

const app = require('./src/middleware/app')
// const privateKey = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/private.key','utf8');
// const certificate = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/Certificate.cer', 'utf8');
// const ca = fs.readFileSync('C:/Program Files/OpenSSL-Win64/bin/CA_Bundle.cer', 'utf8');

// let credentials = {
// 	key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };
//app.use(Api.middleware(require('./src/core/config').apiFormater))
//app.use('/',loging,router)
// app.use('/ping',(req,res,next)=>{
//     res.status(200).send('pong')
//     next()
// })
// function loging(req, res, next){
//     console.log(`${require('./src/core/config').date.time()}  ${req.method} : ${req.path}`)
//     next()
// }
//app.use("/Attached", express.static(path.join(__dirname, "./src/Attached")));
app.use(express.static('Attached')); //to access the files in public folder
app.use(cors());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
      cb(null, __dirname + '/src/Attached')
    },
    filename: function (req, file, cb) {
      // let math = ["image/png", "image/jpeg","image/jpg","application/pdf","application/docx"];
      // if (math.indexOf(file.mimetype) === -1) {
      //   let errorMess = `The file <strong>${file.originalname}</strong> loi. file upload là jpeg or png or pdf.`;
      //   return cb(errorMess, null);
      // }
      // console.log(file,cb);
      cb(null, file.originalname)
    }
  })
   
  const upload = multer({ storage: storage });
    app.get('/',function(req,res){
        res.sendFile(__dirname + '/index.html');
      });

      app.post('/uploadfile',upload.single('myFile'),function(req, res) {
        //console.log(req.file)
       // res.send(req.file.name)
        if (!req.file) {
          
          return res.send('file lỗi')
        }
        return res.send('thành công')
       
     
    });


// app.post('/upload', (req, res) => {

//     if (!req.files) {
//         return res.status(500).send({ msg: "file is not found" })
//     }
//         // accessing the file
//     const myFile = req.files.file;

//     //  mv() method places the file inside public directory
//     myFile.mv(`${__dirname}/scr/Attached/${myFile.name}`, function (err) {
//         if (err) {
//             console.log(err)
//             return res.status(500).send({ msg: "Error occured" });
//         }
//         // returing the response with file path and name
//         return res.send({name: myFile.name, path: `/${myFile.name}`});
//     });
// })
// const httpsServer = http.createServer(app1);
// app1.listen(require('./src/core/config').port, () => {
//   console.log('HTTPS Server running on port ' + 3003);
// });
const https = require('https')
const credentials = require('./src/core/credentials')
if (credentials) {
    https.createServer(credentials, app).listen(require('./src/core/config').port, () => {
        console.log(`HTTPS running on port 3003`);
    })
  } 
const server = http.createServer(app).listen(3004, () => {
    console.log(`Server : open port 3004`)
    
})