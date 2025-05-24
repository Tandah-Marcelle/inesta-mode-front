import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How can I order a custom dress?",
    answer: "You can order a custom dress by visiting our Custom Designs collection or contacting us directly through our contact form. We'll schedule a consultation to discuss your requirements, take measurements, and create your perfect dress."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 14 days of delivery for standard collection items in their original condition. Custom-made dresses are non-returnable unless there are significant defects."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days within the country. International shipping typically takes 7-14 business days. Express shipping options are available at checkout."
  },
  {
    question: "Do you offer alterations?",
    answer: "Yes, we offer alterations for all our dresses. The first fitting and basic alterations are complimentary. Additional modifications may incur extra charges."
  },
  {
    question: "Can I schedule a virtual fitting?",
    answer: "Yes! We offer virtual fitting sessions through video call. You'll need someone to help take your measurements, and we'll guide you through the process."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers. For custom orders, we require a 50% deposit to begin work."
  }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-secondary-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">
            Find answers to common questions about our services, ordering process, and policies
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between"
              >
                <span className="text-lg font-medium text-left">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-primary-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-secondary-400" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-white px-6 pb-6 rounded-b-lg shadow-sm">
                      <p className="text-secondary-700">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;