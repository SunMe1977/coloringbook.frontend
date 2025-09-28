# AI SelfPub ColoringBook Studio Frontend

This project contains the frontend application for the AI SelfPub ColoringBook Studio, built with React and Vite.

## Getting Started

Follow these steps to set up and run the frontend application locally.

### 1. Navigate to the Frontend Directory

### 2. Install Dependencies

```bash
npm install
```

### 3. Update Dependencies (Optional)

To check for and update major package versions:

```bash
npx npm-check-updates -u
```

To see outdated packages:

```bash
npm outdated
```

### 4. Set Environment Variables

You need to set the `VITE_API_BASE_URL` environment variable to point to your backend server.

**For Windows (Command Prompt):**

```cmd
setx VITE_API_BASE_URL "http://localhost:8080"
```

**For Linux/macOS (Bash/Zsh):**

```bash
export VITE_API_BASE_URL="http://localhost:8080"
```

*(Note: For permanent environment variables on Linux/macOS, you might add this to your `~/.bashrc`, `~/.zshrc`, or `~/.profile` file.)*

### 5. Run the Development Server

```bash
npm run dev
```

This will start the application in development mode, usually accessible at `http://localhost:5173`.

### 6. Build for Production

To create a production-ready build:

```bash
npm run build
```

The optimized build files will be generated in the `dist` directory.

### 7. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```