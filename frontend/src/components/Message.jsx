import React, { useState } from 'react'
import { contactApi } from '../api';

function Message() {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!accepted) {
            setStatus({ type: 'error', message: 'Please accept terms and conditions' });
            return;
        }
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            await contactApi.submitContact(formData);
            setStatus({ type: 'success', message: 'Message sent successfully!' });
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setAccepted(false);
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to send message' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-6xl mx-auto px-35 py-12'>
            <h2 className='text-4xl font-bold text-center mb-12'>Feel Free To Leave A Message</h2>
            
            {status.message && (
                <div className={`mb-6 p-4 rounded-lg text-center ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status.message}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <input 
                        type='text' 
                        name='name'
                        placeholder='Name' 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className='w-full px-6 py-4 bg-gray-100 rounded-full outline-none'
                    />
                    <input 
                        type='email' 
                        name='email'
                        placeholder='Email' 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className='w-full px-6 py-4 bg-gray-100 rounded-full outline-none'
                    />
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <input 
                        type='tel' 
                        name='phone'
                        placeholder='Phone Number' 
                        value={formData.phone}
                        onChange={handleChange}
                        className='w-full px-6 py-4 bg-gray-100 rounded-full outline-none'
                    />
                    <input 
                        type='text' 
                        name='subject'
                        placeholder='Your Subject' 
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className='w-full px-6 py-4 bg-gray-100 rounded-full outline-none'
                    />
                </div>
                
                <textarea 
                    name='message'
                    placeholder='Your Message' 
                    rows='6' 
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className='w-full px-6 py-4 bg-gray-100 rounded-3xl outline-none resize-none'
                ></textarea>
                
                <div className='flex items-center gap-2'>
                    <input 
                        type='checkbox' 
                        id='terms' 
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        className='w-4 h-4' 
                    />
                    <label htmlFor='terms' className='text-gray-700'>
                        Accept <span className='text-orange-500'>Terms & Conditions</span> And <span className='text-orange-500'>Privacy Policy.</span>
                    </label>
                </div>
                
                <div className='text-center'>
                    <button 
                        type='submit' 
                        disabled={loading}
                        className='bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Sending...' : 'Submit Now →'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Message
