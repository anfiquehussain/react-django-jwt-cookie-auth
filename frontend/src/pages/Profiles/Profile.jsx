import React, { useEffect, useState } from 'react';
import { getUser } from '../../ApiCalls/User';
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSignInAlt,
} from 'react-icons/fa';

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUser();
        setUser(user);
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="text-center mt-10 text-primary-500">Loading profile...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto bg-secondary-200 shadow-2xl rounded-2xl p-10">
        <h1 className="text-4xl font-bold text-text mb-8 text-center">Your Profile</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          <ProfileItem icon={<FaUser />} label="Username" value={user.username} />
          <ProfileItem icon={<FaEnvelope />} label="Email" value={user.email} />
          <ProfileItem icon={<FaMapMarkerAlt />} label="Country" value={user.country} />
          <ProfileItem icon={<FaMapMarkerAlt />} label="State" value={user.state} />
          <ProfileItem icon={<FaMapMarkerAlt />} label="City" value={user.city} />
          <ProfileItem icon={<FaCalendarAlt />} label="Joined On" value={formatDate(user.date_joined)} />
          <ProfileItem icon={<FaSignInAlt />} label="Last Login" value={formatDate(user.last_login)} />
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 bg-primary-100 rounded-lg p-4 shadow-sm w-full max-w-full overflow-hidden">
      <div className="text-secondary-500 text-xl mt-1 shrink-0">{icon}</div>
      <div className="flex flex-col w-full overflow-hidden">
        <p className="text-sm text-text-500 mb-1">{label}</p>
        <p
          className="text-md font-medium text-main-text-500 break-words break-all whitespace-pre-wrap leading-snug w-full overflow-hidden"
          style={{ wordBreak: 'break-word' }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default Profile;
