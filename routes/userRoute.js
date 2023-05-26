const express=require('express');
const user_route=express.Router();

user_route.use(express.static('public'));
const path=require('path');
const multer=require('multer');

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/images'));
    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const upload=multer({storage:storage});

const userController=require('../controllers/userContoller');

const auth=require('../middlewares/auth');

user_route.get('/register',auth.isLogout,userController.registerLoad);
user_route.post('/register',upload.single('image'),userController.register);

user_route.get('/',auth.isLogout,userController.loadlogin);
user_route.post('/',userController.login);
user_route.get('/logout',auth.isLogin ,userController.logout);

user_route.get('/dashboard',auth.isLogin,userController.loadDashboard);
user_route.post('/save-chat',userController.saveChat);



module.exports=user_route;
