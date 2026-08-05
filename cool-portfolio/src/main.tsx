import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import { HomePage } from "@/pages/Home";
import { PublicationsPage } from "@/pages/Publications";
import { ProjectsPage } from "@/pages/Projects";
import { BlogPage } from "@/pages/Blog";
import { ResumePage } from "@/pages/Resume";
import { ContactPage } from "@/pages/Contact";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="publications" element={<PublicationsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
