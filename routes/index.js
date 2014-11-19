var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');
var validator = require('validator');
 
/* Mostramos el formualario para crear usuarios nuevos */
router.get('/', function(req, res)
{
  // res.render('index', { title: 'Servicio rest con nodejs, express 4 y mysql'});
  res.redirect("/users/");
});

router.get('/users/create', function(req, res)
{
  res.render('index', { title: 'Servicio rest con nodejs, express 4 y mysql', data: null});
  // res.redirect("/users/");
});
 
/* Creamos un nuevo usuario */
router.post("/user", function(req,res)
{
    //creamos un objeto con los datos a insertar del usuario
    var userData = {
        id : null,
        username : req.body.username,
        email : req.body.email,
        password : req.body.password,
        created_at : null
    };
    
    //validate

    //username
    username = validator.isLength(userData.username, 6, 250); 
    UserModel.uniqueUsername(userData.username, function(error, data)
    {
        if (data.msg[0].count != 0) {
            console.log("EXIST");
            // req.data("exist");
            // res.render('index');
            res.render('index', { title: 'Servicio rest con nodejs, express 4 y mysql', data: 'exist'});
        } else {
            console.log("UNIQUE");
        }
    });
    // //email
    email = validator.isEmail(userData.email);

    UserModel.insertUser(userData,function(error, data)
    {
        //si el usuario se ha insertado correctamente mostramos un 
        // mensaje y redireccionados a todos los usuarios
        if(data && data.insertId)
        {
            //res.redirect("/users/");
            //res.render('index', { title: 'Servicio rest con nodejs, express 4 y mysql', data: null});
            UserModel.getUsers(function(error, data)
            {
                //si existe el usuario mostramos el formulario
                if (typeof data !== 'undefined')
                {
                    req.flash('info', 'Usuario añadido correctamente.');
                    res.render("show",{
                        title : "Servicio rest con nodejs, express 4 y mysql",
                        users : data
                    });
                }
                //en otro caso mostramos un error
                else
                {
                    res.json(404,{"msg":"notExist"});
                }
            });
        }
        else
        {
            console.log("error");
            res.json(500,{"msg":"Error"});
        }
    });
});
 
/* Actualizamos un usuario existente */
router.put('/user/', function(req, res)
{
    //almacenamos los datos del formulario en un objeto
    var userData = {id:req.param('id'),username:req.param('username'),email:req.param('email')};
    UserModel.updateUser(userData,function(error, data)
    {
        //si el usuario se ha actualizado correctamente mostramos un mensaje
        if(data && data.msg)
        {
            req.flash('info', 'Usuario editado correctamente.');
            res.redirect("/users/");
        }
        else
        {
            res.json(500,{"msg":"Error"});
        }
    });
});
 
/* Obtenemos un usuario por su id y lo mostramos en un formulario para editar */
router.get('/user/:id', function(req, res)
{
    var id = req.params.id;
    //solo actualizamos si la id es un número
    if(!isNaN(id))
    {
        UserModel.getUser(id,function(error, data)
        {
            //si existe el usuario mostramos el formulario
            if (typeof data !== 'undefined' && data.length > 0)
            {
                res.render("update",{
                    title : "Servicio rest con nodejs, express 4 y mysql",
                    info : data
                });
            }
            //en otro caso mostramos un error
            else
            {
                res.json(404,{"msg":"notExist"});
            }
        });
    }
    //si la id no es numerica mostramos un error de servidor
    else
    {
        res.json(500,{"msg":"The id must be numeric"});
    }
});
 
/* Obtenemos y mostramos todos los usuarios */
router.get('/users/', function(req, res)
{
    UserModel.getUsers(function(error, data)
    {
        //si existe el usuario mostramos el formulario
        if (typeof data !== 'undefined')
        {
            res.render("show",{
                title : "Servicio rest con nodejs, express 4 y mysql",
                users : data
            });
        }
        //en otro caso mostramos un error
        else
        {
            res.json(404,{"msg":"notExist"});
        }
    });
});
 
/* ELiminamos un usuario */
router.delete("/user/", function(req, res)
{
    //id del usuario a eliminar
    var id = req.param('id');
    UserModel.deleteUser(id,function(error, data)
    {
        if(data && data.msg === "deleted" || data.msg === "notExist")
        {
            req.flash('info', 'Usuario borrado correctamente.');
            res.redirect("/users/");
        }
        else
        {
            res.json(500,{"msg":"Error"});
        }
    });
})
 
module.exports = router;