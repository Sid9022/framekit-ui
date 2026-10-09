import type * as React from 'react'
import { ReceiptPrintToast, DEFAULT_RECEIPTS } from '@/components/ui/receipt-print-toast'

const demo: React.ReactNode = <ReceiptPrintToast receipt={DEFAULT_RECEIPTS[0]} />

export default demo
