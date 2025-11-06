import { useStore } from '@nanostores/react';
import { useState } from 'react';
import { settingsStore, updateUserProfile, setSettingsSaving, markSettingsSaved } from '@/stores/settingsStore';
import { updateProfile } from '@/services/settingsService';
import { toast } from '@/stores/toastStore';
import type { UpdateProfileData } from '@/types/settings';

export default function AccountSection() {
  const { settings, isSaving } = useStore(settingsStore);
  const { user } = settings;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    fullName: user.fullName || '',
    phone: user.phone || '',
    location: user.location || '',
  });

  const formatDate = (date: Date): string => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  const handleSave = async () => {
    try {
      setSettingsSaving(true);
      await updateProfile(formData);
      updateUserProfile(formData);
      markSettingsSaved();
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar perfil');
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-outline p-6">
      <h2 className="text-2xl font-bold text-state-idle mb-6">Cuenta</h2>

      {/* Avatar y datos básicos */}
      <div className="flex items-start gap-6 mb-8 pb-8 border-b border-outline">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <i className="fas fa-user text-3xl text-primary"></i>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-state-idle mb-4">Información básica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-state-disabled">Usuario</label>
              <p className="text-state-idle font-medium">{user.username}</p>
            </div>
            <div>
              <label className="text-sm text-state-disabled">Correo electrónico</label>
              <p className="text-state-idle font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-state-disabled">Rol</label>
              <p className="text-state-idle font-medium">{user.role}</p>
            </div>
            <div>
              <label className="text-sm text-state-disabled">Fecha de registro</label>
              <p className="text-state-idle font-medium">{formatDate(user.registeredAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Editar perfil */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-state-idle">Información adicional</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors"
            >
              <i className="fas fa-edit mr-2"></i>
              Editar perfil
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-state-idle mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Juan Pérez García"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-state-idle mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+51 987 654 321"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-state-idle mb-2">
                Ubicación
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Lima, Perú"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving && <i className="fas fa-spinner fa-spin"></i>}
                Guardar cambios
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: user.fullName || '',
                    phone: user.phone || '',
                    location: user.location || '',
                  });
                }}
                disabled={isSaving}
                className="px-6 py-2 border border-outline text-state-idle rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-state-disabled">Nombre completo</label>
              <p className="text-state-idle font-medium">{user.fullName || 'No especificado'}</p>
            </div>
            <div>
              <label className="text-sm text-state-disabled">Teléfono</label>
              <p className="text-state-idle font-medium">{user.phone || 'No especificado'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-state-disabled">Ubicación</label>
              <p className="text-state-idle font-medium">{user.location || 'No especificada'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
