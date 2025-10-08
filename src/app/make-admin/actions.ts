'use server';
import 'server-only';
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// This is a server-only file. It will not be sent to the client.

// Initialize Firebase Admin SDK
function initializeAdminApp(): App {
    const apps = getApps();
    if (apps.length > 0) {
        return apps[0];
    }
    // This will use the GOOGLE_APPLICATION_CREDENTIALS environment variable
    // for authentication, which is automatically set in the App Hosting environment.
    return initializeApp();
}

/**
 * Sets the admin custom claim on a user account.
 * This is a server action and is only executed on the backend.
 * @param uid The UID of the user to make an admin.
 * @returns An object indicating success or failure.
 */
export async function setAdminClaim(uid: string): Promise<{ success: boolean; error?: string }> {
  try {
    const adminApp = initializeAdminApp();
    const auth = getAuth(adminApp);

    // Set the custom claim. This overwrites existing claims.
    await auth.setCustomUserClaims(uid, { admin: true });

    // It's good practice to verify the claim was set, though not strictly required.
    const userRecord = await auth.getUser(uid);
    if (userRecord.customClaims?.['admin'] !== true) {
        throw new Error('Failed to verify admin claim on user record.');
    }

    // After setting a claim, the user's ID token must be refreshed on the client.
    // The easiest way to force this is to sign them out and have them sign back in.

    return { success: true };
  } catch (error: any) {
    console.error('Failed to set admin claim:', error);
    // Provide a more generic error message to the client for security.
    return { success: false, error: 'An internal error occurred. Could not set admin claim.' };
  }
}
