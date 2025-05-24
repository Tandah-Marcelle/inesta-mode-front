import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Julie Samira Nguini",
    title: "Miss Cameroon 2016",
    image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    quote: "Inesta Mode's designs perfectly capture the essence of modern African beauty. Their attention to detail and craftsmanship is unmatched."
  },
  {
    name: "Jessica Ngoua",
    title: "Miss Cameroon 2017",
    image: "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    quote: "I've worn many designer dresses, but none compare to the elegance and comfort of Inesta Mode's creations."
  },
  {
    name: "Aimee Diane",
    title: "Miss Cameroon 2018",
    image: "https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    quote: "The way Inesta Mode combines traditional elements with modern design is truly remarkable."
  },
  {
    name: "Audrey Nabila",
    title: "Miss Cameroon 2019",
    image: "https://images.pexels.com/photos/1989248/pexels-photo-1989248.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    quote: "Every dress tells a story, and Inesta Mode helps me tell mine with grace and style."
  },
  {
    name: "Angèle Kossinda",
    title: "Miss Cameroon 2020",
    image: "https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    quote: "Their custom designs make me feel confident and beautiful every time I step onto the stage."
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
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-subtitle">
            Hear from some of the distinguished personalities who have worn our designs
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