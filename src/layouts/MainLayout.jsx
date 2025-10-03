import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 w-full rounded-2xl">
            <Header />
            <main className="flex-1 m-6 rounded-2xl">
                 <div className="rounded-2xl">
                    <Outlet />
                 </div>
            </main>

            <Footer />
        </div>
    );
}
