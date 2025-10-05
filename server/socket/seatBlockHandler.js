import { SeatBlock } from '../models/index.js';
import { Op } from 'sequelize';

const BLOCK_DURATION = 5 * 60 * 1000;

const cleanExpiredBlocks = async () => {
  try {
    await SeatBlock.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning expired blocks:', error);
  }
};

setInterval(cleanExpiredBlocks, 30000);

const setupSeatBlockSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-show', async (showId) => {
      socket.join(`show-${showId}`);
      console.log(`Socket ${socket.id} joined show ${showId}`);

      try {
        await cleanExpiredBlocks();

        const blockedSeats = await SeatBlock.findAll({
          where: {
            ShowId: showId,
            expiresAt: {
              [Op.gt]: new Date()
            }
          },
          attributes: ['seatRow', 'seatColumn', 'socketId']
        });

        socket.emit('current-blocks', blockedSeats);
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
    });

    socket.on('block-seat', async (data) => {
      try {
        const { showId, seatRow, seatColumn } = data;

        const existingBlock = await SeatBlock.findOne({
          where: {
            ShowId: showId,
            seatRow,
            seatColumn,
            expiresAt: {
              [Op.gt]: new Date()
            }
          }
        });

        if (existingBlock && existingBlock.socketId !== socket.id) {
          socket.emit('seat-block-failed', { seatRow, seatColumn });
          return;
        }

        if (existingBlock && existingBlock.socketId === socket.id) {
          existingBlock.expiresAt = new Date(Date.now() + BLOCK_DURATION);
          await existingBlock.save();
        } else {
          await SeatBlock.create({
            ShowId: showId,
            seatRow,
            seatColumn,
            socketId: socket.id,
            expiresAt: new Date(Date.now() + BLOCK_DURATION)
          });
        }

        io.to(`show-${showId}`).emit('seat-blocked', {
          seatRow,
          seatColumn,
          socketId: socket.id
        });
      } catch (error) {
        console.error('Error blocking seat:', error);
        socket.emit('seat-block-failed', data);
      }
    });

    socket.on('unblock-seat', async (data) => {
      try {
        const { showId, seatRow, seatColumn } = data;

        await SeatBlock.destroy({
          where: {
            ShowId: showId,
            seatRow,
            seatColumn,
            socketId: socket.id
          }
        });

        io.to(`show-${showId}`).emit('seat-unblocked', {
          seatRow,
          seatColumn
        });
      } catch (error) {
        console.error('Error unblocking seat:', error);
      }
    });

    socket.on('unblock-all-seats', async (showId) => {
      try {
        await SeatBlock.destroy({
          where: {
            ShowId: showId,
            socketId: socket.id
          }
        });

        const seats = await SeatBlock.findAll({
          where: {
            socketId: socket.id
          },
          attributes: ['seatRow', 'seatColumn']
        });

        seats.forEach(seat => {
          io.to(`show-${showId}`).emit('seat-unblocked', {
            seatRow: seat.seatRow,
            seatColumn: seat.seatColumn
          });
        });
      } catch (error) {
        console.error('Error unblocking all seats:', error);
      }
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);

      try {
        const blockedSeats = await SeatBlock.findAll({
          where: { socketId: socket.id },
          attributes: ['ShowId', 'seatRow', 'seatColumn']
        });

        await SeatBlock.destroy({
          where: { socketId: socket.id }
        });

        blockedSeats.forEach(seat => {
          io.to(`show-${seat.ShowId}`).emit('seat-unblocked', {
            seatRow: seat.seatRow,
            seatColumn: seat.seatColumn
          });
        });
      } catch (error) {
        console.error('Error cleaning up on disconnect:', error);
      }
    });
  });
};

export default setupSeatBlockSocket;