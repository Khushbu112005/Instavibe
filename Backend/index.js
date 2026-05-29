require("dotenv").config();
let express = require("express");
let multer = require("multer");
let { MongoClient, ObjectId } = require("mongodb");
let path = require("path");
let fs = require("fs");
let cors = require("cors");
let cloudinary = require("cloudinary").v2;
let { CloudinaryStorage } = require("multer-storage-cloudinary");
let bcrypt = require("bcrypt");
let jwt = require("jsonwebtoken");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ status: "InstaVibe API is running 🚀", routes: ["/signup", "/login", "/upload", "/files", "/delete/:id"] });
});

// let storage = multer.diskStorage(
// {
// destination: (req,file,cb) => cb(null,"uploads/"),
// filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// }
// );

let storage = new CloudinaryStorage({cloudinary});
let dalal = multer({storage});


const url = process.env.MONGO_URI || "mongodb://0.0.0.0:27017";

const JWT_SECRET = process.env.JWT_SECRET || "instavibe_super_secret_key_123";

// Seed admin user on startup
const seedAdmin = async () => {
    try {
        let client = new MongoClient(url);
        let db = client.db("insta");
        let users = db.collection("users");

        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        let existingAdmin = await users.findOne({ username: adminUsername });
        if (!existingAdmin) {
            let hashedPassword = await bcrypt.hash(adminPassword, 10);
            await users.insertOne({ username: adminUsername, password: hashedPassword, isAdmin: true });
            console.log(`✅ Admin user '${adminUsername}' created successfully`);
        } else if (!existingAdmin.isAdmin) {
            await users.updateOne({ username: adminUsername }, { $set: { isAdmin: true } });
            console.log(`✅ Admin flag set for '${adminUsername}'`);
        } else {
            console.log(`✅ Admin user '${adminUsername}' already exists`);
        }
        await client.close();
    } catch (err) {
        console.error("❌ Error seeding admin:", err.message);
    }
};
seedAdmin();

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(403).send("A token is required for authentication");
    try {
        token = token.replace("Bearer ", "");
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

app.post("/signup", async (req, res) => {
    try {
        let client = new MongoClient(url);
        let db = client.db("insta");
        let users = db.collection("users");
        
        let { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send("Username and password are required");
        }

        let existingUser = await users.findOne({ username });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        await users.insertOne({ username, password: hashedPassword, isAdmin: false });
        
        res.status(201).send("User registered successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        let client = new MongoClient(url);
        let db = client.db("insta");
        let users = db.collection("users");
        
        let { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send("Username and password are required");
        }

        let user = await users.findOne({ username });
        if (!user) {
            return res.status(400).send("Invalid credentials");
        }

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }

        let token = jwt.sign({ username: user.username, isAdmin: user.isAdmin || false }, JWT_SECRET, { expiresIn: "24h" });
        res.json({ token, username: user.username, isAdmin: user.isAdmin || false });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/upload", verifyToken, dalal.single("file"),(req,res) => 
{
    let client = new MongoClient(url);
    let db = client.db("insta");
    let collec = db.collection("photos");
    let obj = {
        username: req.user.username,
        caption: req.body.caption,
        file_url: req.file.path,
        file_name: req.file.filename,
        upload_time: new Date()
    }
    collec.insertOne(obj)
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
})


app.get("/files", verifyToken, (req, res) => {
  let client = new MongoClient(url);
  let username = req.query.username;
  let obj = username?{username}:{};
      let db = client.db("insta");
      let collec= db.collection("photos");
      collec.find(obj).toArray()
    .then((result) => res.json(result))
    .catch((err) => {
      res.send(err);
    })
});

app.delete("/delete/:id", verifyToken, (req,res) => {
    let client = new MongoClient(url);
    let db = client.db("insta");
    let collec = db.collection("photos");
    let id = req.params.id; 
    let _id = new ObjectId(id);
    collec.findOne({_id})
    .then((obj) =>{
      if (!obj) return res.status(404).send("Photo not found");
      if (obj.username !== req.user.username && !req.user.isAdmin) return res.status(403).send("Unauthorized");
      // fs.promises.unlink(`uploads/${obj.file_name}`);
      cloudinary.uploader.destroy(obj.file_name);
      return collec.deleteOne({_id});
    })
    .then((result) => res.send(result))
    .catch((err) => res.send(err));
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
