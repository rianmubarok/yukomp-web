# Yukomp - File Compression Tool

Yukomp is a powerful file compression tool designed to help you optimize your files efficiently. Whether you're working with images or PDFs, Yukomp provides a simple and intuitive interface to compress your files while maintaining quality.

The name "Yukomp" comes from the Indonesian phrase "Yuk Kompres!", which means "Let's compress!", reflecting the tool's friendly and inviting approach to file optimization.

## 🌟 Features

- **Image Compression**

  - Compress multiple images at once
  - Maintain visual quality
  - Supports JPG, JPEG, and PNG formats

- **PDF Compression**
  - Reduce PDF file sizes
  - Maintain document quality
  - Perfect for sharing and storing documents

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS

### Backend

- Python
- Flask
- Pillow (for image processing)
- PyPDF2 (for PDF processing)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Running Locally

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/yukomp.git
cd yukomp
```

#### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend server will run on `http://localhost:5000`

#### 3. Frontend Setup

Open a new terminal window and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will run on `http://localhost:5173`

#### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

Note: Make sure both frontend and backend servers are running simultaneously for the application to work properly.

## 🚀 Self-Hosting Guide

If you want to deploy Yukomp on your own servers, follow these instructions:

### Frontend Deployment (Vercel)

1. Fork or clone this repository
2. Create a new project on Vercel
3. Connect your repository to Vercel
4. Configure the following build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add any necessary environment variables
6. Deploy!

### Backend Deployment (Railway)

1. Fork or clone this repository
2. Create a new project on Railway
3. Connect your repository to Railway
4. Configure environment variables if needed
5. Railway will automatically detect the Python project and use the Procfile
6. Deploy!

Note: Make sure to update the frontend API URL to point to your deployed backend URL.

## 👥 Contributors

- [Muhammad Fitrian Mubarok](https://github.com/rianmubarok)
- [Genard Arya Djaya](https://github.com/genard)

## 📝 License

This project is licensed under the Rupacode License. All rights reserved.

Copyright (c) 2025 Rupacode

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
2. Any modifications or derivative works must be clearly marked as such.
3. The Software may not be used for commercial purposes without explicit permission from Rupacode.
4. The Software is provided "as is", without warranty of any kind, express or implied.
