import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";

import Messages from "./pages/Messages";
import { NIP19Page } from "./pages/NIP19Page";
import { Landing } from "./pages/Landing";
import { Catalog } from "./pages/Catalog";
import { LevelPage } from "./pages/LevelPage";
import { LessonPage } from "./pages/LessonPage";
import { Profile } from "./pages/Profile";
import { Progress } from "./pages/Progress";
import NotFound from "./pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:levelCode" element={<LevelPage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/messages" element={<Messages />} />
        {/* NIP-19 route for npub1, note1, naddr1, nevent1, nprofile1 */}
        <Route path="/:nip19" element={<NIP19Page />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;