import { useState, useEffect } from 'react';
import { teamApi } from '../api';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter, FaCalendarDay } from 'react-icons/fa';
import TestimonialSwiper from '../components/testimonials/TestimonialSwiper';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTeamMembers();
  }, [currentPage]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const response = await teamApi.getTeamMembers({ page: currentPage, limit: 8 });
      setTeamMembers(response.data || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error fetching team members:', error);
      setTeamMembers([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;

  return (

    <div>

      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 mb-8">
          <div>
            <h6 className="text-orange-500 text-sm font-medium mb-2">Our Team</h6>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Meet Our Professional, Skilled<br />and Dedicated Staff</h2>
          </div>
          <Link to="/contactus" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
            Contact Us
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {teamMembers && teamMembers.length > 0 && teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group">
              <div className="relative overflow-hidden">
                <img
                  src={`http://localhost:5000/uploads/${member.image}`}
                  alt={member.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {member.facebook_url && (
                    <a href={member.facebook_url} target="_blank" rel="noopener noreferrer" className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                      <FaFacebookF />
                    </a>
                  )}
                  {member.instagram_url && (
                    <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition">
                      <FaInstagram />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition">
                      <FaTwitter />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition">
                      <FaLinkedinIn />
                    </a>
                  )}
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.designation}</p>
              </div>
            </div>
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(pagination.totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded ${currentPage === index + 1
                  ? 'bg-orange-500 text-white'
                  : 'border hover:bg-gray-100'
                  }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}




      </div>

      <div className='relative bg-[#681515] my-12 overflow-hidden'>

        <img src="/images/home-banner-bg-02.jpg" alt=""
          className='hidden lg:block absolute w-12 right-20 bottom-6 animate-[bounce_3s_ease-in-out_infinite]'
        />

        <img src="/images/home-banner-bg-05-rotating.jpg" alt=""
          className='hidden lg:block absolute right-10 top-10 w-10 animate-[spin_8s_ease-in-out_infinite]'
        />

        <div className='max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between px-4 sm:px-6 lg:px-12 py-10 gap-8'>

          <div className='flex-2 text-white'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-4'>
              Do You Need Professional Vehicle Wash! We Are Here
            </h2>
            <p>
              Ask especially collecting terminated may son expression collecting lorem may so.
            </p>
          </div>

          <div className='flex-1 relative flex items-center justify-center min-h-48'>



            <Link to="/book" className='flex items-center gap-3 bg-white text-orange-500 text-lg font-semibold px-6 py-3 rounded-lg z-10 hover:bg-orange-500 hover:text-white transition'>
              Book Appointment <FaCalendarDay />
            </Link>

          </div>

        </div>

      </div>

      <div>

        <TestimonialSwiper />

      </div>

    </div>



  );
};

export default TeamPage;
