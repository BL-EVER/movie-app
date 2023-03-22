import Header from "./components/layout/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import NotFound from "./pages/notFound/NotFound";
import Protected from "./pages/utils/Protected";
import MovieTheaterPage from "./pages/MovieTheater/MovieTheaterPage";
import HomePage from "./pages/Home/HomePage";
import MoviePage from "./pages/Movie/MoviePage";
import TicketPage from "./pages/Ticket/TicketPage";
import ProfilePage from "./pages/Profile/ProfilePage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Header><HomePage/></Header>,
        errorElement: <NotFound />,
    },
    {
        path: "/movieTheater",
        element: <Header><Protected authorizationRoles={['admin', 'manager']}><MovieTheaterPage/></Protected></Header>,
        errorElement: <NotFound />,
    },
    {
        path: "/movieTheater/:_id",
        element: <Header><Protected authorizationRoles={['admin', 'manager']}><MovieTheaterPage/></Protected></Header>,
        errorElement: <NotFound />,
    },
    {
        path: "/movie/:_id",
        element: <Header><MoviePage/></Header>,
        errorElement: <NotFound />,
    },
    {
        path: "/ticket/:movieId",
        element: <Header><Protected authorizationRoles={['admin', 'user', 'manager']}><TicketPage/></Protected></Header>,
        errorElement: <NotFound />,
    },
    {
        path: "/profile",
        element: <Header><Protected authorizationRoles={['admin', 'user', 'manager']}><ProfilePage/></Protected></Header>,
        errorElement: <NotFound />,
    }
]);

function App() {
  return (
      <>
          <RouterProvider router={router} />
          <ToastContainer />
      </>
  );
}

export default App;
