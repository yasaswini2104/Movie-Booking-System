import { Screen, Cinema } from '../models/index.js';

export const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.findAll({
      include: [
        {
          model: Cinema,
          attributes: ['id', 'name', 'location']
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: screens.length,
      data: screens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching screens',
      error: error.message
    });
  }
};

export const getScreenById = async (req, res) => {
  try {
    const screen = await Screen.findByPk(req.params.id, {
      include: [
        {
          model: Cinema,
          attributes: ['id', 'name', 'location']
        }
      ]
    });

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    res.status(200).json({
      success: true,
      data: screen
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching screen',
      error: error.message
    });
  }
};

export const createScreen = async (req, res) => {
  try {
    const { name, cinemaId, totalRows, totalColumns, screenType } = req.body;

    const cinema = await Cinema.findByPk(cinemaId);
    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: 'Cinema not found'
      });
    }

    const screen = await Screen.create({
      name,
      cinemaId,
      totalRows: totalRows || 10,
      totalColumns: totalColumns || 10,
      screenType: screenType || 'Standard'
    });

    res.status(201).json({
      success: true,
      message: 'Screen created successfully',
      data: screen
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating screen',
      error: error.message
    });
  }
};

export const updateScreen = async (req, res) => {
  try {
    const screen = await Screen.findByPk(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    const { name, totalRows, totalColumns, screenType } = req.body;

    await screen.update({
      name: name || screen.name,
      totalRows: totalRows || screen.totalRows,
      totalColumns: totalColumns || screen.totalColumns,
      screenType: screenType || screen.screenType
    });

    res.status(200).json({
      success: true,
      message: 'Screen updated successfully',
      data: screen
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating screen',
      error: error.message
    });
  }
};

export const deleteScreen = async (req, res) => {
  try {
    const screen = await Screen.findByPk(req.params.id);

    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found'
      });
    }

    await screen.destroy();

    res.status(200).json({
      success: true,
      message: 'Screen deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting screen',
      error: error.message
    });
  }
};
