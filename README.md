# Jain Jinvani (जैन जिनवाणी)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)

**Jain Jinvani** is a comprehensive digital encyclopedia and daily companion for the Jain community. It provides a modern, interactive interface to access Arti, Bhajans, Chalisa, Path, Puja, Tirthankar details, and cosmology data.

## Features

- **📚 Digital Library**: Extensive collection of Jain texts and scriptures.
- **🧘 Sadhana Tools**: Interactive interfaces for daily rituals (Vidhi, Path, Arti).
- **📅 Jain Calendar**: Lunisolar calendar with Tithi and festival notifications.
- **🎨 Modern UI**: Glassmorphism design, macOS-style Dock navigation, and 3D animated emojis.
- **📱 Responsive**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React, Fluent Emojis
- **Data**: Modular JavaScript data files

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/jain-jinvani.git
   cd jain-jinvani
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5173`.

## Project Structure

```
e:/JainJinvani/
├── public/                 # Static assets and legacy modules
│   └── modules/            # Data modules (Arti, Bhajan, etc.)
├── src/
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Layout components (Dock, Header)
│   │   └── ui/             # Core UI components
│   ├── pages/              # Application page views
│   ├── lib/                # Utilities and helper functions
│   └── types/              # TypeScript type definitions
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Project dependencies and scripts
```

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.