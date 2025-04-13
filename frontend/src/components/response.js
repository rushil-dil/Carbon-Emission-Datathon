'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeroHighlight, Highlight } from './hero';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, ComposedChart, ReferenceLine, ReferenceArea } from 'recharts';
import { useCohereGenerate } from '@/api/api';
const getIntervalForValue = (value) => {
  const intervals = [
    [0, 900],
    [900, 1800],
    [1800, 2700],
    [2700, 3600],
    [3600, 4500],
    [4500, 5400],
    [5400, 6300],
    [6300, 7200],
    [7200, 8100],
    [8100, 9000],
  ];

  for (let [low, high] of intervals) {
    if (value >= low && value < high) {
      return `${String(low).padStart(4, '0')}-${String(high).padStart(5, '0')}`;
    }
  }

  return null;
};

export function CarbonFootprintDashboard() {
  const [responseData, setResponseData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [answerData, setAnswerData] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const { generateTips, output: tipsData, loading: tipsLoading } = useCohereGenerate();

  const router = useRouter();
  

  useEffect(() => {
    const cachedResponse = localStorage.getItem('surveyResponse');
    const cachedAnswers = localStorage.getItem('carbonSurveyAnswers');
    console.log(cachedAnswers)

    if (cachedResponse) {
      try {
        const parsedResponse = JSON.parse(cachedResponse);
        console.log('Parsed survey response: ', parsedResponse);
        setResponseData(parsedResponse);
      } catch (error) {
        console.error('Error parsing survey response:', error);
      }
    }

    if (cachedAnswers) {
      try {
        const parsedAnswers = JSON.parse(cachedAnswers);
        console.log('Parsed answers', parsedAnswers)
        setAnswerData(parsedAnswers);
      } catch (error) {
        console.error('Error parsing survey answers:', error);
      }
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (responseData && Object.keys(responseData).length > 0) {
      console.log('Updated responseData: ', responseData);
    }
  }, [responseData]);

  useEffect(() => {
    if (answerData && Object.keys(answerData).length > 0) {
      console.log('Updated answerData: ', answerData);
    }
  }, [answerData]);


useEffect(() => {
    if (answerData) {
      const formattedPrompt = `
  You are a helpful assistant that gives actionable, eco-friendly tips based on user lifestyle data.
  
  Here is the user's data (in JSON format):
  ${JSON.stringify(answerData, null, 2)}
  
  Based on this data, generate 5 personalized carbon footprint reduction tips as a list of strings, and provide a short summary sentence about the potential impact.
  
  Output the result as JSON with this format. (MAKE SURE TO STRICTLY FOLLOW The format with braces, and strings, needs to be a valid string):
  {
    "reductionTips": [ ... ],
    "impactSummary": "..."
  }
      `;
      console.log(answerData);
      console.log('sending request to cohere');
      generateTips(formattedPrompt);
    }
  }, [answerData]);

  useEffect(() => {
    if (responseData && Object.keys(responseData).length > 0) {
      try {
        const dummyData = {
          result: responseData.result || 0,
          breakdown: responseData.breakdown || {
            transportation: 1850,
            energy: 1420,
            food: 980,
            shopping: 622,
          },
          comparison: responseData.comparison || {
            nationalAvg: 6200,
            globalAvg: 4600,
          },
        };

        setGraphData(dummyData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading response data:', error);
        setIsLoading(false);
      }
    } else {
        setIsLoading(false);
    }
  }, [responseData]);

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto mt-10 p-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-green-200 dark:bg-green-800 rounded mb-4"></div>
          <div className="h-64 w-full bg-green-100 dark:bg-green-900 rounded"></div>
        </div>
      </div>
    );
  }

  if (!responseData || !graphData) {
    return (
      <div className="w-full max-w-md mx-auto mt-10 p-4">
        <Card className="rounded-lg border border-green-200 dark:border-green-800 shadow-md">
          <CardHeader className="bg-green-50 dark:bg-green-900/30">
            <CardTitle>
              <Highlight className="text-green-700 dark:text-green-300">No Response Data Found</Highlight>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              It seems your survey responses haven't been processed yet.
            </p>
            <Button onClick={() => router.push('/')} className="mt-4 bg-green-600 hover:bg-green-700">
              Back to Survey
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const histogramData = [
    { range: '0-900', count: 304 },
    { range: '900-1800', count: 3474 },
    { range: '1800-2700', count: 3542 },
    { range: '2700-3600', count: 1642 },
    { range: '3600-4500', count: 645 },
    { range: '4500-5400', count: 278 },
    { range: '5400-6300', count: 92 },
    { range: '6300-7200', count: 18 },
    { range: '7200-8100', count: 4 },
    { range: '8100-9000', count: 1 },
  ];

  const breakdownData = [
    { name: 'Transportation', value: graphData.breakdown.transportation },
    { name: 'Energy', value: graphData.breakdown.energy },
    { name: 'Food', value: graphData.breakdown.food },
    { name: 'Shopping', value: graphData.breakdown.shopping },
  ];

  const comparisonData = [
    { name: 'Your Footprint', value: graphData.result },
    { name: 'National Avg', value: graphData.comparison.nationalAvg },
    { name: 'Global Avg', value: graphData.comparison.globalAvg },
  ];
  

  const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#AFB42B'];
  const userInterval = getIntervalForValue(graphData.result);

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 p-4">
      <div className="flex flex-col space-y-6">
        {/* Header Card */}
        <Card className="border border-green-200 dark:border-green-800 shadow-md">
          <CardHeader className="bg-green-50 dark:bg-green-900/30">
            <CardTitle className="text-2xl text-green-700 dark:text-green-300 flex justify-between items-center">
              <span>Your Carbon Footprint Dashboard</span>
              <span className="text-lg font-normal text-green-600 dark:text-green-400">
                Last Updated: May 2025
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {graphData.result.toLocaleString()} kg CO₂e
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Your annual carbon footprint</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setActiveTab('overview')} 
                  variant={activeTab === 'overview' ? "default" : "outline"}
                  className={activeTab === 'overview' ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"}
                >
                  Overview
                </Button>
                <Button 
                  onClick={() => setActiveTab('breakdown')} 
                  variant={activeTab === 'breakdown' ? "default" : "outline"}
                  className={activeTab === 'breakdown' ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"}
                >
                  Breakdown
                </Button>
                <Button 
                  onClick={() => setActiveTab('comparison')} 
                  variant={activeTab === 'comparison' ? "default" : "outline"}
                  className={activeTab === 'comparison' ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"}
                >
                  Comparison
                </Button>
                <Button 
                  onClick={() => setActiveTab('tips')} 
                  variant={activeTab === 'tips' ? "default" : "outline"}
                  className={activeTab === 'tips' ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"}
                >
                  Tips
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <Card className="border border-green-200 dark:border-green-800 shadow-md">
            <CardHeader className="bg-green-50 dark:bg-green-900/30">
              <CardTitle className="text-green-700  dark:text-green-300">Carbon Footprint Trend</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Your carbon footprint over the last few months shows a steady decrease. Keep up the good work!
              </p>
              <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={histogramData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#4CAF50" />
        {/* Reference Line for User Interval */}
        <ReferenceLine
            x={userInterval}
            stroke="#4CAF50"
            label={{ value: 'You', position: 'top', fill: '#4CAF50' }}
        />
        {/* Shaded Area to Highlight the User Interval */}
        <ReferenceArea
            x1={userInterval - 2}  // Adjust x1 and x2 to match the desired interval
            x2={userInterval + 2}
            fill="#6a329f"
            fillOpacity={0.3}
        />
    </ComposedChart>
</ResponsiveContainer>

              </div>
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">Environmental Impact</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your current footprint is equivalent to the carbon sequestered by approximately <span className="font-semibold text-green-600 dark:text-green-400">{Math.floor(graphData.result/24.62)} trees</span> growing for 10 years.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'breakdown' && (
          <Card className="border border-green-200 dark:border-green-800 shadow-md">
            <CardHeader className="bg-green-50 dark:bg-green-900/30">
              <CardTitle className="text-green-700 dark:text-green-300">Carbon Footprint Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {breakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} kg CO₂e`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-4">Category Analysis</h3>
                  <ul className="space-y-3">
                    {breakdownData.map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                        </div>
                        <span className="font-medium text-green-600 dark:text-green-400">{item.value.toLocaleString()} kg CO₂e</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                    Transportation and energy usage are your largest sources of carbon emissions. Consider focusing your reduction efforts in these areas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'comparison' && (
          <Card className="border border-green-200 dark:border-green-800 shadow-md">
            <CardHeader className="bg-green-50 dark:bg-green-900/30">
              <CardTitle className="text-green-700 dark:text-green-300">Comparison with Averages</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                See how your carbon footprint compares to national and global averages.
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-2">Your Standing</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your footprint is <span className="font-semibold text-green-600 dark:text-green-400">21% lower</span> than the national average and <span className="font-semibold text-green-600 dark:text-green-400">6% higher</span> than the global average.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

{activeTab === 'tips' && (
  <Card className="border border-green-200 dark:border-green-800 shadow-md">
    <CardHeader className="bg-green-50 dark:bg-green-900/30">
      <CardTitle className="text-xl text-green-700 dark:text-green-300">
        Personalized Carbon Reduction Tips
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      {tipsLoading ? (
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Generating tips...</div>
      ) : tipsData ? (
        <div>
          <ul className="list-disc pl-6 space-y-2 text-green-800 dark:text-green-300">
            {tipsData.reductionTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
          <p className="mt-4 italic text-sm text-gray-600 dark:text-gray-400">
            {tipsData.impactSummary}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No tips available yet.</p>
      )}
    </CardContent>
  </Card>
)}
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <Button 
            onClick={() => router.push('/form')} 
            className="bg-green-600 hover:bg-green-700"
          >
            Take Survey Again
          </Button>
          <Button
            onClick={() => {
              console.log('Downloading report');
            }}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            Download Full Report
          </Button>
          <Button
            onClick={() => {
              console.log('Set reduction goals');
            }}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            Set Reduction Goals
          </Button>
        </div>
      </div>
    </div>
  );
}
