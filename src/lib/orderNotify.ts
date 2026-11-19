import type { Order } from '../types';

/**
 * Optional alerts for new orders.
 *
 * E-mail uses FormSubmit's AJAX endpoint (https://formsubmit.co) — no account,
 * API key or paid plan required. The recipient clicks a one-time "Activate Form"
 * link sent by FormSubmit before the first message is delivered.
 *
 * WhatsApp uses CallMeBot (https://www.callmebot.com/blog/free-api-whatsapp-messages/),
 * also free. Activation: send "I allow callmebot to send me messages" to
 * +34 644 51 95 23 from the receiving phone, then put the API key in `.env`.
 *
 * Both channels stay silent when their environment variables are empty.
 */
const NOTIFY_EMAIL = import.meta.env.VITE_ORDER_NOTIFY_EMAIL?.trim();
const WHATSAPP_PHONE = import.meta.env.VITE_ORDER_WHATSAPP_PHONE?.trim();
const WHATSAPP_APIKEY = import.meta.env.VITE_ORDER_WHATSAPP_APIKEY?.trim();

const formatPrice = (value: number) => `${value.toLocaleString('fr-FR')} DZD`;

export const isOrderNotifyEnabled = Boolean(NOTIFY_EMAIL);
export const isWhatsAppNotifyEnabled = Boolean(WHATSAPP_PHONE && WHATSAPP_APIKEY);

const buildOrderLines = (order: Order) =>
  order.items.map((item, index) => {
    const name = item.product.name.fr || item.product.name.ar;
    const size = item.selectedSize ? ` — taille ${item.selectedSize}` : '';
    const lineTotal = formatPrice(item.product.price * item.quantity);
    return `${index + 1}. ${item.quantity} × ${name}${size} (${lineTotal})`;
  });

const deliveryLabel = (order: Order) =>
  order.deliveryType === 'home' ? 'À domicile' : 'Bureau (Stop Desk)';

async function notifyByEmail(order: Order): Promise<void> {
  if (!NOTIFY_EMAIL) return;

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
    'Mode de livraison': deliveryLabel(order),
    'Articles': buildOrderLines(order).join('\n') || '—',
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
      console.warn('Notification e-mail en attente :', result.message);
    }
  } catch {
    /* Response body is not required; ignore parsing issues. */
  }
}

async function notifyByWhatsApp(order: Order): Promise<void> {
  if (!WHATSAPP_PHONE || !WHATSAPP_APIKEY) return;

  const lines = [
    `🛒 Nouvelle commande ${order.orderNumber}`,
    `👤 ${order.customerName}`,
    `📱 ${order.customerPhone}`,
    `📍 ${order.wilayaName} — ${order.communeAddress}`,
    `🚚 ${deliveryLabel(order)}`,
    '',
    ...buildOrderLines(order),
    '',
    `Sous-total : ${formatPrice(order.subtotal)}`,
    `Livraison : ${formatPrice(order.deliveryFee)}`,
    `💰 Total COD : ${formatPrice(order.total)}`,
  ];

  if (order.notes) lines.push(`📝 Note : ${order.notes}`);

  const url =
    'https://api.callmebot.com/whatsapp.php' +
    `?phone=${encodeURIComponent(WHATSAPP_PHONE)}` +
    `&text=${encodeURIComponent(lines.join('\n'))}` +
    `&apikey=${encodeURIComponent(WHATSAPP_APIKEY)}`;

  // CallMeBot does not send CORS headers; `no-cors` still delivers the request.
  await fetch(url, { mode: 'no-cors' });
}

export async function notifyNewOrder(order: Order): Promise<void> {
  const results = await Promise.allSettled([
    notifyByEmail(order),
    notifyByWhatsApp(order),
  ]);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.warn('Notification de commande non envoyée :', result.reason);
    }
  }
}
