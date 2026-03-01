import { createBrowserRouter } from "react-router";
import Layout from "./Layout";
import Home from "./pages/Home";
import Boxes from "./pages/Boxes";
import BoxDetail from "./pages/BoxDetail";
import AddressChanges from "./pages/AddressChanges";
import Checklist from "./pages/Checklist";
import Settings from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "boxes", Component: Boxes },
      { path: "boxes/:boxId", Component: BoxDetail },
      { path: "address", Component: AddressChanges },
      { path: "checklist", Component: Checklist },
      { path: "settings", Component: Settings },
    ],
  },
]);
