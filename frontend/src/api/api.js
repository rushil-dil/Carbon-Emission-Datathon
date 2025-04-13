import { useState } from "react";

import { CohereClientV2 } from 'cohere-ai';


const API_URL = "http://127.0.0.1:5000";
const useSubmitSurvey = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
 
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

const cohere = new CohereClientV2({
    token: process.env.NEXT_PUBLIC_COHERE,
  });
export function useCohereGenerate() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const generateTips = async (prompt) => {
    setLoading(true);
    try {
      const response = await cohere.generate({
        model: 'command-r-plus',
        prompt,
        max_tokens: 300,
        temperature: 0.7,
        stop_sequences: ["\n\n"],
      });

      const text = response.generations[0].text;
      console.log(text)
      const parsed = JSON.parse(text); // assumes Cohere returns valid JSON
      setOutput(parsed);
      return parsed;
    } catch (err) {
      console.error('Cohere generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return { generateTips, output, loading };
}


export function useBreakdownPie()  {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
   
    const submitBreakdown = async (data) => {
      console.log('Submitting breakdown data:', data);
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Making API request to:', API_URL + '/breakdown');
        const res = await fetch("https://carbon-iq-191f1496b345.herokuapp.com/" + '/breakdown', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        console.log('API breakdown status:', res.status);
        
        if (!res.ok) {
          throw new Error(`Failed to submit form: ${res.status} ${res.statusText}`);
        }
        
        const result = await res.json();
        console.log('API breakdown data:', result);
        
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
      submitBreakdown,
      isLoading,
      error,
      response,
    };
  };
