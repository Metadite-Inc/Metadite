
import { Star } from 'lucide-react';

const TestimonialsSection = ({ testimonials, theme }) => {
  return (
    <section className={`py-16 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community has to say about Metadite.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="glass-card p-6 rounded-xl hover:shadow-lg transition-all">
      <div className="flex items-center mb-4">
        <div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 italic">"{testimonial.text}"</p>
    </div>
  );
};

export default TestimonialsSection;
