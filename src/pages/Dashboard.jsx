const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Page</h1>
      <p className="mt-4 text-gray-600">Welcome to the MotoMedic IMS Dashboard</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-2xl font-bold text-blue-600">₱0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Inventory Items</h3>
          <p className="text-2xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Orders</h3>
          <p className="text-2xl font-bold text-orange-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Customers</h3>
          <p className="text-2xl font-bold text-purple-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;