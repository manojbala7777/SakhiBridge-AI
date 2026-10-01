import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

const Assistant = lazy(() => import("./pages/Assistant"));
const Help = lazy(() => import("./pages/Help"));

export default function App() {
  return (
    <Suspense fallback={<p className="center" role="status">…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}
