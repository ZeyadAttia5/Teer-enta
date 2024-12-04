import React, { useState } from 'react'

const steps = [
  {
    title: "Choose Your Destination",
    description: "Click on the map to select your dream vacation spot.",
    image: "https://images.travelandleisureasia.com/wp-content/uploads/sites/3/2023/02/02192048/great-wall-of-china.jpeg",
    arrowPosition: { top: '50%', left: '50%' }
  },
  {
    title: "Select Your Dates",
    description: "Use the calendar to pick your travel dates.",
    image: "https://media.cntraveler.com/photos/5818a486b6f3d25e7b5c6a3e/master/pass/GettyImages-573103543.jpg",
    arrowPosition: { top: '30%', right: '20%' }
  },
  {
    title: "Book Your Flight",
    description: "Choose from available flights for your selected dates.",
    image: "https://www.aesdes.org/wp-content/uploads/2019/01/pyramids.jpg",
    arrowPosition: { bottom: '25%', left: '40%' }
  },
  {
    title: "Reserve Your Accommodation",
    description: "Select from a variety of hotels or vacation rentals.",
    image: "http://www.sumit4allphotography.com/wp-content/uploads/2015/04/paris-013.jpg",
    arrowPosition: { top: '60%', right: '30%' }
  },
  {
    title: "Plan Your Activities",
    description: "Browse and book exciting activities for your trip.",
    image: "https://anamericaninrome.com/wp-content/uploads/2017/08/Colosseum-at-Night-2.jpg",
    arrowPosition: { bottom: '20%', left: '25%' }
  }
]

export default function VacationGuide() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsOpen(false)
      setCurrentStep(0)
    }
  }

  const handleSkip = () => {
    setIsOpen(false)
    setCurrentStep(0)
  }

  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'unset'
  }

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r text-xl from-third to-second hover:from-first hover:to-second text-white font-bold py-1.5 px-4 rounded-full shadow-lg transform transition duration-500 hover:scale-105 "
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
          <div className="relative bg-white rounded-xl shadow-2xl w-[600px] overflow-hidden">
            <div className="px-8 pt-6">
              <h2 className="text-2xl font-bold text-first mb-2">{steps[currentStep].title}</h2>
              <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
            </div>
            
            <div className="relative aspect-[16/9] bg-gray-100">
              <img 
                src={steps[currentStep].image} 
                alt={steps[currentStep].title} 
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute w-12 h-12 bg-yellow-400 rounded-full animate-pulse"
                style={{
                  ...steps[currentStep].arrowPosition,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
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

