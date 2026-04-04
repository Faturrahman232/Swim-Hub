"use client";

import { useRef } from "react";
import { format } from "date-fns";

interface Invoice {
  invoice_number: string;
  issue_date: string;
  customer_name: string;
  customer_email: string;
  booking_id: string;
  total_guest?: number;
  amount: number;
  booking_date: string;
  session: string;
}

const sessionLabel = (key: string) => {
  switch (key) {
    case "sesi1":
      return "Sesi 1 (09.00 - 13.00)";
    case "sesi2":
      return "Sesi 2 (14.00 - 18.00)";
    case "fullday":
      return "Full Day (09.00 - 18.00)";
    default:
      return "-";
  }
};

export default function InvoiceClient({ invoice }: { invoice: Invoice }) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (pdfRef.current) {
      // @ts-ignore
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: 0.5,
        filename: `${invoice.invoice_number}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      html2pdf().set(opt).from(pdfRef.current).save();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700">
          Invoice #{invoice.invoice_number}
        </h1>
        <button
          onClick={handleDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Card */}
      <div
        ref={pdfRef}
        className="p-8 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        {/* Issued Date */}
        <div className="text-sm text-gray-500 mb-4">
          Issued on: {format(new Date(invoice.issue_date), "dd MMM yyyy")}
        </div>

        {/* Customer & Booking Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Customer Information
            </h2>
            <p>
              <strong>Name:</strong> {invoice.customer_name}
            </p>
            <p>
              <strong>Email:</strong> {invoice.customer_email}
            </p>
            <p>
              <strong>Booking ID:</strong> {invoice.booking_id}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Booking Details
            </h2>
            <p>
              <strong>Total Guests:</strong> {invoice.total_guest ?? "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="text-green-600 font-semibold">Paid</span>
            </p>
            <p>
              <strong>Booking Date:</strong>{" "}
              {format(new Date(invoice.booking_date), "dd MMM yyyy")}
            </p>
            <p>
              <strong>Session:</strong> {sessionLabel(invoice.session)}
            </p>
          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-md mb-6">
          <h3 className="text-xl font-semibold mb-2 text-blue-800">
            Amount Breakdown
          </h3>
          <div className="flex justify-between text-lg font-medium">
            <span>Total Amount:</span>
            <span className="text-blue-800 font-bold">
              Rp {Number(invoice.amount).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-600 mt-6 border-t pt-4">
          Terima kasih telah melakukan booking bersama <strong>SwimEase</strong>
          .<br />
          Hubungi kami jika Anda memiliki pertanyaan mengenai invoice ini.
        </div>
      </div>
    </div>
  );
}
