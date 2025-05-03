# East Coast Enduro Association (ECEA) Website

This repository contains the code and configuration files for the East Coast Enduro Association (ECEA) website, which provides information on enduro events, rider details, and club activities.

## Major Parts of the Code

1. **Apache Configuration**:
   - The configuration files optimize default expiration times for static resources, enable gzip compression for resources, and set headers for caching and content encoding.

2. **Caching and Compression**:
   - The configuration includes settings for caching static resources, enabling gzip compression for better performance, and managing cache control headers.

3. **Site Configuration**:
   - Various settings related to the site's build process, including environment variables, build commands, and header settings.

4. **Event Management**:
   - Management of enduro and hare scramble events, including details about upcoming events, registration information, and club involvement.

5. **Club Information**:
   - Details about various clubs involved in the ECEA, including their contact information, meeting times, and event participation.

6. **Blog and Announcement Section**:
   - A section for blog posts and announcements related to events, race recaps, and important updates for riders.

7. **User Interface**:
   - HTML and JavaScript files to manage the front-end, including the layout for the content management system (CMS) and rider information.

8. **Internationalization**:
   - Support for multiple languages (English, French, Italian, German) to cater to a diverse audience.

## Installation Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/east-coast-enduro-association.git
   cd east-coast-enduro-association
   ```

2. **Install Dependencies**:
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Build the Site**:
   Run the build command to generate the static files:
   ```bash
   npx tinacms build && hugo --minify --gc
   ```

4. **Run the Local Server** (Optional):
   To preview the site locally, you can use a simple server command:
   ```bash
   hugo server
   ```

5. **Deploy**:
   Follow your hosting provider's instructions to deploy the generated static site to your server.

## Usage Instructions

- **Event Management**: 
  - Add or modify events using the Markdown files located in the `content` directory. Ensure that each event follows the template for consistency.

- **Club Information**:
  - Update the club details in the `clubs` section to reflect any changes in contacts or event participation.

- **Blog Posts**:
  - To add new blog posts, create a new Markdown file in the `content/blog` directory and follow the existing format.

- **Internationalization**:
  - If adding new languages, ensure to update the respective language sections in the configuration files.

This README.md serves as a guide to understanding the structure of the ECEA website code, along with instructions on how to set it up and maintain it. For any issues or contributions, please feel free to open an issue or submit a pull request!# FastKIDZ Event Management

This repository contains code for managing and displaying upcoming youth racing events organized by various clubs. The events mainly include Hare Scramble races and are part of the ECEA Youth Series.

## Major Components

1. **Event Data**:
   - Events are defined in a structured format with details such as title, description, club, event date and time, location, event type, gate fee, registration date, and promotional images.
   - Each event can include attachments, flyers, and background images.

2. **Event Handling**:
   - The system integrates with the AMA (American Motorcyclist Association) to ensure compliance with event regulations.
   - Event registration is handled through external systems, with links provided for participants to register.

3. **User Interface**:
   - The UI is built using Hugo, a static site generator, and includes features like event previews, detailed event pages, and a responsive design.
   - The design adapts to various devices and displays information such as upcoming events, club details, and event descriptions.

4. **Scripts and Styles**:
   - The project includes various JavaScript and CSS files to enhance functionality and styling, including animations, event handling, and responsive designs.

## Installation

To set up the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/fastkidz-event-management.git
   cd fastkidz-event-management
   ```

2. **Install Dependencies**:
   - Ensure you have [Node.js](https://nodejs.org/) and [Hugo](https://gohugo.io/) installed.
   - Install any necessary Node packages:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   hugo server -D
   ```
   - Visit `http://localhost:1313` in your browser to view the site.

## Usage

- **Adding Events**: 
   - Events can be added by creating new Markdown files in the `content/events` directory, following the structure provided in existing event files.
   - Ensure to include relevant metadata such as event title, date, club, and location.

- **Managing Clubs**: 
   - Clubs can be added or modified in the `data/clubs` directory.
   - Each club should have a corresponding logo and relevant details.

- **Customizing Appearance**:
   - Modify CSS files located in the `assets/css` directory to change the styling of the site.
   - Update JavaScript files in the `assets/js` directory for custom functionality.

- **Publishing Events**:
   - To publish events, ensure that the `draft` status is set to `false` in the event Markdown files and rebuild the site using Hugo.

For further details on customizing and using Hugo, refer to the [Hugo Documentation](https://gohugo.io/documentation/).

## Contributing

Contributions are welcome! Please follow the standard GitHub flow for submitting pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.# Project Title

## Overview

This project includes a collection of code files for integrating various features on a web platform. The primary components include:

1. **Font Awesome Integration**: This section includes CSS rules for using Font Awesome icons throughout the application, providing a wide range of icons for various uses.
2. **Bootstrap Integration**: This section contains styles and scripts from Bootstrap 3.4.1, a popular front-end framework for responsive design.
3. **Google Maps Integration**: The code includes a function that initializes a Google Map, allowing for the display of maps with customizable markers.
4. **Shuffle.js**: This library is employed for sorting and filtering elements on the page, allowing for a dynamic display of items such as images or cards based on user interaction.

## Features

- Integration of Font Awesome icons for enhanced UI design.
- Responsive design capabilities provided by Bootstrap.
- Map display with customizable markers using Google Maps API.
- Dynamic sorting and filtering of elements with Shuffle.js.

## Installation

### Prerequisites

To use this project, you need to have the following:

- A web server (like Apache or Nginx) to serve your HTML files.
- Internet access for loading external libraries (Font Awesome, Bootstrap, Google Maps).

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/project-name.git
   cd project-name
   ```

2. **Include External Libraries**:
   Ensure that you have the following libraries included in your HTML file:
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/css/bootstrap.min.css">
   <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.4.1/js/bootstrap.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/shufflejs/5.2.0/shuffle.min.js"></script>
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
   ```

3. **Set Up Your HTML**:
   Create an HTML file that includes the necessary divs for the map and any items you want to shuffle.

4. **Initialize Google Maps**:
   Ensure you have the HTML element with the id `map` and set its `data-latitude` and `data-longitude` attributes to display the desired location on the map.

5. **Run Your Application**:
   Open your HTML file in a web browser, or run a local web server to view the application.

## Usage

### Using Font Awesome Icons

To use an icon, simply add the appropriate class to an `<i>` or `<span>` tag:
```html
<i class="fas fa-camera"></i>
```

### Using Bootstrap Components

Utilize Bootstrap classes for responsive design, such as:
```html
<div class="container">
    <h1>Hello, world!</h1>
</div>
```

### Google Maps

To initialize the map, use the provided `map()` function in your JavaScript, ensuring the latitude and longitude are set correctly in the HTML.

### Shuffle.js

To filter or sort items, call the `filter()` or `sort()` methods provided by the Shuffle.js library, passing in the desired parameters.

## Conclusion

This project serves as a foundation for creating a dynamic, responsive web application with various integrated features. Follow the installation and usage instructions to set up and customize your application.# Project Title

## Overview
This project is a responsive web application built with Bootstrap and Sass. It features a pricing section, a blog, a contact form, and various UI components. The application is designed to provide a user-friendly experience across different devices.

## Major Parts of the Code

1. **Pricing Section**: 
   - Displays different pricing plans with features.
   - Each plan includes a title, description, and a call-to-action button.

2. **Latest News**: 
   - A section showcasing the latest news articles.
   - Each article displays an image, title, and short description.

3. **Contact Form**: 
   - A responsive contact form allowing users to submit inquiries.
   - Includes validation for input fields.

4. **Navigation**: 
   - Implemented using Bootstrap’s navbar component.
   - Supports dropdowns for navigation links.

5. **Styling**: 
   - Utilizes Sass for modular and maintainable CSS.
   - Includes various utility classes and media queries for responsiveness.

6. **Components**: 
   - Various UI components such as buttons, alerts, modals, and tooltips.
   - Custom styles for buttons and form controls.

7. **Carousel**: 
   - An image carousel for featured content or promotions.
   - Integrates with Bootstrap’s carousel component.

8. **Testimonials**: 
   - Displays user testimonials in a visually appealing format.
   - Supports various layout styles.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**:
   Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then run:
   ```bash
   npm install
   ```

3. **Compile Sass**:
   If your project uses Sass, compile the `.scss` files to `.css`:
   ```bash
   npm run sass
   ```

4. **Open the project**:
   Open `index.html` in your preferred web browser to view the application.

## Usage

- **Responsive Design**: The application is designed to adapt to various screen sizes. You can resize your browser or view it on different devices to see the responsive behavior.
  
- **Navigation**: Use the navigation bar to access different sections of the site, including the blog, pricing, and contact form.

- **Contact Form**: Fill out the contact form with your details and submit your inquiry. The form validates input fields for a better user experience.

- **Carousel and Testimonials**: Click through the carousel and read testimonials to engage with the content.

## Contributing
If you want to contribute to this project, please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
- Bootstrap for providing a responsive grid system and components.
- Sass for enabling modular and maintainable CSS. 

---

Feel free to modify this README.md to better suit your project's specific needs!