# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




## for change base url need to change this folders ------->>>>

1.env.js
2.Connection.jsx --- (const API_BASE_URL = "https://aivista.co.in";)--- line no -- 2
3.VectorInsightsTab -- (const API_URL = "https://aivista.co.in/rag_chat";) --- line no -- 179
4.UploadFiles.jsx --- ( callApi("https://aivista.co.in/upload_files", "Chat Insights Upload API")) --- line no -- 136
5.vite.Config.js --- ( target: "https://aivista.co.in/") --- line no -- 12

