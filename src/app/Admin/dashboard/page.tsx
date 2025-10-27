import { AdminDashboard } from '@/app/components/Dashboard/Admin/AdminDashboard'
import UserDahboard from '@/app/components/Dashboard/User/UserDashboard'
import React from 'react'

const AdminDashboardPage = () => {
  return (
    <>
      <AdminDashboard />
      <UserDahboard />
    </>
  )
}

export default AdminDashboardPage
