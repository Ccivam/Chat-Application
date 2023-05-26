require('dotenv').config();
const express=require('express');
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/dynamic-chat-app');


const app=express();

const bodyParser=require('body-parser');

const session=require('express-session');
const {SESSION_SECRET}=process.env;
app.use(session({secret:SESSION_SECRET}));

app.set('view engine','ejs');
app.set('views','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
const http=require('http').Server(app);

const userRoute=require('./routes/userRoute');

const User=require('./models/userModel');
app.use('/',userRoute);

const io=require('socket.io')(http);

var usp=io.of('/user-namespace');

usp.on('connection',async function(socket){
        console.log('User Connected');
       
        var userID=socket.handshake.auth.token;

        await User.findByIdAndUpdate({_id:userID},{$set:{is_online:'1'}});

        socket.broadcast.emit('getOnlineUser',{user_id:userID});  
        socket.on('disconnect',async function(){
                console.log('User Disconnected'); 
                var userID=socket.handshake.auth.token;

                await User.findByIdAndUpdate({_id:userID},{$set:{is_online:'0'}});
                 
                socket.broadcast.emit('getOfflineUser',{user_id:userID});
        

        });
        


});


http.listen(8000,function(){
    console.log('Server is running');
})