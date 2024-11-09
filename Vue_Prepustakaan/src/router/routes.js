import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import Notifications from "@/pages/Notifications.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import TableList from "@/pages/ListPeminjaman.vue";
import AddPeminjaman from "@/pages/AddPeminjaman.vue";
import LoginAdmin from "@/pages/LoginAdmin.vue";
import RegisterAja from "../pages/Register.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/login", // Corrected from "/dashbord" to "/dashboard"
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "stats",
        name: "stats",
        component: UserProfile,
      },
      {
        path: "notifications",
        name: "notifications",
        component: Notifications,
      },
      {
        path: "icons",
        name: "icons",
        component: Icons,
      },
      {
        path: "maps",
        name: "maps",
        component: Maps,
      },
      {
        path: "table-list",
        name: "list-Peminjaman",
        component: TableList,
      },
      {
        path: "addPeminjaman", // Corrected from "addPeminjama" to "addPeminjaman"
        name: "AddPeminjaman",
        component: AddPeminjaman,
      },
      {
        path: "login",
        name: "login",
        component: LoginAdmin,
      },
      {
        path: "register",
        name: "register",
        component: RegisterAja,
      },
    ],
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
}; 
**/

export default routes;
