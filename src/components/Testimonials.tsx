import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

import princessIssie from '../assets/images/princess issie/1.jpg';
import juliaSamantha from '../assets/images/julia Samantha/5.jpg';
import DeuxiemeDauphine2023  from '../assets/images/2ème Dauphine Miss Cameroun 2023/1.jpg';
import DeuxiemeDauphine2024 from '../assets/images/2ème Dauphine Miss Cameroun 2024 chez inesta/3.jpg';
import clientX from '../assets/images/Children/Fille Inesta/22.jpg';
import  clienthomme from '../assets/images/Collection homme/2.jpg';


const testimonials = [
  {
    name: "Princesse Issie",
    title: "Miss Cameroon 2023",
    image: princessIssie,
    quote: "Les créations d’Inesta Mode capturent parfaitement l’essence de la beauté africaine moderne. Leur souci du détail et leur savoir-faire sont incomparables."
  },
  {
    name: "Julia Samantha",
    title: "Miss Cameroon XXXX",
    image: juliaSamantha,
    quote: " J’ai porté de nombreuses robes de créateurs, mais aucune n’égale l’élégance et le confort des créations d’Inesta Mode."
  },
    {
    name: "No name",
    title: " XXX",
    image: clienthomme,
    quote: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  },

  {
    name: "No name",
    title: "2ème Dauphine Miss Cameroun 2023",
    image: DeuxiemeDauphine2023,
    quote: " La manière dont Inesta Mode allie éléments traditionnels et design moderne est tout simplement remarquable."
  },
  {
    name: "No name",
    title: "2ème Dauphine Miss Cameroun 2024",
    image: DeuxiemeDauphine2024,
    quote: "Chaque création d'Inesta mode racconte une histoire. "
  },
  
  {
    name: "No name",
    title: " XXX",
    image: clientX,
    quote: "Je suis tres fiere de ma Maman, je l'aime beaucoup et je souhaterai etre comme elle un jour"
  }
  
];

function Testimonials() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="section-title">Ce que disent nos clients</h2>
          <p className="section-subtitle">
            Quelques-unes des personnalites qui apprecies et encouragent notre travail.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            inView && (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="aspect-w-3 aspect-h-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="p-6">
                  <blockquote className="text-secondary-700 italic mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <h4 className="font-display text-lg font-medium">{testimonial.name}</h4>
                    <p className="text-primary-600">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;