import mongoose from "mongoose";
const { Schema } = mongoose;

const movieSchema = new Schema(
    {
        title: { type: String, required: true },
        year: Number,
        rating: Number,
        watched: { type: Boolean, default: false },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
);

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;
