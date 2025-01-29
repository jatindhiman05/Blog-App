const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
    {
        blog: {
            type: mongoose.Schema.Types.ObjectId,
            red: "Blog",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }, {
    timestamps: true
}
);

const like = mongoose.model("Like",likeSchema);

module.exports = Like;