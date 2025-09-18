# How to Add Cloudinary Credentials to Render Environment Variables

This guide will walk you through the process of finding your Cloudinary credentials and securely adding them to your backend service hosted on Render. This is a critical step to allow your application to generate secure upload signatures for file uploads.

### Prerequisites

*   You have a [Cloudinary](https://cloudinary.com/) account.
*   You have a backend web service deployed on [Render](https://render.com/).

---

### Step 1: Find Your Cloudinary Credentials

First, you need to locate your unique API credentials in your Cloudinary dashboard.

1.  **Log in** to your [Cloudinary account](https://cloudinary.com/users/login).
2.  Navigate to your main **Dashboard**. This is usually the first page you see after logging in. If you have multiple products, ensure you are in the **Programmable Media** dashboard.
3.  In the **Account Details** section at the top of the dashboard, you will find the necessary credentials. You need to copy three values:
    *   **Cloud Name**
    *   **API Key**
    *   **API Secret** (You may need to click to reveal this)

    

Keep these three values handy for the next step.

---

### Step 2: Add Credentials to Render Environment

Next, you will add these credentials as environment variables to your backend service on Render. This ensures your secret keys are never hardcoded in your source code.

1.  **Log in** to your [Render dashboard](https://dashboard.render.com/).
2.  Navigate to your backend web service (e.g., `vidora-backend`).
3.  In the left-hand menu for your service, click on the **"Environment"** tab.
4.  Scroll down to the **"Environment Variables"** section.
5.  Click the **"Add Environment Variable"** button to add the first key. You will repeat this for all three credentials.

    Enter the keys and their corresponding values exactly as follows:

    | Key                       | Value                                         |
    | ------------------------- | --------------------------------------------- |
    | `CLOUDINARY_CLOUD_NAME`   | Paste the **Cloud Name** you copied.          |
    | `CLOUDINARY_API_KEY`      | Paste the **API Key** you copied.             |
    | `CLOUDINARY_API_SECRET`   | Paste the **API Secret** you copied.          |

    **Important:** The key names must match exactly what is shown above, as the backend code (`src/lib/cloudinary.ts`) is configured to read these specific variable names.

    Your environment variables section in Render should look like this when you're done:
    

---

### Step 3: Save and Redeploy

1.  After adding all three environment variables, scroll down and click the **"Save Changes"** button.
2.  Render will automatically detect the changes to your environment and trigger a new deployment of your backend service.
3.  Wait for the deployment to complete. Once it's live, your backend will have secure access to the Cloudinary credentials and will be able to generate upload signatures.

Your backend is now fully configured to work with Cloudinary!
