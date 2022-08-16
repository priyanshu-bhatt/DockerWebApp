const fs = require('fs');
const express = require("express");
const app= express()
const { exec } = require("child_process")

app.get("/index",(req,res) => {

        res.sendFile(__dirname + "/index.html")
})

//--- LAUNCH CONTAINER CODE -----

app.get("/run",(req,res) => {

const cname= req.query.cname;
const cimage = req.query.cimage;
        exec('docker run -dit --name '+ cname + ' '+ cimage ,(err, stdout, stderr) => {
        res.send("<pre>" +  stdout + "</pre>")
        console.log(stdout)
        })
})

//--- DOCKER INFO CODE -------
app.get("/ps",(req,res) => {
        exec('docker ps -a',(err,stdout,stderr) => {
        res.send("<pre>"+ stdout + "</pre>")
})
})

// --- DELETE NODE CODE -----
app.get("/delete",(req,res) => {
const cname=req.query.cname;
        exec('docker rm -f ' + cname ,(err,stdout,stderr) => {
        res.send("<pre>"+ stdout + "</pre>")
})
})


//---  Docker file CODE ------

app.get("/dockerfile",(req,res) => {
const docker_file_content=req.query.dfile;
        const validation=req.query.vali;
        exec("cat dockerfile && echo '<br /><b>sucessfully created Dockerfile</b>' ",(err,stdout,stderr) => {
                        fs.writeFile('/root/project_mern/dockerfile', docker_file_content.split(";").toString().replaceAll(',', '\n'), err => {
                                        if (err) {
                                        console.error(err);
                                        }})

                                        // file written successfully
console.log(validation);
res.send("<pre>"+ stdout + "</pre>")

})
})

//---- Docker Build -----
app.get("/buildpush",(req,res) => {
        const user_name=req.query.username;
        const pass_word=req.query.password;
        const image_name=req.query.imagename;
        const version_number=req.query.version;
        exec('docker  build -t '+ user_name +'/'+ image_name +':'+ version_number +' . '+'&& docker push '+user_name+'/'+image_name+':'+version_number ,(err,stdout,stderr) => {
                console.log(user_name)
                console.log(pass_word)
                console.log(version_number)
                console.log(image_name)
        res.send("<pre>"+ stdout + "</pre>")
})
})

// -- DOCKER IMAGES VIEW ----

app.get("/images",(req,res) => {
        exec('docker images',(err,stdout,stderr) => {
        res.send("<pre>"+ stdout + "</pre>")
})
})


// ---- BASIC LINUX -------
app.get("/linux",(req,res) => {
         const cmd=req.query.command;

        exec(cmd + "| head -n 15",(err,stdout,stderr) => {
                console.log(stdout)
        res.send("<pre>"+ stdout + "</pre>")
})
})



app.listen(3000,() => { console.log("container ap started")})
                                                    
