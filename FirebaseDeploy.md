# Production Deployment Guide: Vidora on Firebase

This guide provides a comprehensive, step-by-step walkthrough for refactoring and deploying the Vidora application from a local prototype to a scalable, secure, and production-ready state using the Firebase platform.

This approach leverages the tightly integrated Firebase ecosystem to replace the existing mock/Express backend.

### The Firebase Stack

*   **Frontend:** **Firebase Hosting** – For a global CDN, free SSL, and simple, fast deployments.
*   **Backend:** **Cloud Functions for Firebase** – To run your backend logic in a serverless environment.
*   **Database:** **Cloud Firestore** – A highly scalable, real-time NoSQL database that will replace the need for MongoDB/Prisma in this stack.
*   **File Storage:** **Cloud Storage for Firebase** – For securely storing all user-uploaded media like videos and avatars.
*   **Authentication:** **Firebase Authentication** – A secure, easy-to-use service for managing user sign-up and login.

---

## Step 1: Firebase Project Setup

First, let's create your project and set up the necessary tools.

1.  **Create a Firebase Project:**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and click **"Add project"**.
    *   Give your project a name (e.g., `vidora-prod`) and follow the setup steps.

2.  **Upgrade to the "Blaze" Plan:** While many services have a generous free tier, deploying Cloud Functions requires the **Blaze (Pay-as-you-go)** plan. You will likely not incur any charges with typical initial usage.

3.  **Enable Firebase Services:**
    *   In your new project's console, go to the **"Build"** section in the sidebar.
    *   Enable **Authentication:** Click "Get started" and enable providers like "Email/Password" and "Google".
    *   Enable **Firestore Database:** Click "Create database", start in **production mode**, and choose a location close to your users.
    *   Enable **Storage:** Click "Get started" and follow the prompts.

4.  **Install the Firebase CLI:** On your local machine, install the command-line tools:
    ```bash
    npm install -g firebase-tools
    ```

5.  **Initialize Firebase in Your Project:**
    *   Log in to your Google account: `firebase login`.
    *   Navigate to the **root directory** of your Vidora project.
    *   Run the initialization command: `firebase init`.
    *   Follow the prompts:
        *   `Are you ready to proceed?` -> **Yes**.
        *   `Which Firebase features do you want to set up?` -> Use the spacebar to select:
            *   **Firestore**
            *   **Functions**
            *   **Hosting**
            *   **Storage**
        *   `Please select an option:` -> **Use an existing project** and select the project you just created.
        *   **Firestore:** Accept the default file names (`firestore.rules`, `firestore.indexes.json`).
        *   **Functions:**
            *   `What language would you like to use?` -> **TypeScript**.
            *   `Do you want to use ESLint?` -> **Yes**.
            *   `Do you want to install dependencies with npm now?` -> **Yes**.
        *   **Hosting:**
            *   `What do you want to use as your public directory?` -> **dist** (This is where Vite builds your React app).
            *   `Configure as a single-page app (rewrite all urls to /index.html)?` -> **Yes**.
            *   `Set up automatic builds and deploys with GitHub?` -> **No** (for now).
        *   **Storage:** Accept the default file name (`storage.rules`).

    This process creates a `functions` directory for your backend code and configuration files like `firebase.json`.

## Step 2: Migrate Backend from Express to Cloud Functions

Cloud Functions will replace your Express server. Instead of one server, each API route becomes a separate function.

1.  **Copy Dependencies:** Open `backend/package.json` and copy the necessary dependencies (like `cors`) into `functions/package.json`. Then run `npm install` inside the `functions` directory.

2.  **Convert an Express Route:** Let's convert the video upload logic from `backend/src/controllers/video.controller.ts` into a Cloud Function.

    *   Open `functions/src/index.ts` and replace its contents:

    ```typescript
    // functions/src/index.ts
    import * as functions from "firebase-functions";
    import * as admin from "firebase-admin";
    import * as cors from "cors";

    // Initialize the Firebase Admin SDK
    admin.initializeApp();
    const db = admin.firestore();
    const corsHandler = cors({origin: true});

    /**
     * Example: A function to add video metadata to Firestore.
     * In a real app, you would upload the video to Cloud Storage first
     * from the client, then call this function with the URL.
     */
    export const uploadVideoMetadata = functions.https.onRequest((request, response) => {
      // Use the CORS middleware
      corsHandler(request, response, async () => {
        if (request.method !== "POST") {
          response.status(405).send("Method Not Allowed");
          return;
        }

        // TODO: Add Firebase Auth check to get userId
        const { description, videoUrl, thumbnailUrl, userId } = request.body;

        if (!description || !videoUrl || !userId) {
          response.status(400).send("Missing required fields.");
          return;
        }

        try {
          const videoData = {
            description,
            videoUrl,
            thumbnailUrl: thumbnailUrl || null,
            userId,
            likes: 0,
            comments: 0,
            shares: 0,
            views: 0,
            status: "approved",
            uploadDate: admin.firestore.FieldValue.serverTimestamp(),
          };

          // Add the new video document to the 'videos' collection
          const videoRef = await db.collection("videos").add(videoData);

          response.status(201).send({id: videoRef.id, ...videoData});
        } catch (error) {
          console.error("Error adding video metadata:", error);
          response.status(500).send("Internal Server Error");
        }
      });
    });

    // ... you would create more functions here for other routes like getFeed, addComment, etc.
    ```

## Step 2.5: Securely Manage API Keys & Secrets (LiveKit Credentials)

Sensitive credentials like your LiveKit API Key and Secret must **never** be included in your frontend code. The correct and secure place to store them is in the Cloud Functions environment configuration.

The workflow is:
1.  You set the secret keys using the Firebase CLI.
2.  Your Cloud Function reads these keys from its secure environment.
3.  The function uses the keys to generate a short-lived, temporary access token for a specific user and room.
4.  The function sends only this temporary token back to the frontend. The frontend client never sees your secret keys.

#### Action Steps:

1.  **Install LiveKit Server SDK:** In your `functions` directory, install the LiveKit server-side library:
    ```bash
    npm install livekit-server-sdk
    ```

2.  **Set the Secrets:** From your project's root directory, run the following commands in your terminal, replacing the placeholder values with your actual LiveKit credentials.
    ```bash
    firebase functions:config:set livekit.api_key="YOUR_LIVEKIT_API_KEY"
    firebase functions:config:set livekit.api_secret="YOUR_LIVEKIT_API_SECRET"
    ```
    This stores the keys securely with your Firebase project.

3.  **Create a Token-Generating Function:** Add the following callable Cloud Function to your `functions/src/index.ts` file. Callable functions are secure and require an authenticated user by default.

    ```typescript
    // Add this to functions/src/index.ts
    import { AccessToken } from "livekit-server-sdk";

    export const getLiveKitToken = functions.https.onCall(async (data, context) => {
      // Ensure the user is authenticated before creating a token
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "The function must be called while authenticated."
        );
      }

      const roomName = data.roomName; // The client will send the room name it wants to join
      const participantName = context.auth.uid; // Use the user's unique Firebase ID as their identity

      // Retrieve the secret keys from the secure environment config
      const apiKey = functions.config().livekit.api_key;
      const apiSecret = functions.config().livekit.api_secret;

      if (!apiKey || !apiSecret) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "LiveKit credentials are not configured."
        );
      }

      const at = new AccessToken(apiKey, apiSecret, {
        identity: participantName,
      });

      // Grant permission to join the specified room
      at.addGrant({ roomJoin: true, room: roomName });

      // Return the temporary JWT to the client
      return { token: at.toJwt() };
    });
    ```
Your frontend will now call this `getLiveKitToken` function to get permission before joining a stream.

## Step 3: Configure Security Rules

Security rules are critical for protecting your data.

1.  **Firestore Rules (`firestore.rules`):** This example allows authenticated users to read/write their own data and read public content.
    ```
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Users can only read/write their own profile
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        // Anyone can read videos, but only authenticated users can create them
        match /videos/{videoId} {
          allow read: if true;
          allow create: if request.auth != null;
          // Only the video owner can update/delete
          allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
        }
      }
    }
    ```

2.  **Storage Rules (`storage.rules`):** This example allows authenticated users to upload files into a folder matching their user ID.
    ```
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        // Allow users to upload to their own folder, max 50MB videos
        match /uploads/{userId}/{allPaths=**} {
          allow write: if request.auth != null && request.auth.uid == userId
                      && request.resource.size < 50 * 1024 * 1024
                      && request.resource.contentType.matches('video/.*');
        }
        // Allow anyone to read uploaded files
        match /{allPaths=**} {
          allow read: if true;
        }
      }
    }
    ```

## Step 4: Refactor Frontend to use Firebase

Now, update the React app to talk to Firebase instead of the old mock/Express backend.

1.  **Install the Firebase Client SDK:**
    ```bash
    npm install firebase
    ```

2.  **Initialize Firebase in Your App:** Create a file `src/services/firebase.ts`.
    ```typescript
    // src/services/firebase.ts
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";
    import { getStorage } from "firebase/storage";
    import { getFunctions } from "firebase/functions";

    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Export the services you need
    export const auth = getAuth(app);
    export const db = getFirestore(app);
    export const storage = getStorage(app);
    export const functions = getFunctions(app);
    ```
    *You can find your `firebaseConfig` object in the Firebase Console: Project Settings > General > Your apps.*

3.  **Refactor `App.tsx`:** Update data fetching to use Firestore and Cloud Functions.
    ```typescript
    // In App.tsx
    import { db } from './services/firebase';
    import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

    // ...inside the App component
    useEffect(() => {
      const fetchVideos = async () => {
        try {
          const videosCollection = collection(db, "videos");
          const q = query(videosCollection, where("status", "==", "approved"), orderBy("uploadDate", "desc"));
          const querySnapshot = await getDocs(q);
          const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setVideos(videosData as Video[]);
        } catch (error) {
          console.error("Error fetching videos from Firestore:", error);
        }
      };

      fetchVideos();
    }, []);
    ```

4.  **Refactor `UploadView.tsx`:** Update the upload logic to use Cloud Storage.
    ```typescript
    // In UploadView.tsx
    import { storage, functions } from './services/firebase';
    import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
    import { httpsCallable } from "firebase/functions";

    const handleUpload = async (source: UploadSource, description: string) => {
        if (!currentUser || source.type !== 'file') return; // Assuming real auth

        const file = source.data;
        // Create a storage reference
        const storageRef = ref(storage, `uploads/${currentUser.id}/${Date.now()}-${file.name}`);

        try {
            // 1. Upload the file
            const snapshot = await uploadBytes(storageRef, file);
            // 2. Get the public URL
            const downloadURL = await getDownloadURL(snapshot.ref);

            // 3. Call the Cloud Function to save metadata
            const uploadMetadata = httpsCallable(functions, 'uploadVideoMetadata');
            await uploadMetadata({
                description,
                videoUrl: downloadURL,
                userId: currentUser.id,
            });
            
            // ...handle success UI
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };
    ```

## Step 5: Configure for Deployment

The `firebase.json` file controls your deployment. Ensure it's configured correctly.

```json
// firebase.json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "functions": {
    "predeploy": "npm --prefix \"$RESOURCE_DIR\" run build"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

## Step 6: Build and Deploy

You're ready to go live!

1.  **Build Your React App:** Run the build command from the **root** of your project.
    ```bash
    npm run build
    ```

2.  **Deploy Everything:** Run the deploy command from the **root** of your project.
    ```bash
    firebase deploy
    ```

This command will deploy your security rules, your Cloud Functions, your static frontend files to Firebase Hosting, and your storage rules. Firebase will give you a public URL where you can see your live application.