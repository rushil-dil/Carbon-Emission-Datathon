'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import useSubmitSurvey from '@/api/api';  
const router = useRouter();

useEffect(() => {
    if (response) {
      // Redirect to a results or insights page
      router.push(`/insights/${response.id}`);  // or `/results`, or whatever
    }
  }, [response, router]);
const questions = [
    {
      id: 'bodyType',
      label: 'What\'s your body type?',
      options: ['underweight', 'normal', 'overweight', 'obese'],
      type: 'select',
    },
    {
      id: 'sex',
      label: 'What\'s is your sex?',
      options: ['male', 'female'],
      type: 'select',
    },
    {
      id: 'diet',
      label: 'How would you generally categorize your diet?',
      options: ['pescatarian', 'vegetarian', 'omnivore', 'vegan'],
      type: 'select',
    },
    {
      id: 'shower',
      label: 'How often do you shower?',
      options: ['daily', 'less frequently', 'more frequently', 'twice a day'],
      type: 'select',
    },
    {
      id: 'heatingSource',
      label: 'What energy source do you use for heating?',
      options: ['coal', 'natural gas', 'wood', 'electricity'],
      type: 'select',
    },
    {
      id: 'transport',
      label: 'What do you use for transportation?',
      options: ['public', 'private', 'walk/bicycle'],
      type: 'select',
    },
    {
      id: 'vehicleType',
      label: 'What type of vehicle do you use (if any)?',
      options: ['petrol', 'diesel', 'hybrid', 'electric', 'none', 'lpg'],
      type: 'select',
    },
    {
      id: 'socialActivity',
      label: 'How often do you socialize with others?',
      options: ['never', 'sometimes', 'often', 'very frequently'],
      type: 'select',
    },
    {
      id: 'monthlyGroceryBill',
      label: 'What is your average monthly grocery bill (USD)?',
      type: 'input',
    },
    {
      id: 'airTravelFrequency',
      label: 'How often do you travel by air?',
      options: ['never', 'rarely', 'sometimes', 'frequently', 'very frequently'],
      type: 'select',
    },
    {
      id: 'vehicleDistance',
      label: 'What is the average distance you drive per month (km)?',
      type: 'input',
    },
    {
      id: 'wasteBagSize',
      label: 'What is the size of your regular trash bag?',
      options: ['small', 'medium', 'large', 'extra large'],
      type: 'select',
    },
    {
      id: 'wasteBagWeeklyCount',
      label: 'How many waste bags do you throw away per week?',
      type: 'input',
    },
    {
      id: 'tvPcDailyHour',
      label: 'How many hours a day do you spend on TV or PC?',
      type: 'input',
    },
    {
      id: 'newClothesMonthly',
      label: 'How many new clothes do you buy per month?',
      type: 'input',
    },
    {
      id: 'internetDailyHour',
      label: 'How many hours a day do you spend on the internet?',
      type: 'input',
    },
    {
      id: 'energyEfficiency',
      label: 'Is your home energy efficient?',
      options: ['Yes', 'No', 'Sometimes'],
      type: 'select',
    },
    {
      id: 'recycling',
      label: 'What materials do you recycle?',
      options: ['Paper', 'Plastic', 'Glass', 'Metal'],
      type: 'multi-select',
    },
    {
      id: 'cookingWith',
      label: 'What appliances do you commonly use for cooking?',
      options: ['Stove', 'Oven', 'Microwave', 'Grill', 'Airfryer'],
      type: 'multi-select',
    }
  ];

  export function CarbonSurveyForm() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const { submitSurvey, isLoading, error, response } = useSubmitSurvey();  // Hook for submission
  
    const handleNext = () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        // When last question is answered, submit the form
        handleSubmit();
      }
    };
  
    const handleChange = (e) => {
      const question = questions[currentQuestion];
      const { value } = e.target;
  
      if (question.type === 'multi-select') {
        const current = answers[question.id] || [];
        if (current.includes(value)) {
          setAnswers((prev) => ({
            ...prev,
            [question.id]: current.filter((v) => v !== value),
          }));
        } else {
          setAnswers((prev) => ({
            ...prev,
            [question.id]: [...current, value],
          }));
        }
      } else {
        setAnswers((prev) => ({
          ...prev,
          [question.id]: value,
        }));
      }
    };
  
    const handleSubmit = async () => {
      try {
        await submitSurvey(answers);  // Submit the answers to the backend
      } catch (err) {
        console.error('Error submitting survey:', err);
      }
    };
  
    const question = questions[currentQuestion];
    const answer = answers[question.id];
  
    return (
      <div className="w-full max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">{question.label}</h2>
  
            {question.type === 'select' && (
              <select
                className="w-full p-2 mb-4 border rounded"
                onChange={handleChange}
                value={answer || ''}
              >
                <option value="" disabled>Select an option</option>
                {question.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
  
            {question.type === 'input' && (
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full p-2 mb-4 border rounded"
                onChange={handleChange}
                value={answer || ''}
              />
            )}
  
            {question.type === 'multi-select' && (
              <div className="space-y-2 mb-4">
                {question.options.map((option, idx) => (
                  <label key={idx} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={answer?.includes(option)}
                      onChange={handleChange}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
  
            <div className="flex justify-end">
              <Button
                onClick={handleNext}
                disabled={
                  question.type === 'multi-select'
                    ? !answer || answer.length === 0
                    : !answer
                }
                className="mt-2"
              >
                {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
  
        {/* Optional: Show loading or response status */}
        {isLoading && <p>Submitting...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {response && <p className="text-green-500">Success! Thank you for your response.</p>}
      </div>
    );
  }
    
