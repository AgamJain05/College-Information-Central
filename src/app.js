import bcrypt from 'bcrypt'
import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser"
import User from './models/user.models.js';
import { nanoid } from 'nanoid'
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import admin from 'firebase-admin'
import Blog from './models/blog.models.js';
import Comment from './models/comment.models.js';
import Notification from './models/notifications.models.js';
import linkRoutes from './routes/link.routes.js';
import cloudinary from 'cloudinary';
// import serviceAccountkey from "./college-central-website-firebase-adminsdk-owwn4-e692d33373.json" assert { type: "json" }
import serviceAccountKey from './serviceAccountKey.js';
import { getAuth } from "firebase-admin/auth";

import { CloudinaryStorage } from 'multer-storage-cloudinary';




const app = express();
app.use(cors())


// Allowing Multiple Origins

// const allowedOrigins = [
//     'http://', // Local development on PC
//     'http://' // Access from mobile device
//   ];
  
//   app.use(cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     }
//   }));



// app.use(cors({
//     origin: '', // Replace with your frontend's IP address and port
//   }));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))


//Feature 1: Only college students can make this website
// let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let emailRegex = /^\w+([\.-]?\w+)*@ietdavv\.edu\.in$/;

let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/api/links', linkRoutes);


// Cloudinary setup


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'college', // Specify the folder name in Cloudinary
      format: async (req, file) => 'png', // Set file format
      public_id: (req, file) => 'computed-filename-using-file', // Use file details to set a unique name
    },
  });
// const generateUploadURL = async (file) => {
//     try {
//         const result = await cloudinary.uploader.upload(file.path, {
//             resource_type: 'image',
//             folder: 'college',
//         });

//         return result.secure_url;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
        return res.status(401).json({ error: "No access token" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({ error: "Access token is invalid" });
        }
        req.user = user;
        next();
    });
}

const formatDataToSend = (user) => {
    return {
        access_token: jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET),
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    };
}



const generateUsername = async (email) => {
    let username = email.split("@")[0]
    let isUniqueUsername = await User.exists({ "personal_info.username": username }).then(result => result)
    isUniqueUsername ? username += nanoid().substring(0, 5) : ""
    return username;
}
// const parser = multer({ storage: storage });

// app.post('/upload', parser.single('image'), (req, res) => {
//     if (req.file) {
//       // File is uploaded successfully
//       res.json({ url: req.file.path });
//     } else {
//       // Handle the error if the file wasn't uploaded
//       res.status(500).json({ error: 'File upload failed' });
//     }
//   });
// app.get('/get-upload-url', (req, res) => {
//     const form = new IncomingForm();
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         // Assuming the image is the first file
//         const file = files.image.path;
//     cloudinary.v2.uploader.upload(file, (error, result) => {
//       if (error) {
//         res.status(500).json({ error: 'Cloudinary upload error' });
//         return;
//       }
//       res.json({ url: result.secure_url });
//     });
//     });
// });
// app.get('/get-upload-url', upload.single('image'), async (req, res) => {
//     try {
//         const imageUrl = await generateUploadURL(req.file);
//         console.log(imageUrl);
//         res.status(200).json({ imageUrl });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
// app.post('/get-upload-url', upload.single('image'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }
//         const filePath = req.file.path;
//         const url = await generateUploadURL(filePath);
//         res.status(200).json({ imageUrl: url });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
app.post('/signup', (req, res) => {
    // console.log(req.body)
    let { fullname, email, password } = req.body;
    // Form Validation
    if (fullname) {
        if (fullname.length < 3) {
            return res.status(400).json({ "error": "Full Name must be at least 3 characters long" });
        }
    }
    if (!email.length) {
        return res.status(400).json({ "error": "Enter Email" });

    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ "error": "Enter your college email address" });

    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({ "error": "Password must contain at least 6 to 20 characters one uppercase, one lowercase, one number and one special character" });
    }

    bcrypt.hash(password, 10, async (err, hashPassword) => {
        let username = await generateUsername(email)
        let user = new User({
            personal_info: {
                fullname,
                email,
                password: hashPassword,
                username
            }
        })
        user.save()
            .then(u => {
                return res.status(200).json(formatDataToSend(u))
            })
            .catch(err => {
                if (err.code === 11000) {
                    return res.status(400).json({ "error": "Email already exists" })
                }
                return res.status(500).json({ "error": "Server Error" })
            })



    }
    )
})


app.post('/signin', (req, res) => {
    let { email, password } = req.body
    User.findOne({ "personal_info.email": email })
        .then(user => {
            if (!user) {
                return res.status(403).json({ "error": "Email not found" })
            }

            bcrypt.compare(password, user.personal_info.password, (err, result) => {

                if (err) {
                    return res.status(403).json({ "error": "Error occured while login please try again" });
                }

                if (!result) {
                    return res.status(403).json({ "error": "Incorrect password" })
                } else {
                    return res.status(200).json(formatDataToSend(user))
                }
            })

        })
        .catch(err => {

            console.log(err.message)
            return res.status(500).json({ "error": err.message })
        })

})

app.post("/google-auth", async (req, res) => {
    let { access_token } = req.body;
    getAuth().verifyIdToken(access_token)
        .then(async (decodedUser) => {
            let { email, name, picture } = decodedUser;
            picture = picture.replace("s96-c", "s384-c");
            let user = await User.findOne({"personal_info.email": email}).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
                return u || null
            })
            .catch(err => {
                return res.status(500).json({ "error": err.message })
            });

            if (user) { // login
                if (!user.google_auth) {
                    return res.status(403).json({ "error": "This email was signed up without google. Please log in with password to access the account" });
                }
            } else { // sign up
                let username = await generateUsername(email);
                user = new User({
                    personal_info: { fullname: name, email, username },
                    google_auth: true
                });

                await user.save()
                    .then((u) => {
                        user = u;
                    })
                    .catch(err => {
                        return res.status(500).json({ "error": err.message });
                    });
            }
            res.status(200).json(formatDataToSend(user));
        })
        .catch(err => {
            return res.status(500).json({ "error": "failed to authenticate with google" });
        });
});

// Changed in pagination to post from get
app.post("/latest-blogs", (req, res) => {
    let {page} = req.body;
    let maxLimit = 5;

    Blog.find({ draft: false })
    .sort({ "publishedAt": -1 })
    .limit(maxLimit)
    .populate("author", "personal_info.username personal_info.profile_img personal_info.fullname-_id")
    .select(" blog_id title des banner tags activity publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .then(blogs => {
        return res.status(200).json({blogs});
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
})
app.post("/all-latest-blogs-count", (req, res) => {

    Blog.countDocuments({ draft: false })
    .then(count => {
        return res.status(200).json({totalDocs:count});
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });

})


app.get("/trending-blogs", (req, res) => {
    
    Blog.find({ draft: false })
    .sort({ "activity.total_likes": -1 ,"activity.total_read": -1  ,"publishedAt": -1})
    .limit(5)
    .populate("author", "personal_info.username personal_info.profile_img personal_info.fullname-_id")
    .select(" blog_id title publishedAt -_id")
    .then(blogs => {
        return res.status(200).json({blogs});
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
})
app.post("/search-users", (req, res) => {
    let { query } = req.body;
    let maxLimit = 50;

    // Check if query is provided and not empty
    // if (!query || query.trim() === "") {
    //     return res.status(200).json({ users: [] });
    // }

    User.find({"personal_info.username": new RegExp(query, 'i') })
        .limit(maxLimit)
        .select("personal_info.username personal_info.fullname personal_info.profile_img-_id")
        .then(users => {
            return res.status(200).json({ users });
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});

app.post("/get-profile", (req, res) => {
    let { username } = req.body;

    User.findOne({ "personal_info.username": username })
        .select("-personal_info.password -google_auth -blogs -updatedAt")
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json(user);
        })
        .catch(err => {
            return res.status(500).json({ error: err.message });
        });
});


app.post("/search-blogs", (req, res) => {
    let { tag , query, page ,author , eliminate_blog} = req.body;
    let findQuery;

    if(tag){
        findQuery = { tags: tag , draft: false , blog_id: { $ne: eliminate_blog } };
    } else if(query) {
        findQuery = { title: new RegExp(query , 'i'), draft: false };
    }
    else if(author){
        findQuery = { author, draft: false };
    }
    let maxLimit = 2;
    Blog.find(findQuery)
    .sort({ "publishedAt": -1 })
    .limit(maxLimit)
    .populate("author", "personal_info.username personal_info.profile_img personal_info.fullname-_id")
    .skip((page - 1) * maxLimit)
    .select("blog_id title des banner tags activity publishedAt -_id")
    .then(blogs => {
        return res.status(200).json({blogs});
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });
})

app.post("/search-blogs-count", (req, res) => {
    let { tag ,query ,author } = req.body;
   let findQuery;
    if(tag){
        findQuery = { tags: tag , draft: false };
    } else if(query) {
        findQuery = { title: new RegExp(query , 'i'), draft: false };
    }
    else if(author){
        findQuery = { author, draft: false };
    }
    Blog.countDocuments(findQuery)
    .then(count => {
        return res.status(200).json({totalDocs:count});
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    });

})
app.post("/create-blog", verifyJWT ,(req, res) => {
    console.log("req.user:", req.user); // Log the req.user object to understand its structure
    let authorId = req.user.id;
    let { title, des ,banner,tags ,content ,draft ,id } = req.body;
    console.log("Received banner:", req.body.banner); // Log the banner data
    if(!title.length) {
        return res.status(403).json({ error: "You must Provide a title" });
    }
    
    if(!draft){
        if(!des.length || des.length > 100) {
            return res.status(403).json({ error: "You must Provide a Blog Description under 100 characters" });
        }
        if(!banner.length) {
            return res.status(400).json({ error: "Banner is required" });
        }
        if(!tags.length || tags.length > 10) {
            return res.status(403).json({ error: "Tags are required, Max 10" });
        }
        if(!content.blocks.length) {
            return res.status(403).json({ error: "Content is required" });
        }
    }
   

    tags= tags.map(tag => tag.toLowerCase());
    let blog_id = id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\+/g, "-").trim() + nanoid();
    if(id){

        Blog.findOneAndUpdate({ blog_id }, { title, des, banner, content, tags, draft: draft ? draft : false })
        .then(() => {
            return res.status(200).json({ id: blog_id });
        })
        .catch(err => {
            return res.status(500).json({ error: "Failed to update total posts number" })
        })

    } else{

        let blog = new Blog({
            title, des, banner, content, tags, author: authorId, blog_id, draft: Boolean(draft)
        })


    blog.save().then(blog => {
        let incrementVal = draft ? 0 : 1;
        User.findOneAndUpdate({_id:authorId}, { $inc: { "account_info.total_posts": incrementVal } , $push: { "blogs": blog._id } })
            .then(user => {
                return res.status(200).json({ id: blog.blog_id});
            })
            .catch(err => {
                return res.status(500).json({ error: "failed to update total post number" });
            });
    })

       .catch(err => {
        return res.status(500).json({ error: err.message }); 
    })
    }
})



app.post("/get-blog", (req, res) => {

    let { blog_id, draft, mode } = req.body;

    let incrementVal = mode != 'edit' ? 1 : 0;

    Blog.findOneAndUpdate({ blog_id }, { $inc : { "activity.total_reads": incrementVal } })
    .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title des content banner activity publishedAt blog_id tags")
    .then(blog => {

        User.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, { 
            $inc : { "account_info.total_reads": incrementVal }
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })

        if(blog.draft && !draft){
            return res.status(500).json({ error: 'you can not access draft blogs' })
        }

        return res.status(200).json({ blog });

    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    })

})


app.post("/like-blog", verifyJWT, (req, res) => {

    let user_id = req.user.id;

    let { _id, islikedByUser } = req.body;

    let incrementVal = !islikedByUser ? 1 : -1;

    Blog.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementVal } })
    .then(blog => {

        if(!islikedByUser){
            let like = new Notification({
                type: "like",
                blog: _id,
                notification_for: blog.author,
                user: user_id
            })

            like.save().then(notification => {
                return res.status(200).json({ liked_by_user: true })
            })
        } else{

            Notification.findOneAndDelete({ user: user_id, blog: _id, type: "like" })
            .then(data => {
                return res.status(200).json({ liked_by_user: false })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message });
            })

        }

    })

})

app.post("/isliked-by-user", verifyJWT, (req, res) => {
    
    let user_id = req.user.id;

    let { _id } = req.body;

    Notification.exists({ user: user_id, type: "like", blog: _id })
    .then(result => {
        return res.status(200).json({ result }) 
    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })

}) 

app.post("/add-comment", verifyJWT, (req, res) => {

    let user_id = req.user.id;

    let { _id, comment, blog_author, replying_to, notification_id } = req.body;

    if(!comment.length) {
        return res.status(403).json({ error: 'Write something to leave a comment' });
    }

    // creating a comment doc
    let commentObj = {
        blog_id: _id, blog_author, comment, commented_by: user_id,
    }

    if(replying_to){
        commentObj.parent = replying_to;
        commentObj.isReply = true;
    }

    new Comment(commentObj).save().then(async commentFile => {

        let { comment, commentedAt, children } = commentFile;

        Blog.findOneAndUpdate({ _id }, { $push: { "comments": commentFile._id }, $inc : { "activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1 },  })
        .then(blog => { console.log('New comment created') });

        let notificationObj = {
            type: replying_to ? "reply" : "comment",
            blog: _id,
            notification_for: blog_author,
            user: user_id,
            comment: commentFile._id
        }

        if(replying_to){

            notificationObj.replied_on_comment = replying_to;

            await Comment.findOneAndUpdate({ _id: replying_to }, { $push: { children: commentFile._id } })
            .then(replyingToCommentDoc => { notificationObj.notification_for = replyingToCommentDoc.commented_by })

            if(notification_id){
                Notification.findOneAndUpdate({ _id: notification_id }, { reply: commentFile._id })
                .then(notificaiton => console.log('notification updated'))
            }

        }

        new Notification(notificationObj).save().then(notification => console.log('new notification created'));

        return res.status(200).json({
            comment, commentedAt, _id: commentFile._id, user_id, children
        })

    })


}) 

app.post("/get-blog-comments", (req, res) => {

    let { blog_id, skip } = req.body;

    let maxLimit = 5;

    Comment.find({ blog_id, isReply: false })
    .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
    .skip(skip)
    .limit(maxLimit)
    .sort({
        'commentedAt': -1
    })
    .then(comment => {
        console.log(comment, blog_id, skip)
        return res.status(200).json(comment);
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ error: err.message })
    })

})
app.post("/get-replies", (req, res) => {

    let { _id, skip } = req.body;

    let maxLimit = 5;

    Comment.findOne({ _id })
    .populate({
        path: "children",
        options: {
            limit: maxLimit,
            skip: skip,
            sort: { 'commentedAt': -1 }
        },
        populate: {
            path: 'commented_by',
            select: "personal_info.profile_img personal_info.fullname personal_info.username"
        },
        select: "-blog_id -updatedAt"
    })
    .select("children")
    .then(doc => {
        console.log(doc);
        return res.status(200).json({ replies: doc.children })
    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })

})

app.post("/notifications", verifyJWT, (req, res) => {
    let user_id = req.user.id;

    let { page, filter, deletedDocCount } = req.body;

    let maxLimit = 10;

    let findQuery = { notification_for: user_id, user: { $ne: user_id } };

    let skipDocs = ( page - 1 ) * maxLimit;

    if(filter != 'all'){
        findQuery.type = filter;
    }

    if(deletedDocCount){
        skipDocs -= deletedDocCount;
    }

    Notification.find(findQuery)
    .skip(skipDocs)
    .limit(maxLimit)
    .populate("blog", "title blog_id")
    .populate("user", "personal_info.fullname personal_info.username personal_info.profile_img")
    .populate("comment", "comment")
    .populate("replied_on_comment", "comment")
    .populate("reply", "comment")
    .sort({ createdAt: -1 })
    .select("createdAt type seen reply")
    .then(notifications => {

        Notification.updateMany(findQuery, { seen: true })
        .skip(skipDocs)
        .limit(maxLimit)
        .then(() => console.log('notification seen'));

        return res.status(200).json({ notifications });

    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    })

})

app.post("/all-notifications-count", verifyJWT, (req, res) => {

    let user_id = req.user.id;

    let { filter } = req.body;

    let findQuery = { notification_for: user_id, user: { $ne: user_id } }

    if(filter != 'all'){
        findQuery.type = filter;
    }

    Notification.countDocuments(findQuery)
    .then(count => {
        return res.status(200).json({ totalDocs: count })
    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })

})
app.post("/user-written-blogs", verifyJWT, (req, res) => {

    let user_id = req.user.id;

    let { page, draft, query, deletedDocCount } = req.body;

    let maxLimit = 5;
    let skipDocs = (page - 1) * maxLimit;

    if(deletedDocCount){
        skipDocs -= deletedDocCount;
    }

    Blog.find({ author: user_id, draft, title: new RegExp(query, 'i') })
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({ publishedAt: -1 })
    .select(" title banner publishedAt blog_id activity des draft -_id ")
    .then(blogs => {
        return res.status(200).json({ blogs })
    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    })

})

app.post("/user-written-blogs-count", verifyJWT, (req, res) => {

    let user_id = req.user.id;

    let { draft, query } = req.body;

    Blog.countDocuments({ author: user_id, draft, title: new RegExp(query, 'i') })
    .then(count => {
        return res.status(200).json({ totalDocs: count })
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    })

})

app.post("/delete-blog", verifyJWT, (req, res) => {

    let user_id = req.user.id;
    let { blog_id } = req.body;

    Blog.findOneAndDelete({ blog_id })
    .then(blog => {
        
        Notification.deleteMany({ blog: blog._id }).then(data => console.log('notifications deleted'));

        Comment.deleteMany({ blog_id: blog._id }).then(data => console.log('comments deleted'));

        User.findOneAndUpdate({ _id: user_id }, { $pull: { blog: blog._id }, $inc: { "account_info.total_posts": -1 } })
        .then(user => console.log('Blog deleted'));

        return res.status(200).json({ status: 'done' });

    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })

})
app.get("/new-notification", verifyJWT, (req, res) => {

    let user_id = req.user.id;

    Notification.exists({ notification_for: user_id, seen: false, user: { $ne: user_id } })
    .then(result => {
        if( result ){
            return res.status(200).json({ new_notification_available: true })
        } else{
            return res.status(200).json({ new_notification_available: false })
        }
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ error: err.message })
    })

})
app.post("/update-profile-img", verifyJWT, (req, res) => {

    let { url } = req.body;

    User.findOneAndUpdate({ _id: req.user.id }, { "personal_info.profile_img": url })
    .then(() => {
        return res.status(200).json({ profile_img: url })
    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })

})
app.post("/update-profile", verifyJWT, (req, res) => {

    let { username, bio, social_links } = req.body;

    let bioLimit = 150;

    if(username.length < 3){
        return res.status(403).json({ error: "Username should be at least 3 letters long" });
    }

    if(bio.length > bioLimit){
        return res.status(403).json({ error: `Bio should not be more than ${bioLimit} characters` });
    }

    let socialLinksArr = Object.keys(social_links);

    try {

        for(let i = 0; i < socialLinksArr.length; i++){
            if(social_links[socialLinksArr[i]].length){
                let hostname = new URL(social_links[socialLinksArr[i]]).hostname; 

                if(!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != 'website'){
                    return res.status(403).json({ error: `${socialLinksArr[i]} link is invalid. You must enter a full link` })
                }

            }
        }

    } catch (err) {
        return res.status(500).json({ error: "You must provide full social links with http(s) included" })
    }

    let updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    }

    User.findOneAndUpdate({ _id: req.user.id }, updateObj, {
        runValidators: true
    })
    .then(() => {
        return res.status(200).json({ username })
    })
    .catch(err => {
        if(err.code == 11000){
            return res.status(409).json({ error: "username is already taken" })
        }
        return res.status(500).json({ error: err.message })
    })

})
app.post("/change-password", verifyJWT, (req, res) => {

    let { currentPassword, newPassword } = req.body; 

    if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
        return res.status(403).json({ error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })
    }

    User.findOne({ _id: req.user.id })
    .then((user) => {

        if(user.google_auth){
            return res.status(403).json({ error: "You can't change account's password because you logged in through google" })
        }

        bcrypt.compare(currentPassword, user.personal_info.password, (err, result) => {
            if(err) {
                return res.status(500).json({ error: "Some error occured while changing the password, please try again later" })
            }

            if(!result){
                return res.status(403).json({ error: "Incorrect current password" })
            }

            bcrypt.hash(newPassword, 10, (err, hashed_password) => {

                User.findOneAndUpdate({ _id: req.user.id }, { "personal_info.password": hashed_password })
                .then((u) => {
                    return res.status(200).json({ status: 'password changed' })
                })
                .catch(err => {
                    return res.status(500).json({ error: 'Some error occured while saving new password, please try again later' })
                })

            })
        })

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error : "User not found" })
    })

})


app.use('/api/links', linkRoutes);



// app.use((req, res, next) => {
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//     next();
//   });

export { app };