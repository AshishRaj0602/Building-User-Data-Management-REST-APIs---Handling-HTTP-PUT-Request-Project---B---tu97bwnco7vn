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
        res.status(200).json({status: "success","data": {"users": users}})
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
        let id=Number(req.params.id);
        console.log(id);
        let index=users.findIndex(user=>user._id===id);
        console.log(index)
        if(index===-1){
            return res.status(404).json({
                message: "User Not Found",
                status: "Error",
            });
        }
        let singleUser = users[index];
        console.log(singleUser);
        return res.status(201).json({ "status": "success","data":singleUser})
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
        if(!req.body.name||!req.body.email){
            return res.status(400).json({
                message: "Name or email missing",
                status: "Error",
            });
        }
        let newUser={
            "_id":users.length + 1,
            "name":req.body.name,
            "email":req.body.email
        };
        users.push(newUser);
        fs.writeFile(`${__dirname}/../data/users.json`,JSON.stringify(users),()=>{
            res.status(201).json({

                "status": "success",
              
                "data": {
              
                  "user":newUser
              
                }
              
              });
        })
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
        let id=Number(req.params.id);
        let index=users.findIndex(user=>user._id===id);
        if(index===-1){
            return res.status(404).json({ "status": "Error", "message": "User Not Found" })
        }
        let singleUser = users[index];
        let updatedUser = {
            ...singleUser,
            "name":req.body.name,
        }
        if(req.body.email){
            updatedUser.email = req.body.email;
        }
        users.splice(index, 1, updatedUser);
        fs.writeFile(`${__dirname}/../data/users.json`,JSON.stringify(users),()=>{
            res.status(201).json({

                "status": "success",
              
                "data": {
              
                  "user":users
              
                }
              
              });
        })
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
        let id=Number(req.params.id);
        let index=users.findIndex(user=>user._id===id);
        if(index===-1){
            return res.status(404).json({ "status": "Error", "message": "User Not Found" })
        }
        
        users.splice(index, 1);
        fs.writeFile(`${__dirname}/../data/users.json`,JSON.stringify(users),()=>{
            res.status(201).json({

                "status": "success",
              
                "data": {
              
                  "user":users
              
                }
              
              });
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
