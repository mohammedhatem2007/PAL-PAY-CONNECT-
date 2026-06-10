"use client"

import * as React from "react"
import { Copy, Phone, Wallet, History, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const USSD_PREFIX = "*370*1*1*"
const HISTORY_STORAGE_KEY = "palpay_ussd_history"

type Transaction = {
  id: string;
  phoneNumber: string;
  amount: string;
  timestamp: string;
}

export function UssdGenerator() {
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [history, setHistory] = React.useState<Transaction[]>([])
  const { toast } = useToast()

  // تحميل السجل من الذاكرة المحلية عند بدء التشغيل
  React.useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY)
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Failed to parse history", e)
      }
    }
  }, [])

  const ussdCode = React.useMemo(() => {
    if (!phoneNumber || !amount) return ""
    return `${USSD_PREFIX}${phoneNumber}*${amount}#`
  }, [phoneNumber, amount])

  const addToHistory = () => {
    if (!phoneNumber || !amount) return

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      phoneNumber,
      amount,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }

    const updatedHistory = [newTransaction, ...history].slice(0, 10) // الاحتفاظ بآخر 10 عمليات فقط
    setHistory(updatedHistory)
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory))
  }

  const copyToClipboard = () => {
    if (!ussdCode) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "الرجاء إدخال رقم الجوال والمبلغ أولاً.",
      })
      return
    }
    navigator.clipboard.writeText(ussdCode)
    addToHistory()
    toast({
      title: "تم النسخ بنجاح",
      description: `الكود: ${ussdCode}`,
    })
  }

  const handleLaunchDialer = () => {
    if (!ussdCode) return
    addToHistory()
    window.location.href = `tel:${encodeURIComponent(ussdCode)}`
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_STORAGE_KEY)
    toast({
      title: "تم مسح السجل",
      description: "تم إفراغ سجل التحويلات المحلي بنجاح.",
    })
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      <Card className="shadow-lg border-primary/10 overflow-hidden">
        <CardHeader className="bg-primary/5 pb-8">
          <CardTitle className="font-headline text-2xl flex items-center gap-2 text-primary">
            <Wallet className="h-6 w-6" />
            توليد كود PalPay
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            أدخل البيانات لتوليد كود USSD الخاص بالتحويل المباشر
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-headline font-semibold flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              رقم جوال المستلم
            </Label>
            <Input
              id="phone"
              placeholder="مثال: 0599000000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
              className="text-lg h-12 bg-muted/50 focus:bg-background border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="font-headline font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              المبلغ المراد تحويله
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg h-12 bg-muted/50 focus:bg-background border-primary/20"
            />
          </div>

          {ussdCode && (
            <div className="mt-8 p-6 rounded-xl bg-accent/10 border border-accent/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="text-center space-y-3">
                <span className="text-sm font-medium text-accent-foreground/60 block">كود USSD المولد:</span>
                <code dir="ltr" className="text-2xl md:text-3xl font-mono font-bold text-primary tracking-widest break-all">
                  {ussdCode}
                </code>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            onClick={copyToClipboard} 
            disabled={!ussdCode}
            className="flex-1 h-12 gap-2 text-lg font-headline shadow-md transition-all active:scale-95"
            variant="secondary"
          >
            <Copy className="h-5 w-5" />
            نسخ الكود
          </Button>
          <Button 
            onClick={handleLaunchDialer} 
            disabled={!ussdCode}
            className="flex-1 h-12 gap-2 text-lg font-headline bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all active:scale-95"
          >
            <Phone className="h-5 w-5" />
            اتصال مباشر
          </Button>
        </CardFooter>
      </Card>

      {/* سجل التحويلات */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 text-primary">
            <History className="h-5 w-5" />
            سجل آخر التحويلات
          </h3>
          {history.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={clearHistory}
              className="gap-2 rounded-full px-4 h-8"
            >
              <Trash2 className="h-4 w-4" />
              حذف السجل
            </Button>
          )}
        </div>

        <div className="grid gap-3">
          {history.length > 0 ? (
            history.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 rounded-lg bg-card border border-primary/5 shadow-sm hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-secondary p-2 rounded-full">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{item.phoneNumber}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-primary font-bold text-xl">{item.amount} <span className="text-xs">ILS</span></p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-10 rounded-xl border-2 border-dashed border-muted text-center space-y-2 opacity-60">
              <History className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">لا توجد تحويلات مسجلة حالياً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
