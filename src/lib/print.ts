import type { StoreSettings, OrderServiceInfo } from '@/types';
import { formatCurrency, formatDate, formatDateTime } from './utils';

interface InvoiceLine {
  designation: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceData {
  type: 'purchase' | 'sale';
  reference: string;
  date: string;
  partyName: string;
  partyPhone?: string;
  partyAddress?: string;
  lines: InvoiceLine[];
  total: number;
  reduction?: number;
  final?: number;
  paid: number;
  rest: number;
  service?: OrderServiceInfo;
}

const SERVICE_LABELS = { table: 'Sur place', takeaway: 'À emporter', delivery: 'Livraison' } as const;

function serviceHtml(s?: OrderServiceInfo): string {
  if (!s?.orderType) return '';
  let label: string = SERVICE_LABELS[s.orderType];
  if (s.orderType === 'table' && s.tableNumber) label += ` · Table ${s.tableNumber}`;
  let html = `<br/><span class="lbl">Service</span> <strong style="font-size:13px">${label}</strong>`;
  if (s.orderType === 'delivery') {
    if (s.deliveryAddress) html += `<br/>📍 ${s.deliveryAddress}`;
    if (s.deliveryPhone) html += `<br/>📞 ${s.deliveryPhone}`;
    if (s.delivererName) html += `<br/>🛵 Livreur : ${s.delivererName}`;
  }
  return html;
}

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; color: #3A1E1B; padding: 24px; background: #fff; }
  .sheet { max-width: 760px; margin: 0 auto; border: 2px solid #F8D2E0; border-radius: 18px; overflow: hidden; box-shadow: 0 6px 24px rgba(176, 46, 102,.08); }

  /* Header */
  .header { display: flex; align-items: center; gap: 18px; padding: 22px 26px; background: linear-gradient(135deg,#FFF8F6 0%,#FCE8EF 100%); border-bottom: 3px solid #D6457F; }
  .logo-box { width: 78px; height: 78px; border-radius: 16px; border: 2px solid #D6457F; background:#fff; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; }
  .logo-box img { width:100%; height:100%; object-fit:cover; }
  .logo-fallback { font-family: 'Poppins', 'Segoe UI', sans-serif; font-size: 30px; color:#D6457F; }
  .store-info { flex:1; }
  .store-name { font-family: 'Poppins', 'Segoe UI', sans-serif; font-size: 24px; font-weight: bold; color: #6B4843; }
  .store-tag { font-size: 12px; color:#A88A86; font-style: italic; margin-top:2px; }
  .store-meta { font-size: 12px; color: #8A4A6B; margin-top: 8px; line-height: 1.6; }
  .store-meta span { display:inline-block; margin-right:14px; }

  /* Title bar */
  .title-bar { display:flex; justify-content:space-between; align-items:center; padding: 14px 26px; background:#D6457F; color:#fff; }
  .title { font-size: 18px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
  .title-meta { text-align:right; font-size:12px; line-height:1.6; }
  .title-meta strong { font-size:13px; }

  .content { padding: 22px 26px; }

  /* Party box */
  .party { background: #FFF8F6; border: 1px solid #F8D2E0; border-left: 4px solid #D6457F; border-radius: 10px; padding: 12px 16px; margin-bottom: 18px; font-size: 13px; line-height: 1.6; }
  .party .lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color:#A88A86; font-weight:600; }
  .party strong { color: #6B4843; font-size: 15px; }

  /* Items table */
  table { width: 100%; border-collapse: collapse; margin-bottom: 18px; font-size: 13px; border:1px solid #FBE4EF; border-radius:10px; overflow:hidden; }
  th { background: #D6457F; color: #FFFFFF; padding: 10px 12px; text-align: left; font-weight:600; }
  th:nth-child(2), th:nth-child(3), th:last-child, td:nth-child(2), td:nth-child(3), td:last-child { text-align: right; }
  td { padding: 10px 12px; border-bottom: 1px solid #FBE4EF; }
  tr:nth-child(even) td { background:#FFFAFC; }
  tr:last-child td { border-bottom: none; }

  /* Totals */
  .totals-wrap { display:flex; justify-content:flex-end; }
  .totals { width: 320px; border:1px solid #F8D2E0; border-radius:12px; overflow:hidden; font-size: 14px; }
  .totals div { display: flex; justify-content: space-between; padding: 8px 16px; }
  .totals div:nth-child(odd) { background:#FFF8F6; }
  .totals .grand { background:#D6457F; color:#fff; font-weight: bold; font-size: 16px; }
  .totals .rest-row span:last-child { color:#fff; }
  .totals .rest-pos { background: linear-gradient(135deg,#F58BA0,#9F1239) !important; color:#fff; font-weight:bold; }

  /* Footer */
  .footer { margin-top: 22px; padding-top: 16px; border-top: 2px dashed #F8D2E0; text-align:center; }
  .social { display:inline-flex; align-items:center; gap:6px; background:#FFF8F6; border:1px solid #F8D2E0; border-radius:999px; padding:6px 16px; font-size:13px; color:#6B4843; font-weight:600; }
  .thanks { margin-top:12px; font-size:13px; color:#A88A86; font-style: italic; }
  .signatures { display: flex; justify-content: space-between; margin-top: 36px; font-size: 13px; }
  .sig-box { text-align: center; width: 45%; }
  .sig-line { border-top: 1px solid #6B4843; margin-top: 38px; padding-top: 6px; color:#8A4A6B; }
`;

function logoHtml(store: StoreSettings, big = true): string {
  const size = big ? '' : 'style="width:54px;height:54px;"';
  if (store.logo) {
    return `<div class="logo-box" ${size}><img src="${store.logo}" alt="logo"/></div>`;
  }
  return `<div class="logo-box" ${size}><span class="logo-fallback">🍔</span></div>`;
}

export function printInvoice(data: InvoiceData, store: StoreSettings) {
  const win = window.open('', '_blank', 'width=860,height=960');
  if (!win) return;

  const titleLabel = data.type === 'purchase' ? "FACTURE D'ACHAT" : 'FACTURE DE VENTE';
  const partyLabel = data.type === 'purchase' ? 'Fournisseur' : 'Client';

  const rows = data.lines
    .map(
      (l) => `<tr>
        <td>${l.designation}</td>
        <td>${l.quantity}</td>
        <td>${formatCurrency(l.unitPrice)}</td>
        <td>${formatCurrency(l.quantity * l.unitPrice)}</td>
      </tr>`
    )
    .join('');

  const social = store.socialMedia
    ? `<div class="footer"><span class="social">🌐 ${store.socialMedia}</span><p class="thanks">Merci de votre confiance — À très bientôt !</p></div>`
    : `<div class="footer"><p class="thanks">Merci de votre confiance — À très bientôt !</p></div>`;

  win.document.write(`
    <html>
      <head><title>${data.reference}</title><style>${css}</style></head>
      <body>
        <div class="sheet">
          <div class="header">
            ${logoHtml(store)}
            <div class="store-info">
              <div class="store-name">${store.name}</div>
              ${store.description ? `<div class="store-tag">${store.description}</div>` : ''}
              <div class="store-meta">
                ${store.address ? `<span>📍 ${store.address}</span>` : ''}
                ${store.phone ? `<span>📞 ${store.phone}</span>` : ''}
                ${store.email ? `<span>✉️ ${store.email}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="title-bar">
            <div class="title">${titleLabel}</div>
            <div class="title-meta">
              <strong>N° ${data.reference}</strong><br/>
              Date: ${data.type === 'sale' ? formatDateTime(data.date) : formatDate(data.date)}
            </div>
          </div>

          <div class="content">
            <div class="party">
              <div class="lbl">${partyLabel}</div>
              <strong>${data.partyName}</strong><br/>
              ${data.partyAddress ? data.partyAddress + '<br/>' : ''}
              ${data.partyPhone ? '📞 ' + data.partyPhone : ''}
              ${serviceHtml(data.service)}
            </div>

            <table>
              <thead><tr><th>Désignation</th><th>Qté</th><th>P.U.</th><th>Total</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>

            <div class="totals-wrap">
              <div class="totals">
                <div><span>Total</span><span>${formatCurrency(data.total)}</span></div>
                ${data.reduction ? `<div><span>Réduction</span><span>- ${formatCurrency(data.reduction)}</span></div>` : ''}
                ${data.final !== undefined && data.reduction ? `<div><span>Net à payer</span><span>${formatCurrency(data.final)}</span></div>` : ''}
                <div><span>Montant payé</span><span>${formatCurrency(data.paid)}</span></div>
                <div class="grand ${data.rest > 0 ? 'rest-pos' : ''}"><span>Reste à payer</span><span>${formatCurrency(data.rest)}</span></div>
              </div>
            </div>

            <div class="signatures">
              <div class="sig-box"><div class="sig-line">Signature ${partyLabel}</div></div>
              <div class="sig-box"><div class="sig-line">Signature Gérant</div></div>
            </div>

            ${social}
          </div>
        </div>
        <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 350); };</script>
      </body>
    </html>
  `);
  win.document.close();
}

export function printHTML(title: string, bodyHtml: string, extraCss = '', store?: StoreSettings) {
  const win = window.open('', '_blank', 'width=900,height=1000');
  if (!win) return;
  const header = store
    ? `<div class="sheet"><div class="header">${logoHtml(store)}<div class="store-info"><div class="store-name">${store.name}</div>${store.description ? `<div class="store-tag">${store.description}</div>` : ''}<div class="store-meta">${store.address ? `<span>📍 ${store.address}</span>` : ''}${store.phone ? `<span>📞 ${store.phone}</span>` : ''}</div></div></div><div class="content">${bodyHtml}${store.socialMedia ? `<div class="footer"><span class="social">🌐 ${store.socialMedia}</span></div>` : ''}</div></div>`
    : bodyHtml;
  win.document.write(`
    <html><head><title>${title}</title><style>${css}${extraCss}</style></head>
    <body>${header}<script>window.onload=function(){setTimeout(function(){window.print();},350);};</script></body></html>
  `);
  win.document.close();
}
