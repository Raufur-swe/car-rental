import React from 'react'
import RecentBookings from '../../components/owner/RecentBookings'
import BookingChart from '../../components/owner/BookingChart'
import RevenueChart from '../../components/owner/RevenueChart'
import StatsCards from '../../components/owner/StatsCards'
import RecentCars from '../../components/owner/RecentCars'

const OwnerDashboard = () => {
  return (
    <div className="space-y-6">
      <StatsCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>

        <BookingChart />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentCars />

        <RecentBookings />
      </div>
    </div>
  )
}

export default OwnerDashboard