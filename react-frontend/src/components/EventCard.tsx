import React from 'react';

// Define the props types using TypeScript
interface EventCardProps {
    owner_id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
}

const EventCard: React.FC<EventCardProps> = ({ owner_id, name, description, startDate, endDate }) => {
  return (
    <div className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:bg-gray-700 bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-400">{description}</p>
          <p className="text-gray-400">Start: {startDate}</p>
          <p className="text-gray-400">End: {endDate}</p>
        </div>
        <div className="text-gray-400 hover:text-gray-300 cursor-pointer">
          ...
        </div>
      </div>
    </div>
  );
};

export default EventCard;
