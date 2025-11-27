"use client";
import { useEffect } from "react";

export default function BodyClassUpdater({ className }: { className: string }) {
  useEffect(() => {
    document.body.className = className;
  }, [className]);
  return null;
}
