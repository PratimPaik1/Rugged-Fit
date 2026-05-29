import mongoose from "mongoose"

const logoutSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

const logoutModel = mongoose.model('logout', logoutSchema)

export default logoutModel