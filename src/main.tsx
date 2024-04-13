// @ts-ignore
import * as React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import User from "./pages/user";
import AskQuestions from "./pages/ask-a-question";
import DataSource from "./pages/data-source";
import { ChakraProvider } from "@chakra-ui/react";

const root = createRoot(document.getElementById("root")!);

root.render(
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<User />} />
        <Route path="ask-a-question" element={<AskQuestions />} />
        <Route path="data-source" element={<DataSource />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
);
