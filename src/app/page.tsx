"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import Header from "@/components/Header";
import MachineCard from "@/components/MachineCard";
import MachineFormModal from "@/components/MachineFormModal";
import { getTokenForTypeId, getTypeIdForToken } from "@/utils/filterToken";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const machineTypes = useAppSelector((state) => state.machineTypes.types);
  const machines = useAppSelector((state) => state.machines.machines);

  const [selectedType, setSelectedType] = useState(() => {
    const filterToken = searchParams.get("filter");
    if (filterToken) {
      const typeId = getTypeIdForToken(filterToken);
      if (
        typeId &&
        (typeId === "all" || machineTypes.some((t) => t.id === typeId))
      ) {
        return typeId;
      }
    }
    return "all";
  });

  const [isAddingMachine, setIsAddingMachine] = useState(false);
  const [addingToType, setAddingToType] = useState<string | null>(null);

  const validatedSelectedType =
    selectedType !== "all" && !machineTypes.some((t) => t.id === selectedType)
      ? "all"
      : selectedType;

  useEffect(() => {
    if (validatedSelectedType === "all" && selectedType !== "all") {
      router.replace("/");
    }
  }, [validatedSelectedType, selectedType, router]);

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);

    const token = getTokenForTypeId(typeId);
    if (typeId === "all") {
      router.replace("/");
    } else {
      router.replace(`/?filter=${token}`);
    }
  };

  const filteredTypes =
    validatedSelectedType === "all"
      ? machineTypes
      : machineTypes.filter((t) => t.id === validatedSelectedType);

  const handleAddMachine = (typeId: string) => {
    setAddingToType(typeId);
    setIsAddingMachine(true);
  };

  return (
    <div
      style={{ backgroundColor: "hsl(var(--color-background))" }}
      className="min-h-screen"
    >
      <Header
        selectedType={validatedSelectedType}
        onTypeChange={handleTypeChange}
      />

      <main className="container mx-auto px-4 py-8">
        {machineTypes.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No Machine Types Yet</h2>
            <p
              style={{ color: "hsl(var(--color-muted-foreground))" }}
              className="mb-6"
            >
              Get started by creating your first machine type.
            </p>
            <a
              href="/manage-types"
              style={{
                backgroundColor: "hsl(var(--color-primary))",
                color: "hsl(var(--color-primary-foreground))",
              }}
              className="inline-block px-6 py-3 rounded-lg transition hover:opacity-90"
            >
              Create Machine Type
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredTypes.map((type) => {
              const typeMachines = machines.filter((m) => m.typeId === type.id);

              return (
                <div
                  key={type.id}
                  style={{ backgroundColor: "hsl(var(--color-card))" }}
                  className="rounded-lg p-6 shadow-elevation-card"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{type.title}</h2>
                    <button
                      onClick={() => handleAddMachine(type.id)}
                      style={{
                        backgroundColor: "hsl(var(--color-primary))",
                        color: "hsl(var(--color-primary-foreground))",
                      }}
                      className="px-4 py-2 rounded-lg transition hover:opacity-90"
                    >
                      + Add {type.title}
                    </button>
                  </div>

                  {typeMachines.length === 0 ? (
                    <p
                      style={{ color: "hsl(var(--color-muted-foreground))" }}
                      className="text-center py-8"
                    >
                      No machines of this type yet. Click &quot;Add {type.title}
                      &quot; to create one.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {typeMachines.map((machine) => (
                        <MachineCard
                          key={machine.id}
                          machine={machine}
                          machineType={type}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isAddingMachine && addingToType && (
        <MachineFormModal
          machineType={machineTypes.find((t) => t.id === addingToType)!}
          onClose={() => {
            setIsAddingMachine(false);
            setAddingToType(null);
          }}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div
          style={{ backgroundColor: "hsl(var(--color-background))" }}
          className="min-h-screen"
        >
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
