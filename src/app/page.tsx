
import { UssdGenerator } from "@/components/ussd-generator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Wallet } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-headline text-xl font-bold tracking-tight text-primary">
              PalPay <span className="text-foreground">Connect</span>
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight">
            سهولة التحويل مع <span className="text-primary">بال باي</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            ولد كود USSD الخاص بمعاملتك فوراً، وبكل أمان. لا حاجة لحفظ الأكواد الطويلة بعد الآن.
          </p>
        </div>

        <UssdGenerator />
      </main>

      <footer className="border-t py-8 bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-medium">
            جميع الحقوق محفوظة لدى الرفاق للحلول التكنولوجية 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
