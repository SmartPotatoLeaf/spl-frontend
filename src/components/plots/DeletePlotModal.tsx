import {useTranslation} from 'react-i18next';
import {toast} from "@/stores";
import {deletePlot} from "@/services/plotService.ts";
import DeleteModal from "@/components/shared/DeleteModal.tsx";

interface DeletePlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  plotId: number;
  plotName: string;
  onSuccess?: () => void;
}

export default function DeletePlotModal({
                                          isOpen,
                                          onClose,
                                          plotId,
                                          plotName,
                                          onSuccess,
                                        }: DeletePlotModalProps) {
  const {t} = useTranslation();

  const handleDelete = async () => {
    try {
      await deletePlot(plotId);
      toast.success(t("plots.deleteModal.deleteSuccess"));
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      toast.error(t("plots.deleteModal.deleteError"));
      throw e;
    }
  };

  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={t('plots.deleteModal.title')}
      description={t('plots.deleteModal.description', {name: plotName})}
      confirmText={t('plots.deleteModal.confirm')}
    />
  );
}

