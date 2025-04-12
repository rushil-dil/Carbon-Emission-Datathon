import { useState } from "react";

const useSubmitSurvey = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const API_URL = "http://127.0.0.1:5000";
  
  const submitSurvey = async (data) => {
    console.log('Submitting survey data:', data);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Making API request to:', API_URL + '/submit');
      const res = await fetch(API_URL + '/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('API response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`Failed to submit form: ${res.status} ${res.statusText}`);
      }
      
      const result = await res.json();
      console.log('API response data:', result);
      
      setResponse(result);
      return result; // Return the result so it can be used in the submit handler
    } catch (err) {
      console.error('API error:', err);
      setError(err.message || 'Something went wrong');
      throw err; // Re-throw to handle in the component
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    submitSurvey,
    isLoading,
    error,
    response,
  };
};

export default useSubmitSurvey;