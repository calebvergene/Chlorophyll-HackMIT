// src/pages/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div className="bg-cover bg-center min-h-screen bg-neutral-100 text-black/90">
      <div className="flex items-center justify-between h-screen bg-gray-100">
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 ml-10 mb-10">
          <div className="border border-gray-500 rounded-lg px-2 py-1 left-0 text-xs mb-3 font-semibold mr-[388px]">
            HackMIT 24
          </div>
          <h1 className="text-6xl font-bold mr-[85px]">
            Chlorophyll <span className="mx-10"></span>
          </h1>
          <h3 className="text-black/50 mt-3 text-lg mr-[143px]">
            Visualize solutions to urban heat islands.
          </h3>
          <div className="flex flex-row mt-11 text-lg font-rubik">
            <div className="relative inline-flex group">
              <div className="mr-[317px] absolute transitiona-all duration-1000 rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <button
                className="relative inline-flex items-center justify-center px-6 py-3 text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-emerald-700 to-emerald-500  rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-100 mr-[363px]"
                role="button"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
        <div className="w-2/3 flex items-center justify-center">

        </div>
      </div>
    </div>
  );
};

export default Home;
