"use client";

import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface HeaderProps {
  selectedType: string;
  onTypeChange: (typeId: string) => void;
}

export default function Header({ selectedType, onTypeChange }: HeaderProps) {
  const machineTypes = useAppSelector((state) => state.machineTypes.types);

  return (
    <header
      style={{ backgroundColor: "hsl(var(--color-card))" }}
      className="shadow-elevation-medium sticky top-0 z-10"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Machine Management</h1>
            <div className="md:hidden">
              <ThemeSwitcher />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onTypeChange("all")}
                style={{
                  backgroundColor:
                    selectedType === "all"
                      ? "hsl(var(--color-primary))"
                      : "hsl(var(--color-muted))",
                  color:
                    selectedType === "all"
                      ? "hsl(var(--color-primary-foreground))"
                      : "inherit",
                }}
                className="px-4 py-2 rounded-lg font-medium transition hover:opacity-80"
              >
                All
              </button>
              {machineTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => onTypeChange(type.id)}
                  style={{
                    backgroundColor:
                      selectedType === type.id
                        ? "hsl(var(--color-primary))"
                        : "hsl(var(--color-muted))",
                    color:
                      selectedType === type.id
                        ? "hsl(var(--color-primary-foreground))"
                        : "inherit",
                  }}
                  className="px-4 py-2 rounded-lg font-medium transition hover:opacity-80"
                >
                  {type.title}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <Link
                href="/manage-types"
                style={{
                  backgroundColor: "hsl(var(--color-secondary))",
                  color: "hsl(var(--color-secondary-foreground))",
                }}
                className="px-4 py-2 rounded-lg transition hover:opacity-80 font-medium whitespace-nowrap"
              >
                Manage Types
              </Link>
              <div className="hidden md:block">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
