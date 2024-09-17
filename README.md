# Chlorophyll 🌳  
**Generative AI-Powered Solution for Urban Heat Island Mitigation**

### Inspiration
Imagine living in the rural Midwest, taking your first trip to NYC with hopes and expectations, only to be met with the annoyingly hot and humid weather! You think about heading back to your peaceful countryside. You're not alone! Many U.S. metropolitan cities have turned into Urban Heat Islands (UHI) due to increasing populations and lack of trees. UHIs cause over 700 heat-related fatalities annually, worsen air quality, and put a strain on energy resources.

With urban populations growing, one thing we can control is **planting more trees**! Some areas of NYC lack significant greenery, emphasizing the need for a tool to visualize how urban spaces could be transformed with more trees, offering sustainable and livable environments.

**Chlorophyll** is a generative AI-powered solution designed to mitigate UHI effects by providing urban planners and individuals with a tool to visualize landscapes enhanced with greenery and trees.

---

### What It Does
1. **Interactive Map**: Displays a Google Map with data on Urban Heat Islands, including area names, latitude, longitude, average temperatures, and other metadata.
2. **Street View Integration**: Allows users to click on hotspots and view a 270-degree panorama of the area via Google Street View API.
3. **Greenscape Simulation**: Enables users to activate a ‘Greenscape’ mode, which generates a realistic image of the area enhanced with trees and greenery. This helps urban planners identify optimal tree-planting locations and encourages individuals to support greener cities.
4. **Cache Feature**: Caches simulated images for faster access upon revisiting. Users can also clear the cache anytime.

---

### How We Built It
- **Frontend**: Built using React with Google Maps and Google Street View APIs. Components include:
  - Map with custom markers
  - Heatmap layer
  - Street view
  - Greenscape view
  - Tailwind CSS for styling.
  
- **Heat Data**: Collected from sources like Google Earth Engine (datasets from Yale Center for Earth Observation) focusing on Boston and Cambridge landmarks.

- **Backend**: Built using Python, LitServe, and Hugging Face libraries. We serve a **Stable Diffusion 1.5 model** controlled by **ControlNet v1.1 with Canny Edge** to generate greenscape elements.

  **Greenscape Workflow**:
  1. Client sends flattened panorama from Google Street View.
  2. Backend processes the panorama using the Stable Diffusion model to generate greenscape-enhanced images.
  3. Client receives and displays the enhanced panorama for a before-and-after comparison.

We also tested OpenAI’s DALL-E and CLIP APIs to generate images, but ControlNet proved to deliver more realistic results.

---

### Challenges We Faced
- Integrating Google Earth Engine datasets and processing the heatmap layer.
- Computational challenges led us to pivot from a client-side to a client-server architecture to handle the heavy processing required for Stable Diffusion models.

---

### Accomplishments We're Proud Of
- Successfully building a complex frontend with React and Tailwind CSS.
- Seamlessly integrating image generation using ControlNet and Stable Diffusion.
- Adding useful features like cache management to improve user experience.

---

### What We Learned
- Integrating diverse technologies such as Google APIs, ControlNet, and Stable Diffusion required efficient coordination.
- Implementing caching and data preprocessing was essential for optimizing performance and user convenience.

---

### Future Plans
- Extend the panoramic view to full 360-degree live imagery.
- Enable user customizations for tree types or urban designs to simulate various greenification strategies.
- Introduce real-time collaboration features between urban planners and local communities to promote shared sustainability goals.

---

### Learn More:
- **MIT Submission**: https://ballot.hackmit.org/project/nrxbx-dybbn-omneh-ziutg
- **Presentation**: [Google Slides](https://docs.google.com/presentation/d/1-GSL8OWDMsA_gvttjJddl060Lp6mOdQW-kQKdWUlAHY/edit?usp=sharing)
- **Video Demo**: [YouTube](https://youtu.be/s9E8diL_gks)
