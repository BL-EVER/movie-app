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

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
        errorElement: <NotFound />,
    },
    {
        path: "/movieTheater",
        element: <Protected authorizationRoles={['admin', 'user', 'manager']}><MovieTheaterPage/></Protected>,
        errorElement: <NotFound />,
    },
    {
        path: "/movieTheater/:_id",
        element: <Protected authorizationRoles={['admin', 'manager']}><MovieTheaterPage/></Protected>,
        errorElement: <NotFound />,
    },
    {
        path: "/movie/:_id",
        element: <MoviePage/>,
        errorElement: <NotFound />,
    },
    {
        path: "/ticket/:movieId",
        element: <TicketPage/>,
        errorElement: <NotFound />,
    }
]);

function App() {
  return (
      <>
          <Header/>
          <RouterProvider router={router} />
          <ToastContainer />
      </>
  );
}

export default App;
