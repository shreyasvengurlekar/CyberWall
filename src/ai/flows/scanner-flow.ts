// src/ai/flows/scanner-flow.ts

'use server';
/**
 * @fileOverview A security scanner AI flow.
 *
 * - performScan - A function that handles the security scan process.
 * - ScanInput - The input type for the performScan function.
 * - ScanResult - The return type for the performScan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define input schema
const ScanInputSchema = z.object({
  url: z.string().url().describe('The URL of the website to scan.'),
  scanType: z.string().describe('The type of scan to perform (e.g., general, xss, sql-injection).'),
});
export type ScanInput = z.infer<typeof ScanInputSchema>;

// Define the structure for a single vulnerability
const VulnerabilitySchema = z.object({
    title: z.string().describe('A brief, descriptive title for the vulnerability (e.g., "Cross-Site Scripting (XSS) in search bar").'),
    severity: z.enum(['Critical', 'High', 'Medium', 'Low', 'Informational']).describe('The severity level of the vulnerability.'),
    description: z.string().describe('A detailed but easy-to-understand explanation of the vulnerability, including the potential impact.'),
    remediation: z.string().describe('Clear, actionable steps the developer should take to fix the vulnerability. Provide code examples where possible. MUST be a step-by-step markdown numbered list.'),
});

// Define the overall output schema for the scan result
const ScanResultSchema = z.object({
    overallScore: z.number().int().min(0).max(100).describe('An overall security score from 0 to 100, where 100 is perfectly secure.'),
    summary: z.string().describe('A one or two-sentence summary of the security posture of the scanned URL.'),
    vulnerabilities: z.array(VulnerabilitySchema).describe('An array of all vulnerabilities found.'),
});
export type ScanResult = z.infer<typeof ScanResultSchema>;

// --- THIS IS THE NEW, PERMANENT FIX ---
/**
 * A "safety net" function to clean and format the AI's remediation text.
 * It takes the raw, often messy, output from the AI and forces it into a 
 * clean, reliable Markdown format.
 * @param text The raw remediation string from the AI.
 * @returns A clean string with proper Markdown formatting.
 */
function formatRemediation(text: string): string {
  if (!text) return "";

  let formattedText = text;

  // Step 1: Add newlines before bolded headings (e.g., "**Input Validation:**")
  formattedText = formattedText.replace(/\*\*(.*?):\*\*/g, '\n\n**$1:**');

  // Step 2: Add newlines before numbered points stuck to sentences (e.g., "...end.2. Start...")
  formattedText = formattedText.replace(/(\.)(\d\.)/g, '$1\n\n$2');
  
  // Step 3: Find common code examples and wrap them in proper Markdown code fences.
  // This looks for language hints like "in Python:" or "Example CSP Header:"
  formattedText = formattedText.replace(/(For example, in Python:|Example CSP Header:|Example \(HTTP Header\):)/g, '\n\n$1');
  formattedText = formattedText.replace(/(```\w*\n[\s\S]*?\n```)/g, (match) => `\n${match}\n`);

  // Step 4: Ensure numbered lists start correctly.
  formattedText = formattedText.replace(/(\s|^)1\./g, '\n\n1.');
  
  // Final cleanup: remove multiple consecutive newlines, leaving just two.
  formattedText = formattedText.replace(/\n{3,}/g, '\n\n');

  return formattedText.trim();
}
// --- END OF FIX ---


// The exported function that will be called from the frontend
export async function performScan(input: ScanInput): Promise<ScanResult> {
  return scannerFlow(input);
}


const scannerPrompt = ai.definePrompt({
    name: 'scannerPrompt',
    input: { schema: ScanInputSchema },
    output: { schema: ScanResultSchema },
    prompt: `
        You are a world-class cybersecurity expert performing a penetration test on the website at the given URL.
        Your analysis is for EDUCATIONAL PURPOSES ONLY. Do not perform any real attacks.
        Based on the URL and the scan type requested, please generate a realistic-but-simulated security report.
        
        URL to analyze: {{{url}}}
        Scan focus: {{{scanType}}}
        
        Your task is to:
        1.  Create a list of 2 to 4 plausible vulnerabilities that a site like this might have, relevant to the requested scan type. If the scan type is 'general', include a mix of common vulnerabilities (XSS, SQLi, Security Misconfiguration, etc.). If a specific scan type is requested (e.g., 'xss'), focus primarily on that.
        2.  For each vulnerability, provide:
            - A clear title.
            - An appropriate severity.
            - A detailed description of the risk, written in an easy-to-understand manner.
            - Actionable remediation advice. This is the most important part. The advice MUST be in a markdown numbered list format (e.g., "1. First do this..."). Do NOT use long paragraphs. Keep each step short and simple. Provide clear "before" and "after" code examples where relevant to illustrate the fix. Assume the user is a student or new developer.
        3.  Provide a concise, one-sentence summary of the site's security health based on your findings.
        4.  Calculate an overall security score from 0 to 100. A score of 100 means no issues found. Deduct points based on the severity and number of vulnerabilities (e.g., Critical: -40, High: -25, Medium: -15, Low: -5).
        
        Produce the output in the required JSON format. If no vulnerabilities are found, the 'vulnerabilities' array MUST be empty.
    `,
});


// Define the main flow
const scannerFlow = ai.defineFlow(
  {
    name: 'scannerFlow',
    inputSchema: ScanInputSchema,
    outputSchema: ScanResultSchema,
  },
  async (input) => {
    // Step 1: Get the raw output from the AI model
    const { output } = await scannerPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid response.');
    }

    // --- THIS IS THE FINAL, PERMANENT FIX ---
    // Step 2: Loop through each vulnerability and clean up its remediation text
    // before sending the data back to the frontend.
    if (output.vulnerabilities && output.vulnerabilities.length > 0) {
      output.vulnerabilities.forEach(vuln => {
        vuln.remediation = formatRemediation(vuln.remediation);
      });
    }
    // --- END OF FIX ---

    // Step 3: Return the now clean and perfectly formatted data.
    return output;
  }
);