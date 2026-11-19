import type { Order } from '../types';

/**
 * Optional e-mail alerts for new orders.
 *
 * Uses FormSubmit's AJAX endpoint (https://formsubmit.co) so no account, API key
 * or paid plan is required. The recipient must click the one-time "Activate Form"
 * link sent by FormSubmit before the first message is delivered.
 *
 * Configure the destination with `VITE_ORDER_NOTIFY_EMAIL` in `.env`.
 * When the variable is empty, notifications are silently disabled.
 */
const NOTIFY_EMAIL = import.meta.env.VITE_ORDER_NOTIFY_EMAIL?.trim();

const formatPrice = (value: number) => `${value.toLocaleString('fr-FR')} DZD`;

export const isOrderNotifyEnabled = Boolean(NOTIFY_EMAIL);

export async function notifyNewOrder(order: Order): Promise<void> {
  if (!NOTIFY_EMAIL) return;

  const items = order.items
    .map((item, index) => {
      const name = item.product.name.fr || item.product.name.ar;
      const size = item.selectedSize ? ` — taille ${item.selectedSize}` : '';
      const lineTotal = formatPrice(item.product.price * item.quantity);
      return `${index + 1}. ${item.quantity} × ${name}${size} (${lineTotal})`;
    })
    .join('\n');

  const payload = {
    _subject: `Nouvelle commande ${order.orderNumber} — OD WEAR`,
    _template: 'table',
    _captcha: 'false',
    'N° de commande': order.orderNumber,
    'Date': new Date(order.createdAt).toLocaleString('fr-FR'),
    'Client': order.customerName,
    'Téléphone': order.customerPhone,
    'Wilaya': order.wilayaName,
    'Adresse': order.communeAddress,
    'Mode de livraison': order.deliveryType === 'home' ? 'À domicile' : 'Bureau (Stop Desk)',
    'Articles': items || '—',
    'Sous-total': formatPrice(order.subtotal),
    'Frais de livraison': formatPrice(order.deliveryFee),
    'Total à encaisser': formatPrice(order.total),
    'Paiement': order.paymentMethod === 'cod' ? 'Paiement à la livraison (COD)' : 'WhatsApp',
    'Note du client': order.notes || '—',
  };

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(NOTIFY_EMAIL)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`FormSubmit a répondu avec le statut ${response.status}.`);
  }

  // FormSubmit answers 200 with `success: "false"` until the recipient activates
  // the form from their inbox, so surface that state instead of failing silently.
  try {
    const result = (await response.json()) as { success?: string | boolean; message?: string };
    if (result.success === false || result.success === 'false') {
      console.warn('Notification de commande en attente :', result.message);
    }
  } catch {
    /* Response body is not required; ignore parsing issues. */
  }
}
