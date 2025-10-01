'use server';

import { generateRemediationGuidance } from '@/ai/flows/generate-remediation-guidance';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(50, { message: 'Source code must be at least 50 characters.' }),
});

export interface RemediationState {
  guidance?: string;
  error?: string;
  timestamp?: number;
}

export async function getRemediationGuidance(
  prevState: RemediationState | undefined,
  formData: FormData
): Promise<RemediationState> {
  const validatedFields = schema.safeParse({
    code: formData.get('code'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.code?.join(', '),
    };
  }

  try {
    const result = await generateRemediationGuidance({
      mockScannedSourceCode: validatedFields.data.code,
    });
    return { guidance: result.remediationGuidance, timestamp: Date.now() };
  } catch (error) {
    console.error(error);
    return {
      error: 'An error occurred while generating remediation guidance. Please try again.',
    };
  }
}
