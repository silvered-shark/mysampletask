var express = require('express');
var mongo = require('mongojs');
var http = require('http');
var url = require('url');


var db = mongo('mongodb://Luthrasaab:p869p8699@ds255958.mlab.com:55958/mysampletask',['users']);
var router = express.Router();

//to find all users
router.get('/users',function(req,res,next) {
      
    
    db.users.find().count(function(err, count){
      
      //console.log("Number of docs: ", count );
       
      var pages = parseInt(count/5)+1;
      //console.log(pages);

      var page = req.query.page;
      var limit = req.query.limit ? (req.query.limit):5;  //default limit is 5
      
      var sorter = req.query.sort;
      var name = req.query.name?(req.query.name):"";    //default name is empty string
       
      var qs = { first_name: new RegExp('^' + name) };
      
      //sort the results according to user's id,age,first_name or last_name(can add more options for sorting documents)
      if(sorter=="-age"){
      //console.log(name);
     
      db.users.find(qs)  
                  .skip(page>0?(((page-1)*limit)):0)
                  .limit(parseInt(limit))
                  .sort({age: -1})
                  .toArray(function(err,users){
          	
            	res.send(users);
              res.status(200);          
        
        });
    }else if(sorter=="-first_name"){
          db.users.find(qs)
                  .skip(page>0?(((page-1)*limit)):0)
                  .limit(parseInt(limit))
                  .sort({first_name: -1})
                  .toArray(function(err,users){
         
              res.send(users);
              res.status(200);          
            
            });
          
      }else if(sorter=="-last_name"){
            db.users.find(qs)
                  .skip(page>0?(((page-1)*limit)):0)
                  .limit(parseInt(limit))
                  .sort({last_name: -1})
                  .toArray(function(err,users){
            
              res.send(users);
              res.status(200);          
            
            });
         
      }else if(sorter=="age"){

            db.users.find(qs)
                  .skip(page>0?(((page-1)*limit)):0)
                  .limit(parseInt(limit))
                  .sort({age: 1})
                  .toArray(function(err,users){
            
              res.send(users);
              res.status(200);          
            
            });
          
      }else if(sorter=="first_name"){
            db.users.find(qs)
                  .skip(page>0?(((page-1)*limit)):0)
                  .limit(parseInt(limit))
                  .sort({first_name: 1})
                  .toArray(function(err,users){
            
              res.send(users);
              res.status(200);          
            
            });
         
      }else if(sorter=="-id"){
            db.users.find(qs)
                  .skip(page>0?(((page-1)*limit)):0)
                  .limit(parseInt(limit))
                  .sort({id: -1})
                  .toArray(function(err,users){
            
              res.send(users);
              res.status(200);          
            
            });
         
      }else if(sorter=="id"){
        db.users.find(qs)
                  .skip(page>0?(((page-1)*limit)):0)
                  .limit(parseInt(limit))
                  .sort({id: 1})
                  .toArray(function(err,users){
            
              res.send(users);
              res.status(200);          
            
            });
         
      }
      else{
            db.users.find(qs)
                  .skip(page>0?(((page-1)*limit)):0)
                  .limit(parseInt(limit))
                  .sort({last_name: 1})
                  .toArray(function(err,users){
            
              res.send(users);
              res.status(200);          
            
            });
        
      }



      });
    
    
});


//to find details of single user
router.get('/users/:id',function(req,res,next) {
	
      db.users.findOne({_id: mongo.ObjectId(req.params.id)},function(err,user){
      
         //res.send(req.param.id);

      	if(err){
      		res.send("User does not exist");
      	}
      	res.json(user);
      });
});

//to create a single user in a database
router.post('/users',function(req,res,next) {
	
   
	var payload = {
		    "id": req.body.id,
    "first_name": req.body.first_name,
    "last_name": req.body.last_name,
    "company_name": req.body.company_name,
    "city": req.body.city,
    "state": req.body.state,
    "zip": req.body.zip,
    "email": req.body.email,
    "web": req.body.web,
    "age": req.body.age,
    
	};
	
    
      db.users.save(payload,function(err,user){
      	
         //res.send(req.param.id);
      	if(err){
      		res.send(err);
      	}
      	res.sendStatus(201);
      });
  
});

//to delete a user
router.delete('/users/:id',function(req,res,next) {
	
      db.users.remove({_id: mongo.ObjectId(req.params.id)},function(err,user){
      	
         //res.send(req.param.id);
      	if(err){
      		res.send(err);
      	}
      	res.sendStatus(200);
      	res.json(user);
      });
});

//to update a user
router.put('/users/:id',function(req,res,next) {
	
		var payload = {
			"first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "age": req.body.age
        };

      if(payload.first_name==" " || payload.last_name==" "){
      	res.status(400);
      	res.json({
      		"error":"Incorrect Data"
      	});
      }

      else{
	      db.users.update({_id: mongo.ObjectId(req.params.id)},payload,function(err,user){
	      	
	         //res.send(req.param.id);
	      	if(err){
	      		res.send(err);
	      	}
	      	res.sendStatus(200);
	      	res.json(user);
	      });
      }
});


module.exports = router;