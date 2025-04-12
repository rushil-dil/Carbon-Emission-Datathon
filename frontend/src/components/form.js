"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, ArrowRight, Check, ChevronRight, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import useSubmitSurvey from "@/api/api";

// Environmental insights for each question
const insights = {
  bodyType: "Body mass can impact carbon footprint through dietary requirements and metabolic needs.",
  sex: "Biological factors can influence resource consumption patterns.",
  diet: "A vegan diet can reduce your carbon footprint by up to 73% compared to a meat-heavy diet.",
  shower: "A typical shower uses 2.5 gallons of water per minute. Reducing shower time saves both water and energy.",
  heatingSource: "Natural gas heating produces about 40% less carbon emissions than coal.",
  transport: "Public transportation can reduce CO2 emissions by up to 45% compared to private vehicles.",
  vehicleType: "Electric vehicles produce zero direct emissions, while hybrids reduce emissions by 30-60%.",
  socialActivity: "Social activities often involve travel and consumption, impacting your carbon footprint.",
  monthlyGroceryBill: "Local, seasonal food can reduce carbon emissions from transportation by up to 20%.",
  airTravelFrequency: "A single transatlantic flight can add 1.6 tons of CO2 to your carbon footprint.",
  vehicleDistance: "Every 1,000 km driven in a gasoline car produces approximately 240 kg of CO2.",
  wasteBagSize: "The average person generates about 4.5 pounds of waste per day.",
  wasteBagWeeklyCount: "Reducing waste by composting can decrease your household waste by up to 30%.",
  tvPcDailyHour: "Electronic devices in standby mode can account for 5-10% of residential energy use.",
  newClothesMonthly: "The fashion industry produces 10% of global carbon emissions and is the second-largest consumer of water.",
  internetDailyHour: "Internet usage contributes to your carbon footprint through data center energy consumption.",
  energyEfficiency: "Energy-efficient homes can reduce energy consumption by 25-30%.",
  recycling: "Recycling one ton of paper saves 17 trees and 7,000 gallons of water.",
  cookingWith: "Microwaves use 80% less energy than conventional ovens for small portions."
};

// Original questions from your document
const questions = [
  {
    id: "bodyType",
    label: "What's your body type?",
    options: ["underweight", "normal", "overweight", "obese"],
    type: "select",
  },
  {
    id: "sex",
    label: "What's is your sex?",
    options: ["male", "female"],
    type: "select",
  },
  {
    id: "diet",
    label: "How would you generally categorize your diet?",
    options: ["pescatarian", "vegetarian", "omnivore", "vegan"],
    type: "select",
  },
  {
    id: "shower",
    label: "How often do you shower?",
    options: ["daily", "less frequently", "more frequently", "twice a day"],
    type: "select",
  },
  {
    id: "heatingSource",
    label: "What energy source do you use for heating?",
    options: ["coal", "natural gas", "wood", "electricity"],
    type: "select",
  },
  {
    id: "transport",
    label: "What do you use for transportation?",
    options: ["public", "private", "walk/bicycle"],
    type: "select",
  },
  {
    id: "vehicleType",
    label: "What type of vehicle do you use (if any)?",
    options: ["petrol", "diesel", "hybrid", "electric", "none", "lpg"],
    type: "select",
  },
  {
    id: "socialActivity",
    label: "How often do you socialize with others?",
    options: ["never", "sometimes", "often", "very frequently"],
    type: "select",
  },
  {
    id: "monthlyGroceryBill",
    label: "What is your average monthly grocery bill (USD)?",
    type: "input",
  },
  {
    id: "airTravelFrequency",
    label: "How often do you travel by air?",
    options: ["never", "rarely", "sometimes", "frequently", "very frequently"],
    type: "select",
  },
  {
    id: "vehicleDistance",
    label: "What is the average distance you drive per month (km)?",
    type: "input",
  },
  {
    id: "wasteBagSize",
    label: "What is the size of your regular trash bag?",
    options: ["small", "medium", "large", "extra large"],
    type: "select",
  },
  {
    id: "wasteBagWeeklyCount",
    label: "How many waste bags do you throw away per week?",
    type: "input",
  },
  {
    id: "tvPcDailyHour",
    label: "How many hours a day do you spend on TV or PC?",
    type: "input",
  },
  {
    id: "newClothesMonthly",
    label: "How many new clothes do you buy per month?",
    type: "input",
  },
  {
    id: "internetDailyHour",
    label: "How many hours a day do you spend on the internet?",
    type: "input",
  },
  {
    id: "energyEfficiency",
    label: "Is your home energy efficient?",
    options: ["Yes", "No", "Sometimes"],
    type: "select",
  },
  {
    id: "recycling",
    label: "What materials do you recycle?",
    options: ["Paper", "Plastic", "Glass", "Metal"],
    type: "multi-select",
  },
  {
    id: "cookingWith",
    label: "What appliances do you commonly use for cooking?",
    options: ["Stove", "Oven", "Microwave", "Grill", "Airfryer"],
    type: "multi-select",
  }
];

export function CarbonSurveyForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showInsight, setShowInsight] = useState(false);
  const { submitSurvey, isLoading, error, response } = useSubmitSurvey();
  const router = useRouter();

  
  useEffect(() => {
    if (response) {
      // Cache the response data
      localStorage.setItem('surveyResponse', JSON.stringify(response));
      // Redirect to the response page
      router.push(`/response`);
    }
  }, [response, router]);
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      toast.success(`Question ${currentQuestion + 1} completed!`);
      setCurrentQuestion((prev) => prev + 1);
      setShowInsight(false);
    } else {
      handleSubmit();
    }
  };

  const handleChange = (value, question) => {
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
    toast.promise(submitSurvey(answers), {
      loading: 'Calculating your environmental impact...',
      success: 'Analysis complete!',
      error: 'Something went wrong. Please try again.'
    });
  };

  const toggleInsight = () => {
    setShowInsight(!showInsight);
  };

  const question = questions[currentQuestion];
  const answer = answers[question.id];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-neutral-900 p-4">
      <Toaster position="top-center" richColors />

      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-300 text-center mb-2">Environmental Impact Assessment</h1>
          <p className="text-green-600 dark:text-green-400 text-center mb-4">Question {currentQuestion + 1} of {questions.length}</p>
          <Progress value={progress} className="h-2 bg-green-100 dark:bg-green-900">
            <div className="h-full bg-green-600 dark:bg-green-400 rounded-full" style={{ width: `${progress}%` }} />
          </Progress>
        </div>

        <Card className="border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader className="bg-green-50 dark:bg-green-900/40 border-b border-green-100 dark:border-green-800">
            <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
              <span>{question.label}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto text-green-600 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-200 dark:hover:bg-green-900"
                onClick={toggleInsight}
              >
                <Info size={18} />
              </Button>
            </CardTitle>
            
            <AnimatePresence>
              {showInsight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardDescription className="mt-2 p-2 bg-green-100 dark:bg-green-800/50 rounded-md flex items-start gap-2">
                    <Lightbulb size={16} className="mt-1 text-green-600 dark:text-green-400" />
                    <span className="text-green-800 dark:text-green-200">{insights[question.id]}</span>
                  </CardDescription>
                </motion.div>
              )}
            </AnimatePresence>
          </CardHeader>

          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={question.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {question.type === 'select' && (
                  <Select onValueChange={(value) => handleChange(value, question)} value={answer || ""}>
                    <SelectTrigger className="w-full border-green-200 dark:border-green-800">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {question.options.map((option, idx) => (
                        <SelectItem key={idx} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {question.type === 'input' && (
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    className="border-green-200 dark:border-green-800"
                    onChange={(e) => handleChange(e.target.value, question)}
                    value={answer || ''}
                  />
                )}

                {question.type === 'multi-select' && (
                  <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Checkbox 
                          id={`${question.id}-${option}`} 
                          checked={answer?.includes(option)} 
                          onCheckedChange={() => handleChange(option, question)}
                          className="border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <label 
                          htmlFor={`${question.id}-${option}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-green-100 dark:border-green-800 pt-4 bg-green-50/50 dark:bg-green-900/30">
            <Button
              variant="outline" 
              className="border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900 dark:hover:text-green-300"
              onClick={toggleInsight}
            >
              {showInsight ? "Hide Insight" : "Show Insight"}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={
                question.type === 'multi-select'
                  ? !answer || answer.length === 0
                  : !answer
              }
              className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 flex items-center gap-1"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <span>Submit</span>
                  <Check size={16} />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight size={16} />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {(isLoading || error) && (
          <div className="mt-4 p-4 rounded-md bg-white dark:bg-neutral-800 shadow-md">
            {isLoading && <p className="text-green-600 dark:text-green-400">Analyzing your responses...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}