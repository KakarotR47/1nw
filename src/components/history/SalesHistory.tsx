import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { SaleTransaction } from '../../types';
import {
  Receipt,
  Search,
  Printer,
  RotateCcw,
  Calendar,
  Banknote,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertOctagon,
  X,
} from 'lucide-react';

export const SalesHistory: React.FC = () => {
  const { transactions, refundSale, openReceiptModal, formatCurrency, isOwner, openProfileModal } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'refunded'>('all');
  const [txToRefund, setTxToRefund] = useState<SaleTransaction | null>(null);
  const [refundReason, setRefundReason] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          tx.receiptNumber.toLowerCase().includes(q) ||
          (tx.customerName && tx.customerName.toLowerCase().includes(q)) ||
          tx.items.some((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [transactions, statusFilter, searchQuery]);

  const summary = useMemo(() => {
    let totalSales = 0;
    let totalProfit = 0;
    let completedCount = 0;
    let refundedCount = 0;

    transactions.forEach((tx) => {
      if (tx.status === 'completed') {
        totalSales += tx.grandTotal;
        totalProfit += tx.grossProfit;
        completedCount++;
      } else {
        refundedCount++;
      }
    });

    return { totalSales, totalProfit, completedCount, refundedCount };
  }, [transactions]);

  const confirmRefund = () => {
    if (!txToRefund || !refundReason.trim()) return;
    refundSale(txToRefund.id, refundReason.trim());
    setTxToRefund(null);
    setRefundReason('');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sales Transactions &amp; Receipts
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Full register audit log, customer reprint archive, and inventory return processing
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Completed Sales
          </div>
          <div className="mt-1 text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white">
            {summary.completedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">transactions settled</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Revenue Settled
          </div>
          <div className="mt-1 text-2xl font-bold font-mono-numbers text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.totalSales)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">gross payments collected</div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Gross Profit Generated</span>
            {!isOwner && <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded">Owner Only</span>}
          </div>
          <div className="mt-1 text-2xl font-bold font-mono-numbers text-slate-900 dark:text-white">
            {isOwner ? (
              formatCurrency(summary.totalProfit)
            ) : (
              <span className="text-slate-400 tracking-widest text-lg">••••••</span>
            )}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isOwner ? 'after merchandise costs' : 'Restricted to store owner'}
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Refunds &amp; Returns
          </div>
          <div className="mt-1 text-2xl font-bold font-mono-numbers text-rose-600 dark:text-rose-400">
            {summary.refundedCount}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">stock returned to shelves</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by receipt # (e.g. RCP-20261107-0001), item name, or customer..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Receipts
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter('refunded')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              statusFilter === 'refunded'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Refunded
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-3">Date &amp; Time</th>
                <th className="py-3 px-3">Items Sold</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3 text-right">Sale Total</th>
                {isOwner && <th className="py-3 px-3 text-right">Gross Profit</th>}
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => {
                const totalUnits = tx.items.reduce((s, i) => s + i.quantity, 0);
                const isRefunded = tx.status === 'refunded';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {tx.receiptNumber}
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      <div>{new Date(tx.timestamp).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {tx.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {totalUnits} units total
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {tx.customerName ? (
                        <div>
                          <div className="font-medium">{tx.customerName}</div>
                          {tx.customerPhone && <div className="text-[10px] text-slate-400 font-mono">{tx.customerPhone}</div>}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Walk-in Customer</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {tx.paymentMethod === 'cash' && <Banknote className="w-3.5 h-3.5 text-emerald-600" />}
                        {tx.paymentMethod === 'card' && <CreditCard className="w-3.5 h-3.5 text-blue-600" />}
                        {tx.paymentMethod === 'mobile_qr' && <QrCode className="w-3.5 h-3.5 text-purple-600" />}
                        <span>{tx.paymentMethod.replace('_', ' ')}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-slate-900 dark:text-white text-sm">
                      {formatCurrency(tx.grandTotal)}
                    </td>

                    {isOwner && (
                      <td className="py-3 px-3 text-right font-mono-numbers font-semibold text-emerald-600 dark:text-emerald-400">
                        {isRefunded ? '—' : `+${formatCurrency(tx.grossProfit)}`}
                      </td>
                    )}

                    <td className="py-3 px-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            isRefunded
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          }`}
                        >
                          {isRefunded ? <AlertOctagon className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                          <span className="capitalize">{tx.status}</span>
                        </span>
                        {isRefunded && tx.refundReason && (
                          <span
                            className="text-[10px] text-rose-600 dark:text-rose-400 italic max-w-[140px] truncate"
                            title={`Reason: ${tx.refundReason}${tx.refundedBy ? ` (by ${tx.refundedBy})` : ''}`}
                          >
                            "{tx.refundReason}"
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openReceiptModal(tx)}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          title="Print / View Receipt"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Receipt</span>
                        </button>

                        {!isRefunded && (
                          <button
                            onClick={() => {
                              setTxToRefund(tx);
                              setRefundReason('');
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Process return / refund & restore stock to shelves"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Receipt className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No transactions match your search criteria
            </p>
          </div>
        )}
      </div>

      {/* In-app Refund Confirmation Modal (Mandatory Reason Required) */}
      {txToRefund && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Confirm Refund &amp; Return
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Receipt #{txToRefund.receiptNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTxToRefund(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700/60 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Total Items Returning to Stock:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  +{txToRefund.items.reduce((s, i) => s + i.quantity, 0)} units
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Refund Amount Due to Customer:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  {formatCurrency(txToRefund.grandTotal)}
                </span>
              </div>
            </div>

            {/* Mandatory Reason Input as requested by user */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Reason for Refund <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">Required</span>
              </div>

              {/* Quick Preset Reason Tags */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Customer returned item',
                  'Wrong item selected',
                  'Damaged paper/stamp',
                  'Customer changed mind',
                  'Pricing error',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRefundReason(preset)}
                    className={`px-2 py-1 text-[11px] rounded-lg border transition-colors ${
                      refundReason === preset
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Write the reason to confirm refund (e.g., Unused stamp paper returned by client)..."
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                autoFocus
              />
              {!refundReason.trim() && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  Please type or select a reason above to enable confirmation.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setTxToRefund(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRefund}
                disabled={!refundReason.trim()}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors ${
                  !refundReason.trim()
                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-70'
                    : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Refund</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
