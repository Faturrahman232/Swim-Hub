import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";
import InvoiceClient from "./InvoiceClient";

interface InvoicePageParams {
  invoice_number: string;
}

export default async function InvoicePage({
  params,
}: {
  params: InvoicePageParams;
}) {
  const { invoice_number } = params;

  const conn = await db.getConnection();
  const [rows]: any = await conn.execute(
    `SELECT 
       i.*, 
       b.id AS booking_id,
       b.booking_date as booking_date,
       b.session,
       b.guests_count as total_guest, 
       u.name as customer_name, 
       u.email as customer_email
     FROM invoices i
     JOIN bookings b ON i.booking_id = b.id
     JOIN users u ON b.user_id = u.id
     WHERE i.invoice_number = ?`,
    [invoice_number]
  );

  if (rows.length === 0) return notFound();

  const invoice = rows[0];

  return <InvoiceClient invoice={invoice} />;
}
