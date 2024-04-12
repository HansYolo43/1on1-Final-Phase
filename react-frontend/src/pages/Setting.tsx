import React, {useState} from "react";
import Sidebar from "../components/Sidebar";
import { set } from "date-fns";
import Navbar from "../components/Navbar";
import userProfileImage from "../images/profile.jpg";
import ScheduleMeetingModal from '../components/ScheduleMeetingModal';


const Setting: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [profilePicture, uploadProfilePicture] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  


  return (
   
    <div>
      <Sidebar onScheduleMeetingClick={openModal} />
      <ScheduleMeetingModal isOpen={isModalOpen} onClose={closeModal} />

      <Navbar/>
      <div className="pt-20 pl-64">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Settings</h2>
          <div className="flex flex-col items-center justify-center my-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 mb-4">
              <img
                src={userProfileImage}
                alt="Profile Picture"
                className="absolute w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer">
                <span className="text-white text-sm text-center px-2">Change Profile Picture</span>
                <input
                  type="file"
                  id="profileInput"
                  name="profilePicture"
                  accept="image/*"
                  className="hidden"
                  // onChange={(e) => uploadProfilePicture(e.target)}
                />
              </div>
            </div>
            <span className="text-xl font-medium mt-2">David</span> {/* Ensure user name matches state or props */}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Change Username</h2>
            <form
              id="changeUsernameForm"
              className="bg-gray-900 p-5 rounded-lg border border-gray-700 mt-4"
            >
              <label htmlFor="newUsername" className="block text-sm font-medium text-white">New Username</label>
              <input
                type="text"
                id="newUsername"
                name="newUsername"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500 block w-full rounded-md sm:text-sm focus:ring-1"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <button
                type="submit"
                className="mt-4 px-3 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold block w-full rounded-md"
              >
                Change Username
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Change Password</h2>
            <form
              id="changePasswordForm"
              className="bg-gray-900 p-5 rounded-lg border border-gray-700 mt-4"
            >
              <label htmlFor="currentPassword" className="block text-sm font-medium text-white">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500 block w-full rounded-md sm:text-sm focus:ring-1"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              
              <label htmlFor="newPassword" className="block text-sm font-medium text-white mt-4">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500 block w-full rounded-md sm:text-sm focus:ring-1"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              
              <button
                type="submit"
                className="mt-4 px-3 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold block w-full rounded-md"
              >
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div >
    
  );
};
export default Setting;
