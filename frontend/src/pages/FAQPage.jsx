import { useState, useEffect } from 'react';
import { faqApi } from '../api';
import { FaPlus, FaMinus } from 'react-icons/fa';
import Message from "../components/Message"

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await faqApi.getAllFaqs();
      setFaqs(Array.isArray(response) ? response : (response.data || []));
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <div className="text-center py-20 text-lg">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        <div className="rounded-2xl overflow-hidden">
          <img
            src="/images/faq-img.jpg"
            alt="Car Wash Service"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h6 className="text-red-500 text-sm font-semibold mb-2">FAQ</h6>
          <h2 className="text-4xl font-bold mb-4">Usually Asked Questions</h2>
          <p className="text-gray-600 mb-8">
            Ask especially collecting terminated may son expression collecting lorem may son expression text.
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="border-b border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between py-4 text-left hover:text-red-500 transition"
                >
                  <span className="text-lg font-semibold pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <FaMinus className="text-red-500 flex-shrink-0" />
                  ) : (
                    <FaPlus className="flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="pb-4 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
      <div>
<Message />
      </div>
    </div>
  );
};

export default FAQPage;
