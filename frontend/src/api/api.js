import { useState } from "react";

const useSubmitSurvey = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const API_URL= "http://localhost:5000"

  const submitSurvey = async (data, onSuccess) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL + '/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to submit form');
      }

      const result = await res.json();
      setResponse(result);

      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(result);
      }

    } catch (err) {
      setError(err.message || 'Something went wrong');
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
