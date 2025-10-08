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
    // In a Google Cloud environment like Firebase App Hosting, calling initializeApp()
    // with no arguments will automatically use the project's default service account credentials.
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

    return { success: true };
  } catch (error: any) {
    console.error(`Error in setAdminClaim: ${error.code} - ${error.message}`);
    // Provide a more detailed error message for debugging
    let detailedError = `An internal error occurred: ${error.message}`;
    if (error.code === 'permission-denied' || error.code === 'insufficient-permission') {
         detailedError = 'The backend service does not have sufficient permissions to set admin claims. Please check the IAM roles for the App Hosting service account.';
    } else if (error.message.includes('Google OAuth2 access token')) {
        detailedError = `An internal error occurred: Credential implementation provided to initializeApp() via the "credential" property failed to fetch a valid Google OAuth2 access token with the following error: "${error.message}"`;
    }
     return { success: false, error: detailedError };
  }
}
