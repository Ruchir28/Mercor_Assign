import React, { useEffect, useState } from 'react';
import {Prisma} from "@prisma/client"
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaBriefcase, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import defaultAvatar from "../../public/image.png";
import LoadingProfile from './LoadingProfile';
import { config } from '../config';


type MercorUser = Prisma.MercorUsersGetPayload<{
    include: {
      MercorUserSkills: {
        include: {
          Skills: true
        }
      },
      UserResume: {
        include: {
            WorkExperience: true,
            Education: true
        }
      }
    }
  }>

  type MercorUserSkill = Prisma.MercorUserSkillsGetPayload<{
    include: {
      Skills: true
    }
  }>

  type WorkExperience = Prisma.WorkExperienceGetPayload<{}>

  type Education = Prisma.EducationGetPayload<{}>

  const ProfilePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<MercorUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

  
    useEffect(() => {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://${config.SERVER_URL}/api/users/${userId}`).then(res => res.json());
          setUser(response);
          setError(null);
        } catch (err) {
          setError('Failed to fetch user data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, [userId]);

    const handleBack = () => {
        navigate(-1);
    };
  
    if (loading) {
      return <LoadingProfile />
    }
  
    if (error || !user) {
      return <div className="text-center mt-8 text-red-500">Error: {error || 'User not found'}</div>;
    }
    if (loading) {
        return <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>;
      }
    
      if (error || !user) {
        return <div className="flex items-center justify-center h-screen text-red-500">Error: {error || 'User not found'}</div>;
      }
    
      return (
        <div className="bg-gray-100 min-h-screen">
        <div className="max-w-6xl mx-auto p-6">
          <button 
            onClick={handleBack}
            className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 transition duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <ProfileHeader user={user} />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <ExperienceSection experience={user.UserResume?.WorkExperience || []} />
              <EducationSection education={user.UserResume?.Education || []} />
            </div>
            <div>
              <SkillsSection skills={user.MercorUserSkills} />
              <AvailabilitySection user={user} />
            </div>
          </div>
        </div>
      </div>
        );
    };
    
    const ProfileHeader: React.FC<{ user: MercorUser }> = ({ user }) => (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center">
            <img 
              className="h-32 w-32 rounded-full mr-8 border-4 border-indigo-100 shadow-lg" 
              src={user.profilePic || defaultAvatar} 
              alt={user.name || 'User'} 
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name || 'Anonymous'}</h1>
              <p className="text-xl text-indigo-600">{user.preferredRole || 'No preferred role'}</p>
              <p className="mt-2 text-gray-600 flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                { 'Location not specified'}
              </p>
            </div>
          </div>
          <p className="mt-6 text-gray-700">{user.summary || 'No summary provided'}</p>
          <div className="mt-6 flex space-x-4">
            <button className="bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition duration-300">
              Request intro
            </button>
            <button className="border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-100 transition duration-300">
              Shortlist
            </button>
          </div>
        </div>
      </div>
    );
    
    const SkillsSection: React.FC<{ skills: MercorUserSkill[] }> = ({ skills }) => (
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Expert in</h2>
        <div className="flex flex-wrap">
          {skills.map(skill => (
            <span key={skill.skillId} className="bg-indigo-100 text-indigo-800 text-sm font-medium mr-2 mb-2 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition duration-300">
              {skill.Skills.skillValue}
            </span>
          ))}
        </div>
      </div>
    );
    
    const AvailabilitySection: React.FC<{ user: MercorUser }> = ({ user }) => (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Availability</h2>
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-700">Full-time</h3>
            <p className="text-2xl font-bold text-indigo-900 mt-2">{user.fullTimeSalaryCurrency} {user.fullTimeSalary || 'N/A'} <span className="text-sm text-indigo-600">/ month</span></p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-700">Part-time</h3>
            <p className="text-2xl font-bold text-green-900 mt-2">{user.partTimeSalaryCurrency} {user.partTimeSalary || 'N/A'} <span className="text-sm text-green-600">/ month</span></p>
          </div>
        </div>
      </div>
    );
    
    const ExperienceSection: React.FC<{ experience: WorkExperience[] }> = ({ experience }) => (
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FaBriefcase className="mr-2 text-indigo-500" />
          Work Experience
        </h2>
        {experience.map((exp, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{exp.role || 'Role not specified'}</h3>
                <p className="text-gray-600">{exp.company || 'Company not specified'}</p>
              </div>
              <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
            </div>
            <p className="mt-2 text-gray-700">{exp.description || 'No description provided'}</p>
          </div>
        ))}
      </div>
    );
    
    const EducationSection: React.FC<{ education: Education[] }> = ({ education }) => (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FaGraduationCap className="mr-2 text-indigo-500" />
          Education
        </h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{edu.degree || 'Degree not specified'}</h3>
                <p className="text-gray-600">{edu.school || 'School not specified'}</p>
              </div>
              <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate || 'Present'}</p>
            </div>
            <p className="mt-2 text-gray-700">{edu.major || 'Major not specified'}</p>
          </div>
        ))}
      </div>
    );
    
    export default ProfilePage;
    