'use server';

/**
 * @fileOverview Generates tailored security fix recommendations based on mock-scanned source code.
 *
 * - generateRemediationGuidance - A function that generates security fix recommendations.
 * - GenerateRemediationGuidanceInput - The input type for the generateRemediationGuidance function.
 * - GenerateRemediationGuidanceOutput - The return type for the generateRemediationGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRemediationGuidanceInputSchema = z.object({
  mockScannedSourceCode: z
    .string()
    .describe('The mock-scanned source code to analyze for vulnerabilities.'),
});
export type GenerateRemediationGuidanceInput = z.infer<
  typeof GenerateRemediationGuidanceInputSchema
>;

const GenerateRemediationGuidanceOutputSchema = z.object({
  remediationGuidance: z
    .string()
    .describe(
      'Dynamically adjusted security fix recommendations for the provided source code.'
    ),
});
export type GenerateRemediationGuidanceOutput = z.infer<
  typeof GenerateRemediationGuidanceOutputSchema
>;

export async function generateRemediationGuidance(
  input: GenerateRemediationGuidanceInput
): Promise<GenerateRemediationGuidanceOutput> {
  return generateRemediationGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRemediationGuidancePrompt',
  input: {schema: GenerateRemediationGuidanceInputSchema},
  output: {schema: GenerateRemediationGuidanceOutputSchema},
  prompt: `You are a security expert providing remediation guidance for the following code:

  {{{mockScannedSourceCode}}}

  Please provide dynamically adjusted security fix recommendations tailored to the specific vulnerabilities present in the code. Consider potential exploits and provide clear, actionable steps to mitigate them.  Focus on specific code fixes rather than general advice.
  `,
});

const generateRemediationGuidanceFlow = ai.defineFlow(
  {
    name: 'generateRemediationGuidanceFlow',
    inputSchema: GenerateRemediationGuidanceInputSchema,
    outputSchema: GenerateRemediationGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
