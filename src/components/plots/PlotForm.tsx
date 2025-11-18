import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {PlotFormData} from '@/types';

interface PlotFormProps {
  initialData?: PlotFormData & { id?: bigint };
  mode?: 'create' | 'edit';
  onSubmit: (data: PlotFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function PlotForm({ initialData, mode = 'create', onSubmit, onCancel, isSubmitting }: PlotFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<PlotFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PlotFormData, string>>>({});

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
      newErrors.name = t('plots.form.errors.nameRequired');
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t('plots.form.errors.nameMinLength');
    } else if (formData.name.trim().length > 100) {
      newErrors.name = t('plots.form.errors.nameMaxLength');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('plots.form.errors.descriptionRequired');
    } else if (formData.description.trim().length < 10) {
      newErrors.description = t('plots.form.errors.descriptionMinLength');
    } else if (formData.description.trim().length > 500) {
      newErrors.description = t('plots.form.errors.descriptionMaxLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al guardar parcela:', error);
    } finally {
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-state-idle mb-2">
          {t('plots.form.nameLabel')} <span className="text-error">*</span>
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
          placeholder={t('plots.form.namePlaceholder')}
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
          {t('plots.form.descriptionLabel')} <span className="text-error">*</span>
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
          placeholder={t('plots.form.descriptionPlaceholder')}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-error flex items-center gap-1">
            <i className="fas fa-exclamation-circle"></i>
            {errors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-state-disabled">
          {formData.description.length}/500 {t('plots.form.characters')}
        </p>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 text-state-idle hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('plots.form.cancel')}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting && <i className="fas fa-spinner fa-spin"></i>}
          {isSubmitting ? t('plots.form.saving') : t('plots.form.save')}
        </button>
      </div>
    </form>
  );
}
