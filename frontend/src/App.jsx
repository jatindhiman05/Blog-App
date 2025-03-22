import { Routes, Route } from "react-router-dom";
import AuthForm from "./pages/AuthForm";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AddBlog from "./pages/AddBlog";
import BlogPage from "./pages/BlogPage";
import VerifyUser from "./components/VerifyUser";
import ProfilePage from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import SearchBlogs from "./components/SearchBlogs";
import Setting from "./components/Setting";
import AboutPage from "./components/AboutPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<AuthForm type={"signin"} />} />
        <Route path="/signup" element={<AuthForm type={"signup"} />} />
        <Route path="/add-blog" element={<AddBlog />} />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="/edit/:id" element={<AddBlog />} />
        <Route path="/search" element={<SearchBlogs />} />
        <Route path="/tag/:tag" element={<SearchBlogs />} />
        <Route
          path="/verify-email/:verificationToken"
          element={<VerifyUser />}
        />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/setting" element={<Setting />} />

        {/* Profile routes */}
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/:username/saved-blogs" element={<ProfilePage />} />
        <Route path="/:username/liked-blogs" element={<ProfilePage />} />
        <Route path="/:username/draft-blogs" element={<ProfilePage />} />

        {/* Add the About Page Route here */}
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
