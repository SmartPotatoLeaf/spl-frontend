import { useState } from 'react';

export interface PlotFormData {
  name: string;
  description: string;
  variety?: string;
  sector?: string;
}

interface PlotFormProps {
  initialData?: PlotFormData;
  mode?: 'create' | 'edit';
}

export default function PlotForm({ initialData, mode = 'create' }: PlotFormProps) {
  const [formData, setFormData] = useState<PlotFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    variety: initialData?.variety || '',
    sector: initialData?.sector || '',
  });

  const [errors, setErrors] = useState<Partial<PlotFormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof PlotFormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<PlotFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Emitir evento para que lo maneje la página de Astro
      window.dispatchEvent(new CustomEvent('plot-form-submit', { detail: formData }));
    }
  };

  const handleCancel = () => {
    window.dispatchEvent(new CustomEvent('plot-form-cancel'));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-state-idle mb-2">
          Nombre de la parcela <span className="text-error">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.name ? 'border-error' : 'border-outline'
          }`}
          placeholder="Ej: Parcela A"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-state-idle mb-2">
          Descripción <span className="text-error">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
            errors.description ? 'border-error' : 'border-outline'
          }`}
          placeholder="Describe la ubicación, características del suelo, etc."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="variety" className="block text-sm font-medium text-state-idle mb-2">
            Variedad de papa
          </label>
          <input
            type="text"
            id="variety"
            name="variety"
            value={formData.variety}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ej: Canchan, Perricholi, Yungay"
          />
        </div>

        <div>
          <label htmlFor="sector" className="block text-sm font-medium text-state-idle mb-2">
            Sector
          </label>
          <input
            type="text"
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Ej: Sector Norte"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-outline">
        <button
          type="submit"
          className="flex-1 sm:flex-initial px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          {mode === 'edit' ? 'Guardar cambios' : 'Crear parcela'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="flex-1 sm:flex-initial px-6 py-2 border border-outline text-state-idle rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
