import { Cinema, Screen } from '../models/index.js';

export const getAllCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.findAll({
      include: [
        {
          model: Screen,
          attributes: ['id', 'name', 'screenType']
        }
      ],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: cinemas.length,
      data: cinemas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cinemas',
      error: error.message
    });
  }
};

export const getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findByPk(req.params.id, {
      include: [
        {
          model: Screen,
          attributes: ['id', 'name', 'screenType', 'totalRows', 'totalColumns']
        }
      ]
    });

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    res.status(200).json({
      success: true,
      data: cinema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cinema',
      error: error.message
    });
  }
};

export const createCinema = async (req, res) => {
  try {
    const { name, location, address, city, facilities } = req.body;

    const cinema = await Cinema.create({
      name,
      location,
      address,
      city,
      facilities
    });

    res.status(201).json({
      success: true,
      message: 'Cinema created successfully',
      data: cinema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating cinema',
      error: error.message
    });
  }
};

export const updateCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByPk(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    const { name, location, address, city, facilities } = req.body;

    await cinema.update({
      name: name || cinema.name,
      location: location || cinema.location,
      address: address || cinema.address,
      city: city || cinema.city,
      facilities: facilities || cinema.facilities
    });

    res.status(200).json({
      success: true,
      message: 'Cinema updated successfully',
      data: cinema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cinema',
      error: error.message
    });
  }
};

export const deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByPk(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    await cinema.destroy();

    res.status(200).json({
      success: true,
      message: 'Cinema deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting cinema',
      error: error.message
    });
  }
};
