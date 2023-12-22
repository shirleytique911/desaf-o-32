const express = require("express");
const path = require("path");
const cartRouter = require("./routes/cartRouter");
const productsRouter = require("./routes/productRouter.js");
const vistaRouter = require("./routes/vistaRouter.js");
const userRouter = require("./routes/usersRouter.js");
const sessionRouter = require("./routes/sessionsRouter.js");
const mailRouter = require("./routes/mailRouter");
const mockingproducts = require("./routes/mockingRouter.js")
const passporConfig = require("./config/passport.config.js");
const { isUtf8 } = require("buffer");
const fs = require("fs");
const socketIo = require("socket.io");
const {Server} = require("socket.io");
const http = require("http");
const handlebars = require('express-handlebars');
const { error } = require("console");
const {default: mongoose} = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require("passport");
const fileStore = require("session-file-store");
const { initializePassport, checkRole } = require("./config/passport.config");
const GitHubStrategy = require("passport-github2");
const cookieParser = require("cookie-parser"); //revisar si funciona
const { Contacts, Users, Carts, Products } = require("./dao/factory");


const app = express()
const server = http.createServer(app)
const io = new Server(server)
global.io = io;
const PORT = 8080


//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());// revisar si funciona

io.on('connection', (socket) => {
    console.log('Done Conect');
  
    socket.emit('conexion-establecida', 'Conexión exitosa con el servidor de Socket.IO');
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
});


server.listen(PORT, ()=>{
    console.log(`servidor corriendo en puerto ${PORT}`)
});

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://shirleytique911:GKZraArQ50QuepXc@cluster0.dvtsniz.mongodb.net/?retryWrites=true&w=majority",
        // mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }, ttl: 3500
    }),
    secret: "clavesecreta",
    resave: false,
    saveUninitialized: true
}));

//uso PASSPORT
initializePassport();

//RUTAS
app.use(passport.initialize())
app.use(passport.session());
app.use("/", cartRouter);
app.use("/", productsRouter); 
app.use("/", vistaRouter);
app.use("/", userRouter);
app.use("/", sessionRouter);
app.use("/", mailRouter);
app.use("/", mockingproducts);



//Configuración de handlebars
app.engine("handlebars", handlebars.engine());

//Usa handlebars como motor de plantillas
app.set("view engine", "handlebars");

//Usa la carpeta views como carpeta de vistas
app.set("views", __dirname + "/views");

//Archivos dentro de la carpeta public
app.use(express.static(path.join(__dirname, "public")));












