/**
 * Professional HTML email templates.
 * Kept framework-free (table-based-ish divs) for max email-client compatibility.
 */

const baseWrapper = (title, bodyHtml, accentColor = '#4f46e5') => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>${title}</title></head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.06);">
    <div style="background:${accentColor};padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:.3px;">📦 Inventory System</h1>
    </div>
    <div style="padding:32px;color:#1f2937;">
      ${bodyHtml}
    </div>
    <div style="padding:20px 32px;background:#f9fafb;color:#9ca3af;font-size:12px;text-align:center;">
      This is an automated message from your Inventory Management System. Please do not reply.
    </div>
  </div>
</body>
</html>`;

export const newOrderTemplate = (order) =>
  baseWrapper(
    'New Order Created',
    `
    <h2 style="margin-top:0;">🛒 New Order Received</h2>
    <p>A new order <strong>#${order.orderNumber}</strong> has been created for <strong>${order.customerName}</strong>.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#6b7280;">Total Amount</td><td style="text-align:right;font-weight:600;">$${order.totalPrice.toFixed(2)}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Status</td><td style="text-align:right;">${order.orderStatus}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Items</td><td style="text-align:right;">${order.products.length}</td></tr>
    </table>
    <p style="color:#6b7280;font-size:14px;">View full order details in your dashboard.</p>
  `,
    '#4f46e5'
  );

export const lowStockTemplate = (product) =>
  baseWrapper(
    'Low Stock Alert',
    `
    <h2 style="margin-top:0;color:#d97706;">⚠️ Low Stock Alert</h2>
    <p><strong>${product.name}</strong> (SKU: ${product.sku}) is running low.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#6b7280;">Current Quantity</td><td style="text-align:right;font-weight:600;color:#d97706;">${product.quantity}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Threshold</td><td style="text-align:right;">${product.lowStockThreshold}</td></tr>
    </table>
    <p style="color:#6b7280;font-size:14px;">Consider restocking soon to avoid running out.</p>
  `,
    '#d97706'
  );

export const outOfStockTemplate = (product) =>
  baseWrapper(
    'Out of Stock Alert',
    `
    <h2 style="margin-top:0;color:#dc2626;">🚨 Out of Stock</h2>
    <p><strong>${product.name}</strong> (SKU: ${product.sku}) is now <strong>out of stock</strong>.</p>
    <p style="color:#6b7280;font-size:14px;">This product will be unavailable for new orders until restocked.</p>
  `,
    '#dc2626'
  );

export const productAddedTemplate = (product) =>
  baseWrapper(
    'Product Added',
    `
    <h2 style="margin-top:0;color:#16a34a;">✅ New Product Added</h2>
    <p><strong>${product.name}</strong> has been added to inventory.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#6b7280;">SKU</td><td style="text-align:right;">${product.sku}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Category</td><td style="text-align:right;">${product.category}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Quantity</td><td style="text-align:right;">${product.quantity}</td></tr>
    </table>
  `,
    '#16a34a'
  );

export const productDeletedTemplate = (product) =>
  baseWrapper(
    'Product Deleted',
    `
    <h2 style="margin-top:0;color:#dc2626;">🗑️ Product Removed</h2>
    <p><strong>${product.name}</strong> (SKU: ${product.sku}) has been deleted from inventory.</p>
  `,
    '#dc2626'
  );
