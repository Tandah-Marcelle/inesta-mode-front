import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <>
      <section className="pt-24 pb-12 bg-secondary-950 text-white">
        <div className="container-custom">
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-6">
            Contact Us
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Have questions or want to learn more about our dresses? We're here to help and would love to hear from you.
          </p>
        </div>
      </section>
      
      <section ref={ref} className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {inView && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-sm text-center"
                >
                  <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Our Location</h3>
                  <p className="text-secondary-600">
                    123 Fashion Avenue<br />
                    Design District<br />
                    New York, NY 10001
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-lg shadow-sm text-center"
                >
                  <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Phone & Email</h3>
                  <p className="text-secondary-600 mb-2">
                    +1 (212) 555-7890
                  </p>
                  <p className="text-secondary-600">
                    contact@inestamode.com
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-6 rounded-lg shadow-sm text-center"
                >
                  <div className="mx-auto w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">Opening Hours</h3>
                  <p className="text-secondary-600 mb-1">
                    Monday - Friday: 9am - 6pm
                  </p>
                  <p className="text-secondary-600 mb-1">
                    Saturday: 10am - 5pm
                  </p>
                  <p className="text-secondary-600">
                    Sunday: Closed
                  </p>
                </motion.div>
              </>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {inView && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl font-medium mb-6">Get In Touch</h2>
                <p className="text-secondary-700 mb-8">
                  Whether you have questions about our dresses, custom orders, or anything else, we'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
                </p>
                
                {isSubmitted ? (
                  <div className="bg-success-50 text-success-700 p-6 rounded-lg">
                    <h3 className="text-xl font-medium mb-2">Thank You!</h3>
                    <p>Your message has been sent successfully. We'll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-1">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="order">Order Inquiry</option>
                        <option value="custom">Custom Design Request</option>
                        <option value="sizing">Sizing Question</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="btn-primary w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
            
            {inView && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-lg overflow-hidden shadow-md h-[500px]"
              >
                <iframe
                  title="Inesta Mode Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304605!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1629382360000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactPage;