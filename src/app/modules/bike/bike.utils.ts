import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';
import { TBike } from './bike.interface';

export const generateDescription = async (payload: Partial<TBike>) => {
  const genAI = new GoogleGenerativeAI(config.google_api_key as string);
  const model = genAI.getGenerativeModel({
    model: 'gemini-pro',
  });

  const prompt = `Create a 200-word description for a bike rental service website based on the following bike specifications:

Specifications: ${payload}

1. Begin with an engaging overview of the bike and its type.
2. Highlight its key specifications (engine capacity, mileage, features, etc.) in a way that appeals to 3. 3. potential renters.
4. Explain why this bike is an ideal choice for the user (e.g., for city rides, long-distance travel, 5. 5. off-road adventures).
6. End with the affordable hourly rate and a call to action.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  return text;
};
