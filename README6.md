# Guide: How to Connect Your Backend to a Live MongoDB Database

This guide provides a step-by-step walkthrough for connecting your Prisma-based Node.js backend (hosted on Render) to a live, persistent database on MongoDB Atlas. Following these steps will transition your application from using temporary mock data to a production-ready data layer.

---

### **Step 1: Connect Prisma to MongoDB via Environment Variables**

The first step is to securely provide your backend application with the credentials to access your database. This is done using an environment variable.

#### **Action Steps:**

1.  **Get Your MongoDB Atlas Connection String:**
    *   Log in to your [MongoDB Atlas](https://cloud.mongodb.com/) dashboard.
    *   Navigate to your cluster and click the **"Connect"** button.
    *   Select the **"Drivers"** connection method.
    *   Copy the **Connection String (URI)** provided.
    *   **Crucially**, replace the `<password>` placeholder in the string with the actual password for the database user you created.

    Your connection string should look something like this:
    `mongodb+srv://your_username:YOUR_REAL_PASSWORD@yourcluster.mongodb.net/your_database_name?retryWrites=true&w=majority`

2.  **Set the Environment Variable in Render:**
    *   Go to your backend service dashboard on [Render](https://render.com/).
    *   Click on the **"Environment"** tab.
    *   Under **"Environment Variables"**, click **"Add Environment Variable"**.
    *   Create a new variable with the key `DATABASE_URL` and paste your complete MongoDB Atlas connection string as the value.
    *   Save the changes. Render will automatically redeploy your service with the new environment variable.

---

### **Step 2: Sync Your Schema with the Database**

Now that your backend can connect to the database, you need to instruct Prisma to create the necessary collections and structures based on your `schema.prisma` file.

#### **Action Steps:**

1.  **Push Your Schema:** Run the following Prisma command from your local machine's `backend` directory. This command reads your schema and applies it to the database specified in your `.env` file (which should match your Render `DATABASE_URL`).

    ```bash
    # This command is great for initial setup and prototyping.
    # It syncs your database state with your Prisma schema without creating migration files.
    npx prisma db push
    ```

2.  **(Optional but Recommended for Production) Use Migrations:** For a production workflow where you need to track database changes over time, using migrations is the best practice.

    ```bash
    # To create a new migration file after a schema change
    npx prisma migrate dev --name your-change-name

    # To apply pending migrations to your production database
    npx prisma migrate deploy
    ```

---

### **Step 3: Replace Mock Controllers with Prisma Queries**

This is the most critical code change. You must replace all functions that currently read from `backend/src/data.ts` with asynchronous database queries using the Prisma client.

#### **Action Steps:**

1.  **Update Every Controller:** Go through each file in `backend/src/controllers/`.
2.  **Import Prisma Client:** At the top of each controller file, import the shared Prisma client instance.
3.  **Refactor Functions:** Convert your controller functions to `async` and use `prisma` to perform database operations (e.g., `findMany`, `create`, `update`, `delete`). Wrap your database logic in `try...catch` blocks to handle potential errors gracefully.

    **Example: Updating `video.controller.ts`**

    ```typescript
    // BEFORE (using mock data)
    import { mockVideos } from '../data';
    export const getFeed = async (req, res) => {
      res.status(200).json({ videos: mockVideos });
    };

    // AFTER (using Prisma)
    import prisma from '../lib/prisma'; // Import the shared instance

    export const getFeed = async (req, res) => {
      try {
        const videos = await prisma.video.findMany({
          where: { status: 'approved' },
          orderBy: { uploadDate: 'desc' },
          include: {
            user: true, // Include the author's details
            commentsData: { include: { user: true } } // Include comments and their authors
          },
        });
        res.status(200).json({ videos });
      } catch (error) {
        console.error('Error fetching feed:', error);
        res.status(500).json({ msg: 'Error fetching feed.' });
      }
    };
    ```

    This pattern must be applied to all controllers (`auth.controller.ts`, `user.controller.ts`, etc.) to make your application fully data-driven.

---

### **Step 4: Secure Your Database Network Access**

For initial setup, allowing access from anywhere is convenient, but it is a security risk for a production application. You should restrict database access to only your Render backend service.

#### **Action Steps:**

1.  **Find Your Render Service's IP Addresses:**
    *   In your Render service dashboard, go to the **"Connect"** tab.
    *   Under **"Outbound"**, you will find a list of static IP addresses that your service uses for outgoing connections. Copy these addresses.

2.  **Update MongoDB Atlas Network Access:**
    *   In your MongoDB Atlas dashboard, navigate to **"Network Access"** under the **"Security"** section.
    *   Find the entry for `0.0.0.0/0` ("Allow Access from Anywhere") and **delete it**.
    *   Click **"Add IP Address"**.
    *   Paste each static IP address from Render into the access list. Add a description for each (e.g., "Render Backend").
    *   Confirm the changes.

After completing these steps, your backend will be securely connected to and interacting with your live MongoDB database, marking a major milestone in moving your application to production.
