export function Footer() {
    return (
        <footer className="border-t bg-muted/30 py-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-6 md:h-24 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0 mx-auto">
                    <p className="text-center text-sm leading-loose text-muted-foreground">
                        Built for better health awareness. Not a substitute for professional medical advice.
                    </p>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                    © 2026 SymptoCare. All rights reserved.
                </p>
            </div>
        </footer>
    )
}
