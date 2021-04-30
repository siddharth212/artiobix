const Post = require('../database/models/Post')
 
module.exports = async (req, res) => {
    const post = await Post.findById(mongoose.Types.ObjectId);    
    res.render("post", {
        post
    });
}

