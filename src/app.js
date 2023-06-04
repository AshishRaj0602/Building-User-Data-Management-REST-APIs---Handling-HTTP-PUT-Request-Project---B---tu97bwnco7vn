const express = require("express");
const fs = require("fs");
const app = express();

// Parsing user data from user.json 
const users = JSON.parse(fs.readFileSync(`${__dirname}/../data/users.json`));

app.use(express.json());

/*
Write a GET Request to return all users. 
The response should be in the following format: 
{
    "status": "success",
    "data": {
        "users": [
            {
                "_id": 1,
                "name": "James B",
                "email": "jamesb@example.com"
            },
            ...
        ]
    }
}*/
app.get("/api/v1/users/", (req, res) => {
    try {
        //Write your code here.
        res.status(201).json({
            status:'success',
            data:{
                users
            }
        })
    } catch (err) {
        res.status(404).json({
            message: "Users Not Found",
            status: "Error",
            error: err,
        });
    }
});


/*
Write a GET Request to return a user by ID. 
The response should be in the following format: 
{
    "status": "success",
    "data": {
        "user": {
            "_id": 1,
            "name": "James B",
            "email": "jamesb@example.com"
        }
    }
}
Return 404 error when user is not found. 
*/
app.get("/api/v1/users/:id", (req, res) => {
    try {
        const user = users.find((obj)=>obj._id == req.params.id);
        if(!user){
            return res.status(404).json({
                status:'Error',
                message:'User Not Found'
            })
        }
            res.status(201).json({
                status:'success',
                data:{
                    user:user
                }
            })
    } catch (err) {
        res.status(400).json({
            message: "User Fetching Failed",
            status: "Error",
            error: err,
        });
    }
});


/*
Write a POST request to create a new User. 
The response should be in the following format: 
{
    "status": "success",
    "data": {
        "user": {
            "_id": 5,
            "name": "Someone Someone",
            "email": "someone@gmail.com"
        }
    }
}
Generate a new id using the id of the last user in the database, increment it by 1
Return a 400 error when the email or name is missing 
*/
app.post("/api/v1/users/", (req, res) => {
    try {
        //Write your code here
        const {name,email} = req.body;

        if(!name){
            return res.status(400).json({
                message:'Name Missing',
                status:'Error'
            })
        }

        if(!email){
            return res.status(400).json({
                message:'Email Missing',
                status:'Error'
            })
        }

        const new_id = users[users.length-1]._id + 1;
        const new_user = {_id:new_id,name,email};
        users.push(new_user);

        fs.writeFile(`${__dirname}/../data/users.json`,JSON.stringify(users),(err)=>{
            res.status(201).json({
                status:'success',
                data:{
                    user:new_user
                }
            })
        });

    } catch (err) {
        res.status(400).json({
            message: "User Creation failed",
            status: "Error",
        });
    }
});

/*
Write a PATCH request to update user's name or email. 
The response should be in the following format: 
{
    "status": "success",
    "data": {
        "users": [
            {
                "_id": 1,
                "name": "James A",
                "email": "jamesA@example.com"
            },
            {
                "_id": 2,
                "name": "James B",
                "email": "jamesb@example.com"
            }, ....
        ]
    }
}
req.body can contain both name and email as well. Update the data based on the parameters recieved in req.body
Return a 404 error if the user is missing, with the following message 
{
    "message": "User not Found"
}
*/
app.patch("/api/v1/users/:id", (req, res) => {
    try {
        //Write your code here.
        const {name,email} = req.body;
        for(let i in users){
            if(users[i]._id == req.params.id){
                users[i].name = name || users[i].name;
                users[i].email = email || users[i].email;

                fs.writeFile(`${__dirname}/../data/users.json`,JSON.stringify(users),(err)=>{
                    return res.status(201).json({
                        status:'success',
                        data:{
                            users
                        },
                    });
                })
            }
            else{
                res.status(404).json({
                    message: "User Not Found",
                    status: "Error"
                });
            }
        }
   
            
        
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "User Updation Failed",
            status: "Error",
            error: err,
        });
    }
});

/*
Write a DELETE request to delete the user from the users.json
The response should be in the following format: 
{
    "status": "success",
    "data": {
        "users": [
            {
                "_id": 1,
                "name": "James A",
                "email": "jamesA@example.com"
            },
            {
                "_id": 2,
                "name": "James B",
                "email": "jamesb@example.com"
            }, .... // Shouldn't have the user deleted.
        ]
    }
}

Return a 404 error if the user is missing, with the following message 
{
    "message": "User not Found"
}
*/
app.delete("/api/v1/users/:id", (req, res) => {
    try {
        //Write your code here.
        const object = users.find((obj)=>obj._id == req.params.id);
        if(!object){
            return res.status(404).json({
                status:'Error',
                message:'User not Found'
            })
        }
        const filterUsers = users.filter((item)=>item._id!=req.params.id);

        fs.writeFile(`${__dirname}/../data/users.json`,JSON.stringify(filterUsers),(err)=>{
            res.status(201).json({
                status:'success',
                data:{
                    users:filterUsers
                }
            })
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "User Deletion Failed",
            status: "Error",
            error: err,
        });
    }
});

module.exports = app;
