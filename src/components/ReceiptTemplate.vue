<template>
  <div class="receipt-container" ref="receiptRef">
    <!-- Receipt Header -->
    <div class="receipt-header">
      <div class="logo-section">
        <img src="@/assets/logo.png" alt="Dinvio Logo" class="logo" />
        <div class="brand-info">
          <h1 class="brand-name">DINVIO</h1>
          <p class="brand-tagline">Crafting Amazing Experiences</p>
        </div>
      </div>

      <div class="receipt-info">
        <div class="receipt-number">
          <span class="label">Receipt #:</span>
          <span class="value">{{ receiptNumber }}</span>
        </div>
        <div class="receipt-date">
          <span class="label">Date:</span>
          <span class="value">{{ currentDate }}</span>
        </div>
        <div class="receipt-time">
          <span class="label">Time:</span>
          <span class="value">{{ currentTime }}</span>
        </div>
      </div>
    </div>

    <!-- Order Details -->
    <div class="order-section">
      <h2 class="section-title">Order Details</h2>

      <!-- Items List -->
      <div class="items-list">
        <div class="item-header">
          <span class="item-name-header">Item</span>
          <span class="item-qty-header">Qty</span>
          <span class="item-price-header">Price</span>
          <span class="item-total-header">Total</span>
        </div>

        <div
          v-for="item in orderItems"
          :key="`${item.name}-${item.tab}-${item.idx}`"
          class="item-row"
        >
          <div class="item-name">
            <span class="item-title">{{ item.name }}</span>
            <span class="item-category">{{ item.category }}</span>
          </div>
          <span class="item-qty">{{ item.count }}</span>
          <span class="item-price">${{ item.price.toFixed(2) }}</span>
          <span class="item-total">${{ (item.price * item.count).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="summary-section">
      <div class="summary-row">
        <span class="summary-label">Subtotal:</span>
        <span class="summary-value">${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="summary-row">
        <span class="summary-label">Tax (8.5%):</span>
        <span class="summary-value">${{ tax.toFixed(2) }}</span>
      </div>
      <div class="summary-row total-row">
        <span class="summary-label">Total:</span>
        <span class="summary-value">${{ total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Payment Method -->
    <div class="payment-section">
      <div class="payment-row">
        <span class="payment-label">Payment Method:</span>
        <span class="payment-value">Cash</span>
      </div>
      <div class="payment-row">
        <span class="payment-label">Status:</span>
        <span class="payment-status">Paid</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="receipt-footer">
      <div class="thank-you">
        <h3>Thank You!</h3>
        <p>We appreciate your business</p>
      </div>

      <div class="contact-info">
        <p><strong>Dinvio Café</strong></p>
        <p>123 Coffee Street, Brew City</p>
        <p>Phone: (555) 123-4567</p>
        <p>Email: hello@dinvio.com</p>
      </div>

      <div class="footer-note">
        <p>Please keep this receipt for your records</p>
        <p>Visit us again soon!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  orderItems: {
    type: Array,
    required: true
  },
  receiptNumber: {
    type: String,
    required: true
  }
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const currentTime = computed(() => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  })
})

const subtotal = computed(() => {
  return props.orderItems.reduce((total, item) => {
    return total + (item.price * item.count)
  }, 0)
})

const tax = computed(() => {
  return subtotal.value * 0.085 // 8.5% tax rate
})

const total = computed(() => {
  return subtotal.value + tax.value
})

// Expose the receipt element for PDF generation
defineExpose({
  receiptRef: null
})
</script>

<style scoped>
.receipt-container {
  width: 400px;
  background: white;
  padding: 30px;
  font-family: 'Arial', sans-serif;
  color: #333;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

/* Print-specific styles */
@media print {
  .receipt-container {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 20px !important;
    box-shadow: none !important;
    background: white !important;
    page-break-inside: avoid;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}

/* Header Styles */
.receipt-header {
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 20px;
  margin-bottom: 25px;
}

.logo-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 50px;
  height: 50px;
  margin-right: 15px;
}

.brand-info {
  flex: 1;
}

.brand-name {
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
  letter-spacing: 2px;
}

.brand-tagline {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  font-style: italic;
}

.receipt-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 12px;
}

.receipt-info > div {
  display: flex;
  justify-content: space-between;
}

.label {
  font-weight: 600;
  color: #6b7280;
}

.value {
  color: #1f2937;
}

/* Order Section */
.order-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.items-list {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.item-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background: #f9fafb;
  padding: 12px 15px;
  font-weight: bold;
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 15px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
}

.item-row:last-child {
  border-bottom: none;
}

.item-name {
  display: flex;
  flex-direction: column;
}

.item-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.item-category {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.item-qty, .item-price, .item-total {
  text-align: center;
  font-weight: 600;
  color: #1f2937;
}

/* Summary Section */
.summary-section {
  border-top: 2px solid #e5e7eb;
  padding-top: 20px;
  margin-bottom: 25px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-label {
  color: #6b7280;
  font-weight: 500;
}

.summary-value {
  font-weight: 600;
  color: #1f2937;
}

.total-row {
  border-top: 1px solid #e5e7eb;
  padding-top: 8px;
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #059669;
}

/* Payment Section */
.payment-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 15px;
  margin-bottom: 25px;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.payment-label {
  color: #6b7280;
  font-weight: 500;
}

.payment-value, .payment-status {
  font-weight: 600;
  color: #1f2937;
}

.payment-status {
  color: #059669;
}

/* Footer */
.receipt-footer {
  border-top: 2px solid #e5e7eb;
  padding-top: 20px;
  text-align: center;
}

.thank-you {
  margin-bottom: 20px;
}

.thank-you h3 {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 5px 0;
}

.thank-you p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.contact-info {
  margin-bottom: 20px;
  font-size: 11px;
  color: #6b7280;
  line-height: 1.4;
}

.contact-info p {
  margin: 2px 0;
}

.footer-note {
  font-size: 10px;
  color: #9ca3af;
  line-height: 1.3;
}

.footer-note p {
  margin: 2px 0;
}

/* Print Styles */
@media print {
  .receipt-container {
    box-shadow: none;
    margin: 0;
    padding: 20px;
  }

  body {
    margin: 0;
    padding: 0;
  }
}
</style>
