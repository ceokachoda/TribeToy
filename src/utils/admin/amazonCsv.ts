export type ParsedAmazonOrder = {
  amazon_order_id: string;
  customer_name: string;
  email: string;
  phone: string;
  shipping_address: any;
  items: { sku: string; name: string; quantity: number; price: number }[];
  total_amount: number;
};

export type AmazonParseResult = {
  orders: ParsedAmazonOrder[];
  errors: string[];
};

const FIELD_ALIASES: Record<string, string[]> = {
  order_id: ["order-id", "amazon-order-id", "order id"],
  sku: ["sku", "seller-sku"],
  name: ["product-name", "title", "item-name"],
  qty: ["quantity-purchased", "quantity"],
  item_price: ["item-price", "price", "item-total"],
  buyer_name: ["recipient-name", "buyer-name"],
  phone: ["ship-phone-number", "buyer-phone-number"],
  email: ["buyer-email"],
  address: ["ship-address-1", "ship-address", "shipping-address"],
  city: ["ship-city", "city"],
  state: ["ship-state", "state"],
  pincode: ["ship-postal-code", "postal-code", "zip"],
};

function normHeader(h: string): string {
  return h.trim().toLowerCase().replace(/['"]/g, "");
}

function splitLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delim) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

function toNumber(v: string | undefined): number {
  if (!v) return 0;
  const n = Number(v.replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function parseAmazonCsv(text: string): AmazonParseResult {
  const errors: string[] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { orders: [], errors: ["File has no data rows (need a header + at least one row)."] };
  }

  const headerLine = lines[0];
  const delim = headerLine.includes("\t") ? "\t" : ",";
  const rawHeaders = splitLine(headerLine, delim).map(normHeader);

  const colOf: Record<string, number> = {};
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    const idx = rawHeaders.findIndex((h) => aliases.includes(h));
    if (idx !== -1) colOf[field] = idx;
  }

  if (colOf.order_id === undefined) {
    return {
      orders: [],
      errors: [`Could not find an order-id column. Found headers: ${rawHeaders.join(", ")}`],
    };
  }

  const byOrder = new Map<string, ParsedAmazonOrder>();

  for (let r = 1; r < lines.length; r++) {
    const cols = splitLine(lines[r], delim);
    const get = (field: string): string | undefined =>
      colOf[field] !== undefined ? cols[colOf[field]] : undefined;

    const orderId = get("order_id");
    if (!orderId) {
      errors.push(`Row ${r + 1}: missing order id — skipped.`);
      continue;
    }

    const qty = Math.trunc(toNumber(get("qty")));
    if (qty <= 0) {
      errors.push(`Row ${r + 1} (${orderId}): quantity is ${qty} — skipped.`);
      continue;
    }

    const price = toNumber(get("item_price"));
    
    const existing = byOrder.get(orderId);
    if (existing) {
      existing.items.push({
        sku: get("sku") || "",
        name: get("name") || "Amazon Item",
        quantity: qty,
        price,
      });
      existing.total_amount += price;
      continue;
    }

    const name = get("buyer_name") || "Amazon Customer";
    const email = get("email") || `customer-${orderId}@amazon-marketplace.com`;
    
    byOrder.set(orderId, {
      amazon_order_id: orderId,
      customer_name: name,
      email,
      phone: get("phone") || "",
      shipping_address: {
        address: get("address") || "",
        city: get("city") || "",
        state: get("state") || "",
        pincode: get("pincode") || "",
      },
      items: [{
        sku: get("sku") || "",
        name: get("name") || "Amazon Item",
        quantity: qty,
        price,
      }],
      total_amount: price,
    });
  }

  return {
    orders: Array.from(byOrder.values()),
    errors
  };
}
