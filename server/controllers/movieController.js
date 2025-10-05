import { Movie, Show } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({
      order: [['releaseDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching movies',
      error: error.message
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching movie',
      error: error.message
    });
  }
};

export const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      genre,
      language,
      rating,
      releaseDate,
      posterUrl,
      trailerUrl,
      cast,
      director
    } = req.body;

    const movie = await Movie.create({
      title,
      description,
      duration,
      genre,
      language,
      rating,
      releaseDate,
      posterUrl,
      trailerUrl,
      cast,
      director
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating movie',
      error: error.message
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    await movie.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: movie
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating movie',
      error: error.message
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    await movie.destroy();

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting movie',
      error: error.message
    });
  }
};
