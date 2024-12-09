import React, { useState, useEffect } from 'react'
import gif1 from './gifs/activ.gif'
import gif2 from './gifs/itin.gif'
import gif3 from './gifs/hotel.gif'
import gif4 from './gifs/trans.gif'
import gif5 from './gifs/flight.gif'
import gif6 from './gifs/product.gif'
import gif7 from './gifs/ViewBookings.gif'

const steps = [
  {
    title: "Book Your Activities",
    description: "Browse and book exciting activities for your trip.",
    image: gif1,
    arrowPosition: { top: '50%', left: '50%' }
  },
  {
    title: "Book Your Itinerary",
    description: "Create a custom itinerary for your trip.",
    image: gif2,
    arrowPosition: { top: '30%', right: '20%' }
  },
  {
    title: "Book Your Hotel",
    description: "Select from a variety of hotels or vacation rentals.",
    image: gif3,
    arrowPosition: { bottom: '25%', left: '40%' }
  },
  {
    title: "Book Your Transporation",
    description: "Find the best transportation options for your trip.",
    image: gif4,
    arrowPosition: { top: '60%', right: '30%' }
  },
  {
    title: "Book Your Flight",
    description: "Find the best deals on flights for your trip.",
    image: gif5,
    arrowPosition: { bottom: '20%', left: '25%' }
  },
  {
    title: "Purchase Travel Products",
    description: "Shop for travel products to make your trip more enjoyable.",
    image: gif6,
    arrowPosition: { bottom: '20%', left: '25%' }
  },
  {
    title: "View Your Bookings",
    description: "View all of your bookings in one place.",
    image: gif7,
    arrowPosition: { bottom: '20%', left: '25%' }
  },
]

export default function VacationGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsPlaying(true)
      }, 500) // 2 seconds delay

      return () => clearTimeout(timer)
    } else {
      setIsPlaying(false)
    }
  }, [isOpen, currentStep])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setIsPlaying(false) // Reset playing state for new step
    } else {
      setIsOpen(false)
      setCurrentStep(0)
    }
  }

  const handleSkip = () => {
    setIsOpen(false)
    setCurrentStep(0)
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r text-xl from-third to-second hover:from-first hover:to-second text-white font-bold py-1.5 px-4 rounded-full shadow-lg transform transition duration-500 hover:scale-105"
      >
        ?
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl w-[600px] mt-28 overflow-hidden">
            <div className="px-8 pt-6">
              <h2 className="text-2xl font-bold text-first mb-2">{steps[currentStep].title}</h2>
              <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
            </div>
            
            <div className="relative aspect-[16/9] bg-gray-100 flex items-center justify-center">
              <img 
                src={steps[currentStep].image} 
                alt={steps[currentStep].title} 
                className="w-full h-full object-contain"
                style={{ 
                  opacity: isPlaying ? 1 : 0, 
                  transition: 'opacity 0.5s ease-in-out',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-second border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            {/* Step indicator dots */}
            <div className="flex justify-center items-center space-x-2 my-4" role="navigation" aria-label="Step progress">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-second w-3 h-3' 
                      : index < currentStep 
                        ? 'bg-third' 
                        : 'bg-gray-300'
                  }`}
                  aria-current={index === currentStep ? 'step' : undefined}
                  aria-label={`Step ${index + 1} of ${steps.length}`}
                />
              ))}
            </div>

            <div className="flex justify-between p-6 bg-gray-50">
              <button 
                onClick={handleSkip}
                className="px-6 py-2 rounded-full border-2 border-second text-second font-medium hover:bg-third transition-colors"
              >
                Skip
              </button>
              <button 
                onClick={handleNext}
                className="px-6 py-2 rounded-full bg-second text-white font-medium hover:bg-first transition-colors"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

