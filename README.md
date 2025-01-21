# Movie Recommendation System

## Overview
The **Movie Recommendation System** is a Vite-based TypeScript application that suggests movies to users based on their preferences. It utilizes machine learning algorithms and collaborative filtering techniques to generate personalized recommendations.

## Features
- **User-based and Item-based Collaborative Filtering**
- **Content-based Recommendation**
- **Hybrid Recommendation System**
- **User Rating and Reviews Analysis**
- **Movie Metadata Utilization**
- **Real-time Recommendation Updates**
- **Interactive User Interface**

## Technologies Used
- **Frontend:** Vite + TypeScript
- **Backend:** Node.js / Express
- **Database:** Supabase
- **Libraries:** Pandas, NumPy, Scikit-learn, TensorFlow (if deep learning is used)
- **Deployment:** Docker, AWS/GCP/Azure

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Ibrahimboutal/MRS.git
   ```
2. Navigate to the project directory:
   ```bash
   cd MRS
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the database:
   - Configure your Supabase project and update the `.env` file with the necessary credentials.
5. Run the application:
   ```bash
   npm run dev
   ```

## Usage
1. **Register/Login** to access the personalized recommendation system.
2. **Search for Movies** using filters such as genre, release year, ratings, and reviews.
3. **Rate Movies** to improve recommendation accuracy.
4. **Get Personalized Recommendations** based on watch history and preferences.

## Data Sources
- IMDb Dataset
- MovieLens Dataset
- The Open Movie Database API (OMDb API)

## Future Enhancements
- Implement deep learning-based recommendations.
- Add sentiment analysis for user reviews.
- Integrate a chatbot for movie discussions.
- Enhance the UI with real-time updates and animations.

## Contributors
- **Ibrahim Boutal** (ibrahim.boutal@gmail.com)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries, please reach out via email at ibrahim.boutal@gmail.com or open an issue on GitHub.

