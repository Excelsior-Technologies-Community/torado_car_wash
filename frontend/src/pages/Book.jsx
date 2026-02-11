import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { vehicleCategoriesApi } from '../api/vehicleCategories'
import { servicesApi } from '../api/services'
import axios from 'axios'
import 'swiper/css'
import 'swiper/css/navigation'

function Book() {
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [swiper, setSwiper] = useState(null)
    const [services, setServices] = useState([])
    const [selectedServices, setSelectedServices] = useState([])
    const [washPackages, setWashPackages] = useState([])
    const [selectedPackage, setSelectedPackage] = useState(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [availableSlots, setAvailableSlots] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)

    const getCurrentStep = () => {
        if (selectedDate && selectedTime) return 4
        if (selectedPackage) return 3
        if (selectedServices.length > 0) return 2
        if (selectedCategory) return 1
        return 0
    }

    useEffect(() => {
        fetchCategories()
        fetchServices()
        fetchWashPackages()
    }, [])

    const fetchCategories = async () => {
        try {
            const { data } = await vehicleCategoriesApi.getAll()
            console.log('Categories data:', data)
            setCategories(data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const fetchServices = async () => {
        try {
            const { data } = await servicesApi.getAll()
            console.log('Services data:', data)
            setServices(data)
        } catch (error) {
            console.error('Error fetching services:', error)
        }
    }

    const fetchWashPackages = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/wash-packages')
            console.log('Wash packages data:', data)
            setWashPackages(data)
        } catch (error) {
            console.error('Error fetching wash packages:', error)
            setWashPackages([])
        }
    }

    const fetchAvailableSlots = async (date) => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/bookings/available-slots?date=${date}`)
            console.log('Available slots response:', data)
            // Backend returns available_time, map it to time_slot
            const slots = data.availableSlots?.map(slot => ({
                time_slot: slot.available_time?.substring(0, 5) || slot.time_slot
            })) || []
            setAvailableSlots(slots)
        } catch (error) {
            console.error('Error fetching slots:', error)
            const defaultSlots = [
                { time_slot: '09:00' },
                { time_slot: '10:00' },
                { time_slot: '11:00' },
                { time_slot: '12:00' },
                { time_slot: '13:00' },
                { time_slot: '14:00' },
                { time_slot: '15:00' },
                { time_slot: '16:00' },
                { time_slot: '17:00' }
            ]
            setAvailableSlots(defaultSlots)
        }
    }

    const handleDateChange = (e) => {
        const date = e.target.value
        setSelectedDate(date)
        setSelectedTime('')
        if (date) fetchAvailableSlots(date)
    }

    const calculateTotalPrice = () => {
        if (!selectedPackage || !selectedCategory) return 0
        const pkg = washPackages.find(p => p.id === selectedPackage)
        if (!pkg || !pkg.pricing) return Number(pkg?.base_price || 0)
        const pricing = pkg.pricing.find(p => p.vehicle_category_id === selectedCategory.id)
        return Number(pricing?.final_price || pkg.base_price || 0)
    }

    useEffect(() => {
        setTotalPrice(calculateTotalPrice())
    }, [selectedPackage, selectedCategory, washPackages])

    const toggleService = (serviceId) => {
        setSelectedServices(prev => 
            prev.includes(serviceId) 
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        )
    }

    useEffect(() => {
        if (swiper && categories.length > 0) {
            const initialIndex = Math.min(1, categories.length - 1)
            swiper.slideTo(initialIndex, 0)
            setSelectedCategory(categories[initialIndex])
        }
    }, [swiper, categories])

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Vehicle Category Section */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold">Select Vehicle Type</h2>
                        <span className="text-lg font-medium text-gray-600">Step 1 of 4</span>
                    </div>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={40}
                    slidesPerView={Math.min(3, categories.length)}
                    centeredSlides={categories.length >= 3}
                    initialSlide={categories.length >= 3 ? 1 : 0}
                    navigation={categories.length > 3}
                    onSwiper={setSwiper}
                    onSlideChange={(swiper) => setSelectedCategory(categories[swiper.activeIndex])}
                    className="py-12"
                >
                    {categories.map((category, index) => (
                        <SwiperSlide key={category.id || index}>
                            {({ isActive }) => (
                                <div className="flex flex-col items-center transition-all duration-300">
                                    <div 
                                        className={`relative w-full aspect-square rounded-full flex items-center justify-center transition-all duration-300 ${
                                            isActive ? 'bg-yellow-400 scale-100' : 'bg-gray-100 scale-90 opacity-60'
                                        }`}
                                    >
                                        {category.image && (
                                            <img 
                                                src={`http://localhost:5000/uploads/${category.image}`} 
                                                alt={category.name} 
                                                className="w-64 h-auto  object-contain rounded-full"
                                                onError={(e) => console.log('Image load error:', e.target.src)}
                                            />
                                        )}
                                    </div>
                                    <h3 className={`mt-6 text-xl font-semibold transition-all ${
                                        isActive ? 'text-black' : 'text-gray-400'
                                    }`}>
                                        {category.name}
                                    </h3>
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
                </div>

                {selectedCategory && (

                    <>
                        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Select Services</h2>
                                <span className="text-lg font-medium text-gray-600">Step 2 of 4</span>
                            </div>
                            {services.length > 0 ? (
                                <Swiper
                                    modules={[Navigation]}
                                    spaceBetween={20}
                                    slidesPerView={Math.min(4, services.length)}
                                    navigation={services.length > 4}
                                >
                                    {services.map((service) => (
                                        <SwiperSlide key={service.id}>
                                            <div 
                                                onClick={() => toggleService(service.id)}
                                                className={`cursor-pointer rounded-lg p-6 transition-all ${
                                                    selectedServices.includes(service.id)
                                                        ? 'bg-yellow-400 shadow-lg scale-105'
                                                        : 'bg-gray-50 hover:bg-gray-100'
                                                }`}
                                            >
                                                {service.image && (
                                                    <img 
                                                        src={`http://localhost:5000/uploads/${service.image}`}
                                                        alt={service.name}
                                                        className="w-full h-32 object-cover rounded-lg mb-4"
                                                    />
                                                )}
                                                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                                                {service.description && (
                                                    <p className="text-sm text-gray-600">{service.description}</p>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                                    No services available
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Select Wash Package</h2>
                                <span className="text-lg font-medium text-gray-600">Step 3 of 4</span>
                            </div>
                            {washPackages.length > 0 ? (
                                <div className={`grid gap-6 ${
                                    washPackages.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                                    washPackages.length === 2 ? 'grid-cols-2' :
                                    washPackages.length === 3 ? 'grid-cols-3' :
                                    'grid-cols-4'
                                }`}>
                                    {washPackages.map((pkg, index) => (
                                        <div
                                            key={pkg.id}
                                            onClick={() => setSelectedPackage(pkg.id)}
                                            className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                                                selectedPackage === pkg.id 
                                                    ? 'scale-110 shadow-2xl ring-4 ring-yellow-400 z-10' 
                                                    : 'shadow-lg hover:shadow-xl'
                                            }`}
                                        >
                                            <div className={`text-white text-center py-8 relative ${
                                                selectedPackage === pkg.id 
                                                    ? 'bg-yellow-500' 
                                                    : index === 1 ? 'bg-red-500' : 'bg-blue-500'
                                            }`} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)' }}>
                                                <div className="text-sm mb-2">$</div>
                                                <div className="text-5xl font-bold mb-2">{pkg.base_price || '0.00'}</div>
                                                <div className="text-sm flex items-center justify-center gap-1">
                                                    <span>⏱</span>
                                                    <span>{pkg.duration_minutes || 0} min</span>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-white">
                                                <div className="flex items-center gap-3 mb-4">
                                                    {pkg.icon && <span className="text-2xl">{pkg.icon}</span>}
                                                    <h3 className="font-bold text-2xl">{pkg.name}</h3>
                                                </div>
                                                {pkg.features && pkg.features.length > 0 && (
                                                    <ul className="space-y-3 mb-6">
                                                        {pkg.features.map((feature) => (
                                                            <li key={feature.id} className="flex items-start gap-2">
                                                                <span className="text-blue-500 mt-1">✓</span>
                                                                <span className="text-gray-700">{feature.name}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                                <button className="w-full text-orange-500 font-semibold py-2 hover:text-orange-600 flex items-center justify-center gap-2">
                                                    Get Started →
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
                                    No wash packages available
                                </div>
                            )}
                        </div>

                        {selectedPackage && (
                            <>
                                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                                    <h2 className="text-2xl font-bold mb-6">Working Hours</h2>
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                        <div className="grid grid-cols-3 bg-gray-50 p-4 font-semibold text-center">
                                            <div>Days</div>
                                            <div>Start Work Hour</div>
                                            <div>End Work Hour</div>
                                        </div>
                                        {[
                                            { day: 'Friday', icon: '📅', start: '09:00 AM', end: '07:00 PM', bg: 'bg-cyan-50' },
                                            { day: 'Saturday', icon: '📅', start: 'Closed', end: 'Closed', bg: 'bg-blue-50' },
                                            { day: 'Sunday', icon: '📅', start: '09:00 AM', end: '04:00 PM', bg: 'bg-purple-50' },
                                            { day: 'Monday', icon: '📅', start: '09:00 AM', end: '07:00 PM', bg: 'bg-pink-50' },
                                            { day: 'Tuesday', icon: '📅', start: '09:00 AM', end: '07:00 PM', bg: 'bg-orange-50' },
                                            { day: 'Wednesday', icon: '📅', start: '09:00 AM', end: '04:00 PM', bg: 'bg-yellow-50' },
                                            { day: 'Thursday', icon: '📅', start: '09:00 AM', end: '07:00 PM', bg: 'bg-green-50' }
                                        ].map((schedule, idx) => (
                                            <div key={idx} className={`grid grid-cols-3 p-4 text-center border-t ${schedule.bg}`}>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-2xl">{schedule.icon}</span>
                                                    <span className="font-medium">{schedule.day}</span>
                                                </div>
                                                <div className="text-gray-700">{schedule.start}</div>
                                                <div className="text-gray-700">{schedule.end}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-md p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold">Select Date & Time</h2>
                                        <span className="text-lg font-medium text-gray-600">Step 4 of 4</span>
                                    </div>
                                    <div className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Select Date</label>
                                            <input
                                                type="date"
                                                value={selectedDate}
                                                onChange={handleDateChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Available Time Slots</label>
                                            {selectedDate ? (
                                                availableSlots.length > 0 ? (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {availableSlots.map((slot, index) => (
                                                            <button
                                                                key={slot.time_slot || index}
                                                                onClick={() => setSelectedTime(slot.time_slot)}
                                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                                    selectedTime === slot.time_slot
                                                                        ? 'bg-yellow-400 text-black'
                                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                                }`}
                                                            >
                                                                {slot.time_slot}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No slots available for this date</p>
                                                )
                                            ) : (
                                                <p className="text-gray-500 text-sm">Please select a date first</p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {selectedDate && selectedTime && (
                                        <>
                                            <div className="mt-8 border-t pt-6">
                                                <h3 className="text-xl font-semibold mb-6 text-center">Booking Summary</h3>
                                                <div className="grid grid-cols-4 gap-4">
                                                    <div className="bg-red-50 rounded-lg p-4 text-center">
                                                        <div className="text-red-500 text-3xl mb-2">🚗</div>
                                                        <div className="text-sm text-gray-600 mb-1">Vehicle Type</div>
                                                        <div className="font-semibold">{selectedCategory?.name}</div>
                                                    </div>
                                                    <div className="bg-red-50 rounded-lg p-4 text-center">
                                                        <div className="text-red-500 text-3xl mb-2">📅</div>
                                                        <div className="text-sm text-gray-600 mb-1">Appointment Date</div>
                                                        <div className="font-semibold">{new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                                    </div>
                                                    <div className="bg-red-50 rounded-lg p-4 text-center">
                                                        <div className="text-red-500 text-3xl mb-2">🕐</div>
                                                        <div className="text-sm text-gray-600 mb-1">Appointment Time</div>
                                                        <div className="font-semibold">{selectedTime}</div>
                                                    </div>
                                                    <div className="bg-red-50 rounded-lg p-4 text-center">
                                                        <div className="text-red-500 text-3xl mb-2">💰</div>
                                                        <div className="text-sm text-gray-600 mb-1">Total Price</div>
                                                        <div className="font-semibold text-lg">${totalPrice.toFixed(2)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="mt-6 w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-colors">
                                                Book Appointment 📋
                                            </button>
                                        </>
                                    )}
                                    </div>
                                </div>
                            </>
                        )}


                        
                    </>
                )}
            </div>
        </div>
    )
}

export default Book
