'use client';

import { MachineType, Attribute, AttributeType, TitleConfig } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMachineType, updateMachineType } from '@/store/slices/machineTypesSlice';
import { useState, FormEvent } from 'react';

interface MachineTypeFormProps {
  machineType?: MachineType;
  onClose: () => void;
}

export default function MachineTypeForm({ machineType, onClose }: MachineTypeFormProps) {
  const dispatch = useAppDispatch();
  const existingTypes = useAppSelector((state) => state.machineTypes.types);
  const [machineType_, setMachineType] = useState(machineType?.title ?? '');
  const [attributes, setAttributes] = useState<Attribute[]>(
    machineType?.attributes ?? []
  );
  const [titleConfig, setTitleConfig] = useState<TitleConfig>(
    machineType?.titleConfig ?? { type: 'manual' }
  );
  const [error, setError] = useState('');
  
  // Track original attribute IDs to know which ones existed before editing
  const [originalAttributeIds] = useState<Set<string>>(
    new Set(machineType?.attributes.map(attr => attr.id) ?? [])
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!machineType_.trim()) {
      setError('Machine Type is required');
      return;
    }

    // Check if machine type is unique (case-insensitive)
    const isDuplicate = existingTypes.some(
      type => type.title.toLowerCase() === machineType_.trim().toLowerCase() && type.id !== machineType?.id
    );

    if (isDuplicate) {
      setError('This Machine Type already exists. Please use a unique name.');
      return;
    }

    // Ensure title attribute is always present
    const titleAttr: Attribute = {
      id: 'title',
      name: 'title',
      type: 'text',
    };

    const finalAttributes = attributes.some(attr => attr.id === 'title')
      ? attributes
      : [titleAttr, ...attributes];

    const typeData: MachineType = {
      id: machineType?.id ?? Date.now().toString(),
      title: machineType_.trim(),
      attributes: finalAttributes,
      titleConfig,
    };

    if (machineType) {
      dispatch(updateMachineType(typeData));
    } else {
      dispatch(addMachineType(typeData));
    }
    
    onClose();
  };

  const addAttribute = () => {
    const newAttr: Attribute = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
    };
    setAttributes([...attributes, newAttr]);
  };

  const updateAttribute = (index: number, field: keyof Attribute, value: string) => {
    const updated = attributes.map((attr, i) => {
      if (i === index) {
        if (field === 'type') {
          return { ...attr, [field]: value as AttributeType };
        } else {
          return { ...attr, [field]: value };
        }
      }
      return attr;
    });
    setAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div style={{ backgroundColor: 'hsl(var(--color-card))' }} className="rounded-lg shadow-elevation-high max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {machineType ? 'Edit' : 'Create'} Machine Type
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Machine Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={machineType_}
                onChange={(e) => {
                  setMachineType(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Bulldozer, Chainsaw, Crane"
                style={{ backgroundColor: 'hsl(var(--color-background))' }}
                className="w-full px-3 py-2 rounded-lg shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                required
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
              <p style={{ color: 'hsl(var(--color-muted-foreground))' }} className="text-xs mt-1">
                Must be unique across all machine types
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Machine Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={titleConfig.type === 'manual' ? 'Manual entry' : ''}
                  placeholder="Users will enter manually or link to attribute"
                  style={{ backgroundColor: 'hsl(var(--color-background))' }}
                  className="w-full px-3 py-2 pr-24 rounded-lg shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                  disabled
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <select
                    value={titleConfig.type === 'manual' ? 'title' : titleConfig.attributeId}
                    onChange={(e) => {
                      if (e.target.value === 'title') {
                        setTitleConfig({ type: 'manual' });
                      } else {
                        setTitleConfig({ type: 'linked', attributeId: e.target.value });
                      }
                    }}
                    style={{ backgroundColor: 'hsl(var(--color-muted) / 0.5)' }}
                    className="px-2 py-1 pr-6 rounded text-xs shadow-elevation-low appearance-none cursor-pointer border border-transparent hover:border-primary/20 transition-colors"
                    title="Choose title source"
                  >
                    <option value="title">manual</option>
                    {attributes
                      .filter(a => a.type === 'text' && a.id !== 'title')
                      .map(attr => (
                        <option key={attr.id} value={attr.id}>
                          {attr.name || 'Unnamed'}
                        </option>
                      ))
                    }
                  </select>
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <p style={{ color: 'hsl(var(--color-muted-foreground))' }} className="text-xs mt-1">
                {titleConfig.type === 'manual' 
                  ? 'Users will enter a unique title for each machine'
                  : `Title will be the same as "${attributes.find(a => a.id === titleConfig.attributeId)?.name || 'selected field'}"`
                }
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">
                  Additional Attributes
                </label>
                <button
                  type="button"
                  onClick={addAttribute}
                  style={{
                    backgroundColor: 'hsl(var(--color-primary))',
                    color: 'hsl(var(--color-primary-foreground))'
                  }}
                  className="px-3 py-1 rounded text-sm transition hover:opacity-90"
                >
                  + Add Attribute
                </button>
              </div>

              <div className="space-y-3">
                {attributes.map((attr, index) => (
                  <div key={index} style={{ backgroundColor: 'hsl(var(--color-muted) / 0.3)' }} className="flex gap-2 items-start p-3 rounded-lg shadow-elevation-low">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={attr.name}
                        onChange={(e) => updateAttribute(index, 'name', e.target.value)}
                        placeholder="Attribute name"
                        style={{ backgroundColor: 'hsl(var(--color-background))' }}
                        className="w-full px-3 py-2 rounded text-sm shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <select
                        value={attr.type}
                        onChange={(e) => updateAttribute(index, 'type', e.target.value)}
                        disabled={originalAttributeIds.has(attr.id)}
                        style={{ 
                          backgroundColor: 'hsl(var(--color-background))',
                          opacity: originalAttributeIds.has(attr.id) ? 0.6 : 1,
                          cursor: originalAttributeIds.has(attr.id) ? 'not-allowed' : 'pointer'
                        }}
                        className="w-full px-3 py-2 rounded text-sm shadow-elevation-low focus:shadow-elevation-medium transition-shadow outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      style={{
                        backgroundColor: 'hsl(var(--color-destructive))',
                        color: 'hsl(var(--color-destructive-foreground))'
                      }}
                      className="px-3 py-2 rounded text-sm transition hover:opacity-90"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {attributes.length === 0 && (
                  <p style={{ color: 'hsl(var(--color-muted-foreground))' }} className="text-sm text-center py-4">
                    No additional attributes. Click &quot;Add Attribute&quot; to add custom fields.
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                style={{
                  backgroundColor: 'hsl(var(--color-primary))',
                  color: 'hsl(var(--color-primary-foreground))'
                }}
                className="flex-1 px-4 py-2 rounded-lg transition hover:opacity-90"
              >
                {machineType ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: 'hsl(var(--color-secondary))',
                  color: 'hsl(var(--color-secondary-foreground))'
                }}
                className="flex-1 px-4 py-2 rounded-lg transition hover:opacity-80"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
