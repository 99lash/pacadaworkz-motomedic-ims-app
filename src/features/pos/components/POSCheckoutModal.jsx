import React from "react";
import PropTypes from "prop-types";
import { CreditCard, Wallet, Smartphone, X } from "lucide-react";
import { UI_TEXT, PAYMENT_METHODS, formatCurrency } from "../utils";

const POSCheckoutModal = ({
  show,
  total,
  paymentMethod,
  amountPaid,
  change,
  onClose,
  onPaymentMethodChange,
  onAmountPaidChange,
  onCompleteSale,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {UI_TEXT.COMPLETE_PAYMENT}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-3 font-medium">
            {UI_TEXT.PAYMENT_METHOD}
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onPaymentMethodChange(PAYMENT_METHODS.CASH)}
              className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === PAYMENT_METHODS.CASH
                  ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Wallet className="w-6 h-6" />
              <span className="text-sm font-medium">
                {UI_TEXT.PAYMENT_CASH}
              </span>
            </button>
            <button
              onClick={() => onPaymentMethodChange(PAYMENT_METHODS.CARD)}
              className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === PAYMENT_METHODS.CARD
                  ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-sm font-medium">
                {UI_TEXT.PAYMENT_CARD}
              </span>
            </button>
            <button
              onClick={() => onPaymentMethodChange(PAYMENT_METHODS.GCASH)}
              className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === PAYMENT_METHODS.GCASH
                  ? "border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <Smartphone className="w-6 h-6" />
              <span className="text-sm font-medium">
                {UI_TEXT.PAYMENT_GCASH}
              </span>
            </button>
          </div>
        </div>

        {/* Amount Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
            <span>{UI_TEXT.TOTAL_AMOUNT}</span>
            <span className="text-xl text-gray-900 dark:text-gray-100 font-bold">
              {formatCurrency(total)}
            </span>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              {UI_TEXT.AMOUNT_PAID}
            </label>
            <input
              type="number"
              min={total}
              step="0.01"
              value={amountPaid === 0 ? "" : amountPaid}
              onChange={(e) => onAmountPaidChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {UI_TEXT.CHANGE}
            </span>
            <span className="text-xl text-green-700 dark:text-green-400 font-bold">
              {formatCurrency(change)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            {UI_TEXT.CANCEL}
          </button>
          <button
            onClick={onCompleteSale}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {UI_TEXT.COMPLETE_SALE}
          </button>
        </div>
      </div>
    </div>
  );
};

POSCheckoutModal.propTypes = {
  show: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  amountPaid: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  change: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onPaymentMethodChange: PropTypes.func.isRequired,
  onAmountPaidChange: PropTypes.func.isRequired,
  onCompleteSale: PropTypes.func.isRequired,
};

export default POSCheckoutModal;
