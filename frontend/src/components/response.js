'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

export function CarbonFootprintResponse() {
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get the response data from localStorage
    const cachedResponse = localStorage.getItem('surveyResponse');
    
    if (cachedResponse) {
      try {
        const parsedResponse = JSON.parse(cachedResponse);
        setResponseData(parsedResponse);
      } catch (error) {
        console.error('Error parsing response data:', error);
      }
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="w-full max-w-md mx-auto mt-10 p-4">Loading...</div>;
  }

  if (!responseData) {
    return (
      <div className="w-full max-w-md mx-auto mt-10 p-4">
        <Card className="rounded-lg border shadow-md">
          <CardHeader>
            <CardTitle>No Response Data Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">It seems your survey responses haven't been processed yet.</p>
            <Button
              onClick={() => router.push('/')}
              className="mt-4"
            >
              Back to Survey
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract carbon footprint from the response
  const carbonFootprint = responseData.result || 0;

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-4">
      <Card className="rounded-lg border shadow-md">
        <CardHeader>
          <CardTitle>Your Carbon Footprint</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            Your carbon footprint: <strong>{carbonFootprint} kg CO2</strong>
          </p>
          <p className="text-sm text-gray-600 mb-4">
            This is the estimated carbon footprint based on your survey responses.
          </p>
          <Button
            onClick={() => router.push('/form')}
            className="mt-4 mr-2"
          >
            Take Survey Again
          </Button>
          <Button
            onClick={() => {
              // Additional functionality if needed
              console.log('Exploring more details');
            }}
            variant="outline"
            className="mt-4"
          >
            Explore More
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}