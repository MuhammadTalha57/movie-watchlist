import Movie from "../models/Movie.js";

export const createMovieService = async (data) => {
    try {
        const movie = await Movie.create({
            title: data.title,
            year: data.year,
            rating: data.rating,
            watched: data.watched,
            user: data.userId,
        });

        return movie;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const updateMovieService = async (movieId, userId, data) => {
    try {
        const movie = await Movie.findOneAndUpdate(
            { _id: movieId, user: userId },
            {
                title: data.title,
                year: data.year,
                rating: data.rating,
                watched: data.watched,
            },
            { new: true, runValidators: true },
        );

        return movie;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const deleteMovieService = async (movieId, userId) => {
    try {
        const movie = await Movie.findOneAndDelete({
            _id: movieId,
            user: userId,
        });

        return movie;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getMovieByIdService = async (movieId, userId) => {
    try {
        const movie = await Movie.findOne({ _id: movieId, user: userId });

        return movie;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getAllMoviesService = async (userId) => {
    try {
        const movies = await Movie.find({ user: userId }).sort({
            createdAt: -1,
        });

        return movies;
    } catch (error) {
        console.error(error);
        return null;
    }
};
