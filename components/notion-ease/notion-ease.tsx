"use client"

import { useState } from "react"
import { NotionWorkspace } from "./notion-workspace"
import { WelcomeScreen } from "./welcome-screen"
import { Onboarding } from "./onboarding"
import { AnalyzingScreen } from "./analyzing-screen"
import { AppShell } from "./app-shell"
import { SessionProvider } from "@/lib/session-store"
import type { Profile } from "@/lib/data"

type Stage = "workspace" | "welcome" | "onboarding" | "analyzing" | "app"

export function NotionEase() {
  const [stage, setStage] = useState<Stage>("workspace")
  const [profile, setProfile] = useState<Profile | null>(null)

  if (stage === "workspace") {
    return <NotionWorkspace onOpenEase={() => setStage("welcome")} />
  }

  if (stage === "welcome") {
    return (
      <WelcomeScreen
        onLogin={() => setStage("onboarding")}
        onBack={() => setStage("workspace")}
      />
    )
  }

  if (stage === "onboarding") {
    return (
      <Onboarding
        onComplete={(p) => {
          setProfile(p)
          setStage("analyzing")
        }}
      />
    )
  }

  if (stage === "analyzing") {
    return <AnalyzingScreen profile={profile} onDone={() => setStage("app")} />
  }

  return (
    <SessionProvider initialProfile={profile}>
      <AppShell />
    </SessionProvider>
  )
}
