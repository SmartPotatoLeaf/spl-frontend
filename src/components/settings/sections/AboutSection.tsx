import { useStore } from '@nanostores/react';
import { settingsStore } from '@/stores/settingsStore';

export default function AboutSection() {
  const { settings } = useStore(settingsStore);
  const { appInfo } = settings;

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-outline p-6 space-y-8">
      <h2 className="text-2xl font-bold text-state-idle">Acerca de</h2>

      {/* Información de la app */}
      <div className="pb-8 border-b border-outline">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <i className="fas fa-leaf text-4xl text-primary"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-state-idle">Smart Potato Leaf</h3>
            <p className="text-state-disabled mt-1">Sistema de diagnóstico de rancha en papa</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-state-disabled">Versión <span className="text-state-idle font-medium">{appInfo.version}</span></span>
              <span className="text-state-disabled">•</span>
              <span className="text-state-disabled">Actualizado el {formatDate(appInfo.lastUpdate)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-state-idle mb-3">Novedades</h4>
          <ul className="space-y-2">
            {appInfo.changelog.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <i className="fas fa-check text-primary mt-0.5"></i>
                <span className="text-state-idle">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Soporte */}
      <div className="pb-8 border-b border-outline">
        <h3 className="text-lg font-semibold text-state-idle mb-4">Soporte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="#"
            className="p-4 border border-outline rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-question-circle text-primary text-xl"></i>
              <div>
                <p className="font-medium text-state-idle">Centro de ayuda</p>
                <p className="text-sm text-state-disabled">Documentación y guías</p>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="p-4 border border-outline rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-bug text-primary text-xl"></i>
              <div>
                <p className="font-medium text-state-idle">Reportar problema</p>
                <p className="text-sm text-state-disabled">Informa errores o bugs</p>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="p-4 border border-outline rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-comment text-primary text-xl"></i>
              <div>
                <p className="font-medium text-state-idle">Enviar feedback</p>
                <p className="text-sm text-state-disabled">Comparte tus sugerencias</p>
              </div>
            </div>
          </a>

          <a
            href="#"
            className="p-4 border border-outline rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="fas fa-headset text-primary text-xl"></i>
              <div>
                <p className="font-medium text-state-idle">Contactar soporte</p>
                <p className="text-sm text-state-disabled">Ayuda personalizada</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Legal */}
      <div className="pb-8 border-b border-outline">
        <h3 className="text-lg font-semibold text-state-idle mb-4">Legal</h3>
        <div className="space-y-3">
          <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-state-idle">Términos y condiciones</span>
            <i className="fas fa-chevron-right text-state-disabled"></i>
          </a>
          <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-state-idle">Política de privacidad</span>
            <i className="fas fa-chevron-right text-state-disabled"></i>
          </a>
          <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-state-idle">Licencias de código abierto</span>
            <i className="fas fa-chevron-right text-state-disabled"></i>
          </a>
        </div>
      </div>

      {/* Equipo */}
      <div>
        <h3 className="text-lg font-semibold text-state-idle mb-4">Equipo</h3>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <i className="fas fa-users text-4xl text-primary mb-4"></i>
          <p className="text-state-idle font-medium mb-2">Desarrollado con 💚 en Perú</p>
          <p className="text-sm text-state-disabled">© 2025 SmartPotatoLeaf</p>
          <p className="text-sm text-state-disabled mt-1">Todos los derechos reservados</p>
        </div>
      </div>
    </div>
  );
}
