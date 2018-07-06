var bodyParser=require("body-parser"),
expressSanitizer=require("express-sanitizer"),
mongoose=require("mongoose"),
methodOverride=require("method-override"),
express=require("express"),
app=express();

var url=process.env.DATABASEURL||"mongodb://localhost/blog_app";
mongoose.connect(url);
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());

var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

//Blog.create({
//    title:"A Test Blog!!",
//    image:"http://s3.india.com/travel/wp-content/uploads/2014/10/Sunset.jpg",
//    body:"Someone has rightly said, ‘It is almost impossible to watch a sunset and not dream.’ There’s something so beautiful about sunsets that no words can express it. And what’s even more fascinating is how splendid the sunset looks at every different location. Some find sunsets romantic, quite a few are inspired to write, many get into the philosophical mode. It’s intriguing, the effect that the same sight can have on different people. If you admire the beauty of sunsets, and could travel places, just to capture the moment,visit India, where sunsets are breathtakingly beautiful!"
//});

//Routes

app.get("/",function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        console.log("Error!");
        else
        res.render("index",{blogs:blogs});
    });
});

app.get("/blogs/new",function(req,res){
    res.render("new");
});
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)
        res.render("new");
        else
        res.redirect("/blogs");
    });
});

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        res.redirect("/blogs");
        else
        res.render("show",{blog:foundBlog});
    });
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
        res.redirect("/blogs");
        else
        res.render("edit",{blog:foundBlog});
    });
});

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs/"+req.params.id);
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err)
        res.redirect("/blogs");
        else
        res.redirect("/blogs");
    });
});

app.get("/about",function(req,res){
    res.render("about");
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server has started!!");
});