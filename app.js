var restify = require('restify');
var mongojs = require("mongojs");
 
var ip_addr = '127.0.0.1';
var port    =  '8080';
 
var server = restify.createServer({
    name : "myapp"
});

//Setup the server
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

// Setup mongo connections and DB
var connection_string = '127.0.0.1:27017/myapp';
var db = mongojs(connection_string, ['myapp']);
var carts = db.collection("carts");

var PATH = '/cart'
server.get({path : PATH , version : '0.0.1'} , findAllCarts);
server.get({path : PATH +'/:cartId' , version : '0.0.1'} , findCart);
server.post({path : PATH , version: '0.0.1'} ,postNewCart);
server.del({path : PATH +'/:cartId' , version: '0.0.1'} ,deleteCart);

//Start server
server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});

function findAllCarts(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    carts.find().limit(20).sort({postedOn : -1} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }else{
            return next(err);
        }
 
    });
 
}
 
function findCart(req, res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    carts.findOne({_id:mongojs.ObjectId(req.params.cartId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(200 , success);
            return next();
        }
        return next(err);
    })
}
 
function postNewCart(req , res , next){
    var cart = {};
    cart.title = req.params.title;
    cart.description = req.params.description;
    cart.location = req.params.location;
    cart.postedOn = new Date();
 
    res.setHeader('Access-Control-Allow-Origin','*');
 
    carts.save(cart , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(201 , cart);
            return next();
        }else{
            return next(err);
        }
    });
}
 
function deleteCart(req , res , next){
    res.setHeader('Access-Control-Allow-Origin','*');
    carts.remove({_id:mongojs.ObjectId(req.params.cartId)} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(204);
            return next();      
        } else{
            return next(err);
        }
    })
 
}

