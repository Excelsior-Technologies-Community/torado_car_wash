import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaChevronLeft, FaChevronRight, FaFacebookF, FaLinkedinIn, FaInstagram, FaTwitter } from 'react-icons/fa';
import { teamApi } from '../api';
import { Link } from 'react-router-dom';

function TeamSwiper() {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    teamApi.getTeamMembers({ limit: 20 })
      .then(res => {
        const data = res.data || []
        setTeamMembers(data)
      })
      .catch(err => {
        console.error(err)
        setTeamMembers([])
      });
  }, []);

  return (
    <div className='max-w-7xl mx-auto p-4 my-16'>
      <div className='flex justify-between items-center mb-12'>
        <div>
          <h3 className='text-orange-500 font-semibold mb-2'>Expert Team</h3>
          <h2 className='text-4xl font-bold'>Meet Our Professional, Skilled<br />and Dedicated Staff</h2>
        </div>
        <div className='flex gap-3'>
          <button className='team-prev w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition'>
            <FaChevronLeft />
          </button>
          <button className='team-next w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition'>
            <FaChevronRight />
          </button>
          <Link to='/team' className='bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition flex items-center gap-2'>
            View All <FaChevronRight className='text-sm' />
          </Link>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={4}
        navigation={{
          prevEl: '.team-prev',
          nextEl: '.team-next',
        }}
        autoplay={{ delay: 5000 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {teamMembers && teamMembers.length > 0 && teamMembers.map((member) => (
          <SwiperSlide key={member.id}>
            <div className='bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group'>
              <div className='relative overflow-hidden'>
                <img
                  src={`http://localhost:5000/uploads/${member.image}`}
                  alt={member.name}
                  className='w-full h-80 object-cover group-hover:scale-110 transition duration-300'
                />
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  {member.facebook_url && (
                    <a href={member.facebook_url} target='_blank' rel='noopener noreferrer' className='bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition'>
                      <FaFacebookF />
                    </a>
                  )}
                  {member.instagram_url && (
                    <a href={member.instagram_url} target='_blank' rel='noopener noreferrer' className='bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition'>
                      <FaInstagram />
                    </a>
                  )}
                  {member.twitter_url && (
                    <a href={member.twitter_url} target='_blank' rel='noopener noreferrer' className='bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition'>
                      <FaTwitter />
                    </a>
                  )}
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target='_blank' rel='noopener noreferrer' className='bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 hover:text-white transition'>
                      <FaLinkedinIn />
                    </a>
                  )}
                </div>
              </div>
              <div className='p-6 text-center'>
                <h3 className='text-xl font-semibold mb-1'>{member.name}</h3>
                <p className='text-gray-500 text-sm'>{member.designation}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default TeamSwiper;
