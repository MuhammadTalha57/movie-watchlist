import {
    createMovieService,
    deleteMovieService,
    getAllMoviesService,
    getMovieByIdService,
    updateMovieService,
} from "../services/movie.service.js";

export const createMovie = async (req, res) => {
    const movie = await createMovieService({
        ...req.body,
        userId: req.user.id,
    });

    if (movie) {
        res.status(201).json({
            success: true,
            data: movie,
        });
    } else {
        res.status(400).json({
            success: false,
        });
    }
};

export const updateMovie = async (req, res) => {
    const movie = await updateMovieService(
        req.params.id,
        req.user.id,
        req.body,
    );

    if (movie) {
        res.status(200).json({
            success: true,
            data: movie,
        });
    } else {
        res.status(404).json({
            success: false,
        });
    }
};

export const deleteMovie = async (req, res) => {
    const movie = await deleteMovieService(req.params.id, req.user.id);

    if (movie) {
        res.status(200).json({
            success: true,
            data: movie,
        });
    } else {
        res.status(404).json({
            success: false,
        });
    }
};

export const getMovieById = async (req, res) => {
    const movie = await getMovieByIdService(req.params.id, req.user.id);

    if (movie) {
        res.status(200).json({
            success: true,
            data: movie,
        });
    } else {
        res.status(404).json({
            success: false,
        });
    }
};

export const getAllMovies = async (req, res) => {
    const movies = await getAllMoviesService(req.user.id);

    if (movies !== null) {
        res.status(200).json({
            success: true,
            data: movies,
        });
    } else {
        res.status(400).json({
            success: false,
        });
    }
};
