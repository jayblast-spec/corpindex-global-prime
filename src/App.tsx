import { Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Rankings from "@/pages/Rankings";
import Apply from "@/pages/Apply";
import Partner from "@/pages/Partner";
import Company from "@/pages/Company";
import About from "@/pages/About";
import Intelligence from "@/pages/Intelligence";
import Methodology from "@/pages/Methodology";
import News from "@/pages/News";
import SimplePage from "@/pages/SimplePage";
import NotFound from "@/pages/NotFound";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/rankings"
        element={
          <Layout>
            <Rankings />
          </Layout>
        }
      />
      <Route
        path="/rankings/:view"
        element={
          <Layout>
            <Rankings />
          </Layout>
        }
      />
      <Route
        path="/apply"
        element={
          <Layout showTicker={false}>
            <Apply />
          </Layout>
        }
      />
      <Route
        path="/partner"
        element={
          <Layout showTicker={false}>
            <Partner />
          </Layout>
        }
      />
      <Route
        path="/company/:ticker"
        element={
          <Layout>
            <Company />
          </Layout>
        }
      />
      <Route
        path="/intelligence"
        element={
          <Layout>
            <Intelligence />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout showTicker={false}>
            <About />
          </Layout>
        }
      />
      <Route
        path="/methodology"
        element={
          <Layout showTicker={false}>
            <Methodology />
          </Layout>
        }
      />
      <Route
        path="/news"
        element={
          <Layout showTicker={false}>
            <News />
          </Layout>
        }
      />
      {["careers", "api", "privacy", "terms", "cookies"].map((path) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <Layout showTicker={false}>
              <SimplePage slug={path} />
            </Layout>
          }
        />
      ))}
      <Route
        path="*"
        element={
          <Layout showTicker={false}>
            <NotFound />
          </Layout>
        }
      />
    </Routes>
  );
};

export default App;
