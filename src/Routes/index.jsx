import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Template from "../Layouts/Template";
import BookIndex from "../Pages/books";
import Members from "../Pages/members";
import Lendings from "../Pages/lendings";
import Restoration from "../Pages/lendings/data";
import Denda from "../Pages/denda";
import NotLogin from "../Pages/middleware/NotLogin";
import PrivatePage from "../Pages/middleware/PrivatePage";
import Login from "../Pages/Login";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Template />,
        children: [
            {
                element: <NotLogin />, 
                children: [
                    { path: '/', element: <Login /> },
                ]
            },
            {
                element: <PrivatePage />, 
                children: [
                    { path: 'dashboard', element: <Dashboard /> },
                    { path: 'books', element: <BookIndex /> },
                    { path: 'members', element: <Members /> },
                    { path: 'lendings', element: <Lendings /> },
                    { path: 'lendings/data', element: <Restoration /> },
                    { path: 'denda', element: <Denda /> },
                ]
            }
        ]
    }
]);