import { useState } from 'react';
import type { PlotFormData } from '@/types';

interface PlotFormProps {
  initialData?: PlotFormData & { id?: bigint };
  mode?: 'create' | 'edit';
  onSubmit: (data: PlotFormData) => Promise<void>;
  onCancel: () => void;
}

export default function PlotForm({ initialData, mode = 'create', onSubmit, onCancel }: PlotFormProps) {
  const [formData, setFormData] = useState<PlotFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    variety: initialData?.variety || '',
    sector: initialData?.sector || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PlotFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof PlotFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PlotFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres';
    }

    if (formData.variety && formData.variety.length > 50) {
      newErrors.variety = 'La variedad no puede exceder 50 caracteres';
    }

    if (formData.sector && formData.sector.length > 50) {
      newErrors.sector = 'El sector no puede exceder 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al guardar parcela:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
            errors.name
              ? 'border-error focus:ring-error/20'
              : 'border-outline focus:ring-primary/20 focus:border-primary'
          }`}
          placeholder="Ej: Parcela A"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-error flex items-center gap-1">
            <i className="fas fa-exclamation-circle"></i>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-state-idle mb-2">
          Descripción <span className="text-error">*</span>
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors resize-none ${
            errors.description
              ? 'border-error focus:ring-error/20'
              : 'border-outline focus:ring-primary/20 focus:border-primary'
          }`}
          placeholder="Describe la ubicación, características del suelo, etc."
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error flex items-center gap-1">
            <i className="fas fa-exclamation-circle"></i>
            {errors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-state-disabled">
          {formData.description.length}/500 caracteres
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="variety" className="block text-sm font-medium text-state-idle mb-2">
            Variedad de papa
          </label>
          <input
            type="text"
            id="variety"
            value={formData.variety}
            onChange={(e) => handleChange('variety', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.variety
                ? 'border-error focus:ring-error/20'
                : 'border-outline focus:ring-primary/20 focus:border-primary'
            }`}
            placeholder="Ej: Canchan, Perricholi, Yungay"
            disabled={isSubmitting}
          />
          {errors.variety && (
            <p className="mt-1 text-sm text-error flex items-center gap-1">
              <i className="fas fa-exclamation-circle"></i>
              {errors.variety}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="sector" className="block text-sm font-medium text-state-idle mb-2">
            Sector
          </label>
          <input
            type="text"
            id="sector"
            value={formData.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.sector
                ? 'border-error focus:ring-error/20'
                : 'border-outline focus:ring-primary/20 focus:border-primary'
            }`}
            placeholder="Ej: Sector Norte"
            disabled={isSubmitting}
          />
          {errors.sector && (
            <p className="mt-1 text-sm text-error flex items-center gap-1">
              <i className="fas fa-exclamation-circle"></i>
              {errors.sector}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 text-state-idle hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <i className="fas fa-spinner fa-spin"></i>}
          {mode === 'edit' ? 'Guardar cambios' : 'Crear parcela'}
        </button>
      </div>
    </form>
  );
}
