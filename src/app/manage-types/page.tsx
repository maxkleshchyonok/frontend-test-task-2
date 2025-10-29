'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { deleteMachineType } from '@/store/slices/machineTypesSlice';
import { deleteMachinesByType } from '@/store/slices/machinesSlice';
import MachineTypeForm from '@/components/MachineTypeForm';
import { MachineType } from '@/types';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function ManageTypesPage() {
  const dispatch = useAppDispatch();
  const machineTypes = useAppSelector((state) => state.machineTypes.types);
  const machines = useAppSelector((state) => state.machines.machines);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingType, setEditingType] = useState<MachineType | null>(null);

  const handleDelete = (typeId: string) => {
    const machineCount = machines.filter(m => m.typeId === typeId).length;
    const message = machineCount > 0
      ? `This will also delete ${machineCount} machine(s) of this type. Are you sure?`
      : 'Are you sure you want to delete this machine type?';
    
    if (confirm(message)) {
      dispatch(deleteMachineType(typeId));
      dispatch(deleteMachinesByType(typeId));
    }
  };

  return (
    <div style={{ backgroundColor: 'hsl(var(--color-background))' }} className="min-h-screen">
      <header style={{ backgroundColor: 'hsl(var(--color-card))' }} className="border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                style={{ color: 'hsl(var(--color-muted-foreground))' }}
                className="hover:opacity-70 transition"
              >
                ← Back
              </Link>
              <h1 className="text-2xl font-bold">Manage Machine Types</h1>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setIsCreating(true)}
            style={{
              backgroundColor: 'hsl(var(--color-primary))',
              color: 'hsl(var(--color-primary-foreground))'
            }}
            className="px-6 py-3 rounded-lg transition hover:opacity-90 font-medium"
          >
            + Create New Machine Type
          </button>
        </div>

        {machineTypes.length === 0 ? (
          <div style={{ backgroundColor: 'hsl(var(--color-card))' }} className="text-center py-12 border rounded-lg">
            <h2 className="text-xl font-bold mb-2">No Machine Types</h2>
            <p style={{ color: 'hsl(var(--color-muted-foreground))' }}>
              Create your first machine type to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machineTypes.map((type) => {
              const machineCount = machines.filter(m => m.typeId === type.id).length;
              
              return (
                <div key={type.id} style={{ backgroundColor: 'hsl(var(--color-card))' }} className="border rounded-lg p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p style={{ color: 'hsl(var(--color-muted-foreground))' }} className="text-sm mb-4">
                    {machineCount} machine(s) • {type.attributes.length} attribute(s)
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium">Attributes:</p>
                    <ul className="text-sm space-y-1">
                      {type.attributes.map((attr) => (
                        <li key={attr.id} className="flex justify-between">
                          <span>{attr.name}</span>
                          <span style={{ color: 'hsl(var(--color-muted-foreground))' }}>
                            ({attr.type})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingType(type)}
                      style={{
                        backgroundColor: 'hsl(var(--color-primary))',
                        color: 'hsl(var(--color-primary-foreground))'
                      }}
                      className="flex-1 px-3 py-2 rounded transition hover:opacity-90"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(type.id)}
                      style={{
                        backgroundColor: 'hsl(var(--color-destructive))',
                        color: 'hsl(var(--color-destructive-foreground))'
                      }}
                      className="flex-1 px-3 py-2 rounded transition hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {isCreating && (
        <MachineTypeForm onClose={() => setIsCreating(false)} />
      )}
      
      {editingType && (
        <MachineTypeForm
          machineType={editingType}
          onClose={() => setEditingType(null)}
        />
      )}
    </div>
  );
}
