import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => (
  <section className="container mx-auto px-4 py-20 text-center">
    <h1 className="mb-3 text-4xl font-bold">Page not found</h1>
    <p className="mb-8 text-muted-foreground">This CorpIndex route is not part of the MVP yet.</p>
    <Link to="/">
      <Button>Return Home</Button>
    </Link>
  </section>
);

export default NotFound;
