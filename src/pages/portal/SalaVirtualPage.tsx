import { useState } from 'react'
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  PhoneOff,
  MessageSquare,
  Monitor,
  Users,
  Clock,
  Link2,
  Copy,
  CheckCircle,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { upcomingAppointments } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type SessionState = 'idle' | 'waiting' | 'in-call'

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

const virtualAppointments = upcomingAppointments.filter((a) => a.modality === 'virtual')

function VideoCallInterface({ onEnd }: { onEnd: () => void }) {
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [elapsed] = useState('00:04')
  const [msgOpen, setMsgOpen] = useState(false)
  const [chat, setChat] = useState([{ sender: 'Dr. Vásquez', text: 'Buenos días, ¿cómo se ha sentido esta semana?', mine: false }])
  const [input, setInput] = useState('')

  const sendMsg = () => {
    if (!input.trim()) return
    setChat((c) => [...c, { sender: 'Yo', text: input, mine: true }])
    setInput('')
  }

  return (
    <div className="fixed inset-0 bg-foreground z-50 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-6 py-3 sm:py-4 border-b border-foreground/10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
          <span className="text-primary-foreground font-medium text-sm sm:text-base truncate">Teleconsulta en curso</span>
          <Badge className="bg-accent/20 text-accent border-accent/30 text-xs flex-shrink-0">{elapsed}</Badge>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground truncate">Dra. Laura Vásquez · Clínica Médica</div>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-foreground/95 overflow-hidden p-2 sm:p-6">
        <div className="relative w-full max-w-3xl aspect-video bg-secondary/30 rounded-lg sm:rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 sm:gap-3">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg sm:text-2xl font-bold">
              LV
            </div>
            <p className="text-primary-foreground font-medium text-sm sm:text-base">Dra. Laura Vásquez</p>
            <p className="text-muted-foreground text-xs sm:text-sm">Video conectado</p>
          </div>
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-20 sm:w-32 aspect-video bg-secondary rounded-lg sm:rounded-xl flex items-center justify-center border-2 border-primary">
            {camOn ? (
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted-foreground/30 flex items-center justify-center text-primary-foreground text-xs font-bold">
                  MG
                </div>
                <span className="text-xs text-muted-foreground hidden sm:inline">Tú</span>
              </div>
            ) : (
              <VideoOff className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            )}
          </div>
        </div>

        {msgOpen && (
          <div className="absolute top-0 right-0 h-full w-full sm:w-80 bg-foreground/80 border-l border-foreground/10 flex flex-col">
            <div className="px-4 py-3 border-b border-foreground/10">
              <p className="text-primary-foreground font-medium text-sm">Chat de sesión</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chat.map((msg, i) => (
                <div key={i} className={cn('flex flex-col', msg.mine ? 'items-end' : 'items-start')}>
                  <span className="text-xs text-muted-foreground mb-1">{msg.sender}</span>
                  <div
                    className={cn(
                      'rounded-xl px-3 py-2 text-sm max-w-[85%]',
                      msg.mine ? 'bg-primary text-primary-foreground' : 'bg-secondary/30 text-primary-foreground'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-foreground/10 flex gap-2">
              <input
                className="flex-1 bg-secondary/20 rounded-lg px-3 py-2 text-sm text-primary-foreground placeholder:text-muted-foreground outline-none"
                placeholder="Escribir mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMsg()}
              />
              <button
                onClick={sendMsg}
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-3 px-2 sm:px-6 py-3 sm:py-5 border-t border-foreground/10 overflow-x-auto">
        <button
          onClick={() => setMicOn(!micOn)}
          className={cn(
            'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0',
            micOn ? 'bg-secondary/30 text-primary-foreground hover:bg-secondary/50' : 'bg-destructive text-primary-foreground'
          )}
          aria-label={micOn ? 'Silenciar micrófono' : 'Activar micrófono'}
        >
          {micOn ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        <button
          onClick={() => setCamOn(!camOn)}
          className={cn(
            'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0',
            camOn ? 'bg-secondary/30 text-primary-foreground hover:bg-secondary/50' : 'bg-destructive text-primary-foreground'
          )}
          aria-label={camOn ? 'Apagar cámara' : 'Encender cámara'}
        >
          {camOn ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        <button
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/30 text-primary-foreground hover:bg-secondary/50 flex items-center justify-center flex-shrink-0 hidden sm:flex"
          aria-label="Compartir pantalla"
        >
          <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={() => setMsgOpen(!msgOpen)}
          className={cn(
            'w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors flex-shrink-0',
            msgOpen ? 'bg-accent text-accent-foreground' : 'bg-secondary/30 text-primary-foreground hover:bg-secondary/50'
          )}
          aria-label="Abrir chat"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onEnd}
          className="w-10 h-10 sm:w-14 sm:h-12 rounded-full bg-destructive text-primary-foreground flex items-center justify-center hover:bg-destructive/90 flex-shrink-0"
          aria-label="Finalizar llamada"
        >
          <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  )
}

function WaitingRoom({ onJoin, onBack }: { onJoin: () => void; onBack: () => void }) {
  const appt = virtualAppointments[0]
  return (
    <Card className="max-w-lg mx-auto border-border shadow-none">
      <CardContent className="p-4 sm:p-8 flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-accent animate-pulse" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">Sala de espera virtual</h2>
          <p className="text-muted-foreground text-sm mt-1">Conectado — esperando al profesional</p>
        </div>
        <div className="w-full bg-muted rounded-xl p-4 text-left space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tu turno</p>
          <p className="font-semibold text-foreground">{appt?.doctor}</p>
          <p className="text-sm text-muted-foreground">{appt?.specialty}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            {appt?.time} hs
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-accent">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          El profesional ingresará en breve
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="outline" className="flex-1 border-border text-foreground hover:bg-muted" onClick={onBack}>
            Cancelar
          </Button>
          <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={onJoin}>
            <Video className="w-4 h-4 mr-2" />
            Ingresar ahora
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function SalaVirtualPage() {
  const [state, setState] = useState<SessionState>('idle')
  const [copied, setCopied] = useState(false)
  const sessionCode = 'HG-2026-8952'

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (state === 'in-call') return <VideoCallInterface onEnd={() => setState('idle')} />

  if (state === 'waiting') {
    return (
      <div>
        <div className="mb-8">
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">Portal del Paciente</p>
          <h1 className="font-serif text-3xl font-bold text-foreground text-balance">Sala Virtual</h1>
        </div>
        <WaitingRoom onJoin={() => setState('in-call')} onBack={() => setState('idle')} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
          Portal del Paciente
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-balance">Sala Virtual</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Teleconsultas médicas de baja complejidad desde cualquier dispositivo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-foreground hidden sm:block">Teleconsultas programadas</h2>
          {virtualAppointments.length === 0 ? (
            <Card className="border-border shadow-none">
              <CardContent className="p-8 text-center text-muted-foreground">
                No tenés teleconsultas programadas.
              </CardContent>
            </Card>
          ) : (
            virtualAppointments.map((appt) => (
              <Card key={appt.id} className="border-border shadow-none">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Video className="w-5 h-5 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{appt.doctor}</p>
                        <p className="text-xs text-muted-foreground truncate">{appt.specialty}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(appt.date)} · {appt.time} hs
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-accent text-accent-foreground hover:bg-accent/90 text-xs flex-shrink-0 w-full sm:w-auto"
                      onClick={() => setState('waiting')}
                    >
                      Unirse
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          <Card className="border-dashed border-2 border-border shadow-none cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-5 flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
              <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Solicitar nueva teleconsulta</p>
                <p className="text-xs opacity-70">Consultas de baja complejidad disponibles</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-border shadow-none order-first sm:order-none">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base font-bold">Unirse con código de sesión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 bg-muted rounded-lg px-4 py-3 flex items-center gap-2 border border-border">
                  <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground font-mono"
                    placeholder="HG-YYYY-XXXX"
                    defaultValue={sessionCode}
                    readOnly
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-border"
                  onClick={handleCopy}
                  aria-label="Copiar código"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary" onClick={() => setState('waiting')}>
                <Phone className="w-4 h-4 mr-2" />
                Conectarse a la sesión
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="font-serif text-base font-bold">Requisitos técnicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Cámara detectada', ok: true },
                { label: 'Micrófono habilitado', ok: true },
                { label: 'Conexión estable (15 Mbps+)', ok: true },
                { label: 'Navegador compatible (Chrome/Firefox)', ok: true },
              ].map(({ label, ok }) => (
                <div key={label} className="flex items-center gap-3">
                  <CheckCircle className={cn('w-4 h-4 flex-shrink-0', ok ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="text-sm text-foreground">{label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border shadow-none bg-primary/5">
            <CardContent className="p-4 flex gap-3">
              <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Teleconsultas disponibles</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Las consultas virtuales son para seguimientos, recetas y consultas de baja complejidad. Para urgencias,
                  concurrí al servicio de guardia.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

