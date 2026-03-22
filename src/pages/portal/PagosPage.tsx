import { useState } from 'react'
import {
  CreditCard,
  Wallet,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Lock,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { paymentHistory, pendingPayments } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type PaymentMethod = 'visa' | 'mastercard' | 'mercadopago' | 'debin'
type PaymentView = 'list' | 'checkout' | 'success'

function formatCurrency(n: number) {
  return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const paymentMethods: { id: PaymentMethod; label: string; icon: string; last4?: string }[] = [
  { id: 'visa', label: 'Visa', icon: '💳', last4: '4521' },
  { id: 'mastercard', label: 'Mastercard', icon: '💳', last4: '8834' },
  { id: 'mercadopago', label: 'Mercado Pago', icon: '💰' },
  { id: 'debin', label: 'DEBIN / Transferencia', icon: '🏦' },
]

function PaymentCheckout({
  payment,
  onSuccess,
  onBack,
}: {
  payment: (typeof pendingPayments)[0]
  onSuccess: () => void
  onBack: () => void
}) {
  const [method, setMethod] = useState<PaymentMethod>('visa')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 2000)
  }

  const formatCardNumber = (v: string) =>
    v
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim()

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <Card className="border-border shadow-none bg-primary/5">
        <CardContent className="p-5">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Resumen del pago</p>
          <p className="font-semibold text-foreground">{payment.concept}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {payment.doctor} · {payment.turno}
          </p>
          <p className="text-2xl font-bold text-primary mt-3">{formatCurrency(payment.amount)}</p>
        </CardContent>
      </Card>

      <Card className="border-border shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="font-serif text-base">Método de pago</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {paymentMethods.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl border text-xs transition-all text-center',
                method === m.id
                  ? 'border-primary bg-primary/5 text-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              )}
            >
              <span className="text-lg sm:text-2xl">{m.icon}</span>
              <div className="min-w-0">
                <p className="font-medium text-xs text-foreground line-clamp-2">{m.label}</p>
                {m.last4 && <p className="text-xs text-muted-foreground">•••• {m.last4}</p>}
              </div>
              {method === m.id && <CheckCircle className="w-3.5 h-3.5 text-primary mt-1" />}
            </button>
          ))}
        </CardContent>
      </Card>

      {(method === 'visa' || method === 'mastercard') && (
        <Card className="border-border shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="font-serif text-base">Datos de la tarjeta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Nombre en la tarjeta</label>
              <input
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground outline-none focus:border-primary transition-colors"
                placeholder="MARIA E GONZALEZ"
                value={name}
                onChange={(e) => setName(e.target.value.toUpperCase())}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Número de tarjeta</label>
              <input
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground font-mono outline-none focus:border-primary transition-colors"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Vencimiento</label>
                <input
                  className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground font-mono outline-none focus:border-primary transition-colors"
                  placeholder="MM/AA"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">CVV</label>
                <input
                  className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground font-mono outline-none focus:border-primary transition-colors"
                  placeholder="•••"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {method === 'mercadopago' && (
        <Card className="border-border shadow-none bg-muted">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-muted-foreground">
              Serás redirigido a Mercado Pago para completar el pago de forma segura.
            </p>
          </CardContent>
        </Card>
      )}

      {method === 'debin' && (
        <Card className="border-border shadow-none bg-muted">
          <CardContent className="p-5 space-y-2">
            <p className="text-sm font-semibold text-foreground">CBU para transferencia</p>
            <p className="text-sm font-mono text-foreground bg-card rounded-lg p-3 border border-border">
              0720005820000006247915
            </p>
            <p className="text-xs text-muted-foreground">
              Concepto: {payment.turno} — {payment.concept}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="w-3.5 h-3.5 text-primary" />
        Transacción cifrada con SSL 256-bit · PCI DSS Compliant
      </div>

      <Button
        className="w-full bg-primary text-primary-foreground hover:bg-secondary h-12 text-base font-semibold"
        onClick={handlePay}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Procesando...
          </span>
        ) : (
          <>Pagar {formatCurrency(payment.amount)}</>
        )}
      </Button>
    </div>
  )
}

function PaymentSuccess({ onBack }: { onBack: () => void }) {
  return (
    <Card className="max-w-sm mx-auto border-border shadow-none">
      <CardContent className="p-6 sm:p-10 flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="w-9 h-9 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-foreground">Pago exitoso</h2>
          <p className="text-muted-foreground text-sm mt-1">
            El pago fue procesado correctamente. Recibirás el comprobante por email.
          </p>
        </div>
        <div className="w-full bg-muted rounded-xl p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">N° operación</span>
            <span className="font-mono font-semibold text-foreground">
              PAG-{Math.floor(Math.random() * 9000 + 1000)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estado</span>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs" variant="outline">
              Aprobado
            </Badge>
          </div>
        </div>
        <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary" onClick={onBack}>
          Volver al inicio
        </Button>
      </CardContent>
    </Card>
  )
}

export function PagosPage() {
  const [view, setView] = useState<PaymentView>('list')
  const [selectedPayment, setSelectedPayment] = useState<(typeof pendingPayments)[0] | null>(null)

  const totalPending = pendingPayments.reduce((acc, p) => acc + p.amount, 0)

  if (view === 'checkout' && selectedPayment) {
    return (
      <div>
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Portal del Paciente
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-balance">Pagos Online</h1>
        </div>
        <PaymentCheckout
          payment={selectedPayment}
          onSuccess={() => setView('success')}
          onBack={() => setView('list')}
        />
      </div>
    )
  }

  if (view === 'success') {
    return (
      <div>
        <div className="mb-6 sm:mb-8">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
            Portal del Paciente
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-balance">Pagos Online</h1>
        </div>
        <PaymentSuccess onBack={() => setView('list')} />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
          Portal del Paciente
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground text-balance">Pagos Online</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Aboná coseguros y turnos de forma segura desde el portal.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-bold text-foreground">Pagos pendientes</h2>
            {totalPending > 0 && (
              <Badge className="bg-amber-50 text-amber-700 border-amber-200" variant="outline">
                {formatCurrency(totalPending)} pendiente
              </Badge>
            )}
          </div>
          {pendingPayments.length === 0 ? (
            <Card className="border-border shadow-none">
              <CardContent className="p-8 text-center text-muted-foreground">No tenés pagos pendientes.</CardContent>
            </Card>
          ) : (
            pendingPayments.map((p) => (
              <Card key={p.id} className="border-amber-200 shadow-none bg-amber-50/30">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{p.concept}</p>
                        <p className="text-xs text-muted-foreground">{p.doctor}</p>
                        <p className="text-xs text-muted-foreground mt-1">Vencimiento: {formatDate(p.dueDate)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="font-bold text-foreground">{formatCurrency(p.amount)}</p>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-secondary text-xs"
                        onClick={() => {
                          setSelectedPayment(p)
                          setView('checkout')
                        }}
                      >
                        Pagar ahora
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold text-foreground mb-4">Historial de pagos</h2>
          <Card className="border-border shadow-none">
            <CardContent className="p-0 divide-y divide-border">
              {paymentHistory.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                      p.status === 'aprobado' ? 'bg-primary/10' : 'bg-muted'
                    )}
                  >
                    {p.status === 'aprobado' ? (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    ) : (
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.concept}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(p.date)} · {p.method}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {p.amount > 0 ? (
                      <p className="text-sm font-bold text-foreground">{formatCurrency(p.amount)}</p>
                    ) : (
                      <p className="text-sm font-bold text-primary">Cubierto</p>
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        p.status === 'aprobado'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {p.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="font-serif text-lg font-bold text-foreground mb-4">Métodos aceptados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Visa / Mastercard', sub: 'Débito y crédito', icon: CreditCard },
              { name: 'Mercado Pago', sub: 'Billetera virtual', icon: Wallet },
              { name: 'DEBIN', sub: 'Transferencia bancaria', icon: Wallet },
              { name: 'Obra Social', sub: 'Pago directo', icon: CheckCircle },
            ].map(({ name, sub, icon: Icon }) => (
              <Card key={name} className="border-border shadow-none">
                <CardContent className="p-4 flex flex-col gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

