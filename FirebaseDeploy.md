# Production Deployment Guide: Vidora on Firebase Hosting

This guide provides a comprehensive, step-by-step walkthrough for deploying the Vidora application to Firebase Hosting. Firebase is an excellent choice for modern web applications, offering a global CDN, free SSL certificates, and a simple, fast deployment process.

---

### **Prerequisites**

Before you begin, ensure you have the following set up:

1.  **A Google Account:** Required to use Firebase.
2.  **Node.js and npm:** Installed on your local machine to build the project and run the Firebase CLI.
3.  **Project Code:** Your Vidora project files should be on your local machine.

---

### **Step 1: Create a Firebase Project**

First, you need a project in the Firebase console to host your application.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click on **"Add project"**.
3.  Give your project a name (e.g., `vidora-production`) and click **"Continue"**.
4.  You can choose to enable or disable Google Analytics for this project. For this guide, you can disable it.
5.  Click **"Create project"**. Firebase will take a moment to provision your resources.

---

### **Step 2: Install and Configure the Firebase CLI**

The Firebase Command Line Interface (CLI) is how you'll interact with your Firebase project from your terminal.

1.  **Install the CLI:** If you don't have it installed globally, run this command in your terminal:
    ```bash
    npm install -g firebase-tools
    ```
2.  **Log In to Firebase:** Connect the CLI to your Firebase account.
    ```bash
    firebase login
    ```
    This command will open a browser window for you to sign in with your Google account and grant permissions.

---

### **Step 3: Initialize Firebase in Your Project**

Now, you will link your local project folder to the Firebase project you just created.

1.  Open your terminal and navigate to the **root directory** of your Vidora application.
2.  Run the initialization command for Hosting:
    ```bash
    firebase init hosting
    ```
3.  The CLI will ask you a series of questions. Answer them precisely as follows:
    *   `? Please select an option:` → Choose **`Use an existing project`**.
    *   `? Select a default Firebase project for this directory:` → Use the arrow keys to select the project you created in Step 1 (e.g., `vidora-production`).
    *   `? What do you want to use as your public directory?` → Type **`dist`** and press Enter.
        *   *(This is the most critical step. Vite builds the production-ready files into a `dist` folder, and this tells Firebase where to find them.)*
    *   `? Configure as a single-page app (rewrite all urls to /index.html)?` → Type **`y`** (Yes) and press Enter.
        *   *(This is essential for client-side routing in React to work correctly.)*
    *   `? Set up automatic builds and deploys with GitHub?` → Type **`n`** (No) for now. You can set this up later if you wish.

This process will create two files in your project: `.firebaserc` (which links to your project) and `firebase.json` (which contains your hosting configuration).

Your generated `firebase.json` should look like this:
```json
{
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
  }
}
```

---

### **Step 4: Build the Application**

Before deploying, you need to create a production-ready build of your React application. This command will compile and optimize your code into the `dist` folder you specified earlier.

Run the following command in your terminal:
```bash
npm run build
```
*(This command is a standard part of Vite/React projects and is typically defined in `package.json` to run `vite build`)*

---

### **Step 5: Deploy to Firebase**

This is the final step. Run the following command to upload the contents of your newly created `dist` folder to Firebase Hosting.

```bash
firebase deploy --only hosting
```

The CLI will show you the deployment progress and, once finished, will provide you with a **Hosting URL** (e.g., `https://vidora-production.web.app`).

**That's it!** Your Vidora application is now live on the web. You can visit the URL to see your deployed application.

### **Next Steps**

*   **Custom Domain:** In the Firebase Hosting dashboard, you can easily add a custom domain to your project.
*   **CI/CD:** For a more advanced workflow, consider setting up GitHub Actions to automatically build and deploy your site whenever you push changes to your main branch.