import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function openWhatsAppOrder(whatsappNumber, { name, phone, address, items, total }) {
  const line = (text = '') => `\n${text}`;
  const lines = ['*New Order*'];
  lines.push(line(`*Name:* ${name}`));
  lines.push(line(`*Phone:* ${phone}`));
  if (address) lines.push(line(`*Address:* ${address}`));
  lines.push(line());
  lines.push('*Items:*');
  items.forEach((item) => {
    lines.push(line(`- ${item.title} x ${item.quantity} = Rs.${item.price.toLocaleString()}`));
  });
  lines.push(line());
  lines.push(`*Total:* Rs.${total.toLocaleString()}`);
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join(''))}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
