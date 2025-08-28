# East Coast Enduro Association (ECEA) Website

Welcome to the official repository for the East Coast Enduro Association's primary website. This project serves as the central hub for event schedules, news, results, and information for the ECEA community.

This document provides a comprehensive guide for editors, contributors, and developers.

---

## **Project Purpose**

The goal of this website is to provide a modern, fast, and easy-to-manage platform for the ECEA. Key objectives include:

* **Centralized Information:** Serve as the single source of truth for all official event schedules, flyers, results, and announcements.
* **Ease of Use for Editors:** Empower non-technical board members and volunteers to update content quickly and efficiently without needing developer assistance.
* **Maintainability:** Utilize a modern, Git-based workflow that is robust, version-controlled, and easy for future developers to manage.

---

## **User Manual for Site Editors**

This section is for anyone who needs to add or update content on the website, such as creating a blog post or adding a new event.

### **Accessing the CMS**

1.  Navigate to your website's admin page (e.g., `https://www.ecea.org/admin/`).
2.  You will be prompted to log in. Use the credentials provided to you (this will likely be a GitHub, Google, or email-based login).

### **The CMS Interface**

Once logged in, you will see the main dashboard. On the left-hand side is the **Collections** panel. A "Collection" is just a type of content. The main collections you will work with are:

* **Blog:** For news, announcements, and "On Your Minute" articles.
* **Enduro Event, Hare Scramble Event, etc.:** For creating and managing all official ECEA events.
* **Content Pages:** For editing static pages like the FAQ or Contacts page.

### **Creating a New Event or Blog Post**

1.  In the left-hand panel, click on the collection you want to add to (e.g., "Enduro Event").
2.  Click the **"New [Content Type]"** button at the top of the screen (e.g., "New Enduro Event").
3.  Fill out the form fields. Required fields will be marked.
4.  **Uploading Files (Flyers, Logos, etc.):**
    * Click the **"Choose an image"** or **"Upload a file"** button for the relevant field.
    * The media library will open, restricted to the correct folder for that file type.
    * You can either select an existing file or upload a new one from your computer.
5.  **Saving Your Work:**
    * At the top of the page, click the **"Save"** button.
    * A dropdown will appear. You can change the status to **"Draft"** if you are not ready to publish, or **"Ready"** if it is ready to go live.
    * Once the status is set to "Ready", another board member can review it and change the status to **"Published"** to make it live on the site.
      
---

## **Technical Guide for Developers**

This section is for developers who need to run the site locally for theme changes, bug fixes, or other technical work.

***Stack***

This project is built on a modern Jamstack architecture, chosen for its speed, security, and scalability.

* **[GoHugo](https://gohugo.io/)**: A blazingly fast static site generator written in Go. Hugo takes our content (written in Markdown) and our templates and builds them into a complete, pre-rendered HTML website. This means there is no database, which makes the site extremely fast and secure.
* **[Sveltia CMS](https://github.com/sveltia/sveltia-cms)**: A lightweight, Git-based headless Content Management System (CMS). Sveltia provides a clean, user-friendly web interface (`/admin/`) for editors to manage content. When an editor saves a change, Sveltia commits that change directly to this GitHub repository, creating a new version of the content file.
* **[Netlify](https://www.netlify.com/)**: A platform for building, deploying, and hosting modern web projects. Netlify is connected to our GitHub repository. When it detects a new commit (either from a developer pushing code or an editor saving in Sveltia CMS), it automatically runs the Hugo build process and deploys the new version of the site to the web.


### **Running the Site Locally**

To work on the site, you will need to run a local development server that emulates the Netlify environment.

**Prerequisites:**
* [Node.js](https://nodejs.org/) and npm
* [GoHugo Extended](https://gohugo.io/installation/)
* [Netlify CLI](https://docs.netlify.com/cli/get-started/)

**Steps:**
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/east-coast-enduro-association/ecea-ui.git](https://github.com/east-coast-enduro-association/ecea-ui.git)
    cd ecea-ui
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    netlify dev
    ```
    This command will start the Hugo server and provide you with a local URL (usually `http://localhost:8888`). The site will automatically reload when you make changes to the code. The `netlify dev` command is crucial as it allows the local CMS to properly authenticate with the GitHub backend.

### **Writing Code**

* **Content Types & Fields:** All content structures are defined in `static/admin/config.yml`. If you need to add a new field to an event, this is the first place to look.
* **Templates & Layouts:** All of the Hugo theme files are located in the `themes/` directory. This is where you will edit HTML, CSS, and JavaScript to change the look and feel of the site.
* **Static Assets:** Global images, CSS, and JS files that are not part of the theme are located in the `static/` directory.

### **Deployment Process**

All deployments are handled automatically by Netlify. The process is as follows:

1.  A change is committed and pushed to the GitHub repository.
2.  This can be a code push from a developer or a content change from an editor using Sveltia CMS.
3.  Netlify detects the new commit on the `main` branch.
4.  It runs the build command specified in `netlify.toml` (`hugo --minify --gc`).
5.  If the build is successful, Netlify deploys the newly generated `public/` directory to its global CDN. The changes are now live.

**Preview Branches:** When a developer pushes code to a branch other than `main`, Netlify will automatically create a "Deploy Preview" with a unique URL. This allows for testing and reviewing changes in a live environment before they are merged into the production branch.
