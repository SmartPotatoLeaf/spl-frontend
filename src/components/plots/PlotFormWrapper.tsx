import { useEffect, useState } from 'react';
import PlotForm from './PlotForm';
import type { PlotFormData, PlotDetail } from '@/types';
import { createPlot, updatePlot, getPlotById } from '@/services/plotService';
import { toast } from '@/stores';

interface PlotFormWrapperProps {
  mode: 'create' | 'edit';
  plotId?: string;
}

export default function PlotFormWrapper({ mode, plotId }: PlotFormWrapperProps) {
  const [plot, setPlot] = useState<PlotDetail | null>(null);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && plotId) {
      async function loadPlot() {
        try {
          setIsLoading(true);
          const data = await getPlotById(plotId!);
          setPlot(data);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Error al cargar la parcela';
          setLoadError(errorMessage);
          toast.error('Error al cargar', errorMessage);
        } finally {
          setIsLoading(false);
        }
      }

      loadPlot();
    }
  }, [mode, plotId]);

  const handleSubmit = async (data: PlotFormData) => {
    try {
      setSaveError(null);
      
      if (mode === 'create') {
        await createPlot(data);
        toast.success('¡Parcela creada!', 'Redirigiendo a tus parcelas...');
        setTimeout(() => {
          window.location.href = '/plots';
        }, 2000);
      } else if (mode === 'edit' && plotId) {
        await updatePlot(plotId, data);
        toast.success('¡Cambios guardados!', 'Redirigiendo a detalles de la parcela...');
        setTimeout(() => {
          window.location.href = `/plots/${plotId}`;
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la parcela';
      setSaveError(errorMessage);
      toast.error('Error al guardar', errorMessage);
    }
  };

  const handleCancel = () => {
    if (mode === 'edit' && plotId) {
      window.location.href = `/plots/${plotId}`;
    } else {
      window.location.href = '/plots';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-state-disabled">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (mode === 'edit' && (loadError || !plot)) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
        <i className="fas fa-exclamation-triangle text-4xl text-error mb-4"></i>
        <p className="text-error font-semibold mb-2">Error al cargar la parcela</p>
        <p className="text-error text-sm mb-4">{loadError || 'Parcela no encontrada'}</p>
        <a href="/plots" className="inline-block text-primary hover:underline">
          Volver a mis parcelas
        </a>
      </div>
    );
  }

  const initialData: PlotFormData | undefined = mode === 'edit' && plot ? {
    name: plot.name,
    description: plot.description,
    variety: plot.variety,
    sector: plot.sector,
  } : undefined;

  return (
    <div>
      {saveError && (
        <div className="mb-6 bg-error/10 border border-error rounded-lg p-4 flex items-start gap-3">
          <i className="fas fa-exclamation-triangle text-error mt-0.5"></i>
          <div>
            <p className="text-error font-semibold">Error al guardar</p>
            <p className="text-error text-sm">{saveError}</p>
          </div>
        </div>
      )}
      
      <PlotForm
        mode={mode}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
