import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main className="flex flex-col gap-4 justify-center items-center w-screen h-screen p-6">
      <p className="text-3xl sm:text-5xl font-semibold text-center">404: Page Not Found!</p>
      <Link to="/login">
        <Button className="text-lg sm:text-xl">Back to Login</Button>
      </Link>
    </main>
  );
};

export default NotFoundPage;
