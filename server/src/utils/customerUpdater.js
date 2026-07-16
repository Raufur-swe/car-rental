import Booking from "../model/booking.model.js";
import Customer from "../model/customer.model.js";

export const updateCustomer = async (userId) => {
  const bookingStats = await Booking.aggregate([
    {
      $match: {
        customer: userId,
      },
    },

    {
      $group: {
        _id: null,

        totalBookings: {
          $sum: 1,
        },

        activeBookings: {
          $sum: {
            $cond: [
              {
                $in: ["$status", ["approved", "active"]],
              },
              1,
              0,
            ],
          },
        },

        completedBookings: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "completed"],
              },
              1,
              0,
            ],
          },
        },

        cancelledBookings: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "cancelled"],
              },
              1,
              0,
            ],
          },
        },

        totalSpent: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ["$status", "completed"],
                  },
                  {
                    $eq: ["$paymentStatus", "paid"],
                  },
                ],
              },
              "$totalPrice",
              0,
            ],
          },
        },
      },
    },
  ]);

  const stats = bookingStats[0] || {};

  await Customer.findOneAndUpdate(
    {
      user: userId,
    },
    {
      totalBookings: stats.totalBookings || 0,
      activeBookings: stats.activeBookings || 0,
      completedBookings: stats.completedBookings || 0,
      cancelledBookings: stats.cancelledBookings || 0,
      totalSpent: stats.totalSpent || 0,
    },
    {
      new: true,
    }
  );
};