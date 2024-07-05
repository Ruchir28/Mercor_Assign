import React from 'react';
import { UserWithSkills } from '../App';
import defaultAvatar from "../../public/image.png";

interface UserCardProps {
  user: UserWithSkills;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden h-80 m-4">
      <div className="flex h-full">
        <div className="w-1/3 bg-gray-100">
          <img
            className="w-full h-full object-cover"
            src={user.profilePic || defaultAvatar}
            alt="Profile"
          />
        </div>
        <div className="w-2/3 p-6 flex flex-col justify-between">
          <div>
            <div className="uppercase tracking-wide text-sm text-black font-semibold truncate">
              {user.name || 'Anonymous User'} | {user.isActive ? 'Active' : 'Inactive'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {user.workAvailability || 'N/A'}
            </div>
            <p className="mt-2 text-gray-500 text-sm line-clamp-2">
              {user.summary || 'No summary provided'}
            </p>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-900">Expert in</h3>
              <div className="mt-1 flex flex-wrap">
                {user.MercorUserSkills.length > 0 ? (
                  user.MercorUserSkills.slice(0, Math.min(6,user.MercorUserSkills.length)).map((skill) => (
                    <span
                      key={skill.Skills.skillId}
                      className="mr-2 mt-1 inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded"
                    >
                      {skill.Skills.skillValue}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-xs">No skills provided</span>
                )}
                {user.MercorUserSkills.length > 6 && (
                  <span className="mr-2 mt-1 inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded">
                    +{user.MercorUserSkills.length - 6} more
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-medium text-gray-900">Commitment</h3>
              <div className="mt-1 flex flex-wrap">
                {user.fullTime && (
                  <span className="mr-2 mt-1 inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-lg">
                    Full Time
                  </span>
                )}
                {user.partTime && (
                  <span className="mr-2 mt-1 inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-lg">
                    Part Time
                  </span>
                )}
                {!user.fullTime && !user.partTime && (
                  <span className="text-gray-500 text-xs">No commitment information provided</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded hover:bg-indigo-600">
              View profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;