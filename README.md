# East Coast Enduro Association (ECEA) Repository

This repository contains the configuration and code for managing events related to the East Coast Enduro Association (ECEA). It includes settings for caching, gzip compression, header optimizations, and various configurations for event management, translations, and content structure.

## Major Parts of the Code

1. **Caching and Compression**:
   - Optimizes default expiration times for static resources (CSS, JS, images, fonts, etc.)
   - Enables gzip compression for various file types to improve loading times.

2. **Event Management**:
   - Contains configurations for different types of racing events (Enduro, Hare Scramble, Dual Sport).
   - Each event includes details such as date, location, registration links, and specific rules.
   - Supports event registration and rider information management.

3. **Content Management**:
   - Implements multi-language support (English, French, Italian, German).
   - Configures headers for security and SEO optimizations.
   - Contains templates for various pages, including blogs and event information.

4. **Club Information**:
   - Stores information about different clubs associated with ECEA, including contact details and event responsibilities.
   - Provides links to club websites and social media for further engagement.

## Installation Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/ecea-repo.git
   cd ecea-repo
   ```

2. **Install Dependencies**:
   Make sure to have Node.js and npm installed, then run:
   ```bash
   npm install
   ```

3. **Build the Project**:
   Use the following command to build the project:
   ```bash
   npm run build
   ```

4. **Start the Server**:
   To run the application, use:
   ```bash
   npm start
   ```

## Usage Instructions

- **Accessing the Website**: After starting the server, navigate to `http://localhost:3000` in your web browser to access the ECEA website.
  
- **Managing Events**: Use the admin interface to create, update, or delete events. Ensure to fill all required fields such as event type, date, and location.

- **User Registration**: Users can register for events through the provided forms. Ensure to have an AMA membership for participation.

- **Translations**: The website supports multiple languages. To switch languages, use the language selector on the home page.

- **Optimizing Performance**: Regularly check the caching settings and update gzip compression as needed to maintain optimal site performance.

For any issues or contributions, please refer to the issues section of the repository or contact the maintainers.

## License

This project is licensed under the MIT License. See the LICENSE file for details.# Event Management System

This repository contains an Event Management System built using Hugo, a modern static site generator. The system is designed to manage and display various youth racing events organized by different clubs. The code is structured with Markdown files for events, configurations, and various templates that render the frontend.

## Major Components

1. **Event Files**:
   - Each event is represented as a Markdown file containing metadata such as title, description, event date, location, club, registration details, and promotional images.
   - The event types are categorized, and the system supports various event formats like Hare Scramble and FastKIDZ.

2. **Configuration Files**:
   - The `config.toml` file contains basic site configuration settings, theme settings, and any necessary redirects for different languages.
   - It defines the theme being used, the base URL, and other parameters relevant to site behavior and appearance.

3. **Templates**:
   - The repository includes HTML templates that render the event details, club information, and other site components.
   - There are specific templates for handling event listings, individual event pages, and error handling (e.g., 404 pages).

4. **CSS and JavaScript**:
   - The system includes CSS styles for layout and design, along with JavaScript for handling interactive elements like sliders and event filtering.

5. **Scripts and Styles**:
   - External libraries and plugins like Font Awesome for icons and jQuery for DOM manipulation are integrated into the project.

## Installation Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Hugo**:
   - Ensure you have Hugo installed on your machine. Follow the instructions on the [Hugo installation page](https://gohugo.io/getting-started/installation/).

3. **Run the Development Server**:
   ```bash
   hugo server
   ```
   - This will start a local server at `http://localhost:1313` where you can preview the site.

## Usage Instructions

1. **Adding New Events**:
   - Create a new Markdown file in the `content/events/` directory with the required metadata.
   - Follow the structure of existing event files for consistency.

2. **Editing Event Information**:
   - Open the respective Markdown file and modify the event details as needed.
   - You can change the event date, location, description, and other relevant information.

3. **Deploying Changes**:
   - Once changes are made, build the static site using:
     ```bash
     hugo
     ```
   - Deploy the generated files in the `public/` directory to your web server.

4. **Customizing Design**:
   - Modify CSS files under `assets/css/` for styling changes.
   - Adjust HTML templates in the `layouts/` directory to change the structure or layout of pages.

## Conclusion

The Event Management System is a flexible and easy-to-use platform for organizing youth racing events. With support for multiple clubs and event types, it provides a robust solution for managing event data and presenting it in an organized manner. For further customization, feel free to explore the templates and styles provided in this repository.# Project Title

## Summary

This project utilizes various code libraries and frameworks to build a web application with features such as a customizable map, a responsive slider, and an array of icons provided by Font Awesome. The key components include:

- **Map Functionality**: The application integrates Google Maps, allowing the display of custom markers based on latitude and longitude attributes set in the HTML.
- **Responsive Slider**: The implementation uses the Slick Slider library to create a responsive carousel for images or content.
- **Font Awesome Integration**: The application incorporates Font Awesome icons for enhanced UI components.

## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/yourproject.git
   cd yourproject
   ```

2. **Install Dependencies**:
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Include Required Libraries**:
   Ensure that you have included the necessary libraries in your HTML. This includes:
   - Google Maps JavaScript API
   - jQuery
   - Bootstrap
   - Font Awesome
   - Slick Slider

   Example:
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
   <link rel="stylesheet" href="path/to/slick.css">
   <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"></script>
   ```

4. **API Key**:
   If using Google Maps, ensure you have a valid API key and include it in your JavaScript initialization.

## Usage

1. **Initialize the Map**:
   In your JavaScript file, set up the map by calling the `map()` function:
   ```javascript
   function map() {
       // Your map initialization code here
   }
   ```

2. **Set Up the Slider**:
   To initialize the Slick Slider, add the following code:
   ```javascript
   $(document).ready(function(){
       $('.your-slider-class').slick({
           // Your slick options here
       });
   });
   ```

3. **Custom Markers**:
   You can customize the markers on the map by setting data attributes in your HTML:
   ```html
   <div id="map" data-latitude="your-latitude" data-longitude="your-longitude" data-marker="path/to/marker.png" data-marker-name="Marker Name"></div>
   ```

4. **Responsive Design**:
   Ensure that your HTML structure follows Bootstrap classes to maintain responsiveness across different devices.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial)
- [Slick Slider](https://kenwheeler.github.io/slick/)
- [Font Awesome](https://fontawesome.com/)
- [Bootstrap](https://getbootstrap.com/)# Project Title

## Overview

This project is a web application built with HTML, CSS, and JavaScript, utilizing Bootstrap for responsive design. The application includes features such as pricing tables, a blog section, testimonials, a contact form, and a product showcase, all styled with SCSS. The code is organized into distinct sections, providing a clear structure for easy navigation and future enhancements.

## Major Parts of the Code

1. **Styling and Layout**:
   - Utilizes Bootstrap's grid and utility classes for responsive layouts.
   - Custom SCSS styles are defined for various components including buttons, forms, modals, and more.

2. **Pricing Section**:
   - Contains pricing tables for different services or products, with customizable pricing items.

3. **Blog and News Section**:
   - A structured layout for displaying blog posts, including titles, meta information, and content.
   - Comments section allowing user interaction.

4. **Testimonials**:
   - A dedicated area for displaying user feedback, with options for styling and layout.

5. **Contact Form**:
   - A functional contact form for user inquiries, with clear input fields and button styling.

6. **Product Showcase**:
   - Displays products in a grid format with options for hovering effects and detailed views.

## Installation Instructions

To set up this project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd your-repo-name
   ```

3. **Install Dependencies**:
   If you are using a package manager like npm, install the necessary dependencies:
   ```bash
   npm install
   ```

4. **Compile SCSS to CSS**:
   Ensure you have a SCSS compiler installed (like node-sass) to convert SCSS files to CSS:
   ```bash
   npm run build-css
   ```

5. **Open the Project**:
   Open the `index.html` file in your browser to view the application:
   ```bash
   open index.html
   ```

## Usage Instructions

- **Navigating the Application**:
  - Use the navigation bar to access different sections such as Pricing, Blog, and Contact.
  - Each section contains relevant content styled according to the defined classes.

- **Interacting with Features**:
  - In the Pricing section, you can view different pricing options.
  - In the Blog section, you can read posts and leave comments.
  - The Contact form allows you to send inquiries directly.

- **Customizing Styles**:
  - To customize the styles, modify the SCSS files located in the `scss` directory.
  - After making changes, recompile the SCSS files to apply updates.

## Contributing

Contributions are welcome! If you would like to contribute, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.