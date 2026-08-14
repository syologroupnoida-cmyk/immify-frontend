import React from 'react';
import AddCategory from '@/components/services/AddServiceCategory';
import SuperadminDashboard from '@/components/dashboard/SuperadminDashboard';

function add_category() {
  return (
    <div>
      <SuperadminDashboard>
        <AddCategory />
      </SuperadminDashboard>
    </div>
  )
}

export default add_category;
