import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, Settings, LogOut, Loader2, UserCheck, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  service_category: string;
  status: string;
  scheduled_date: string;
  time_slot: string;
  created_at: string;
  customer_id: string;
  technician_id: string | null;
  issue_description: string;
  customer?: { full_name: string; phone: string }; // Joined data
}

interface Profile {
  id: string;
  full_name: string;
  role: 'customer' | 'technician' | 'admin';
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [technicians, setTechnicians] = useState<Profile[]>([]);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        // 1. Fetch current user's profile to check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile(profile);

        // 2. Fetch Bookings based on role
        let query = supabase.from('bookings').select(`
          *,
          customer:profiles!customer_id(full_name, phone)
        `);

        if (profile?.role !== 'admin') {
          query = query.eq('customer_id', user.id);
        } else {
          // If admin, also fetch list of technicians for assignment
          const { data: techs } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'technician');
          setTechnicians(techs || []);
        }

        const { data: bookingsData, error: bookingsError } = await query.order('created_at', { ascending: false });
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);

      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleAssignTech = async (bookingId: string, techId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          technician_id: techId, 
          status: 'accepted' // Automatically approve when assigned
        })
        .eq('id', bookingId);

      if (error) throw error;
      
      toast.success('Technician assigned and request approved');
      // Refresh local state
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, technician_id: techId, status: 'accepted' } : b));
    } catch (err) {
      toast.error('Failed to assign technician');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-purple-100 text-purple-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const isAdmin = userProfile?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-24">
            <div className="mb-6 px-4 pt-2">
              <h3 className="font-bold text-lg text-slate-900 truncate">{user?.email}</h3>
              <p className="flex items-center gap-2 text-sm text-blue-600 font-semibold capitalize">
                {isAdmin ? <ShieldAlert className="w-4 h-4" /> : null}
                {userProfile?.role || 'User'} Account
              </p>
            </div>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium">
                <Package className="w-5 h-5" /> {isAdmin ? 'All Requests' : 'My Bookings'}
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
                <Settings className="w-5 h-5" /> Profile Settings
              </button>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors mt-8">
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              {isAdmin ? 'Service Management' : 'Recent Bookings'}
            </h1>
            {!isAdmin && (
              <Link to="/book" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                New Booking
              </Link>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full p-12 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
                <p>Loading data...</p>
              </div>
            ) : bookings.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <div key={booking.id} className="p-6 flex flex-col gap-4 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-slate-900">{booking.service_category}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status.replace('_', ' ')}
                          </span>
                        </div>
                        {isAdmin && (
                          <p className="text-sm text-blue-600 font-medium">
                            Customer: {booking.customer?.full_name} ({booking.customer?.phone})
                          </p>
                        )}
                        <p className="text-xs text-slate-500 font-mono mt-1">ID: {booking.id.split('-')[0].toUpperCase()}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-lg self-start sm:self-center">
                        <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {new Date(booking.scheduled_date).toLocaleDateString()}</div>
                        <div className="w-px h-4 bg-slate-300"></div>
                        <div>{booking.time_slot}</div>
                      </div>
                    </div>

                    {/* Admin Assignment Section */}
                    {isAdmin && (
                      <div className="mt-2 p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-blue-800">
                          <strong>Issue:</strong> {booking.issue_description}
                        </div>
                        <div className="flex items-center gap-2">
                          <select 
                            className="text-sm border border-blue-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleAssignTech(booking.id, e.target.value)}
                            value={booking.technician_id || ''}
                          >
                            <option value="">Assign Technician...</option>
                            {technicians.map(tech => (
                              <option key={tech.id} value={tech.id}>{tech.full_name}</option>
                            ))}
                          </select>
                          {booking.technician_id && (
                            <UserCheck className="text-green-600 w-5 h-5" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No requests found</h3>
                {!isAdmin && (
                  <Link to="/book" className="text-blue-600 font-medium hover:underline">
                    Book your first service
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
