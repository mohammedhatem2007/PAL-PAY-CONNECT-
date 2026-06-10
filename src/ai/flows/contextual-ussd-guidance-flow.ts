'use server';
/**
 * @fileOverview A Genkit flow for providing context-aware USSD transaction guidance.
 *
 * - contextualUssdGuidance - A function that provides contextual tips for USSD transactions.
 * - ContextualUssdGuidanceInput - The input type for the contextualUssdGuidance function.
 * - ContextualUssdGuidanceOutput - The return type for the contextualUssdGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualUssdGuidanceInputSchema = z.object({
  phoneNumber: z.string().describe('The recipient\'s mobile phone number for the USSD transaction.'),
  amount: z.number().positive().describe('The amount of money to be transferred via USSD.'),
});
export type ContextualUssdGuidanceInput = z.infer<typeof ContextualUssdGuidanceInputSchema>;

const ContextualUssdGuidanceOutputSchema = z.object({
  tips: z.array(z.string()).describe('A list of context-aware tips and best practices for the USSD transaction.'),
});
export type ContextualUssdGuidanceOutput = z.infer<typeof ContextualUssdGuidanceOutputSchema>;

export async function contextualUssdGuidance(input: ContextualUssdGuidanceInput): Promise<ContextualUssdGuidanceOutput> {
  return contextualUssdGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualUssdGuidancePrompt',
  input: {schema: ContextualUssdGuidanceInputSchema},
  output: {schema: ContextualUssdGuidanceOutputSchema},
  prompt: `You are an expert in secure and efficient mobile banking and USSD transactions.
Based on the following USSD transaction details, provide context-aware tips and best practices to ensure a safe and efficient transaction.

Transaction Details:
Recipient Phone Number: {{{phoneNumber}}}
Amount: {{{amount}}}

Consider the following:
- If the amount is large (e.g., over 500 units), emphasize verifying the recipient's identity and number carefully.
- Advise on potential network delays or service interruptions.
- General security tips for USSD transactions.
- Suggest confirming the transaction details before finalizing.

Format your output as a JSON object with a single key 'tips' which is an array of strings. Each tip should be a concise sentence.`
});

const contextualUssdGuidanceFlow = ai.defineFlow(
  {
    name: 'contextualUssdGuidanceFlow',
    inputSchema: ContextualUssdGuidanceInputSchema,
    outputSchema: ContextualUssdGuidanceOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
