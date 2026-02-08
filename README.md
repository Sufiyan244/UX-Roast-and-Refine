UX Roast & Refine 🔥✨

UX Roast & Refine is an automated design auditor that uses Vision AI to provide brutal, honest feedback on your UI screenshots and suggests high-quality code improvements instantly.

🚀 Features

AI Vision Audit: Upload any UI screenshot and get a score based on layout, typography, and accessibility.

The Roast: A "brutally honest" AI critique of your design choices.

Automatic Code Fixes: Gemini generates ready-to-use Vanilla HTML/Tailwind CSS snippets to fix identified UX issues.

Persona Simulator: See how different users (e.g., a busy executive or someone with low vision) would experience your design.

Design Consultant Chat: A contextual sidebar to ask follow-up questions about color theory, font pairings, or UX best practices.

🛠️ Tech Stack

Engine: Google Gemini 2.5 Flash (Vision Capabilities)

Styling: Tailwind CSS

Icons: Lucide-React

Markdown: Marked.js

Frontend: Vanilla JavaScript / HTML5

🏁 Getting Started

1. Clone the repository

git clone [https://github.com/YOUR_USERNAME/ux-roast-refine.git](https://github.com/YOUR_USERNAME/ux-roast-refine.git)
cd ux-roast-refine


2. Add your API Key

This project requires a Gemini API Key to function.

Get a free key from Google AI Studio.

Open index.html.

Locate const apiKey = ""; around line 155.

Paste your key inside the quotes: const apiKey = "YOUR_KEY_HERE";.

3. Run the project

Since this app uses CDNs and the Gemini API, it must be run through a local server to avoid CORS issues:

If using VS Code, install the Live Server extension.

Right-click index.html and select Open with Live Server.

🤝 Contributing

Feel free to fork this project and submit pull requests for new features, better roast prompts, or improved UI components!
