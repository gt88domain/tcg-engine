import { Shell } from "@/components/Shell";
import { Skeleton } from "@/components/ui/skeleton";
import { DemoModeProvider, useDemoMode } from "@/context/DemoModeContext";
import LandingPage from "@/pages/LandingPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";

// Lazy-load pages
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const DesignWorkspacePage = lazy(() => import("@/pages/DesignWorkspacePage"));
const GameRulesPage = lazy(() => import("@/pages/GameRulesPage"));
const CardLibraryPage = lazy(() => import("@/pages/CardLibraryPage"));
const DecksPage = lazy(() => import("@/pages/DecksPage"));
const PlayHomePage = lazy(() => import("@/pages/PlayHomePage"));
const GameBoardPage = lazy(() => import("@/pages/GameBoardPage"));
const NewGamePage = lazy(() => import("@/pages/NewGamePage"));
const JoinPage = lazy(() => import("@/pages/JoinPage"));
const PublishPage = lazy(() => import("@/pages/PublishPage"));
const PlayersPage = lazy(() => import("@/pages/PlayersPage"));
const MyDecksPage = lazy(() => import("@/pages/MyDecksPage"));
const HowToPlayPage = lazy(() => import("@/pages/HowToPlayPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const AnalysisPage = lazy(() => import("@/pages/AnalysisPage"));
const PlaytestPage = lazy(() => import("@/pages/PlaytestPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

function PageFallback() {
  return (
    <div className="p-6 space-y-3">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
      <Skeleton className="h-4 w-80" />
      <div className="pt-4 grid grid-cols-3 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

function ShellLayout() {
  return (
    <Shell>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </Shell>
  );
}

const rootRoute = createRootRoute({
  component: function Root() {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <DemoModeProvider>
          <Outlet />
        </DemoModeProvider>
      </ThemeProvider>
    );
  },
});

// Landing page — no Shell, no sidebar
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

// Shell layout — wraps all app routes with sidebar
const shellLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "shell",
  component: ShellLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/dashboard",
  component: function Index() {
    return (
      <Suspense fallback={<PageFallback />}>
        <DashboardPage />
      </Suspense>
    );
  },
});

const designRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/design",
  component: function Design() {
    return (
      <Suspense fallback={<PageFallback />}>
        <DesignWorkspacePage />
      </Suspense>
    );
  },
});

const gameRulesRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/design/game-rules",
  component: function GameRules() {
    return (
      <Suspense fallback={<PageFallback />}>
        <GameRulesPage />
      </Suspense>
    );
  },
});

const cardLibraryRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/design/cards",
  component: function CardLibrary() {
    return (
      <Suspense fallback={<PageFallback />}>
        <CardLibraryPage />
      </Suspense>
    );
  },
});

const decksRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/design/decks",
  component: function Decks() {
    return (
      <Suspense fallback={<PageFallback />}>
        <DecksPage />
      </Suspense>
    );
  },
});

const playHomeRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/play",
  component: function PlayHome() {
    return (
      <Suspense fallback={<PageFallback />}>
        <PlayHomePage />
      </Suspense>
    );
  },
});

const gameBoardRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/play/game/$sessionId",
  component: function GameBoard() {
    return (
      <Suspense fallback={<PageFallback />}>
        <GameBoardPage />
      </Suspense>
    );
  },
});

const newGameRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/play/new",
  component: function NewGame() {
    return (
      <Suspense fallback={<PageFallback />}>
        <NewGamePage />
      </Suspense>
    );
  },
});

const joinRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/join/$code",
  component: function Join() {
    return (
      <Suspense fallback={<PageFallback />}>
        <JoinPage />
      </Suspense>
    );
  },
});

const publishRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/publish",
  component: function Publish() {
    return (
      <Suspense fallback={<PageFallback />}>
        <PublishPage />
      </Suspense>
    );
  },
});

const playersRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/players",
  component: function Players() {
    return (
      <Suspense fallback={<PageFallback />}>
        <PlayersPage />
      </Suspense>
    );
  },
});

const myDecksRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/my-decks",
  component: function MyDecks() {
    return (
      <Suspense fallback={<PageFallback />}>
        <MyDecksPage />
      </Suspense>
    );
  },
});

const howToPlayRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/how-to-play",
  component: function HowToPlay() {
    return (
      <Suspense fallback={<PageFallback />}>
        <HowToPlayPage />
      </Suspense>
    );
  },
});

const profileRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/profile",
  component: function Profile() {
    return (
      <Suspense fallback={<PageFallback />}>
        <ProfilePage />
      </Suspense>
    );
  },
});

const settingsRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/settings",
  component: function Settings() {
    return (
      <Suspense fallback={<PageFallback />}>
        <SettingsPage />
      </Suspense>
    );
  },
});

const notFoundRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "*",
  component: function NotFound() {
    return (
      <Suspense fallback={<PageFallback />}>
        <NotFoundPage />
      </Suspense>
    );
  },
});

const analysisRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/design/analysis",
  component: function Analysis() {
    return (
      <Suspense fallback={<PageFallback />}>
        <AnalysisPage />
      </Suspense>
    );
  },
});

const playtestRoute = createRoute({
  getParentRoute: () => shellLayoutRoute,
  path: "/design/playtest",
  component: function Playtest() {
    return (
      <Suspense fallback={<PageFallback />}>
        <PlaytestPage />
      </Suspense>
    );
  },
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  shellLayoutRoute.addChildren([
    indexRoute,
    designRoute,
    gameRulesRoute,
    cardLibraryRoute,
    decksRoute,
    analysisRoute,
    playtestRoute,
    playHomeRoute,
    gameBoardRoute,
    newGameRoute,
    joinRoute,
    publishRoute,
    playersRoute,
    myDecksRoute,
    howToPlayRoute,
    profileRoute,
    settingsRoute,
    notFoundRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
