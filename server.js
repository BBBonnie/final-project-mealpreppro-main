// import dependencies
const express = require("express");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const path = require("path");
const mongoose = require("mongoose");
const config = require("config");
const Room = require("./models/Rooms");
const message = require("./models/messages");
const User = require("./models/User");
// import handlers
const homeHandler = require("./controllers/home.js");
const roomHandler = require("./controllers/room.js");
const profileHandler = require("./controllers/profile.js");
const loginHandler = require("./controllers/login.js");
const registrationHandler = require("./controllers/registration.js");
const changePassHandler = require("./controllers/changePass.js");
const roomIdGenerator = require("./util/roomIdGenerator");
const app = express();
const port = 3000;
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET="asdaqrgtdsgasiuhgiuoadsjiogfsuhojoiasdijofqeuohfashio"
var currentUserName = ""
var currentUserId = ""

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// If you choose not to use handlebars as template engine, you can safely delete the following part and use your own way to render content
// view engine setup
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      },
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

const db = config.get("mongoURI");
mongoose.connect(db, (err) => {
  if (err) throw err;
  console.log("connected to mongo db");
});
// set up stylesheets route

// TODO: Add server side code

// Create controller handlers to handle requests at each endpoint

app.post('/api/change-password', async (req, res) => {
  const newpassword = req.body.newpassword
  const token = req.body.token
	//const { token, newpassword: plainTextPassword } = req.body

	if (!newpassword || typeof newpassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (newpassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try {
		const user = jwt.verify(token, JWT_SECRET)

		const _id = user.id

		const password = await bcrypt.hash(newpassword, 10)

		await User.updateOne(
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' })
	} catch (error) {
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})
app.get("/api/currentUser", async (req, res) => {
  

  return res.json({
    currentUserName: currentUserName,
    currentUserId:currentUserId
  })

});
app.get("/api/logout", async (req, res) => {
  
  currentUserName=""
  currentUserId=""
  return res.json({
    currentUserName: currentUserName,
    currentUserId:currentUserId
  })

});


app.post('/api/login', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
	//const { username, password } = req.body
	const user = await User.findOne({ userName:username }).lean()
  console.log('gege 11')
	if (!user) {
    console.log('gege 22')
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
    console.log('gege 33')

		const token = jwt.sign(
			{
				id: user._id,
				username: user.userName
			},
			JWT_SECRET
		)
      console.log("okokok ")
    currentUserName = username
    console.log(currentUserName)
    currentUserId = user._id
		return res.json({ status: 'ok', data: token })
	}
  console.log("babddddk ")
	res.json({ status: 'error', error: 'Invalid username/password' })
})
app.post('/api/register', async (req, res) => {
	//console.log(req.body);
  const username = req.body.username
  const plainTextPassword = req.body.password
  console.log("pass: " + plainTextPassword)
  
	//const {username, password: plainTextPassword } = req.body

	if(!username || typeof username !== 'string'){
		return res.json({status:"error", error:"Invalid username"})
	}

	if(!plainTextPassword || typeof plainTextPassword !== "string") {
		return res.json({status:"error", error:"Invalid password"})
	}
	if (plainTextPassword.length < 4 ) {
		return res.json({status:"error", error:"Password is too short"})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)
	// create the user 
	const newUser = new User({
    userName: username,
    password: password,

  });
  const result = await newUser
    .save()
    .then(console.log(newUser),res.json({ status: 'ok' }))
    .catch((err) => console.log("error at create new user"));
})
app.get("/api/profile", async (req, res) => {
  

  try{
    if (currentUserId !=undefined) {
      
    const userProfile = await User.findById(currentUserId).populate(

    );
    if (userProfile != undefined) {
      //console.log("here1h");
      res.json(userProfile);
      //console.log(findRoom.message)
    } else console.log("empty");
    }
    }catch(error) {
      console.log(error)
      return res.json({status:"error"})
    }
});

app.post("/api/profile", async (req, res) => {
  const displayName =req.body.displayName
  const age =req.body.age
  const PhoneNumber =req.body.PhoneNumber
  const Address =req.body.Address
  const Email =req.body.Email
  const Country =req.body.Country
  const Region =req.body.Region
  try{
  if (req.body.displayName !=undefined && currentUserId !=undefined) {
    await User.findByIdAndUpdate(currentUserId, {
      displayName: displayName,
      age: age,
      PhoneNumber: PhoneNumber,
      address: Address,
      email: Email,
      Country: Country,
      Region: Region,

    });
    res.send("message text edited ");
    console.log("message text edited ")
  }
  }catch(error) {
    console.log(error)
    return res.json({status:"error"})
  }

});

app.post("/create", async (req, res) => {
  const newRoom = new Room({
    name: req.body.roomName,
    id: roomIdGenerator.roomIdGenerator(),
  });
  const result = await newRoom
    .save()
    .then(console.log(newRoom))
    .catch((err) => console.log("error at create new room"));

});

app.post("/createMessage", async (req, res) => {
  var current = new Date();
  const newMessage = new message({
    userName: req.body.userName,
    message: req.body.message,
    datetime: current.toLocaleString(),
    votes: 0,
  });
  console.log(req.body.userName);
  const result = await newMessage.save();
  console.log("chereh");
  const findRoom = await Room.findByIdAndUpdate(req.body.id, {
    $push: { message: result._id },
  });
  console.log("chere1h");

});

app.get("/roomMessage", async (req, res) => {
  roomID = req.query.roomID;
  if (roomID === "") return;
  //console.log(req.query.roomID);
  const findRoom = await Room.findById(roomID).populate(
    "message"
    //"userName message
  );
  if (findRoom != undefined) {
    //console.log("here1h");
    res.json(findRoom.message);
    //console.log(findRoom.message)
  } else console.log("empty");

});

// edit message in mongodb
// dual function: either update vote, or update content text
app.patch("/message", async (req, res) => {
  const messageID = req.body.messageID;
  const messageVote = req.body.messageVote;
  const messageText = req.body.messageText;
  console.log("patch called ")
  if (messageID === "" || messageID === undefined) return;

  if (messageText != undefined) {
    await message.findByIdAndUpdate(messageID, {
      message: messageText,
    });
    res.send("message text edited ");
    console.log("message text edited ")
  } else {
    await message.findByIdAndUpdate(messageID, {
      votes: messageVote,
    });
    res.send("message vote edited ");
    console.log("message vote edited ")
  }
});

app.delete("/message", async (req, res) => {
  messageID = req.body.messageID;

  if (messageID === "") return;

  await message.findByIdAndDelete(messageID);
  res.send("message deleted ");
});



//get json of all rooms from db
app.get("/getRoom", function (req, res) {
  Room.find()
    .lean()
    .then((item) => {
      res.json(item);
    });
});

app.get("/", homeHandler.getHome);

app.get("/profile", profileHandler.getProfile);
app.get("/login", loginHandler.getLogin);
app.get("/changePass", changePassHandler.getChangePass);
app.get("/registration", registrationHandler.getRegistration);

app.get("/:roomName", roomHandler.getRoom);

// NOTE: This is the sample server.js code we provided, feel free to change the structures

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
