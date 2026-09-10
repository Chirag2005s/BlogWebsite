import { Users, FileText, Eye, Heart } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Articles', value: '12', icon: FileText, color: 'text-blue-500' },
    { title: 'Total Views', value: '8,432', icon: Eye, color: 'text-green-500' },
    { title: 'Total Likes', value: '432', icon: Heart, color: 'text-red-500' },
    { title: 'Total Users', value: '89', icon: Users, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-dark-800 p-6 rounded-xl border border-dark-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                </div>
                <div className={`p-3 bg-dark-900 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 min-h-[300px]">
          <h2 className="text-lg font-bold text-white mb-4">Recent Articles</h2>
          <div className="text-gray-400 text-sm flex items-center justify-center h-48 border border-dashed border-dark-600 rounded-lg">
            Articles list goes here
          </div>
        </div>
        <div className="bg-dark-800 p-6 rounded-xl border border-dark-700 min-h-[300px]">
          <h2 className="text-lg font-bold text-white mb-4">Analytics Overview</h2>
          <div className="text-gray-400 text-sm flex items-center justify-center h-48 border border-dashed border-dark-600 rounded-lg">
            Chart goes here
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
