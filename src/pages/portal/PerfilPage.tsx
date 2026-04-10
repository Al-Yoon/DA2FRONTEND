import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  User,
  Bell,
  Shield,
  Calendar,
  FlaskConical,
  FileText,
  CreditCard,
  Trash2,
  Edit3,
  Save,
  X,
  CheckCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { currentPatient, notifications } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/src/context/AuthContext'

type Tab = 'perfil' | 'notificaciones' | 'seguridad'

const notificationIconMap: Record<string, React.ElementType> = {
  resultado: FlaskConical,
  turno: Calendar,
  receta: FileText,
  pago: CreditCard,
}

const notificationColorMap: Record<string, string> = {
  resultado: 'text-amber-600 bg-amber-50',
  turno: 'text-primary bg-primary/10',
  receta: 'text-accent bg-accent/10',
  pago: 'text-primary bg-primary/10',
}

function useQueryParam(name: string) {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search).get(name), [name, search])
}

function NotificationsTab() {
  const [items, setItems] = useState(notifications)

  const markRead = (id: string) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const remove = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id))

  const unread = items.filter((n) => !n.read).length

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Notificaciones</h2>
          {unread > 0 && <Badge className="bg-accent text-accent-foreground text-xs">{unread} nuevas</Badge>}
        </div>
        {unread > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="border-border text-foreground hover:bg-muted text-xs w-full sm:w-auto"
            onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {items.map((notif) => {
          const Icon = notificationIconMap[notif.type] ?? Bell
          const colorClass = notificationColorMap[notif.type] ?? 'text-primary bg-primary/10'
          return (
            <Card
              key={notif.id}
              className={cn(
                'border shadow-none transition-colors',
                notif.read ? 'border-border' : 'border-accent/30 bg-accent/5'
              )}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex gap-3 sm:gap-4">
                  <div
                    className={cn(
                      'w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      colorClass.split(' ').slice(1).join(' ')
                    )}
                  >
                    <Icon className={cn('w-4 h-4 sm:w-5 sm:h-5', colorClass.split(' ')[0])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                        {notif.urgent && (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs" variant="outline">
                            Urgente
                          </Badge>
                        )}
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />}
                      </div>
                      <button
                        onClick={() => remove(notif.id)}
                        className="text-muted-foreground hover:text-foreground flex-shrink-0"
                        aria-label="Eliminar notificación"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{notif.time}</span>
                      {!notif.read && (
                        <button
                          onClick={() => markRead(notif.id)}
                          className="text-xs text-accent hover:text-accent/80 font-medium"
                        >
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {items.length === 0 && (
          <Card className="border-border shadow-none">
            <CardContent className="p-6 sm:p-12 flex flex-col items-center gap-3 text-center">
              <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No tenés notificaciones.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base font-bold">Preferencias de notificación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Recordatorios de turnos', description: '24 hs y 1 hora antes', enabled: true },
            { label: 'Resultados de laboratorio', description: 'Cuando estén disponibles', enabled: true },
            { label: 'Recetas y medicamentos', description: 'Vencimientos y renovaciones', enabled: true },
            { label: 'Pagos y coseguros', description: 'Confirmaciones y vencimientos', enabled: false },
            { label: 'Novedades del sistema', description: 'Actualizaciones y mantenimientos', enabled: false },
          ].map(({ label, description, enabled: init }) => {
            const [on, setOn] = useState(init)
            return (
              <div key={label} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={on}
                  onClick={() => setOn(!on)}
                  className={cn('relative w-10 h-6 rounded-full transition-colors', on ? 'bg-primary' : 'bg-muted')}
                >
                  <span
                    className={cn(
                      'absolute top-1 left-0 w-4 h-4 rounded-full bg-card shadow transition-transform',
                      on ? 'translate-x-5' : 'translate-x-1'
                    )}
                  />
                  <span className="sr-only">{on ? 'Activado' : 'Desactivado'}</span>
                </button>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileTab() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)

  // Nombre consolidado del auth o del mock
  const authenticatedName = user ? `${user.nombre} ${user.apellido}`.trim() : currentPatient.name
  const authenticatedEmail = user?.email ?? currentPatient.email
  const authenticatedDni = user?.dni ?? currentPatient.dni
  const authenticatedObraSocial = user?.obraSocial ?? currentPatient.obraSocial ?? 'Ninguna'

  const [form, setForm] = useState({
    name: authenticatedName,
    phone: currentPatient.phone,
    email: authenticatedEmail,
  })

  // Sincronizar form si el usuario cambia (ej. al cargar)
  useEffect(() => {
    setForm({
      name: authenticatedName,
      phone: currentPatient.phone,
      email: authenticatedEmail,
    })
  }, [authenticatedName, authenticatedEmail])

  const fields = [
    { label: 'Nombre completo', key: 'name' as const, editable: false },
    { label: 'DNI', value: authenticatedDni, editable: false },
    {
      label: 'Fecha de nacimiento',
      value: new Date(currentPatient.dateOfBirth + 'T00:00:00').toLocaleDateString('es-AR'),
      editable: false,
    },
    { label: 'Grupo sanguíneo', value: currentPatient.bloodType, editable: false },
    { label: 'Teléfono', key: 'phone' as const, editable: true },
    { label: 'Email', key: 'email' as const, editable: true },
    { label: 'Obra Social', value: authenticatedObraSocial, editable: false },
    { label: 'N° de afiliado', value: currentPatient.affiliateNumber, editable: false },
  ]

  const handleSave = () => {
    updateUser({
      email: form.email.trim(),
    })
    setEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg sm:text-2xl font-bold flex-shrink-0">
          {authenticatedName
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground truncate">{authenticatedName}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{authenticatedObraSocial}</p>
          <p className="text-xs text-muted-foreground">ID: {user?.dni ? `PAT-${user.dni.slice(-5)}` : currentPatient.id}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-muted w-full sm:w-auto flex-shrink-0"
          onClick={() => setEditing(!editing)}
        >
          {editing ? (
            <>
              <X className="w-3.5 h-3.5 mr-1.5" />
              Cancelar
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 mr-1.5" />
              Editar
            </>
          )}
        </Button>
      </div>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base font-bold">Datos personales</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {fields.map((field) => (
            <div
              key={field.label}
              className="py-2.5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
            >
              <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">{field.label}</span>
              {editing && 'key' in field && field.key && field.editable ? (
                <input
                  className="flex-1 border border-input rounded-lg px-3 py-2 sm:py-1.5 text-sm bg-background text-foreground outline-none focus:border-primary transition-colors text-left sm:text-right w-full"
                  value={form[field.key]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                />
              ) : (
                <span className="text-sm font-medium text-foreground text-left sm:text-right">
                  {'key' in field && field.key ? form[field.key] : (field as any).value}
                </span>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {editing && (
        <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Guardar cambios
        </Button>
      )}
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Seguridad y privacidad</h2>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base font-bold">Sesiones activas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { device: 'Chrome · Windows 11', location: 'Buenos Aires, AR', current: true, time: 'Ahora' },
            { device: 'Safari · iPhone 14', location: 'Buenos Aires, AR', current: false, time: 'Hace 2 días' },
          ].map(({ device, location, current, time }) => (
            <div key={device} className="flex items-center justify-between gap-2 py-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0', current ? 'bg-primary' : 'bg-muted-foreground')} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{device}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {location} · {time}
                  </p>
                </div>
              </div>
              {current ? (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs flex-shrink-0" variant="outline">
                  Actual
                </Badge>
              ) : (
                <button className="text-xs text-destructive hover:underline flex-shrink-0">Cerrar</button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base font-bold">Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {['Contraseña actual', 'Nueva contraseña', 'Confirmar nueva contraseña'].map((label) => (
            <div key={label}>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
              <input
                type="password"
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          ))}
          <Button className="bg-primary text-primary-foreground hover:bg-secondary w-full mt-2">
            Actualizar contraseña
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base font-bold">Datos y privacidad</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
            <Shield className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground leading-relaxed">
              Sus datos están protegidos bajo la <strong>Ley 25.326 de Protección de Datos Personales</strong> y los
              estándares HIPAA.
            </p>
          </div>
          <Button variant="outline" className="border-border text-foreground hover:bg-muted w-full justify-start">
            <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
            Descargar mis datos personales
          </Button>
          <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/5 w-full justify-start">
            <Trash2 className="w-4 h-4 mr-2" />
            Solicitar eliminación de cuenta
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'perfil', label: 'Mis datos', icon: User },
  { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
  { id: 'seguridad', label: 'Seguridad', icon: Shield },
]

export function PerfilPage() {
  const tabFromQuery = useQueryParam('tab')
  const [activeTab, setActiveTab] = useState<Tab>('perfil')
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (tabFromQuery === 'notificaciones') setActiveTab('notificaciones')
  }, [tabFromQuery])

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
          Portal del Paciente
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-balance">Perfil y Notificaciones</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Gestioná tus datos personales, alertas y configuración de seguridad.
        </p>
      </div>

      <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6 overflow-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex-1 min-w-max sm:flex-auto flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors relative',
              activeTab === id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden xs:inline">{label}</span>
            {id === 'notificaciones' && unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />}
          </button>
        ))}
      </div>

      {activeTab === 'perfil' && <ProfileTab />}
      {activeTab === 'notificaciones' && <NotificationsTab />}
      {activeTab === 'seguridad' && <SecurityTab />}
    </div>
  )
}

