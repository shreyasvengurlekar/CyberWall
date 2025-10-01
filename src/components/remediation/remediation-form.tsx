'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Lightbulb, Loader, Send, Sparkles, Terminal } from 'lucide-react';
import { getRemediationGuidance, type RemediationState } from '@/app/remediation/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useEffect, useRef } from 'react';

const sampleCode = `const express = require('express');
const app = express();
const db = require('./db');

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send('Error');
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
`;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Guidance
        </>
      )}
    </Button>
  );
}

export function RemediationForm() {
  const initialState: RemediationState = {};
  const [state, formAction] = useFormState(getRemediationGuidance, initialState);
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state?.guidance || state?.error) {
        resultCardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state]);


  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block bg-primary/10 p-3 rounded-lg mb-4">
            <WandSparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Automated Remediation Guidance</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Paste your mock-scanned source code below. Our AI will analyze it and provide tailored security fix recommendations.
        </p>
      </div>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal />
              Source Code Input
            </CardTitle>
            <CardDescription>
              Enter a code snippet with a potential vulnerability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              name="code"
              placeholder="Enter your code here..."
              className="min-h-[250px] font-mono text-sm"
              defaultValue={sampleCode}
            />
            {state?.error && (
                <p className="text-sm font-medium text-destructive mt-2">{state.error}</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">For educational purposes only.</p>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>

    {state?.guidance && (
        <Card ref={resultCardRef} key={state.timestamp}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-accent" />
              Remediation Guidance
            </CardTitle>
            <CardDescription>
              AI-generated recommendations to secure your code.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <pre className="bg-secondary/50 p-4 rounded-md text-sm whitespace-pre-wrap font-mono">
                <code>
                    {state.guidance}
                </code>
            </pre>
          </CardContent>
        </Card>
    )}
    </div>
  );
}
