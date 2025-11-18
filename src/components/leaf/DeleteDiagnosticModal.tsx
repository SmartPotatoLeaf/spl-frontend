import {useTranslation} from 'react-i18next';
import {toast} from "@/stores";
import {deleteDiagnostic} from "@/services/diagnosticsService.ts";
import DeleteModal from "@/components/shared/DeleteModal.tsx";

interface DeleteDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionId: string;
}

export default function DeleteDiagnosticModal({
                                                isOpen,
                                                onClose,
                                                predictionId,
                                              }: DeleteDiagnosticModalProps) {
  const {t} = useTranslation();

  const handleDelete = async () => {
    try {
      await deleteDiagnostic(+predictionId);
      toast.success(t("leaf.deleteModal.deleteSuccess"));
      setTimeout(() => {
        window.location.href = '/history';
      }, 1000);
    } catch (e) {
      toast.error(t("leaf.deleteModal.deleteError"));
      throw e;
    }
  };

  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title={t('leaf.deleteModal.title')}
      description={t('leaf.deleteModal.description')}
      confirmText={t('leaf.deleteModal.confirm')}
    />
  );
}
