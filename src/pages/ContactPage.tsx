import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useContactForm } from '../hooks/useContactForm';

function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  
  const { submitForm, isSubmitting, isSuccess, error, resetForm } = useContactForm();
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await submitForm({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        subject: formData.subject,
        message: formData.message
      });
      
      // Reset form on success
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    }
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
                
                {/* Success Message */}
                {isSuccess && (
                  <div className="bg-success-50 text-success-700 p-6 rounded-lg mb-6 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium mb-1">Message envoyé avec succès !</h3>
                      <p>Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
                    </div>
                  </div>
                )}
                
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 text-red-700 p-6 rounded-lg mb-6 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-medium mb-1">Erreur d'envoi</h3>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                
                {!isSuccess && (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-1">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-1">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                          Email *
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
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="company" className="block text-sm font-medium text-secondary-700 mb-1">
                        Entreprise/Organisation
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-1">
                        Sujet *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="Demande d'informations produits">Demande d'informations produits</option>
                        <option value="Commande et livraison">Commande et livraison</option>
                        <option value="Création sur mesure">Création sur mesure</option>
                        <option value="Partenariat">Partenariat</option>
                        <option value="Support technique">Support technique</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-1">
                        Votre Message *
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
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
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